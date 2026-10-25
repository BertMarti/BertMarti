# AGENTS.md — repositorio de perfil BertMarti

Este repo es especial: GitHub muestra su `README.md` en la portada del perfil
https://github.com/BertMarti. Además publica un portafolio estático en
https://bertmarti.github.io/BertMarti/ (carpeta `site/`).

## Estructura

| Ruta | Qué es |
|---|---|
| `README.md` | Portada del perfil (lo ve cualquier visitante). Tono cercano, nada técnico. |
| `img/banner.svg`, `img/banner-dark.svg` | Cabecera del README (tema claro/oscuro con `<picture>`). |
| `commitling.svg`, `commitling-dark.svg` | Mascota pixel-art. **Los genera un bot cada día.** |
| `.github/workflows/commitling.yml` | Regenera la mascota a diario (05:23 UTC) y hace commit a `main`. |
| `site/` | Portafolio: `index.html`, `styles.css`, `app.js`, `favicon.svg`, `img/proyectos/*.webp`. Sin dependencias ni build. |
| `.github/workflows/pages.yml` | Publica `site/` en Pages (solo si cambia `site/**`). |
| `.github/workflows/ci.yml` | gitleaks + comprobaciones del README y de la web. |

## Reglas que no se rompen

1. **No toques `.github/workflows/commitling.yml` ni `commitling*.svg`.** Los mantiene el bot de
   [commitling](https://github.com/BertMarti/commitling). El README debe seguir mostrando la mascota con el
   mismo bloque `<picture>` y las rutas `./commitling.svg` / `./commitling-dark.svg` (el CI lo comprueba).
2. **Las líneas de contacto del README (email y LinkedIn) no se reescriben**: se dejan idénticas byte a byte.
   El email solo aparece ahí; **nunca** en `site/` ni en otros archivos (el CI falla si la web contiene un email).
3. `pages.yml` lleva el filtro `paths: site/**`: sin él, el commit diario de commitling redesplegaría la web cada día.
4. La web cumple su CSP (`<meta http-equiv="Content-Security-Policy">`): nada de `<style>`, `style=""`, `on*=`
   ni `<script>` en línea; sin `innerHTML`; enlaces externos con `rel="noopener noreferrer"`.
5. Nada de datos privados (IPs reales, rutas de la casa, secretos). Repos privados no se mencionan.

## Comandos

```bash
# Ver la web en local con el mismo prefijo que en Pages
mkdir -p /tmp/pv && ln -sfn "$PWD/site" /tmp/pv/BertMarti && python3 -m http.server 8000 -d /tmp/pv
# → http://localhost:8000/BertMarti/

node --check site/app.js                     # JS válido
gitleaks dir . --redact --no-banner          # secretos
```

No hay instalación, tests ni build: es HTML/CSS/JS estático.

## Añadir un proyecto

Sigue la skill `.claude/skills/anadir-proyecto/SKILL.md`: captura 640x400 en WebP →
tarjeta en `site/index.html` → tarjeta en la tabla de su categoría del `README.md`.

## Convenciones

- Español de España, tono cercano. Emojis con mesura (uno por título o tarjeta).
- Paleta: morado `#7C3AED` (IA/herramientas), cielo `#0EA5E9` (casa), ámbar `#D97706` (día a día), turquesa `#14B8A6` (juegos).
- Commits pequeños en español; ramas y PR, nunca push directo a `main`.
