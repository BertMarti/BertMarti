#!/usr/bin/env node
// Genera el CV en PDF (español e inglés) desde perfil.json y proyectos.json. Sin dependencias de npm.
//
//   node scripts/generar-cv.mjs            → cv/cv-es.html, cv/cv-en.html y los dos PDF de site/cv/
//   CHROME=/ruta/a/chrome node scripts/generar-cv.mjs   (si Chrome o Chromium no están en su sitio habitual)
//   node scripts/comprobar-cv.mjs          → prueba ATS de los PDF generados
//
// Necesita Node 18+ y Chrome o Chromium (imprime el HTML con --headless --print-to-pdf).
// Fuentes: cv/cv.css (estilos), cv/foto.jpg (sale de img/fuentes/foto-alberto.png) y los textos de este
// archivo (rótulos). Los cv/cv-*.html son salida: no los edites a mano.
// El teléfono y el correo solo viven en perfil.json, en cv/ y dentro del PDF; cv/ no se publica en Pages.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { escapar, TECNOLOGIAS_EN } from './comun.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const leer = (archivo) => JSON.parse(readFileSync(join(raiz, archivo), 'utf8'));
export const perfil = leer('perfil.json');
const { proyectos } = leer('proyectos.json');

export const TITULO = `${perfil.nombre} — CV`;
export const FUENTE = (idioma) => join(raiz, 'cv', `cv-${idioma}.html`);
export const SALIDA = (idioma) => join(raiz, 'site', 'cv', `Alberto-Martinez-Moreno-CV-${idioma.toUpperCase()}.pdf`);

// Rótulos por idioma. Los encabezados son los estándar que reconocen los ATS.
export const TEXTOS = {
  es: {
    perfil: 'Perfil', habilidades: 'Habilidades', experiencia: 'Experiencia', proyectos: 'Proyectos',
    formacion: 'Formación', certificaciones: 'Certificaciones', idiomas: 'Idiomas',
    actualidad: 'actualidad', privado: 'Código privado',
    solape: (n) => `${n} puestos en curso a la vez`,
    asunto: 'Currículum de Alberto Martínez Moreno, Full-Stack Developer',
  },
  en: {
    perfil: 'Summary', habilidades: 'Skills', experiencia: 'Experience', proyectos: 'Projects',
    formacion: 'Education', certificaciones: 'Certifications', idiomas: 'Languages',
    actualidad: 'Present', privado: 'Closed source',
    solape: (n) => `${n} roles held at the same time`,
    asunto: 'Résumé of Alberto Martínez Moreno, Full-Stack Developer',
  },
};

const e = escapar;
const sinProtocolo = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
const enlace = (url, clase = '') => `<a${clase && ` class="${clase}"`} href="${e(url)}">${e(sinProtocolo(url))}</a>`;
const seccion = (titulo, cuerpo) => `<section>\n<h2>${e(titulo)}</h2>\n${cuerpo}\n</section>`;
const aMeses = (mmaaaa) => { const [m, a] = mmaaaa.split('/'); return a * 12 + +m; };
const habilidad = (item, idioma) => (idioma === 'en' && perfil.habilidadesEn[item]) || item;

export function destacados() {
  return perfil.destacados.map((repo) => {
    const p = proyectos.find((x) => x.repo === repo);
    if (!p) throw new Error(`perfil.json → destacados: «${repo}» no está en proyectos.json`);
    return p;
  });
}

export function html(idioma) {
  const t = TEXTOS[idioma];
  const c = perfil.contacto;
  const periodo = (inicio, fin) => `<span class="fechas">${inicio} – ${fin ?? t.actualidad}</span>`;

  const habilidades = perfil.habilidades.map((h) =>
    `<div><dt>${e(h.categoria[idioma])}: </dt><dd>${e(h.items.map((i) => habilidad(i, idioma)).join(', '))}</dd></div>`).join('\n');

  const experiencia = perfil.experiencia.map((emp) => {
    const inicio = emp.puestos.map((p) => p.inicio).sort((a, b) => aMeses(a) - aMeses(b))[0];
    const abiertos = emp.puestos.filter((p) => !p.fin).length;
    const fin = abiertos ? null : emp.puestos.map((p) => p.fin).sort((a, b) => aMeses(b) - aMeses(a))[0];
    const puestos = emp.puestos.map((p) => `<div class="puesto${p.fin ? '' : ' actual'}">
<div class="fila"><h4>${e(p.cargo[idioma])} </h4>${periodo(p.inicio, p.fin)}</div>
<ul>
${p.logros[idioma].map((l) => `<li>${e(l)}</li>`).join('\n')}
</ul>
</div>`).join('\n');
    return `<article class="empresa">
<div class="fila"><h3>${e(emp.empresa)} </h3><span class="suave">· ${e(emp.lugar[idioma])} </span>${periodo(inicio, fin)}${abiertos > 1 ? ` <span class="nota">· ${e(t.solape(abiertos))}</span>` : ''}</div>
<div class="puestos">
${puestos}
</div>
</article>`;
  }).join('\n');

  // Los privados nunca enlazan al repositorio: solo a la demo.
  const proyectosHtml = destacados().map((p) => {
    const lema = idioma === 'en' ? p.en?.lema : p.lema;
    if (!lema) throw new Error(`proyectos.json: a «${p.repo}» le falta el lema (${idioma})`);
    const stack = p.tecnologias.map((x) => (idioma === 'en' && TECNOLOGIAS_EN[x]) || x).join(', ');
    return `<div class="proyecto">
<div class="fila"><h3>${e(p.nombre)} </h3>— ${e(lema)} ${enlace(p.web, 'url')}</div>
<p class="stack">${e(stack)}${p.privado ? ` · ${e(t.privado)}` : ''}</p>
</div>`;
  }).join('\n');

  const formacion = perfil.formacion.map((f) => `<div class="fila linea${f.secundario ? ' secundaria' : ''}">
<h3>${e(f.titulo[idioma])} </h3><span class="suave">· </span><span class="resto"><span class="suave">${e(f.centro)}${f.nota ? ` · ${e(f.nota[idioma])}` : ''} </span>${periodo(f.inicio, f.fin)}</span>
</div>`).join('\n');

  const certificaciones = perfil.certificaciones.map((x) =>
    `<li><strong>${e(x.nombre[idioma])} </strong><span class="suave">· ${e(x.emisor)} · <span class="fechas">${x.fecha}</span></span></li>`).join('\n');

  const idiomas = perfil.idiomas.map((i) => `<li><strong>${e(i.idioma[idioma])} </strong>— ${e(i.nivel[idioma])}</li>`).join('\n');

  return `<!doctype html>
<html lang="${idioma}">
<head>
<meta charset="utf-8">
<title>${e(TITULO)}</title>
<meta name="author" content="${e(perfil.nombre)}">
<link rel="stylesheet" href="cv.css">
</head>
<body>
<header>
<div>
<h1>${e(perfil.nombre)}</h1>
<p class="titular">${e(perfil.titular[idioma])}</p>
<ul class="contacto">
<li><a href="mailto:${e(c.email)}">${e(c.email)}</a></li>
<li><a href="tel:${e(c.telefono.replaceAll(' ', ''))}">${e(c.telefono)}</a></li>
<li>${e(perfil.ubicacion[idioma])} · ${e(perfil.modalidad[idioma])}</li>
</ul>
<ul class="contacto">
<li>${enlace(c.linkedin)}</li>
<li>${enlace(c.github)}</li>
<li>${enlace(c.portafolio)}</li>
</ul>
</div>
<div class="foto"><img src="foto.jpg" alt=""></div>
</header>
<main>
${seccion(t.perfil, `<p>${e(perfil.perfil[idioma])}</p>`)}
${seccion(t.habilidades, `<dl class="habilidades">\n${habilidades}\n</dl>`)}
${seccion(t.experiencia, experiencia)}
${seccion(t.proyectos, proyectosHtml)}
${seccion(t.formacion, formacion)}
${seccion(t.certificaciones, `<ul class="corrida">\n${certificaciones}\n</ul>`)}
${seccion(t.idiomas, `<ul class="corrida">\n${idiomas}\n</ul>`)}
</main>
</body>
</html>
`;
}

function buscarChrome() {
  const candidatos = [
    process.env.CHROME,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    'chromium', 'chromium-browser', 'google-chrome', 'google-chrome-stable',
  ].filter(Boolean);
  for (const c of candidatos) {
    if (/[\\/]/.test(c) ? existsSync(c) : spawnSync(c, ['--version']).status === 0) return c;
  }
  throw new Error('No encuentro Chrome ni Chromium. Indica la ruta con la variable CHROME.');
}

// Chrome solo escribe el título. Añadimos autor, asunto y palabras clave con una actualización
// incremental del PDF (un objeto Info nuevo y su tabla xref al final). El contenido es el mismo en
// cada ejecución, pero los bytes no: Chrome guarda dentro la fecha de creación.
function conMetadatos(pdf, info) {
  const texto = pdf.toString('latin1');
  const cola = texto.slice(texto.lastIndexOf('trailer'));
  const tamano = /\/Size (\d+)/.exec(cola);
  const catalogo = /\/Root (\d+ \d+ R)/.exec(cola);
  const anterior = /startxref\s+(\d+)/.exec(cola);
  if (!tamano || !catalogo || !anterior) throw new Error('El PDF de Chrome no trae la tabla xref clásica que esperaba: no puedo añadir los metadatos.');
  const n = +tamano[1];
  const hex = (s) => `<FEFF${[...s].map((ch) => ch.charCodeAt(0).toString(16).padStart(4, '0')).join('')}>`;
  const objeto = `${n} 0 obj\n<< ${Object.entries(info).map(([k, v]) => `/${k} ${hex(v)}`).join(' ')} >>\nendobj\n`;
  const inicio = pdf.length + 1;
  const xref = `xref\n${n} 1\n${String(inicio).padStart(10, '0')} 00000 n \n`
    + `trailer\n<< /Size ${n + 1} /Root ${catalogo[1]} /Info ${n} 0 R /Prev ${anterior[1]} >>\n`
    + `startxref\n${inicio + objeto.length}\n%%EOF\n`;
  return Buffer.concat([pdf, Buffer.from(`\n${objeto}${xref}`, 'latin1')]);
}

function generar() {
  const chrome = buscarChrome();
  mkdirSync(join(raiz, 'site', 'cv'), { recursive: true });
  for (const idioma of Object.keys(TEXTOS)) {
    const fuente = FUENTE(idioma);
    const pdf = SALIDA(idioma);
    writeFileSync(fuente, html(idioma));
    const r = spawnSync(chrome, [
      '--headless=new', '--disable-gpu', '--no-pdf-header-footer',
      `--print-to-pdf=${pdf}`, pathToFileURL(fuente).href,
    ], { encoding: 'utf8' });
    if (r.status !== 0 || !existsSync(pdf)) throw new Error(`Chrome no pudo imprimir ${fuente}:\n${r.stderr}`);
    writeFileSync(pdf, conMetadatos(readFileSync(pdf), {
      Title: TITULO,
      Author: perfil.nombre,
      Subject: TEXTOS[idioma].asunto,
      Keywords: perfil.habilidades.flatMap((h) => h.items.map((i) => habilidad(i, idioma))).join(', '),
      Creator: 'scripts/generar-cv.mjs',
    }));
    console.log(`✓ ${pdf}`);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) generar();
