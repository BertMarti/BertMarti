// Portafolio (site/). Lo usa scripts/generar-tarjetas.mjs.
import { escapar, reemplazar } from './comun.mjs';

let datos;
const urlRepo = (p) => `https://github.com/${datos.dueno}/${p.repo}`;

function enlaceWeb(url, texto, flecha) {
  return `<a href="${url}" target="_blank" rel="noopener noreferrer">${texto} <span aria-hidden="true">${flecha}</span></a>`;
}

function tarjetaWeb(p) {
  const enlaces = [];
  if (p.web) enlaces.push(enlaceWeb(p.web, p.jugar ? 'Jugar' : p.privado ? 'Probar la demo' : 'Abrir la web', '↗'));
  if (p.android) enlaces.push(enlaceWeb(p.android, 'App Android', '↓'));
  if (p.descarga) enlaces.push(enlaceWeb(p.descarga, 'Descargar', '↓'));
  if (p.privado) enlaces.push('<span class="no-web">Código privado</span>');
  else enlaces.push(enlaceWeb(urlRepo(p), 'Ver el código', '↗'));
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

function generarWeb(texto) {
  const tarjetas = datos.proyectos.map(tarjetaWeb).join('\n');
  return reemplazar(reemplazar(texto, 'filtros', filtrosWeb(), 'site/index.html'), 'tarjetas', tarjetas, 'site/index.html');
}

// Devuelve [[ruta, generar(textoActual) => textoNuevo], …]
export function archivosWeb(d, perfil) {
  datos = d;
  return [['site/index.html', generarWeb]];
}
