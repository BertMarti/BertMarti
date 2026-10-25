---
name: anadir-proyecto
description: Añade un proyecto público nuevo de BertMarti al README del perfil y al portafolio (site/). Úsala cuando haya un repo público nuevo con web en GitHub Pages o cambie la descripción de uno existente.
---

# Añadir un proyecto al perfil y al portafolio

Requisitos: el repo es **público** (nunca añadas repos privados). Si tiene web, está en `https://bertmarti.github.io/<Repo>/`
(respeta las mayúsculas exactas del nombre del repo). Si no tiene web:
- app de escritorio con releases (p. ej. Vitaclip) → botón «Descargar» a `https://github.com/BertMarti/<Repo>/releases/latest`;
- app autoalojada sin web pública (p. ej. RUNA) → solo «Ver el código» y la nota «Se instala en tu servidor».

**Aviso automático:** el workflow `.github/workflows/repos-publicos.yml` (semanal, en cada PR y a mano) compara los repos
públicos de la API con los enlaces `github.com/BertMarti/<Repo>` del README y de `site/index.html`, y deja un aviso
(`::warning::`, nunca falla) y una tabla en el resumen del job por cada repo que falte. Si ves ese aviso, usa esta skill.

1. **Datos exactos.** `gh repo view BertMarti/<Repo> --json description,homepageUrl` — la frase de la tarjeta sale
   de la descripción, reescrita para cualquier visitante (sin jerga: nada de «Docker», «Vite»…).
   Elige categoría: casa (cielo `#0EA5E9`), día a día (ámbar `#D97706`), herramientas e IA (morado `#7C3AED`) o juegos (turquesa `#14B8A6`).

2. **Captura 640x400 en WebP** (id en minúsculas):
   ```bash
   chromium --headless=new --disable-gpu --hide-scrollbars --window-size=1280,800 \
     --virtual-time-budget=8000 --screenshot=/tmp/p.png https://bertmarti.github.io/<Repo>/
   python3 -c "from PIL import Image; Image.open('/tmp/p.png').convert('RGB').resize((640,400)).save('site/img/proyectos/<id>.webp','WEBP',quality=72,method=6)"
   ```
   Mírala antes de seguir (que no salga en blanco). Debe pesar menos de ~30 KB.
   Sin web que capturar: compón la imagen con PIL a partir de las capturas del propio repo (p. ej. `docs/img/*.png`,
   descargadas con `gh api repos/BertMarti/<Repo>/contents/<ruta> -H "Accept: application/vnd.github.raw"`) y revisa que
   no muestren datos personales.

3. **Web (`site/index.html`).** Copia una tarjeta existente de la misma categoría y cambia: imagen
   (`img/proyectos/<id>.webp`, con `width`/`height`, `loading="lazy"` y `alt`), nombre, frase, categoría y los dos
   enlaces («Abrir la web» y «Ver el código»), con `rel="noopener noreferrer"`. Sin estilos ni scripts en línea (CSP).

4. **README.** Copia una celda `<td>` de la tabla de su categoría (imagen `./site/img/proyectos/<id>.webp`, título con
   emoji, frase en negrita + explicación, insignias WEB/JUGAR y CÓDIGO). Si la fila ya tiene 3 celdas, abre otra `<tr>`.
   Actualiza el número de la insignia «proyectos abiertos» del final.
   **No toques** las líneas de contacto, el bloque `<picture>` de la mascota ni `commitling*.svg`.

5. **Comprueba:**
   ```bash
   git diff README.md | grep -iE 'mailto|linkedin|commitling' # no debe salir nada (salvo que el proyecto sea commitling)
   node --check site/app.js
   ```
   Sirve `site/` con el prefijo `/BertMarti/` (ver AGENTS.md) y revisa la tarjeta en escritorio y a 390 px.

6. Commit pequeño en español («Añade <Repo> al perfil y al portafolio») en una rama y PR.
