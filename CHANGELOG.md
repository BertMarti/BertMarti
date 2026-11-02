# Cambios

Todas las versiones del perfil y del portafolio (https://bertmarti.github.io/BertMarti/).
El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y las versiones, [SemVer](https://semver.org/lang/es/).

## [1.0.0] - 2026-11-02

Primera versión estable del perfil de GitHub y del portafolio.

### Qué incluye
- **Portafolio en GitHub Pages**: tarjetas de todos los proyectos públicos con captura, lema, tecnologías y enlaces (web, jugar, código), filtros por sección, tema claro y oscuro, móvil y accesible, sin dependencias.
- **README del perfil** con las mismas tarjetas y la mascota de [commitling](https://github.com/BertMarti/commitling), que crece con los commits y se regenera sola.
- **Una sola fuente de verdad**: `proyectos.json` genera las tarjetas del README y de la web (`scripts/generar-tarjetas.mjs`); el CI falla si alguna se queda desfasada.
- **Seguridad**: CSP estricta con Trusted Types, almacenamiento con prefijo propio (origen compartido `bertmarti.github.io`), gitleaks en cada PR y vigilancia semanal de la CSP de todas las webs de Pages.
- **Avisos automáticos**: el CI comprueba cada semana que ningún repo público falte en el perfil.
- **Imagen social** (`og:image`) para que el enlace se vea bien al compartirlo.
