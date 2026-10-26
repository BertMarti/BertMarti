---
name: anadir-proyecto
description: Añade un proyecto público nuevo de BertMarti al README del perfil y al portafolio (site/), o cambia la descripción o los enlaces de uno existente. Todo sale de proyectos.json.
---

# Añadir o cambiar un proyecto del perfil y del portafolio

Las tarjetas del README y de `site/index.html` **se generan** desde `proyectos.json` con
`scripts/generar-tarjetas.mjs` (sin dependencias). No edites a mano lo que hay entre los marcadores
`<!-- tarjetas:inicio … -->` / `<!-- tarjetas:fin -->` (ni los filtros de la web): el CI falla si no coincide.

Requisitos: el repo es **público** (nunca añadas repos privados). Si tiene web, está en `https://bertmarti.github.io/<Repo>/`
(respeta las mayúsculas exactas del nombre del repo; el script lo comprueba).

**Aviso automático:** `.github/workflows/repos-publicos.yml` (semanal, en cada PR y a mano) avisa si un repo público
no aparece en el README o en la web. Si ves ese aviso, usa esta skill.

1. **Datos exactos.** `gh repo view BertMarti/<Repo> --json description,homepageUrl,languages,repositoryTopics`.
   El lema y la descripción salen de la descripción del repo, reescritos para cualquier visitante (sin jerga: nada de
   «Docker» o «Vite» en la frase; las tecnologías van aparte, en `tecnologias`).

2. **Captura 640x400 en WebP** (id en minúsculas). Con `nice` y una sola instancia de Chromium:
   ```bash
   nice -n 19 ionice -c3 chromium --headless=new --disable-gpu --hide-scrollbars --window-size=1280,800 \
     --virtual-time-budget=8000 --screenshot=/tmp/p.png https://bertmarti.github.io/<Repo>/
   python3 -c "from PIL import Image; Image.open('/tmp/p.png').convert('RGB').resize((640,400)).save('site/img/proyectos/<id>.webp','WEBP',quality=72,method=6)"
   ```
   Mírala antes de seguir (que no salga en blanco). Debe pesar menos de ~30 KB.
   Sin web que capturar: compón la imagen con PIL a partir de las capturas del propio repo y revisa que no muestren
   datos personales.

3. **Entrada en `proyectos.json`** (en el orden en que debe salir; la sección decide la tabla del README):
   ```json
   {
     "repo": "NombreExactoDelRepo", "nombre": "Nombre visible", "emoji": "🧩",
     "seccion": "casa | dia | herramientas | juegos", "etiqueta": "filtro de la web (Casa, Día a día, IA, Herramientas, Juegos)",
     "captura": "<id>.webp", "alt": "Captura de …, qué se ve",
     "lema": "Frase corta en negrita.", "descripcion": "Para qué sirve, en una o dos frases.",
     "tecnologias": ["React", "TypeScript"],
     "web": "https://bertmarti.github.io/<Repo>/", "jugar": true
   }
   ```
   Enlaces opcionales, en este orden: `web` (botón WEB, o JUGAR con `"jugar": true`), `android` (APK en releases),
   `descarga` (app de escritorio: `…/releases/latest`), el código (siempre) y `nota` (sin web ni descarga, p. ej.
   `{ "texto": "Se instala en tu servidor", "logo": "docker" }`).

4. **Genera y comprueba:**
   ```bash
   node scripts/generar-tarjetas.mjs              # reescribe README.md y site/index.html
   node scripts/generar-tarjetas.mjs --comprobar  # lo mismo que hace el CI
   git diff README.md | grep -iE 'mailto|linkedin' # no debe salir nada
   ```
   El número de la insignia «proyectos abiertos» se actualiza solo. Sirve `site/` con el prefijo `/BertMarti/`
   (ver AGENTS.md) y revisa la tarjeta en escritorio y a 390 px.

5. Si el proyecto tiene web, la vigilancia semanal de CSP (`vigilancia-csp.yml`) la incluirá sola.

6. Commit pequeño en español («Añade <Repo> al perfil y al portafolio») en una rama y PR.
