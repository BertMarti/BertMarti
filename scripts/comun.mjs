// Utilidades compartidas por scripts/readme.mjs y scripts/web.mjs.
export const escapar = (texto) => String(texto)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

// Tecnologías de proyectos.json que cambian de nombre en inglés (web y CV).
export const TECNOLOGIAS_EN = { IA: 'AI', 'SVG animado': 'Animated SVG' };

export function reemplazar(texto, nombre, contenido, archivo, conHueco = false) {
  const patron = new RegExp(`(<!-- ${nombre}:inicio[^\\n]*-->)[\\s\\S]*?(\\n[ \\t]*<!-- ${nombre}:fin -->)`);
  if (!patron.test(texto)) throw new Error(`${archivo}: faltan los marcadores <!-- ${nombre}:inicio --> / <!-- ${nombre}:fin -->`);
  const hueco = conHueco ? '\n' : '';
  return texto.replace(patron, (_, inicio, fin) => `${inicio}\n${hueco}${contenido}${hueco}${fin}`);
}
