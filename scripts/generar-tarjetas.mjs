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
// Con "privado": true (apps con el código cerrado) no se enlaza el código: «repo» es el de la demo pública y la
// tarjeta dice «Código privado»; tampoco cuenta en la insignia «proyectos abiertos».

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { generarReadme } from './readme.mjs';
import { archivosWeb } from './web.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const comprobar = process.argv.includes('--comprobar');

const datos = JSON.parse(readFileSync(join(raiz, 'proyectos.json'), 'utf8'));
const perfil = JSON.parse(readFileSync(join(raiz, 'perfil.json'), 'utf8'));
validar(datos);

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
    // GitHub Pages del repo o, para una demo que se publica con Cloudflare Pages, su proyecto del mismo nombre.
    const webs = [`https://${d.dueno.toLowerCase()}.github.io/${p.repo}/`, `https://${p.repo}.pages.dev/`];
    if (p.web && !webs.some((w) => p.web.startsWith(w))) errores.push(`${id}: la web debe ser ${webs.join(' o ')} (respeta las mayúsculas)`);
    if (p.privado && !p.web) errores.push(`${id}: con el código privado necesita una «web» pública (la demo)`);
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
  ['README.md', (texto) => generarReadme(texto, datos, perfil)],
  ...archivosWeb(datos, perfil),
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
