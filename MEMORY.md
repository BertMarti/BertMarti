# MEMORY.md — decisiones y trampas (actualizado 24/10/2026)

## Estado actual
- README del perfil renovado: banner SVG propio (claro/oscuro), proyectos en tarjetas por categoría
  (casa, herramientas e IA, juegos) con captura, web y código; mascota commitling en el mismo sitio.
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

## Trampas conocidas
- El bot de commitling hace commit a `main` cada día: las ramas se quedan atrás enseguida; no es un problema
  (no toca los mismos archivos), pero rebasa antes de fusionar si hay conflicto.
- Dependabot ignora `BertMarti/commitling` (la acción de la mascota); `actions/checkout` de `commitling.yml` sí puede actualizarlo: revísalo a mano.
- Las capturas se hacen con Chromium sin cabeza; printquote sale sin vista 3D porque no hay WebGL (es normal).
- ARIA aún no tenía web publicada el 24/10/2026; su tarjeta usa una captura de la web en preparación.
