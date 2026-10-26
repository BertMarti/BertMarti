#!/usr/bin/env node
// Genera las tarjetas de proyectos del README.md y de site/index.html a partir de proyectos.json.
// Sin dependencias (Node 18+).
//
//   node scripts/generar-tarjetas.mjs              # reescribe README.md y site/index.html
//   node scripts/generar-tarjetas.mjs --comprobar  # no escribe; sale con 1 si algo no coincide (lo usa el CI)
//
// Solo se reescribe lo que hay entre los marcadores <!-- tarjetas:inicio … --> / <!-- tarjetas:fin -->
// (y <!-- filtros:… --> en la web) y el número de la insignia «proyectos abiertos» del README.
// El resto del README (contacto, mascota commitling…) no se toca nunca.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const comprobar = process.argv.includes('--comprobar');

const datos = JSON.parse(readFileSync(join(raiz, 'proyectos.json'), 'utf8'));
validar(datos);

const escapar = (texto) => String(texto)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const urlRepo = (p) => `https://github.com/${datos.dueno}/${p.repo}`;
const insignia = (texto, color, logo) => `https://img.shields.io/badge/${texto}-${color}?style=flat-square&logo=${logo}&logoColor=white`;
const textoInsignia = (texto) => encodeURIComponent(texto.toUpperCase());

// ---------- README ----------

function celdaReadme(p, ancho, color) {
  const destino = p.web ?? p.descarga ?? urlRepo(p);
  const altImagen = p.web ? `Web de ${p.nombre}` : p.alt;
  const lineas = [
    `    <td width="${ancho}%" valign="top">`,
    `      <a href="${destino}"><img src="./site/img/proyectos/${p.captura}" alt="${escapar(altImagen)}" width="100%"></a>`,
    `      <h3>${p.emoji} <a href="${urlRepo(p)}">${escapar(p.nombre)}</a></h3>`,
    `      <p><strong>${escapar(p.lema)}</strong><br>${escapar(p.descripcion)}</p>`,
  ];
  if (p.tecnologias?.length) lineas.push(`      <p><sub>${p.tecnologias.map(escapar).join(' · ')}</sub></p>`);
  if (p.web) {
    const boton = p.jugar ? 'JUGAR' : 'WEB';
    const alt = p.jugar ? `Jugar a ${p.nombre}` : `Web de ${p.nombre}`;
    lineas.push(`      <a href="${p.web}"><img src="${insignia(boton, color, 'googlechrome')}" alt="${escapar(alt)}"></a>`);
  }
  if (p.android) lineas.push(`      <a href="${p.android}"><img src="${insignia('ANDROID', '3DDC84', 'android')}" alt="App de Android de ${escapar(p.nombre)}"></a>`);
  if (p.descarga) lineas.push(`      <a href="${p.descarga}"><img src="${insignia('DESCARGAR', color, 'github')}" alt="Descargar ${escapar(p.nombre)}"></a>`);
  lineas.push(`      <a href="${urlRepo(p)}"><img src="${insignia('CÓDIGO', '181717', 'github')}" alt="Código de ${escapar(p.nombre)}"></a>`);
  if (p.nota) lineas.push(`      <img src="${insignia(textoInsignia(p.nota.texto), '6B7280', p.nota.logo)}" alt="${escapar(p.nota.texto)}">`);
  lineas.push('    </td>');
  return lineas.join('\n');
}

function tarjetasReadme() {
  const bloques = [];
  for (const seccion of datos.secciones) {
    const proyectos = datos.proyectos.filter((p) => p.seccion === seccion.id);
    if (!proyectos.length) continue;
    const columnas = Math.min(3, proyectos.length);
    const ancho = Math.floor(100 / columnas);
    const filas = [];
    for (let i = 0; i < proyectos.length; i += 3) {
      const celdas = proyectos.slice(i, i + 3).map((p) => celdaReadme(p, ancho, seccion.color));
      filas.push(['  <tr>', ...celdas, '  </tr>'].join('\n'));
    }
    bloques.push(`### ${seccion.titulo}\n\n<table>\n${filas.join('\n')}\n</table>`);
  }
  return bloques.join('\n\n');
}

// ---------- Web ----------

function enlaceWeb(url, texto, flecha) {
  return `<a href="${url}" target="_blank" rel="noopener noreferrer">${texto} <span aria-hidden="true">${flecha}</span></a>`;
}

function tarjetaWeb(p) {
  const enlaces = [];
  if (p.web) enlaces.push(enlaceWeb(p.web, p.jugar ? 'Jugar' : 'Abrir la web', '↗'));
  if (p.android) enlaces.push(enlaceWeb(p.android, 'App Android', '↓'));
  if (p.descarga) enlaces.push(enlaceWeb(p.descarga, 'Descargar', '↓'));
  enlaces.push(enlaceWeb(urlRepo(p), 'Ver el código', '↗'));
  if (p.nota) enlaces.push(`<span class="no-web">${escapar(p.nota.texto)}</span>`);
  const pila = p.tecnologias?.length
    ? `<ul class="stack" aria-label="Tecnologías">${p.tecnologias.map((t) => `<li>${escapar(t)}</li>`).join('')}</ul>`
    : '';
  return `        <article class="project-card" data-category="${escapar(p.etiqueta)}">`
    + `<img src="img/proyectos/${p.captura}" width="640" height="400" loading="lazy" alt="${escapar(p.alt)}">`
    + `<div class="card-body"><span class="tag">${escapar(p.etiqueta)}</span><h3>${escapar(p.nombre)}</h3>`
    + `<p class="tagline">${escapar(p.lema)}</p><p>${escapar(p.descripcion)}</p>${pila}`
    + `<div class="card-links">${enlaces.join('')}</div></div></article>`;
}

function filtrosWeb() {
  const etiquetas = [...new Set(datos.proyectos.map((p) => p.etiqueta))];
  const boton = (filtro, texto, activo) => `        <button type="button" class="filter${activo ? ' is-active' : ''}" data-filter="${escapar(filtro)}" aria-pressed="${activo}">${escapar(texto)}</button>`;
  return [boton('all', 'Todos', true), ...etiquetas.map((e) => boton(e, e, false))].join('\n');
}

// ---------- Reemplazo entre marcadores ----------

function reemplazar(texto, nombre, contenido, archivo, conHueco = false) {
  const patron = new RegExp(`(<!-- ${nombre}:inicio[^\\n]*-->)[\\s\\S]*?(\\n[ \\t]*<!-- ${nombre}:fin -->)`);
  if (!patron.test(texto)) throw new Error(`${archivo}: faltan los marcadores <!-- ${nombre}:inicio --> / <!-- ${nombre}:fin -->`);
  const hueco = conHueco ? '\n' : '';
  return texto.replace(patron, (_, inicio, fin) => `${inicio}\n${hueco}${contenido}${hueco}${fin}`);
}

const INSIGNIA_TOTAL = /OPEN%20SOURCE-\d+%20proyectos%20abiertos/;

function generarReadme(texto) {
  if (!INSIGNIA_TOTAL.test(texto)) throw new Error('README.md: no encuentro la insignia «proyectos abiertos»');
  const total = datos.proyectos.length;
  return reemplazar(texto, 'tarjetas', tarjetasReadme(), 'README.md', true)
    .replace(INSIGNIA_TOTAL, `OPEN%20SOURCE-${total}%20proyectos%20abiertos`)
    .replace(/alt="\d+ proyectos de código abierto"/, `alt="${total} proyectos de código abierto"`);
}

function generarWeb(texto) {
  const tarjetas = datos.proyectos.map(tarjetaWeb).join('\n');
  return reemplazar(reemplazar(texto, 'filtros', filtrosWeb(), 'site/index.html'), 'tarjetas', tarjetas, 'site/index.html');
}

// ---------- Validación de proyectos.json ----------

function validar(d) {
  const errores = [];
  const secciones = new Set((d.secciones ?? []).map((s) => s.id));
  const vistos = new Set();
  if (!d.dueno) errores.push('falta «dueno»');
  for (const [i, p] of (d.proyectos ?? []).entries()) {
    const id = p.repo ?? `#${i}`;
    for (const campo of ['repo', 'nombre', 'emoji', 'seccion', 'etiqueta', 'captura', 'alt', 'lema', 'descripcion']) {
      if (typeof p[campo] !== 'string' || !p[campo].trim()) errores.push(`${id}: falta «${campo}»`);
    }
    if (vistos.has(p.repo?.toLowerCase())) errores.push(`${id}: repetido`);
    vistos.add(p.repo?.toLowerCase());
    if (!secciones.has(p.seccion)) errores.push(`${id}: sección desconocida «${p.seccion}»`);
    for (const campo of ['web', 'android', 'descarga']) {
      if (p[campo] !== undefined && !/^https:\/\/[^\s"<>]+$/.test(p[campo])) errores.push(`${id}: «${campo}» no es una URL https válida`);
    }
    if (p.web && !p.web.startsWith(`https://${d.dueno.toLowerCase()}.github.io/${p.repo}/`)) errores.push(`${id}: la web debe ser https://${d.dueno.toLowerCase()}.github.io/${p.repo}/ (respeta las mayúsculas)`);
    if (!p.web && !p.descarga && !p.nota) errores.push(`${id}: sin web ni descarga, añade una «nota» (p. ej. «Se instala en tu servidor»)`);
    if (p.captura && !existsSync(join(raiz, 'site/img/proyectos', p.captura))) errores.push(`${id}: no existe site/img/proyectos/${p.captura}`);
  }
  if (errores.length) {
    console.error(`proyectos.json no es válido:\n- ${errores.join('\n- ')}`);
    process.exit(1);
  }
}

// ---------- Principal ----------

const archivos = [
  ['README.md', generarReadme],
  ['site/index.html', generarWeb],
];
let distintos = 0;
for (const [ruta, generar] of archivos) {
  const actual = readFileSync(join(raiz, ruta), 'utf8');
  const nuevo = generar(actual);
  if (nuevo === actual) {
    console.log(`${ruta}: al día`);
  } else if (comprobar) {
    distintos++;
    console.error(`${ruta}: NO coincide con proyectos.json. Ejecuta «node scripts/generar-tarjetas.mjs» y haz commit del resultado.`);
  } else {
    writeFileSync(join(raiz, ruta), nuevo);
    console.log(`${ruta}: regenerado`);
  }
}
process.exit(distintos ? 1 : 0);
