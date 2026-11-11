# Cambios

Todas las versiones del perfil y del portafolio (https://bertmarti.github.io/BertMarti/).
El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y las versiones, [SemVer](https://semver.org/lang/es/).

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
