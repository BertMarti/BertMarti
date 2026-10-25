# MEMORY.md — decisiones y trampas (actualizado 25/10/2026)

## Estado actual
- README del perfil renovado: banner SVG propio (claro/oscuro), proyectos en tarjetas por categoría
  (casa, día a día, herramientas e IA, juegos) con captura, web y código; mascota commitling en el mismo sitio.
- Portafolio estático en `site/` publicado con Pages (`pages.yml`), sin dependencias.
- CI: gitleaks + comprobaciones del README (mascota, imágenes locales) y de la web (CSP, sin email, enlaces).

## Decisiones
- **Las capturas de los proyectos viven en `site/img/proyectos/`** y el README las reutiliza con rutas relativas:
  una sola copia, WebP 640x400 (~5–20 KB cada una).
- **La mascota en la web se carga de `raw.githubusercontent.com`** (por eso la CSP permite ese `img-src`):
  así se ve la versión del día sin redesplegar la web cada vez que el bot hace commit.
- **`pages.yml` solo se dispara con `site/**`** y `ci.yml` ignora los commits que solo tocan los SVG de la mascota.
- El email está solo en el README y a propósito (lo puso Alberto). La web solo enlaza LinkedIn y GitHub.
- No se mencionan repos privados.

## Historial
- 25/10/2026: sección «Para tu día a día» (a medias y RUNA) en el README y en la web, con su filtro; captura real de ARIA
  (ya publicada); contador: 10 proyectos con web + RUNA.

## Trampas conocidas
- El bot de commitling hace commit a `main` cada día: las ramas se quedan atrás enseguida; no es un problema
  (no toca los mismos archivos), pero rebasa antes de fusionar si hay conflicto.
- Dependabot ignora `BertMarti/commitling` (la acción de la mascota); `actions/checkout` de `commitling.yml` sí puede actualizarlo: revísalo a mano.
- Las capturas se hacen con Chromium sin cabeza; printquote sale sin vista 3D porque no hay WebGL (es normal).
- RUNA no tiene web pública (es autoalojable): su tarjeta solo enlaza al repo. No menciones ningún subdominio propio.
- Las tarjetas de a medias y RUNA (25/10/2026) llevan una línea de tecnologías: en el README como `<sub>`, en la web como `.stack`.
