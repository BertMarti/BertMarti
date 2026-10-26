# PLAN.md — hoja de ruta del perfil

## Hecho (24/10/2026)
- [x] README con banner propio, tarjetas de los 9 proyectos con web y enlace al portafolio.
- [x] Portafolio en GitHub Pages (`site/`), claro/oscuro, móvil y accesible.
- [x] CI con gitleaks y comprobaciones; Dependabot para acciones.
- [x] Documentación para IA (AGENTS, CLAUDE, MEMORY, skill `anadir-proyecto`).

## Hecho (25/10/2026)
- [x] Sección «Para tu día a día» con Repartito (antes «a medias») y RUNA (README y web, con filtro).
- [x] Captura real de ARIA, ya publicada en Pages.
- [x] Vitaclip en Herramientas y aviso semanal de repos públicos que falten en el perfil.

## Hecho (26/10/2026, fase 3)
- [x] Imagen social (`og:image` 1200x630, `twitter:card`) para que el enlace del portafolio se vea bien al compartirlo.
- [x] Tarjetas del README y de la web generadas desde `proyectos.json` (script sin dependencias) y comprobadas en el CI.
- [x] Vigilancia semanal de la CSP de todas las webs de Pages (origen compartido `bertmarti.github.io`).
- [x] Trusted Types en la CSP del portafolio; clave de localStorage con prefijo `bertmarti:`.

## Siguiente
- [ ] Revisar cada pocos meses que las descripciones de `proyectos.json` siguen igual que en cada repo
      (`gh repo view BertMarti/<Repo> --json description`).
- [ ] Si la vigilancia de CSP avisa de alguna web, corregirla en su repo.

## Ideas
- Comprobar también en la vigilancia que los service workers de cada web se registran con `scope` limitado a su carpeta.
- Sección de «artículos» o notas cortas sobre IA aplicada.
