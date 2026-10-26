#!/usr/bin/env node
// Vigilancia del origen compartido https://bertmarti.github.io (sin dependencias, Node 18+).
//
// Todas las webs de Pages de BertMarti comparten origen: localStorage, IndexedDB, cookies y service
// workers son comunes a todas las carpetas. Un fallo de XSS en una sola web expone los datos de todas.
// Este script descarga la portada de cada web (lista sacada de proyectos.json) y avisa si:
//   - no tiene CSP (ni cabecera ni <meta http-equiv>);
//   - su script-src (o default-src) permite 'unsafe-inline' o 'unsafe-eval', o no restringe los scripts;
//   - la CSP permite scripts de otros hosts, o la página carga <script src> de otro origen.
//
// Nunca falla (sale con 0): escribe ::warning:: para GitHub Actions y una tabla en $GITHUB_STEP_SUMMARY.
//   node scripts/vigilar-csp.mjs

import { readFileSync, appendFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const datos = JSON.parse(readFileSync(join(raiz, 'proyectos.json'), 'utf8'));
const ORIGEN = `https://${datos.dueno.toLowerCase()}.github.io`;

const webs = [{ nombre: 'Portafolio', url: datos.portafolio }];
for (const p of datos.proyectos) if (p.web) webs.push({ nombre: p.nombre, url: p.web });

const PALABRAS_SEGURAS = new Set(["'self'", "'none'", "'strict-dynamic'", "'report-sample'", "'wasm-unsafe-eval'", "'inline-speculation-rules'"]);

function decodificar(texto) {
  return texto.replace(/&(#39|#x27|quot|amp|lt|gt|apos);/gi, (_, e) => ({ '#39': "'", '#x27': "'", quot: '"', amp: '&', lt: '<', gt: '>', apos: "'" })[e.toLowerCase()]);
}

function atributo(etiqueta, nombre) {
  const m = etiqueta.match(new RegExp(`\\s${nombre}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return m ? decodificar(m[2] ?? m[3] ?? m[4] ?? '') : null;
}

function cspDeMeta(html) {
  const politicas = [];
  for (const etiqueta of html.match(/<meta\b[^>]*>/gi) ?? []) {
    if ((atributo(etiqueta, 'http-equiv') ?? '').toLowerCase() === 'content-security-policy') {
      const contenido = atributo(etiqueta, 'content');
      if (contenido) politicas.push(contenido);
    }
  }
  return politicas;
}

function directivas(politica) {
  const mapa = new Map();
  for (const trozo of politica.split(';')) {
    const [nombre, ...fuentes] = trozo.trim().split(/\s+/);
    if (nombre && !mapa.has(nombre.toLowerCase())) mapa.set(nombre.toLowerCase(), fuentes);
  }
  return mapa;
}

function esFuenteExterna(fuente) {
  const f = fuente.toLowerCase();
  if (PALABRAS_SEGURAS.has(f) || f.startsWith("'nonce-") || /^'sha(256|384|512)-/.test(f) || f.startsWith("'unsafe-")) return false;
  if (f === ORIGEN || f === `${ORIGEN}/` || f.startsWith(`${ORIGEN}/`)) return false;
  return true; // hosts, comodines (*), esquemas (https:, data:, blob:)…
}

function analizarPolitica(politica) {
  const d = directivas(politica);
  const nombre = d.has('script-src') ? 'script-src' : d.has('default-src') ? 'default-src' : null;
  if (!nombre) return { texto: '(sin restricción)', libre: true, inline: true, evalua: true, externas: null };
  const fuentes = d.get(nombre);
  const bajas = fuentes.map((f) => f.toLowerCase());
  return {
    texto: `${nombre} ${fuentes.join(' ')}`.trim(),
    libre: false,
    inline: bajas.includes("'unsafe-inline'"),
    evalua: bajas.includes("'unsafe-eval'"),
    externas: fuentes.filter(esFuenteExterna),
  };
}

// El navegador aplica TODAS las políticas a la vez: algo solo está permitido si lo permiten todas.
function combinar(analisis) {
  const avisos = [];
  if (analisis.every((a) => a.libre)) return ['la CSP no tiene script-src ni default-src: los scripts no están restringidos'];
  if (analisis.every((a) => a.inline)) avisos.push("script-src permite 'unsafe-inline'");
  if (analisis.every((a) => a.evalua)) avisos.push("script-src permite 'unsafe-eval'");
  const restrictivas = analisis.filter((a) => !a.libre);
  const externas = restrictivas[0].externas.filter((f) => restrictivas.every((a) => a.externas.includes(f)));
  if (externas.length) avisos.push(`script-src permite scripts de fuera: ${externas.join(' ')}`);
  return avisos;
}

function scriptsExternos(html, base) {
  const externos = new Set();
  for (const etiqueta of html.match(/<script\b[^>]*>/gi) ?? []) {
    const src = atributo(etiqueta, 'src');
    if (!src) continue;
    try {
      const url = new URL(src, base);
      if (url.origin !== ORIGEN) externos.add(url.host || url.protocol);
    } catch { /* src inválido: el navegador tampoco lo cargaría */ }
  }
  return [...externos];
}

async function revisar({ nombre, url }) {
  const resultado = { nombre, url, csp: '—', scriptSrc: '—', avisos: [] };
  let respuesta;
  try {
    respuesta = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(20000), headers: { 'user-agent': 'vigilar-csp (BertMarti)' } });
  } catch (error) {
    resultado.avisos.push(`no se pudo descargar (${error.name === 'TimeoutError' ? 'tiempo agotado' : error.message})`);
    return resultado;
  }
  if (!respuesta.ok) {
    resultado.avisos.push(`responde con HTTP ${respuesta.status}`);
    return resultado;
  }
  const html = await respuesta.text();
  const cabecera = respuesta.headers.get('content-security-policy');
  const politicas = [...(cabecera ? [cabecera] : []), ...cspDeMeta(html)];
  if (!politicas.length) {
    resultado.csp = 'no';
    resultado.avisos.push('no tiene CSP');
  } else {
    resultado.csp = cabecera ? 'cabecera' : 'meta';
    const analisis = politicas.map(analizarPolitica);
    resultado.scriptSrc = analisis.map((a) => a.texto).join(' / ');
    resultado.avisos.push(...combinar(analisis));
  }
  const externos = scriptsExternos(html, respuesta.url || url);
  if (externos.length) resultado.avisos.push(`carga scripts de otros hosts: ${externos.join(', ')}`);
  return resultado;
}

const celda = (texto) => String(texto).replaceAll('|', '\\|').replaceAll('\n', ' ');

async function main() {
  const resultados = await Promise.all(webs.map(revisar));
  const tabla = [
    '### Vigilancia del origen compartido (CSP de las webs de Pages)',
    '',
    `Origen común: \`${ORIGEN}\` · ${resultados.length} webs revisadas`,
    '',
    '| Web | CSP | Scripts permitidos | Estado |',
    '|---|:---:|---|---|',
  ];
  let conAvisos = 0;
  for (const r of resultados) {
    if (r.avisos.length) conAvisos++;
    for (const aviso of r.avisos) console.log(`::warning title=CSP de ${r.nombre}::${r.url} ${aviso}`);
    const estado = r.avisos.length ? `⚠️ ${r.avisos.join('; ')}` : '✅ bien';
    tabla.push(`| [${celda(r.nombre)}](${r.url}) | ${r.csp} | \`${celda(r.scriptSrc)}\` | ${celda(estado)} |`);
    console.log(`${r.avisos.length ? 'AVISO' : 'bien '}  ${r.url}  ${r.avisos.join('; ')}`);
  }
  tabla.push('', conAvisos
    ? `**${conAvisos} web(s) con avisos.** Corrígelas en su repo: CSP estricta, sin \`'unsafe-inline'\`/\`'unsafe-eval'\` en \`script-src\` y sin scripts de terceros (comparten localStorage y service workers con todas las demás).`
    : 'Todas las webs tienen una CSP estricta para los scripts.');
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${tabla.join('\n')}\n`);
  else console.log(`\n${tabla.join('\n')}`);
}

export { cspDeMeta, analizarPolitica, combinar, scriptsExternos, revisar };

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.log(`::warning title=Vigilancia CSP::El script falló: ${error.message}`);
  }).finally(() => process.exit(0));
}
