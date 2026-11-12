# AGENTS.md — repositorio de perfil BertMarti

Este repo es especial: GitHub muestra su `README.md` en la portada del perfil
https://github.com/BertMarti. Además publica un portafolio estático en
https://bertmarti.github.io/BertMarti/ (carpeta `site/`).

## Estructura

| Ruta | Qué es |
|---|---|
| `README.md` | Portada del perfil (lo ve cualquier visitante). Tono cercano, nada técnico. |
| `proyectos.json` | **Fuente única** de los proyectos (README, web ES/EN y CV), con textos en inglés en `en`. |
| `perfil.json` | **Fuente única** de los datos profesionales: titular, perfil, experiencia, formación, certificaciones, habilidades, idiomas, contacto y `destacados`. |
| `scripts/generar-tarjetas.mjs` | Regenera el README (entre marcadores, en `scripts/readme.mjs`) y las dos páginas de la web enteras (`scripts/web.mjs`). Sin dependencias. |
| `scripts/generar-cv.mjs`, `scripts/comprobar-cv.mjs` | CV en PDF (ES/EN) desde `perfil.json` y `proyectos.json` con Chrome sin cabeza (fuentes en `cv/`), y prueba ATS con `pdftotext` y pypdf. |
| `scripts/vigilar-csp.mjs` | Revisa la CSP de todas las webs de Pages de BertMarti (origen compartido). Pruebas en `*.test.mjs`. |
| `img/og-portafolio.svg` → `site/og.png` | Imagen al compartir el portafolio (1200x630, `og:image`). |
| `img/banner.svg`, `img/banner-dark.svg` | Cabecera del README (tema claro/oscuro con `<picture>`). |
| `commitling.svg`, `commitling-dark.svg` | Mascota pixel-art. **Los genera un bot cada día.** |
| `.github/workflows/commitling.yml` | Regenera la mascota a diario (05:23 UTC) y hace commit a `main`. |
| `site/` | Portafolio: `index.html` (ES) y `en/index.html` (EN) **generados**, `styles.css`, `app.js`, `favicon.svg`, `fonts/`, `img/`, `cv/*.pdf`, `sitemap.xml`, `robots.txt`. Sin dependencias ni build. |
| `docs/rediseno/` | Brief del rediseño de 11/2026, capturas de antes y después y el generador de los banners del README. |
| `.github/workflows/pages.yml` | Publica `site/` en Pages (solo si cambia `site/**`). |
| `.github/workflows/ci.yml` | gitleaks + comprobaciones del README y de la web. |
| `.github/workflows/repos-publicos.yml` | Avisa (sin fallar) si un repo público no aparece en el README o en la web. |
| `.github/workflows/vigilancia-csp.yml` | Cada lunes: avisa (sin fallar) si alguna web de Pages no tiene CSP, permite `unsafe-inline`/`unsafe-eval` o scripts de fuera. |

## Reglas que no se rompen

1. **No toques `.github/workflows/commitling.yml` ni `commitling*.svg`.** Los mantiene el bot de
   [commitling](https://github.com/BertMarti/commitling). El README debe seguir mostrando la mascota con el
   mismo bloque `<picture>` y las rutas `./commitling.svg` / `./commitling-dark.svg` (el CI lo comprueba).
2. **Las líneas de contacto del README (email y LinkedIn) no se reescriben**: se dejan idénticas byte a byte.
   En la web el email **nunca** aparece literal (el CI falla si la contiene): `app.js` lo compone al pulsar «Escríbeme»
   a partir de `data-a`/`data-b`. El **teléfono solo va en el CV en PDF** (`site/cv/*.pdf`, que el CI excluye), nunca en el HTML ni en el README.
3. `pages.yml` lleva el filtro `paths: site/**`: sin él, el commit diario de commitling redesplegaría la web cada día.
4. La web cumple su CSP (`<meta http-equiv="Content-Security-Policy">`, con Trusted Types): nada de `<style>`, `style=""`, `on*=`
   ni `<script>` en línea; sin `innerHTML` ni otros sumideros de HTML (Trusted Types los bloquea); enlaces externos con
   `rel="noopener noreferrer"`.
5. Nada de datos privados (IPs reales, rutas de la casa, secretos). Repos privados no se mencionan.
6. **Origen compartido:** todas las webs de `bertmarti.github.io` comparten localStorage y service workers. Las claves
   de localStorage llevan prefijo `bertmarti:` y no se guarda nada sensible.
7. La web y las tarjetas del README **no se editan a mano**: se cambia `proyectos.json`/`perfil.json` (o `scripts/web.mjs`) y se ejecuta el generador.
   Tras cambiar `perfil.json`, regenera también el CV (`node scripts/generar-cv.mjs && node scripts/comprobar-cv.mjs`).

## Comandos

```bash
# Ver la web en local con el mismo prefijo que en Pages
mkdir -p /tmp/pv && ln -sfn "$PWD/site" /tmp/pv/BertMarti && python3 -m http.server 8000 -d /tmp/pv
# → http://localhost:8000/BertMarti/

node scripts/generar-tarjetas.mjs            # regenera las tarjetas desde proyectos.json
node scripts/generar-tarjetas.mjs --comprobar # el CI falla si no coinciden
node --test scripts/vigilar-csp.test.mjs     # pruebas del vigilante de CSP
node scripts/vigilar-csp.mjs                 # revisa ya la CSP de todas las webs (necesita red)
node --check site/app.js                     # JS válido
node scripts/generar-cv.mjs && node scripts/comprobar-cv.mjs  # CV en PDF + prueba ATS (Chrome; CHROME=/ruta si hace falta)
python docs/rediseno/generar-banner.py       # banners del README (necesita fonttools y brotli)
gitleaks dir . --redact --no-banner          # secretos

# Regenerar la imagen social tras cambiar img/og-portafolio.svg
nice -n 19 chromium --headless=new --disable-gpu --hide-scrollbars --window-size=1200,630 \
  --allow-file-access-from-files --screenshot=/tmp/og.png "file://$PWD/img/og-portafolio.svg"
python3 -c "from PIL import Image; Image.open('/tmp/og.png').convert('RGB').save('site/og.png', optimize=True)"
```

No hay instalación ni build: es HTML/CSS/JS estático y dos scripts de Node sin dependencias.

## Añadir un proyecto

Sigue la skill `.claude/skills/anadir-proyecto/SKILL.md`: captura 640x400 en WebP →
entrada en `proyectos.json` → `node scripts/generar-tarjetas.mjs`.

## Convenciones

- Español de España, tono cercano. Emojis con mesura (uno por título o tarjeta).
- Identidad (desde 11/2026, ver `docs/rediseno/BRIEF.md`): Schibsted Grotesk + JetBrains Mono (autoalojadas en `site/fonts/`),
  violeta `#6D28D9` (oscuro `#A78BFA`) y turquesa `#0F766E` (oscuro `#2DD4BF`) sobre papel cálido; el píxel como firma.
- Commits pequeños en español; ramas y PR, nunca push directo a `main`.
