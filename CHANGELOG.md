# Cambios

Todas las versiones del perfil y del portafolio (https://bertmarti.github.io/BertMarti/).
El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y las versiones, [SemVer](https://semver.org/lang/es/).

## [2.0.0] - 2026-11-12

Rediseño completo del portafolio, del README del perfil y un CV nuevo. Capturas de antes y después en `docs/rediseno/`.

### Añadido
- **Portafolio nuevo, en español e inglés** (`/BertMarti/` y `/BertMarti/en/`), generado entero desde `perfil.json` y `proyectos.json`:
  hero con foto y botones «Descargar CV» y «Contactar», banda de tecnologías animada (se para con el ratón, el teclado, un botón
  o «reducir movimiento»), sobre mí con cifras reales, experiencia en línea de tiempo, seis proyectos destacados con captura,
  chips de tecnologías, estado y enlaces, el resto en una rejilla compacta, habilidades, formación, certificaciones y contacto.
  Identidad propia: Schibsted Grotesk y JetBrains Mono autoalojadas, violeta y turquesa sobre papel cálido, el píxel como firma.
  Modo claro y oscuro. Lighthouse 99/100/100/100 en los dos idiomas.
- **CV en PDF en español e inglés** (`site/cv/Alberto-Martinez-Moreno-CV-ES.pdf` y `-EN.pdf`), de una página y apto para ATS:
  una columna, texto seleccionable, encabezados estándar, fechas MM/AAAA y fuentes estáticas incrustadas. Se genera con
  `node scripts/generar-cv.mjs` y se comprueba con `node scripts/comprobar-cv.mjs` (pdftotext y pypdf).
- **`perfil.json`**: fuente única de la experiencia, la formación, las habilidades y el contacto, que comparten la web, el README y el CV.
- Para buscadores y filtros de empresas: JSON-LD `Person`, Open Graph y Twitter por idioma, `hreflang`, `sitemap.xml` y `robots.txt`.
  Imagen social nueva.

### Cambiado
- **README del perfil rehecho**: cabecera nueva, botones de portafolio y CV, sobre mí con la experiencia, banda de tecnologías
  por categorías, seis destacados con captura y el resto más compactos. La mascota commitling sigue igual.
- **Privacidad**: el teléfono solo aparece en el CV en PDF. En la web el correo ya no está escrito: se compone al pulsar «Escríbeme».
- **Lazo** pasa a la 1.0 «Nochebuena» en las tarjetas (de la rama del PR #24).
- CSP de la web: `font-src 'self'` para las fuentes propias y `connect-src 'self'` para que Lighthouse lea `robots.txt`.
- El generador se divide en `scripts/readme.mjs`, `scripts/web.mjs` y `scripts/comun.mjs`. El CI comprueba también la página en
  inglés, que el teléfono no está en la web y que existen el sitemap y `robots.txt`.
- Versión del pie del portafolio: v2.0.0.

[2.0.0]: https://github.com/BertMarti/BertMarti/blob/main/CHANGELOG.md

## [1.2.5] - 2026-11-12

### Cambiado
- **Lazo** pasa a v0.5: captura nueva con el diseño «El catálogo de juguetes» (la familia en grande y lo más deseado en fotos) y descripción al día (avisos sin spoilers y guía para montarlo en casa).
- Versión del pie del portafolio: v1.2.5.

## [1.2.4] - 2026-11-11

### Cambiado
- **Fresquito** (v4.0.2): la demo se muda a https://fresquito-demo.pages.dev/ (Cloudflare Pages); captura nueva del
  rediseño «Nevera abierta», con lo que caduca antes en fichas ilustradas y una receta para hoy.
- Versión del pie del portafolio: v1.2.4.

## [1.2.3] - 2026-11-11

### Cambiado
- **Gestorín** (v3.2.1): captura del diseño nuevo, «Expediente con señal», con el índice de apartados arriba en lugar del panel lateral, las cifras de días en serif y los iconos propios. La descripción lo cuenta.
- Versión del pie del portafolio: v1.2.3.

## [1.2.2] - 2026-11-11

### Cambiado
- **Lazo** pasa a v0.3.0: captura nueva con fotos de regalos de verdad y descripción al día (la IA es opcional y, para el uso diario, en casa con Ollama).
- Versión del pie del portafolio: v1.2.2.

## [1.2.1] - 2026-11-11

### Cambiado
- **Gestorín** (v3.0.1): captura nueva de la demo, con la lista «Por hacer» y el filtro por persona. La descripción cuenta las novedades de la 3.0: los papeles de toda la familia, un lector con IA en casa (Ollama) para todos, el modo sin IA y unos Ajustes más sencillos.
- Versión del pie del portafolio: v1.2.1.

## [1.2.0] - 2026-11-11

### Añadido
- **Lazo** (v0.2.0): listas de regalos en familia sin regalos repetidos ni spoilers. Nadie ve lo de su propia lista, ni siquiera por la API. Incluye hucha común con ajuste de cuentas, regalos a medias, amigo invisible y día de la entrega. Web (PWA) y Android, autoalojado con PocketBase. Repo público y demo en https://bertmarti.github.io/lazo/.
- Versión del pie del portafolio: v1.2.0.

## [1.1.2] - 2026-11-10

### Corregido
- El enlace de la versión del pie del portafolio daba 404 porque apuntaba a una release que no existía; ahora lleva a este CHANGELOG, que siempre está al día.

## [1.1.1] - 2026-11-10

### Cambiado
- **Fresquito** (v2.4.0): captura nueva con la estética «Frescor» en azul y verde; la descripción cuenta las recetas según tus preferencias y que lo que falta pasa a la lista de la compra (exportación a Pricely). Su demo saca 99/100 en Lighthouse.
- **Gestorín** (v2.11.0): captura nueva con el diseño serio y elegante (inicio con los plazos y los apartados Identidad, Vehículo, Hogar, Salud y Hacienda); la descripción suma el modo sin IA, el calendario fiscal y el widget de Android.
- Versión del pie del portafolio: v1.1.1.

## [1.1.0] - 2026-11-10

### Añadido
- **Fresquito** 🥬: foto a la nevera, la despensa o el ticket; la IA apunta qué tienes, avisa de lo que caduca y propone recetas a tu gusto. Web (PWA) y Android.
- **Gestorín** 🗂️: tu gestor de bolsillo, que explica cartas, multas y notificaciones en lenguaje llano y avisa de los plazos. Windows y Android.
- Nueva sección **«✨ Recién salidas: apps con IA»**, la primera del README; en la web, las dos apps abren la rejilla de proyectos.
- Las tarjetas admiten `"privado": true` para apps con el código cerrado: enlazan solo a la demo pública («Probar la demo»), muestran «Código privado» y no cuentan en la insignia «proyectos abiertos».

### Cambiado
- El aviso semanal de repos públicos da por presente un repo si aparece su web de Pages (las demos no enlazan su repo).
- Versión del pie del portafolio: v1.1.0.

## [1.0.0] - 2026-11-02

Primera versión estable del perfil de GitHub y del portafolio.

### Qué incluye
- **Portafolio en GitHub Pages**: tarjetas de todos los proyectos públicos con captura, lema, tecnologías y enlaces (web, jugar, código), filtros por sección, tema claro y oscuro, móvil y accesible, sin dependencias.
- **README del perfil** con las mismas tarjetas y la mascota de [commitling](https://github.com/BertMarti/commitling), que crece con los commits y se regenera sola.
- **Una sola fuente de verdad**: `proyectos.json` genera las tarjetas del README y de la web (`scripts/generar-tarjetas.mjs`); el CI falla si alguna se queda desfasada.
- **Seguridad**: CSP estricta con Trusted Types, almacenamiento con prefijo propio (origen compartido `bertmarti.github.io`), gitleaks en cada PR y vigilancia semanal de la CSP de todas las webs de Pages.
- **Avisos automáticos**: el CI comprueba cada semana que ningún repo público falte en el perfil.
- **Imagen social** (`og:image`) para que el enlace se vea bien al compartirlo.

[1.1.2]: https://github.com/BertMarti/BertMarti/blob/main/CHANGELOG.md
[1.1.1]: https://github.com/BertMarti/BertMarti/releases/tag/v1.1.1
[1.1.0]: https://github.com/BertMarti/BertMarti/releases/tag/v1.1.0
[1.0.0]: https://github.com/BertMarti/BertMarti/releases/tag/v1.0.0
