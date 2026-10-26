# AGENTS.md — repositorio de perfil BertMarti

Este repo es especial: GitHub muestra su `README.md` en la portada del perfil
https://github.com/BertMarti. Además publica un portafolio estático en
https://bertmarti.github.io/BertMarti/ (carpeta `site/`).

## Estructura

| Ruta | Qué es |
|---|---|
| `README.md` | Portada del perfil (lo ve cualquier visitante). Tono cercano, nada técnico. |
| `proyectos.json` | **Fuente única** de las tarjetas de proyectos (README y web). |
| `scripts/generar-tarjetas.mjs` | Regenera las tarjetas entre los marcadores `<!-- tarjetas:… -->` (sin dependencias). |
| `scripts/vigilar-csp.mjs` | Revisa la CSP de todas las webs de Pages de BertMarti (origen compartido). Pruebas en `*.test.mjs`. |
| `img/og-portafolio.svg` → `site/og.png` | Imagen al compartir el portafolio (1200x630, `og:image`). |
| `img/banner.svg`, `img/banner-dark.svg` | Cabecera del README (tema claro/oscuro con `<picture>`). |
| `commitling.svg`, `commitling-dark.svg` | Mascota pixel-art. **Los genera un bot cada día.** |
| `.github/workflows/commitling.yml` | Regenera la mascota a diario (05:23 UTC) y hace commit a `main`. |
| `site/` | Portafolio: `index.html`, `styles.css`, `app.js`, `favicon.svg`, `img/proyectos/*.webp`. Sin dependencias ni build. |
| `.github/workflows/pages.yml` | Publica `site/` en Pages (solo si cambia `site/**`). |
| `.github/workflows/ci.yml` | gitleaks + comprobaciones del README y de la web. |
| `.github/workflows/repos-publicos.yml` | Avisa (sin fallar) si un repo público no aparece en el README o en la web. |
| `.github/workflows/vigilancia-csp.yml` | Cada lunes: avisa (sin fallar) si alguna web de Pages no tiene CSP, permite `unsafe-inline`/`unsafe-eval` o scripts de fuera. |

## Reglas que no se rompen

1. **No toques `.github/workflows/commitling.yml` ni `commitling*.svg`.** Los mantiene el bot de
   [commitling](https://github.com/BertMarti/commitling). El README debe seguir mostrando la mascota con el
   mismo bloque `<picture>` y las rutas `./commitling.svg` / `./commitling-dark.svg` (el CI lo comprueba).
2. **Las líneas de contacto del README (email y LinkedIn) no se reescriben**: se dejan idénticas byte a byte.
   El email solo aparece ahí; **nunca** en `site/` ni en otros archivos (el CI falla si la web contiene un email).
3. `pages.yml` lleva el filtro `paths: site/**`: sin él, el commit diario de commitling redesplegaría la web cada día.
4. La web cumple su CSP (`<meta http-equiv="Content-Security-Policy">`, con Trusted Types): nada de `<style>`, `style=""`, `on*=`
   ni `<script>` en línea; sin `innerHTML` ni otros sumideros de HTML (Trusted Types los bloquea); enlaces externos con
   `rel="noopener noreferrer"`.
5. Nada de datos privados (IPs reales, rutas de la casa, secretos). Repos privados no se mencionan.
6. **Origen compartido:** todas las webs de `bertmarti.github.io` comparten localStorage y service workers. Las claves
   de localStorage llevan prefijo `bertmarti:` y no se guarda nada sensible.
7. Las tarjetas de proyectos **no se editan a mano**: se cambia `proyectos.json` y se ejecuta el generador.

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
gitleaks dir . --redact --no-banner          # secretos

# Regenerar la imagen social tras cambiar img/og-portafolio.svg
nice -n 19 chromium --headless=new --disable-gpu --hide-scrollbars --window-size=1200,630 \
  --screenshot=/tmp/og.png "file://$PWD/img/og-portafolio.svg"
python3 -c "from PIL import Image; Image.open('/tmp/og.png').convert('RGB').save('site/og.png', optimize=True)"
```

No hay instalación ni build: es HTML/CSS/JS estático y dos scripts de Node sin dependencias.

## Añadir un proyecto

Sigue la skill `.claude/skills/anadir-proyecto/SKILL.md`: captura 640x400 en WebP →
entrada en `proyectos.json` → `node scripts/generar-tarjetas.mjs`.

## Convenciones

- Español de España, tono cercano. Emojis con mesura (uno por título o tarjeta).
- Paleta: morado `#7C3AED` (IA/herramientas), cielo `#0EA5E9` (casa), ámbar `#D97706` (día a día), turquesa `#14B8A6` (juegos).
- Commits pequeños en español; ramas y PR, nunca push directo a `main`.
