# Rediseño del portafolio, el README del perfil y el CV (noviembre de 2026)

Encargo de Alberto: un portafolio **más vistoso**, con un apartado de proyectos **mucho más estético**, una **banda de
tecnologías**, un botón **«Descargar CV»** y un **CV nuevo** que pase los filtros de las empresas (ATS y cribado con IA).
Referencia de estructura: https://paulareixach.github.io/ (hero con foto y CTA, banda de tecnologías, sobre mí con cifras,
experiencia en línea de tiempo, proyectos con chips, habilidades por capas, formación, contacto). **Inspirarse en la
estructura, nunca copiar** su diseño, sus textos ni su código. Identidad propia.

## Fuentes de datos (no inventes nada)
- `perfil.json`: experiencia, formación, certificaciones, habilidades, contacto, perfil (ES/EN). Sin cifras inventadas.
- `proyectos.json`: las 15 apps. Destacadas, en este orden: Fresquito, Gestorín, Lazo, modelduel, commitling, printquote
  (`perfil.json` → `destacados`, por `repo`). Las de `"privado": true` enlazan solo a la demo y dicen «Código privado».
- Foto: `img/fuentes/foto-alberto.png` (400×400).
- Capturas de antes: `docs/rediseno/antes/`.

## Identidad visual común (portafolio, README y CV)
- Tipografía: **Schibsted Grotesk** (variable, texto y titulares) y **JetBrains Mono** (detalles técnicos, chips, fechas).
  Ya están en `site/fonts/` (woff2, subconjunto latino, licencia OFL). Nada de Google Fonts en remoto.
- Color de marca: violeta `#6D28D9` (oscuro: `#A78BFA`). Secundario: turquesa `#0F766E` (oscuro: `#2DD4BF`).
  Fondo claro cálido (papel), oscuro tinta. Las secciones de proyectos pueden usar los colores de su categoría.
- Motivo propio: el **pixel** (la mascota commitling es pixel-art). Úsalo con mesura, como firma, no como decoración por todas partes.
- Que **no parezca hecho con IA**: nada de degradados morados genéricos, tarjetas de cristal, emojis por todas partes,
  textos de relleno («apasionado por…»), ni tres columnas de iconos iguales. Jerarquía clara, espacio, detalles cuidados.
- Tono: español de España, cercano y concreto. EN: inglés natural, no traducción literal.

## Reglas del repo que siguen en pie (ver AGENTS.md)
- La web cumple su CSP con Trusted Types: nada de `<style>`, `style=""`, `on*=`, `<script>` en línea ni `innerHTML`.
  Si hace falta `font-src 'self'`, se añade a la CSP. JSON-LD va en `<script type="application/ld+json">` (bloque de datos).
- Las tarjetas se generan desde `proyectos.json` (`node scripts/generar-tarjetas.mjs`), nunca a mano.
- commitling (`commitling*.svg`, `commitling.yml`) no se toca; el README sigue mostrando la mascota con el mismo `<picture>`.
- Líneas de contacto del README (email y LinkedIn): idénticas byte a byte.
- Repos privados (`BertMarti/fresquito`, `BertMarti/gestorin`) no se nombran ni se enlazan.
- Origen compartido `bertmarti.github.io`: claves de localStorage con prefijo `bertmarti:`.

## Privacidad (decisión de Alberto)
- El **teléfono solo en el CV en PDF**, nunca en el HTML de la web ni en el README.
- En la web, el **correo ofuscado** (no aparece como texto literal en el HTML; el CI falla si la web contiene un email,
  salvo en los PDF del CV) y enlace a LinkedIn.

## Rutas acordadas
- Web ES: `site/index.html` · Web EN: `site/en/index.html` (texto clave en HTML, no solo en JS).
- CV: `site/cv/Alberto-Martinez-Moreno-CV-ES.pdf` y `site/cv/Alberto-Martinez-Moreno-CV-EN.pdf`.
- Foto optimizada para la web: `site/img/alberto.avif`, `.webp` y `.jpg`.
