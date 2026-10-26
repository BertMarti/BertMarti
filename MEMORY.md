# MEMORY.md — decisiones y trampas (actualizado 26/10/2026, fase 3)

## Estado actual
- README del perfil renovado: banner SVG propio (claro/oscuro), proyectos en tarjetas por categoría
  (casa, día a día, herramientas e IA, juegos); están TODOS los repos públicos con aplicación (12, sin contar este) con captura, web y código; mascota commitling en el mismo sitio.
- Portafolio estático en `site/` publicado con Pages (`pages.yml`), sin dependencias.
- CI: gitleaks + comprobaciones del README (mascota, imágenes locales) y de la web (CSP, sin email, enlaces),
  y que las tarjetas generadas coinciden con `proyectos.json`.
- Las tarjetas del README y de la web salen de `proyectos.json` (`scripts/generar-tarjetas.mjs`).
- Vigilancia semanal (lunes) de la CSP de todas las webs de Pages (`vigilancia-csp.yml`). El 26/10/2026 las 11 webs
  tenían `script-src 'self'` (commitling añade `'wasm-unsafe-eval'`, que se acepta: solo permite compilar WebAssembly).

## Decisiones
- **Las capturas de los proyectos viven en `site/img/proyectos/`** y el README las reutiliza con rutas relativas:
  una sola copia, WebP 640x400 (~5–20 KB cada una).
- **La mascota en la web se carga de `raw.githubusercontent.com`** (por eso la CSP permite ese `img-src`):
  así se ve la versión del día sin redesplegar la web cada vez que el bot hace commit.
- **`pages.yml` solo se dispara con `site/**`** y `ci.yml` ignora los commits que solo tocan los SVG de la mascota.
- El email está solo en el README y a propósito (lo puso Alberto). La web solo enlaza LinkedIn y GitHub.
- No se mencionan repos privados.

- **Una sola fuente para las tarjetas** (26/10/2026): `proyectos.json` + generador sin dependencias que reescribe solo
  lo que hay entre marcadores (`<!-- tarjetas:inicio … -->`/`<!-- tarjetas:fin -->`, y `filtros` en la web) y el número
  de la insignia «proyectos abiertos». Se eligió un script propio en vez de una plantilla o un framework para seguir sin
  `package.json` ni build. Al unificar se igualaron los textos: la web usa el mismo lema y descripción que el README
  (antes había dos redacciones distintas) y todas las tarjetas llevan línea de tecnologías.
- **Imagen social**: `site/og.png` (1200x630, PNG ~160 KB) renderizada con Chromium desde `img/og-portafolio.svg`;
  URL absoluta `https://bertmarti.github.io/BertMarti/og.png`. El PNG cuantizado a 256 colores pesaba 60 KB pero
  estropeaba los colores de las capturas: se dejó sin cuantizar.
- **Trusted Types** en la CSP (`require-trusted-types-for 'script'; trusted-types 'none'`): el JS solo usa
  `textContent`, atributos y `dataset`. Comprobado en Chromium: 0 violaciones; un `innerHTML` de prueba queda bloqueado.
- La clave de localStorage del tema pasa de `portfolio-theme` a `bertmarti:tema` (origen compartido); la antigua se
  migra y se borra en la primera visita.

## Historial
- 25/10/2026 (noche): «a medias» pasa a llamarse **Repartito** (web /repartito/, repo BertMarti/repartito, app de Android en releases) para evitar choques de marca con apps de gastos «A medias». Su web antigua /amedias/ da 404.
- 25/10/2026: sección «Para tu día a día» (a medias —hoy Repartito— y RUNA) en el README y en la web, con su filtro; captura real de ARIA
  (ya publicada); contador: 10 proyectos con web + RUNA.
- 25/10/2026 (noche): Vitaclip (app de escritorio, sin web: botón «Descargar» a releases/latest) en Herramientas;
  imagen compuesta con PIL a partir de `docs/img/popup*.png` de su repo (datos de ejemplo, nada personal). printquote ya
  acepta STL, OBJ o 3MF. Contador: «12 proyectos abiertos». Nuevo workflow `repos-publicos.yml` que avisa si falta alguno.

- 26/10/2026 (fase 3): `proyectos.json` + generador + comprobación en CI; `og:image` y tarjeta de Twitter/X;
  Trusted Types; vigilancia semanal de CSP del origen compartido; enlaces de las tarjetas alineados abajo.

## Trampas conocidas
- El bot de commitling hace commit a `main` cada día: las ramas se quedan atrás enseguida; no es un problema
  (no toca los mismos archivos), pero rebasa antes de fusionar si hay conflicto.
- Dependabot ignora `BertMarti/commitling` (la acción de la mascota); `actions/checkout` de `commitling.yml` sí puede actualizarlo: revísalo a mano.
- Las capturas se hacen con Chromium sin cabeza; printquote sale sin vista 3D porque no hay WebGL (es normal).
- RUNA no tiene web pública (es autoalojable): su tarjeta solo enlaza al repo. No menciones ningún subdominio propio.
- Todas las tarjetas llevan una línea de tecnologías: en el README como `<sub>`, en la web como `.stack`.
- Si el CI dice que las tarjetas no coinciden, alguien editó el README o la web a mano: pasa el cambio a
  `proyectos.json` y ejecuta `node scripts/generar-tarjetas.mjs`.
- Cualquier sumidero de HTML (`innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`) rompe la web por
  Trusted Types: usa `textContent` y `createElement`.
- `node --test scripts/` con un directorio cambia de comportamiento entre Node 20 y 22: pasa el archivo de pruebas explícito.
