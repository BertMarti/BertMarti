#!/usr/bin/env node
// Prueba ATS del CV: extrae el texto de cada PDF como lo haría un filtro automático y comprueba
// que se lee entero, en orden y sin caracteres raros. Sin dependencias de npm.
//
//   node scripts/generar-cv.mjs && node scripts/comprobar-cv.mjs
//
// Necesita `pdftotext` (Git Bash en Windows; poppler-utils en Linux). Usa `pdfinfo` para contar páginas si
// está; si no, cuenta los saltos de página de pdftotext. Si hay Python con pypdf, repite la prueba con una
// segunda extracción independiente.
import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { perfil, TEXTOS, TITULO, FUENTE, SALIDA } from './generar-cv.mjs';

const ejecutar = (cmd, args) => spawnSync(cmd, args, { encoding: 'utf8', env: { ...process.env, PYTHONIOENCODING: 'utf-8' } });
const plano = (s) => s.replace(/\s+/g, ' ').trim();
// Palabras del HTML fuente: todo lo que salga del PDF tiene que ser una de ellas.
const palabrasDe = (html) => new Set(plano(html.replace(/<head>[\s\S]*?<\/head>/, '').replace(/<[^>]+>/g, ' ')
  .replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"')).split(' '));
const RAROS = /[ﬀ-ﬆ�-\u0000-\u0008\u000B\u000E-\u001F]/;

function comprobar(idioma, extractor, texto, fuente) {
  const t = TEXTOS[idioma];
  const errores = [];
  const todo = plano(texto);
  const minus = todo.toLowerCase();

  // 1. En orden: nombre, contacto, encabezados y, dentro de cada sección, lo que debe llevar.
  const puestos = perfil.experiencia.flatMap((emp) => emp.puestos);
  const hab = (i) => (idioma === 'en' && perfil.habilidadesEn[i]) || i;
  const orden = [
    perfil.nombre, perfil.contacto.email, perfil.contacto.telefono, 'linkedin.com/in/',
    t.perfil, t.logros, ...perfil.logros.map((l) => l[idioma]), t.habilidades, hab('Java'),
    t.experiencia, ...puestos.flatMap((p) => [p.cargo[idioma], `${p.inicio} – ${p.fin ?? t.actualidad}`, ...p.logros[idioma]]),
    t.formacion, perfil.formacion[0].titulo[idioma],
    t.certificaciones, perfil.certificaciones[0].nombre[idioma],
    t.idiomas, perfil.idiomas[0].idioma[idioma],
  ];
  let desde = 0;
  for (const trozo of orden) {
    const i = minus.indexOf(plano(trozo).toLowerCase(), desde);
    if (i < 0) errores.push(`no aparece, o aparece fuera de orden: «${trozo}»`);
    else desde = i + trozo.length;
  }
  if (!todo.includes(plano(perfil.perfil[idioma]))) errores.push('el párrafo de perfil no se lee seguido');

  // 2. Palabras clave de las ofertas, como palabras sueltas.
  const claves = ['Java', 'Spring Boot', 'Spring Batch', 'React', 'Angular', 'TypeScript', 'Docker', 'CI/CD',
    ...(idioma === 'en' ? ['microservices', 'REST APIs', 'AI'] : ['microservicios', 'APIs REST', 'IA'])];
  for (const c of claves) {
    const patron = new RegExp(`(^|[^\\p{L}\\d])${c.replace(/[/.]/g, '\\$&')}($|[^\\p{L}\\d])`, 'iu');
    if (!patron.test(todo)) errores.push(`falta la palabra clave «${c}»`);
  }
  if (!todo.includes('DAW')) errores.push('falta el título de DAW');

  // 3. Ni caracteres raros ni palabras pegadas o rotas: cada palabra extraída existe en el HTML fuente.
  const raro = RAROS.exec(texto);
  if (raro) errores.push(`carácter raro U+${raro[0].codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`);
  const ajenas = [...new Set(todo.split(' ').filter((p) => !fuente.has(p)))];
  if (ajenas.length) errores.push(`palabras que no están en el fuente (pegadas o rotas): ${ajenas.slice(0, 12).join(' | ')}`);

  console.log(`${errores.length ? '✗' : '✓'} ${idioma.toUpperCase()} · ${extractor}: ${errores.length ? '' : `${todo.split(' ').length} palabras, todo en orden`}`);
  for (const err of errores) console.log(`    - ${err}`);
  return errores.length;
}

let fallos = 0;
for (const idioma of Object.keys(TEXTOS)) {
  const pdf = SALIDA(idioma);
  if (!existsSync(pdf)) { console.log(`✗ ${idioma.toUpperCase()}: falta ${pdf} (ejecuta node scripts/generar-cv.mjs)`); fallos++; continue; }
  const fuente = palabrasDe(readFileSync(FUENTE(idioma), 'utf8'));

  const r = ejecutar('pdftotext', ['-layout', '-enc', 'UTF-8', pdf, '-']);
  if (r.status !== 0) { console.log(`✗ pdftotext no está o ha fallado: ${r.error?.message ?? r.stderr}`); process.exit(1); }
  fallos += comprobar(idioma, 'pdftotext -layout', r.stdout, fuente);

  const info = ejecutar('pdfinfo', [pdf]);
  const paginas = info.status === 0 ? +/Pages:\s+(\d+)/.exec(info.stdout)[1] : r.stdout.split('\f').length - 1;
  const bien = paginas === 1 || paginas === 2;
  console.log(`${bien ? '✓' : '✗'} ${idioma.toUpperCase()} · páginas: ${paginas}`);
  if (!bien) fallos++;

  // Metadatos: título, autor e idioma del documento (están sin comprimir en el PDF).
  const crudo = readFileSync(pdf, 'latin1');
  const utf16 = (s) => `FEFF${[...s].map((ch) => ch.charCodeAt(0).toString(16).padStart(4, '0')).join('')}`;
  const meta = [['título', utf16(TITULO)], ['autor', `/Author <${utf16(perfil.nombre)}`], ['idioma', `/Lang (${idioma}`]]
    .filter(([, aguja]) => !crudo.includes(aguja)).map(([nombre]) => nombre);
  console.log(`${meta.length ? '✗' : '✓'} ${idioma.toUpperCase()} · metadatos${meta.length ? `: falta ${meta.join(', ')}` : ' (título, autor, idioma)'}`);
  fallos += meta.length;

  const py = ejecutar('python', ['-c', 'import sys,pypdf\nprint("\\n".join(p.extract_text() for p in pypdf.PdfReader(sys.argv[1]).pages))', pdf]);
  if (py.status === 0) fallos += comprobar(idioma, 'pypdf', py.stdout, fuente);
  else console.log(`· ${idioma.toUpperCase()} · pypdf: no disponible, se omite la segunda extracción`);
}
console.log(fallos ? `\n${fallos} problema(s).` : '\nCV apto: se lee entero y en orden en los dos idiomas.');
process.exit(fallos ? 1 : 0);
