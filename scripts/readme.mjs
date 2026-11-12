// Tarjetas del README.md del perfil (entre <!-- tarjetas:… -->). Lo usa scripts/generar-tarjetas.mjs.
import { escapar, reemplazar } from './comun.mjs';

let datos;
const urlRepo = (p) => `https://github.com/${datos.dueno}/${p.repo}`;
const insignia = (texto, color, logo) => `https://img.shields.io/badge/${texto}-${color}?style=flat-square&logo=${logo}&logoColor=white`;
const textoInsignia = (texto) => encodeURIComponent(texto.toUpperCase());

function celdaReadme(p, ancho, color) {
  const destino = p.web ?? p.descarga ?? urlRepo(p);
  const altImagen = p.web ? `${p.privado ? 'Demo' : 'Web'} de ${p.nombre}` : p.alt;
  const lineas = [
    `    <td width="${ancho}%" valign="top">`,
    `      <a href="${destino}"><img src="./site/img/proyectos/${p.captura}" alt="${escapar(altImagen)}" width="100%"></a>`,
    `      <h3>${p.emoji} <a href="${urlRepo(p)}">${escapar(p.nombre)}</a></h3>`,
    `      <p><strong>${escapar(p.lema)}</strong><br>${escapar(p.descripcion)}</p>`,
  ];
  if (p.tecnologias?.length) lineas.push(`      <p><sub>${p.tecnologias.map(escapar).join(' · ')}</sub></p>`);
  if (p.web) {
    const boton = p.jugar ? 'JUGAR' : p.privado ? 'DEMO' : 'WEB';
    const alt = p.jugar ? `Jugar a ${p.nombre}` : p.privado ? `Demo de ${p.nombre}` : `Web de ${p.nombre}`;
    lineas.push(`      <a href="${p.web}"><img src="${insignia(boton, color, 'googlechrome')}" alt="${escapar(alt)}"></a>`);
  }
  if (p.android) lineas.push(`      <a href="${p.android}"><img src="${insignia('ANDROID', '3DDC84', 'android')}" alt="App de Android de ${escapar(p.nombre)}"></a>`);
  if (p.descarga) lineas.push(`      <a href="${p.descarga}"><img src="${insignia('DESCARGAR', color, 'github')}" alt="Descargar ${escapar(p.nombre)}"></a>`);
  if (p.privado) lineas.push(`      <img src="${insignia(textoInsignia('Código privado'), '6B7280', 'github')}" alt="Código privado">`);
  else lineas.push(`      <a href="${urlRepo(p)}"><img src="${insignia('CÓDIGO', '181717', 'github')}" alt="Código de ${escapar(p.nombre)}"></a>`);
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

const INSIGNIA_TOTAL = /OPEN%20SOURCE-\d+%20proyectos%20abiertos/;

export function generarReadme(texto, d) {
  datos = d;
  if (!INSIGNIA_TOTAL.test(texto)) throw new Error('README.md: no encuentro la insignia «proyectos abiertos»');
  const total = datos.proyectos.filter((p) => !p.privado).length;
  return reemplazar(texto, 'tarjetas', tarjetasReadme(), 'README.md', true)
    .replace(INSIGNIA_TOTAL, `OPEN%20SOURCE-${total}%20proyectos%20abiertos`)
    .replace(/alt="\d+ proyectos de código abierto"/, `alt="${total} proyectos de código abierto"`);
}
