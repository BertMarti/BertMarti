# CLAUDE.md

Lee primero [AGENTS.md](AGENTS.md): ahí están la estructura y las reglas.

Recordatorios para Claude Code:
- Nunca edites `commitling.yml` ni `commitling*.svg`, ni reescribas las líneas de contacto del README
  (si cambias líneas alrededor, comprueba con `git diff README.md | grep -iE 'mailto|linkedin'` que no salen).
- Para añadir un proyecto usa la skill `anadir-proyecto`.
- Antes de dar algo por hecho: `node --check site/app.js`, sirve `site/` con prefijo `/BertMarti/` y haz captura.
- Decisiones y trampas conocidas: [MEMORY.md](MEMORY.md). Hoja de ruta: [PLAN.md](PLAN.md).
