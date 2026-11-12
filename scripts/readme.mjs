// Bloques generados del README.md del perfil. Lo usa scripts/generar-tarjetas.mjs.
//   <!-- titular:… -->      titular (perfil.json)
//   <!-- sobre:… -->        perfil, experiencia en línea de tiempo y formación (perfil.json)
//   <!-- tecnologias:… -->  insignias por categoría (perfil.json → habilidades)
//   <!-- destacados:… -->   tarjetas grandes de perfil.json → destacados, en ese orden (proyectos.json)
//   <!-- tarjetas:… -->     el resto de proyectos, compactos (proyectos.json)
// y el número de la insignia «proyectos abiertos».
import { escapar, reemplazar } from './comun.mjs';

const VIOLETA = '6D28D9';
const TURQUESA = '0F766E';
const PIZARRA = '475569';
const GRIS = '6B7280';

let datos;
const urlRepo = (p) => `https://github.com/${datos.dueno}/${p.repo}`;
// shields.io: en el texto de una insignia, «-» y «_» se escriben dobles.
const textoInsignia = (texto) => encodeURIComponent(texto.replaceAll('-', '--').replaceAll('_', '__'));
const insignia = (texto, color, logo) =>
  `https://img.shields.io/badge/${textoInsignia(texto)}-${color}?style=flat-square${logo ? `&logo=${logo}&logoColor=white` : ''}`;
const filas = (celdas, columnas) => {
  const salida = [];
  for (let i = 0; i < celdas.length; i += columnas) salida.push(['  <tr>', ...celdas.slice(i, i + columnas), '  </tr>'].join('\n'));
  return `<table>\n${salida.join('\n')}\n</table>`;
};

// ---------- Cabecera y «Sobre mí» (perfil.json) ----------

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const mes = (fecha) => (fecha ? `${MESES[Number(fecha.slice(0, 2)) - 1]} ${fecha.slice(3)}` : 'hoy');
const anio = (fecha) => fecha.slice(3);

// La ubicación y la modalidad ya van en el banner (y en su alt): aquí solo el titular, en texto real.
const titularReadme = (perfil) => `### ${escapar(perfil.titular.es)}`;

function sobreReadme(perfil) {
  const bloques = [escapar(perfil.perfil.es)];
  for (const e of perfil.experiencia) {
    const puestos = e.puestos.map((p) => [
      '  <tr>',
      `    <td width="170" valign="top"><code>${mes(p.inicio)} – ${mes(p.fin)}</code></td>`,
      `    <td valign="top"><strong>${escapar(p.cargo.es)}</strong><br>${escapar(p.logros.es[0])}</td>`,
      '  </tr>',
    ].join('\n'));
    bloques.push(`### Experiencia · ${escapar(e.empresa)}\n\n<table>\n${puestos.join('\n')}\n</table>`);
  }
  const formacion = perfil.formacion.map((f) =>
    `- **${escapar(f.titulo.es)}** · ${escapar(f.centro)} · ${anio(f.inicio)}–${anio(f.fin)}${f.nota ? ` · ${escapar(f.nota.es)}` : ''}`);
  bloques.push(`### Formación\n\n${formacion.join('\n')}`);
  return bloques.join('\n\n');
}

// ---------- Tecnologías (perfil.json → habilidades) ----------

// Logos de Simple Icons; lo que no tiene logo (conceptos) sale como insignia de solo texto.
const LOGOS = {
  Java: 'openjdk', 'Spring Boot': 'springboot', 'Spring Batch': 'spring', 'Spring Web Flow': 'spring',
  React: 'react', Angular: 'angular', TypeScript: 'typescript', JavaScript: 'javascript', HTML5: 'html5', CSS: 'css',
  Claude: 'claude', Ollama: 'ollama', MySQL: 'mysql', SQLite: 'sqlite',
  Docker: 'docker', 'GitHub Actions': 'githubactions', Git: 'git', Jira: 'jira', Bash: 'gnubash',
  Python: 'python', Go: 'go', Rust: 'rust', Tauri: 'tauri', PWA: 'pwa', 'Android (Capacitor)': 'capacitor',
};
// Tres tintas, no un arcoíris: violeta (código de servidor e IA), turquesa (interfaz y datos), pizarra (el resto).
const COLOR_CATEGORIA = { Backend: VIOLETA, IA: VIOLETA, Frontend: TURQUESA, Datos: TURQUESA };

function tecnologiasReadme(perfil) {
  const lineas = perfil.habilidades.map((h) => {
    const color = COLOR_CATEGORIA[h.categoria.es] ?? PIZARRA;
    const insignias = h.items.map((t) => `      <img src="${insignia(t, color, LOGOS[t])}" alt="${escapar(t)}">`);
    return ['  <tr>', `    <td width="150"><strong>${escapar(h.categoria.es)}</strong></td>`, '    <td>', ...insignias, '    </td>', '  </tr>'].join('\n');
  });
  return `<table>\n${lineas.join('\n')}\n</table>`;
}

// ---------- Proyectos (proyectos.json) ----------

const destino = (p) => p.web ?? p.descarga ?? urlRepo(p);
const altCaptura = (p) => (p.web ? `${p.privado ? 'Demo' : 'Web'} de ${p.nombre}` : p.alt);
const captura = (p) => `      <a href="${destino(p)}"><img src="./site/img/proyectos/${p.captura}" alt="${escapar(altCaptura(p))}" width="100%"></a>`;
// Con el código privado, «repo» es el de la demo pública: nunca se enlaza ni se nombra el repo privado.
const verbo = (p) => (p.jugar ? 'Jugar' : p.privado ? 'Demo' : 'Web');

function tarjetaDestacada(p) {
  const lineas = [
    '    <td width="50%" valign="top">',
    captura(p),
    `      <h3><a href="${urlRepo(p)}">${escapar(p.nombre)}</a></h3>`,
    `      <p><strong>${escapar(p.lema)}</strong><br>${escapar(p.descripcion)}</p>`,
  ];
  if (p.tecnologias?.length) lineas.push(`      <p>${p.tecnologias.map((t) => `<code>${escapar(t)}</code>`).join(' ')}</p>`);
  if (p.web) {
    const alt = p.jugar ? `Jugar a ${p.nombre}` : `${verbo(p)} de ${p.nombre}`;
    lineas.push(`      <a href="${p.web}"><img src="${insignia(verbo(p).toUpperCase(), VIOLETA, 'googlechrome')}" alt="${escapar(alt)}"></a>`);
  }
  if (p.android) lineas.push(`      <a href="${p.android}"><img src="${insignia('ANDROID', TURQUESA, 'android')}" alt="App de Android de ${escapar(p.nombre)}"></a>`);
  if (p.descarga) lineas.push(`      <a href="${p.descarga}"><img src="${insignia('DESCARGAR', VIOLETA, 'github')}" alt="Descargar ${escapar(p.nombre)}"></a>`);
  if (p.privado) lineas.push(`      <img src="${insignia('CÓDIGO PRIVADO', GRIS, 'github')}" alt="Código privado">`);
  else lineas.push(`      <a href="${urlRepo(p)}"><img src="${insignia('CÓDIGO', PIZARRA, 'github')}" alt="Código de ${escapar(p.nombre)}"></a>`);
  if (p.nota) lineas.push(`      <img src="${insignia(p.nota.texto.toUpperCase(), GRIS, p.nota.logo)}" alt="${escapar(p.nota.texto)}">`);
  lineas.push('    </td>');
  return lineas.join('\n');
}

function tarjetaCompacta(p) {
  const enlaces = [];
  if (p.web) enlaces.push(`<a href="${p.web}">${verbo(p)}</a>`);
  if (p.android) enlaces.push(`<a href="${p.android}">Android</a>`);
  if (p.descarga) enlaces.push(`<a href="${p.descarga}">Descargar</a>`);
  enlaces.push(p.privado ? 'Código privado' : `<a href="${urlRepo(p)}">Código</a>`);
  if (p.nota) enlaces.push(escapar(p.nota.texto));
  const tecnologias = p.tecnologias?.length ? `<br><sub>${p.tecnologias.map(escapar).join(' · ')}</sub>` : '';
  return [
    '    <td width="33%" valign="top">',
    captura(p),
    `      <p><strong>${p.emoji} <a href="${urlRepo(p)}">${escapar(p.nombre)}</a></strong><br>${escapar(p.lema)}${tecnologias}</p>`,
    `      <p>${enlaces.join(' · ')}</p>`,
    '    </td>',
  ].join('\n');
}

const INSIGNIA_TOTAL = /OPEN%20SOURCE-\d+%20proyectos%20abiertos/;

export function generarReadme(texto, d, perfil) {
  datos = d;
  if (!INSIGNIA_TOTAL.test(texto)) throw new Error('README.md: no encuentro la insignia «proyectos abiertos»');
  const porRepo = new Map(datos.proyectos.map((p) => [p.repo, p]));
  const destacados = perfil.destacados.map((repo) => {
    if (!porRepo.has(repo)) throw new Error(`perfil.json: el destacado «${repo}» no está en proyectos.json`);
    return porRepo.get(repo);
  });
  const resto = datos.proyectos.filter((p) => !destacados.includes(p));
  const total = datos.proyectos.filter((p) => !p.privado).length;
  const bloques = {
    titular: titularReadme(perfil),
    sobre: sobreReadme(perfil),
    tecnologias: tecnologiasReadme(perfil),
    destacados: filas(destacados.map(tarjetaDestacada), 2),
    tarjetas: filas(resto.map(tarjetaCompacta), 3),
  };
  return Object.entries(bloques)
    .reduce((t, [nombre, contenido]) => reemplazar(t, nombre, contenido, 'README.md', true), texto)
    .replace(INSIGNIA_TOTAL, `OPEN%20SOURCE-${total}%20proyectos%20abiertos`)
    .replace(/alt="\d+ proyectos de código abierto"/, `alt="${total} proyectos de código abierto"`);
}
