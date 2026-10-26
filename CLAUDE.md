# CLAUDE.md

Lee primero [AGENTS.md](AGENTS.md): ahí están la estructura y las reglas.

Recordatorios para Claude Code:
- Nunca edites `commitling.yml` ni `commitling*.svg`, ni reescribas las líneas de contacto del README
  (si cambias líneas alrededor, comprueba con `git diff README.md | grep -iE 'mailto|linkedin'` que no salen).
- Para añadir o cambiar un proyecto usa la skill `anadir-proyecto`: se edita `proyectos.json` y se ejecuta
  `node scripts/generar-tarjetas.mjs`; nunca toques a mano las tarjetas entre marcadores.
- Antes de dar algo por hecho: `node scripts/generar-tarjetas.mjs --comprobar`, `node --test scripts/vigilar-csp.test.mjs`,
  `node --check site/app.js`, sirve `site/` con prefijo `/BertMarti/` y comprueba en Chromium (con `nice`) que no hay
  violaciones de CSP ni de Trusted Types.
- Decisiones y trampas conocidas: [MEMORY.md](MEMORY.md). Hoja de ruta: [PLAN.md](PLAN.md).
