// Portafolio (site/index.html en español y site/en/index.html en inglés). Lo usa scripts/generar-tarjetas.mjs.
// Las dos páginas se generan ENTERAS desde perfil.json y proyectos.json: no las edites a mano.
// La web cumple una CSP con Trusted Types: aquí no se genera ningún atributo de estilo, bloque de estilos,
// manejador on* ni script en línea (el JSON-LD es un bloque de datos, no se ejecuta).
import { escapar, TECNOLOGIAS_EN } from './comun.mjs';

const VERSION = '2.1.0';
const URL_BASE = 'https://bertmarti.github.io/BertMarti/';
const MASCOTA = 'https://raw.githubusercontent.com/BertMarti/BertMarti/main/';
// connect-src 'self': la web no hace peticiones, pero sin él Lighthouse no puede leer robots.txt y suspende esa auditoría de SEO.
const CSP = "default-src 'none'; script-src 'self'; style-src 'self'; font-src 'self'; connect-src 'self'; img-src 'self' https://raw.githubusercontent.com; base-uri 'none'; form-action 'none'; require-trusted-types-for 'script'; trusted-types 'none'";

// ---------- Textos de la interfaz ----------

const T = {
  es: {
    titulo: 'Alberto Martínez · Full-Stack Developer (Java, Spring Boot, React, Angular)',
    saltar: 'Saltar al contenido',
    inicio: 'Inicio, Alberto Martínez',
    nav: [['sobre-mi', 'Sobre mí'], ['experiencia', 'Experiencia'], ['proyectos', 'Proyectos'], ['habilidades', 'Habilidades'], ['formacion', 'Formación'], ['contacto', 'Contacto']],
    navLabel: 'Secciones',
    idioma: 'Idioma',
    tema: 'Activar modo oscuro',
    cv: 'Descargar CV',
    cvArchivo: 'cv/Alberto-Martinez-Moreno-CV-ES.pdf',
    contactar: 'Contactar',
    entradilla: 'Desarrollador Full-Stack con más de 3 años en NTT DATA construyendo software para banca: microservicios con Spring Boot, procesos batch e interfaces en React y Angular. Especializado en modernizar arquitecturas con IA.',
    fotoAlt: 'Retrato de Alberto Martínez',
    banda: 'Tecnologías con las que trabajo',
    pausar: 'Pausar la banda de tecnologías',
    sobreMi: 'Sobre mí',
    cifras: (c) => [[`+${c.anios}`, 'años en NTT DATA, desde marzo de 2023'], [c.proyectos, 'proyectos propios publicados'], [c.abiertos, 'con el código abierto en GitHub'], [c.nota, 'de nota media en el ciclo de DAW']],
    experiencia: 'Experiencia',
    hoy: 'hoy',
    actual: 'Actual',
    destacados: 'Proyectos personales',
    destacadosIntro: 'Aplicaciones completas que diseño, desarrollo y publico de principio a fin: arquitectura, UX, seguridad y despliegue.',
    mas: (n) => `Otros ${n} proyectos`,
    masIntro: 'Herramientas, servicios autoalojados y juegos, todos publicados y de código abierto en GitHub.',
    tecnologias: 'Tecnologías',
    abrir: 'Abrir la web', jugar: 'Jugar', demo: 'Probar la demo', android: 'App Android', descargar: 'Descargar', codigo: 'Ver el código', privado: 'Código privado',
    de: (n) => ` de ${n}`,
    habilidades: 'Habilidades',
    idiomas: 'Idiomas',
    formacion: 'Formación y certificaciones',
    estudios: 'Formación',
    certificaciones: 'Certificaciones',
    mascota: 'Mi commitling',
    mascotaTexto: 'Una mascota pixel-art generada a partir de mi actividad en GitHub. Se actualiza automáticamente cada día.',
    mascotaEnlace: 'Ver el proyecto',
    mascotaAlt: 'Commitling, mascota pixel-art que crece con los commits',
    contacto: '¿Hablamos?',
    contactoTexto: (p) => `Vivo en ${p.ubicacion.es.split(',')[0]} y trabajo en ${p.modalidad.es.toLowerCase()}. Puedes contactar conmigo por correo o por LinkedIn.`,
    escribeme: 'Escríbeme',
    pie: 'Desarrollo propio, sin dependencias',
    pieCodigo: 'Código en GitHub',
    meses: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    etiquetas: {},
    ogAlt: 'Alberto Martínez, Full-Stack Developer, junto a capturas de sus proyectos',
  },
  en: {
    titulo: 'Alberto Martínez · Full-Stack Developer (Java, Spring Boot, React, Angular)',
    saltar: 'Skip to content',
    inicio: 'Home, Alberto Martínez',
    nav: [['sobre-mi', 'About'], ['experiencia', 'Experience'], ['proyectos', 'Projects'], ['habilidades', 'Skills'], ['formacion', 'Education'], ['contacto', 'Contact']],
    navLabel: 'Sections',
    idioma: 'Language',
    tema: 'Switch to dark mode',
    cv: 'Download CV',
    cvArchivo: '../cv/Alberto-Martinez-Moreno-CV-EN.pdf',
    contactar: 'Get in touch',
    entradilla: 'Full-Stack Developer with 3+ years at NTT DATA building banking software: Spring Boot microservices, batch processing and React/Angular front ends. Focused on modernising architectures with AI.',
    fotoAlt: 'Portrait of Alberto Martínez',
    banda: 'Technologies I work with',
    pausar: 'Pause the technology band',
    sobreMi: 'About me',
    cifras: (c) => [[`${c.anios}+`, 'years at NTT DATA, since March 2023'], [c.proyectos, 'personal projects shipped'], [c.abiertos, 'of them open source on GitHub'], [c.nota.replace(',', '.'), 'out of 10, average grade in my web development diploma']],
    experiencia: 'Experience',
    hoy: 'present',
    actual: 'Current',
    destacados: 'Personal projects',
    destacadosIntro: 'Complete applications I design, build and ship end to end: architecture, UX, security and deployment.',
    mas: (n) => `${n} more projects`,
    masIntro: 'Tools, self-hosted apps and games, all published and open source on GitHub.',
    tecnologias: 'Technologies',
    abrir: 'Open the site', jugar: 'Play', demo: 'Try the demo', android: 'Android app', descargar: 'Download', codigo: 'View the code', privado: 'Closed source',
    de: (n) => `: ${n}`,
    habilidades: 'Skills',
    idiomas: 'Languages',
    formacion: 'Education and certifications',
    estudios: 'Education',
    certificaciones: 'Certifications',
    mascota: 'My commitling',
    mascotaTexto: 'A pixel-art pet generated from my GitHub activity. It updates automatically every day.',
    mascotaEnlace: 'View the project',
    mascotaAlt: 'Commitling, a pixel-art pet that grows with commits',
    contacto: 'Let’s talk',
    contactoTexto: (p) => `I’m based in ${p.ubicacion.en} (${p.modalidad.en.toLowerCase()}). You can reach me by email or on LinkedIn.`,
    escribeme: 'Email me',
    pie: 'Built from scratch, no dependencies',
    pieCodigo: 'Source on GitHub',
    meses: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    etiquetas: { 'Familia': 'Family', 'Día a día': 'Everyday', 'Casa': 'Home', 'IA': 'AI', 'Herramientas': 'Tools', 'Juegos': 'Games' },
    ogAlt: 'Alberto Martínez, Full-Stack Developer, next to screenshots of his projects',
  },
};

// ---------- Iconos pixel-art propios (rejilla de 9×9; «#» es un píxel encendido) ----------

const ICONOS = {
  ext: ['.........', '..######.', '......##.', '.....#.#.', '....#..#.', '...#...#.', '..#....#.', '.#.......', '.........'],
  bajar: ['....#....', '....#....', '....#....', '.#..#..#.', '..#.#.#..', '...###...', '....#....', '.........', '#########'],
  correo: ['.........', '#########', '##.....##', '#.#...#.#', '#..#.#..#', '#...#...#', '#.......#', '#########', '.........'],
  sol: ['....#....', '.#.....#.', '...###...', '..#####..', '#.#####.#', '..#####..', '...###...', '.#.....#.', '....#....'],
  luna: ['...####..', '..###....', '.###.....', '.###.....', '.###.....', '.####...#', '..#######', '...#####.', '.........'],
  pausa: ['.........', '.##...##.', '.##...##.', '.##...##.', '.##...##.', '.##...##.', '.##...##.', '.##...##.', '.........'],
  play: ['.........', '..#......', '..###....', '..#####..', '..#######', '..#####..', '..###....', '..#......', '.........'],
  candado: ['...###...', '..#...#..', '..#...#..', '.#######.', '.#######.', '.###.###.', '.###.###.', '.#######.', '.........'],
  // Tecnologías
  taza: ['..#..#...', '...#..#..', '..#..#...', '.........', '#######..', '#.....###', '#.....#.#', '#.....###', '.#####...'],
  hoja: ['......###', '....#####', '..#######', '.#####.##', '.####.###', '####.###.', '###.####.', '.#.###...', '#........'],
  capas: ['.#######.', '#########', '.#######.', '.........', '.#######.', '#########', '.........', '.#######.', '#########'],
  atomo: ['...###...', '..#...#..', '.#.....#.', '#...#...#', '#..###..#', '#...#...#', '.#.....#.', '..#...#..', '...###...'],
  escudo: ['....#....', '..#####..', '####.####', '###.#.###', '###...###', '.#.###.#.', '.#.###.#.', '..#####..', '....#....'],
  ts: ['#########', '#########', '#########', '#...#...#', '##.##.###', '##.##...#', '##.####.#', '##.##...#', '#########'],
  bloques: ['..#####..', '..#.###..', '..#####..', '#######.#', '######.##', '#.#######', '..#####..', '..###.#..', '..#####..'],
  go: ['.........', '.........', '####.####', '#....#..#', '#.##.#..#', '#..#.#..#', '####.####', '.........', '.........'],
  engranaje: ['...#.#...', '.#.###.#.', '..#####..', '###...###', '.##...##.', '###...###', '..#####..', '.#.###.#.', '...#.#...'],
  ballena: ['.........', '...##....', '.##.##...', '##.##.#.#', '.......##', '########.', '#######..', '.######..', '..####...'],
  cilindro: ['.#######.', '#########', '.#######.', '#.......#', '#########', '#.......#', '#########', '#.......#', '.#######.'],
  rama: ['.##......', '.##......', '.#....##.', '.#....##.', '.#...#...', '.####....', '.#.......', '.##......', '.##......'],
  ciclo: ['..#####..', '.#.....#.', '#..#....#', '#..##...#', '#..###..#', '#..##...#', '#..#....#', '.#.....#.', '..#####..'],
  chispa: ['....#....', '....#....', '....#....', '...###...', '#########', '...###...', '....#....', '....#....', '....#....'],
};

// Banda de tecnologías: [nombre tal como figura en perfil.json → habilidades, icono].
// Solo salen las que siguen en perfil.json, así que la banda no puede anunciar algo que el perfil ya no dice.
const BANDA = [
  ['Java', 'taza'], ['Spring Boot', 'hoja'], ['Spring Batch', 'capas'], ['React', 'atomo'], ['Angular', 'escudo'],
  ['TypeScript', 'ts'], ['Microservicios', 'bloques'], ['Orquestación de agentes', 'chispa'], ['SQL', 'cilindro'],
  ['Docker', 'ballena'], ['CI/CD', 'ciclo'], ['Git', 'rama'], ['Go', 'go'], ['Rust', 'engranaje'],
];

function trazo(filas) {
  let d = '';
  filas.forEach((fila, y) => {
    for (const m of fila.matchAll(/#+/g)) d += `M${m.index} ${y}h${m[0].length}v1h-${m[0].length}z`;
  });
  return d;
}

const simbolos = () => `<svg class="sprite" aria-hidden="true" focusable="false" width="0" height="0">${
  Object.entries(ICONOS).map(([id, filas]) => `<symbol id="i-${id}" viewBox="0 0 9 9"><path d="${trazo(filas)}"/></symbol>`).join('')}</svg>`;

const icono = (id, clase = '') => `<svg class="ico${clase ? ` ${clase}` : ''}" aria-hidden="true" focusable="false" width="18" height="18"><use href="#i-${id}"/></svg>`;

// ---------- Utilidades ----------

let datos, perfil, lang, t, base;
const e = escapar;
const tx = (campo) => e(typeof campo === 'string' ? campo : campo[lang]);
const urlRepo = (p) => `https://github.com/${datos.dueno}/${p.repo}`;
const habilidad = (h) => (lang === 'en' ? perfil.habilidadesEn?.[h] ?? h : h);
const enP = (p, campo) => (lang === 'en' ? p.en?.[campo] ?? p[campo] : p[campo]);
const tecnologia = (x) => e((lang === 'en' && TECNOLOGIAS_EN[x]) || x);

function fecha(mmAaaa) {
  if (!mmAaaa) return t.hoy;
  const [mm, aaaa] = mmAaaa.split('/');
  return `${t.meses[Number(mm) - 1]} ${aaaa}`;
}
const periodo = (inicio, fin) => `${fecha(inicio)} – ${fecha(fin)}`;
const aMeses = (mmAaaa) => { const [mm, aaaa] = mmAaaa.split('/').map(Number); return aaaa * 12 + mm; };

// Cifras reales, calculadas con los datos. Los años se cuentan hasta la fecha más reciente que figura en perfil.json
// (no hasta «hoy»): así la página generada es siempre la misma y el CI puede compararla.
function cifras() {
  const puestos = perfil.experiencia.flatMap((x) => x.puestos);
  const fechas = [...puestos.flatMap((p) => [p.inicio, p.fin]), ...perfil.certificaciones.map((c) => c.fecha)].filter(Boolean).map(aMeses);
  const inicio = Math.min(...puestos.map((p) => aMeses(p.inicio)));
  return {
    anios: Math.floor((Math.max(...fechas) - inicio) / 12),
    proyectos: datos.proyectos.length,
    abiertos: datos.proyectos.filter((p) => !p.privado).length,
    nota: perfil.formacion[0].nota.es.match(/[\d,]+/)[0],
  };
}

function externo(url, texto, ico = 'ext', oculto = '') {
  return `<a href="${url}" target="_blank" rel="noopener noreferrer">${e(texto)}${oculto ? `<span class="vh">${e(oculto)}</span>` : ''}${icono(ico)}</a>`;
}

// ---------- Secciones ----------

function cabeza() {
  const url = lang === 'es' ? URL_BASE : `${URL_BASE}en/`;
  const rol = perfil.titular[lang].split(' · ')[0];
  const descripcion = `${perfil.perfil[lang].split('. ').slice(0, 2).join('. ')}.`;
  const og = `${URL_BASE}og.png`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: perfil.nombre,
    alternateName: perfil.nombreCorto,
    jobTitle: rol,
    description: perfil.perfil[lang],
    url: URL_BASE,
    image: `${URL_BASE}img/alberto.jpg`,
    worksFor: { '@type': 'Organization', name: 'NTT DATA', url: 'https://www.nttdata.com/' },
    address: { '@type': 'PostalAddress', addressLocality: 'Jaén', addressCountry: 'ES' },
    alumniOf: perfil.formacion.map((f) => ({ '@type': 'EducationalOrganization', name: f.centro })),
    knowsAbout: perfil.habilidades.flatMap((h) => h.items.map(habilidad)),
    knowsLanguage: perfil.idiomas.map((i) => i.idioma[lang]),
    sameAs: [perfil.contacto.linkedin, perfil.contacto.github],
  };
  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e(t.titulo)}</title>
  <meta http-equiv="Content-Security-Policy" content="${CSP}">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta name="description" content="${e(descripcion)}">
  <meta name="author" content="${e(perfil.nombre)}">
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="es" href="${URL_BASE}">
  <link rel="alternate" hreflang="en" href="${URL_BASE}en/">
  <link rel="alternate" hreflang="x-default" href="${URL_BASE}">
  <meta property="og:type" content="profile">
  <meta property="og:locale" content="${lang === 'es' ? 'es_ES' : 'en_GB'}">
  <meta property="og:locale:alternate" content="${lang === 'es' ? 'en_GB' : 'es_ES'}">
  <meta property="og:site_name" content="${e(perfil.nombreCorto)}">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${e(perfil.nombreCorto)} | ${e(rol)}">
  <meta property="og:description" content="${e(perfil.titular[lang])}">
  <meta property="og:image" content="${og}">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${e(t.ogAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${e(perfil.nombreCorto)} | ${e(rol)}">
  <meta name="twitter:description" content="${e(perfil.titular[lang])}">
  <meta name="twitter:image" content="${og}">
  <meta name="twitter:image:alt" content="${e(t.ogAlt)}">
  <meta name="theme-color" content="#f6f2ea" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#15121d" media="(prefers-color-scheme: dark)">
  <link rel="icon" href="${base}favicon.svg" type="image/svg+xml">
  <link rel="preload" href="${base}fonts/schibsted-grotesk-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${base}styles.css">
  <script src="${base}app.js" defer></script>
  <script type="application/ld+json">${JSON.stringify(jsonLd).replaceAll('<', '\\u003c')}</script>
</head>`;
}

function cabecera() {
  const idiomas = [['es', 'ES', 'Español', lang === 'es' ? './' : '../'], ['en', 'EN', 'English', lang === 'es' ? 'en/' : './']]
    .map(([codigo, corto, nombre, href]) => `<a href="${href}" hreflang="${codigo}" lang="${codigo}"${codigo === lang ? ' aria-current="page"' : ''}><abbr title="${nombre}">${corto}</abbr></a>`).join('');
  return `<header class="site-header"><div class="wrap nav-wrap">
    <a class="brand" href="./" aria-label="${e(t.inicio)}"><svg class="brand-mark" aria-hidden="true" focusable="false" viewBox="0 0 9 9" width="30" height="30"><path d="M3 1h3v1h1v6h-1v-2h-3v2h-1v-6h1zM3 2v3h3v-3z"/><path class="punto" d="M7 0h2v2h-2z"/></svg><span>${e(perfil.nombreCorto)}</span></a>
    <nav class="nav" aria-label="${e(t.navLabel)}"><ul>${t.nav.map(([id, texto]) => `<li><a href="#${id}">${e(texto)}</a></li>`).join('')}</ul></nav>
    <div class="tools">
      <nav class="lang" aria-label="${e(t.idioma)}">${idiomas}</nav>
      <button class="theme-toggle" type="button" aria-label="${e(t.tema)}" aria-pressed="false">${icono('luna', 'luna')}${icono('sol', 'sol')}</button>
      <a class="btn btn-small" href="${t.cvArchivo}" download><span class="vh">${e(t.cv.replace(/ ?CV ?/, ''))} </span>CV${icono('bajar')}</a>
    </div>
  </div></header>`;
}

function hero() {
  const [rol, ...resto] = perfil.titular[lang].split(' · ');
  return `<section class="hero wrap" aria-labelledby="titulo">
      <div class="hero-copy">
        <h1 id="titulo">Alberto <span class="nowrap">Martínez<span class="px" aria-hidden="true"></span></span></h1>
        <p class="role"><strong>${e(rol)}</strong>${resto.map((r) => `<span>${e(r)}</span>`).join('')}</p>
        <p class="lead">${e(t.entradilla)}</p>
        <div class="cta">
          <a class="btn" href="${t.cvArchivo}" download>${e(t.cv)}${icono('bajar')}</a>
          <a class="btn btn-ghost" href="#contacto">${e(t.contactar)}</a>
        </div>
        <p class="where">${tx(perfil.ubicacion)} · ${tx(perfil.modalidad)}</p>
      </div>
      <picture class="retrato">
        <source srcset="${base}img/alberto.avif" type="image/avif">
        <source srcset="${base}img/alberto.webp" type="image/webp">
        <img src="${base}img/alberto.jpg" width="400" height="400" alt="${e(t.fotoAlt)}" fetchpriority="high" decoding="async">
      </picture>
    </section>`;
}

function banda() {
  const todas = new Set(perfil.habilidades.flatMap((h) => h.items));
  const items = (oculto) => BANDA.filter(([nombre]) => todas.has(nombre))
    .map(([nombre, ico]) => `<li${oculto ? ' aria-hidden="true"' : ''}>${icono(ico)}${e(habilidad(nombre))}</li>`).join('');
  // La lista va dos veces para que el bucle no tenga costura; la copia es invisible para los lectores de pantalla.
  return `<section class="band" aria-labelledby="banda-titulo">
      <h2 id="banda-titulo" class="vh">${e(t.banda)}</h2>
      <div class="band-view"><ul class="band-track">${items(false)}${items(true)}</ul></div>
      <button class="band-toggle" type="button" hidden aria-pressed="false" aria-label="${e(t.pausar)}">${icono('pausa', 'pausa')}${icono('play', 'play')}</button>
    </section>`;
}

function sobreMi() {
  const frases = perfil.perfil[lang].split('. ');
  const corte = Math.ceil(frases.length / 2);
  const parrafos = [`${frases.slice(0, corte).join('. ')}.`, frases.slice(corte).join('. ')];
  return `<section class="section wrap" id="sobre-mi" aria-labelledby="sobre-mi-titulo">
      <h2 id="sobre-mi-titulo">${e(t.sobreMi)}</h2>
      <div class="about">
        <div class="prose">${parrafos.map((p) => `<p>${e(p)}</p>`).join('')}</div>
        <dl class="figures">${t.cifras(cifras()).map(([n, texto]) => `<div><dt>${e(texto)}</dt><dd>${e(n)}</dd></div>`).join('')}</dl>
      </div>
    </section>`;
}

function experiencia() {
  const empresas = perfil.experiencia.map((x) => {
    const inicio = x.puestos.reduce((min, p) => (aMeses(p.inicio) < aMeses(min) ? p.inicio : min), x.puestos[0].inicio);
    const sigue = x.puestos.some((p) => !p.fin);
    const puestos = x.puestos.map((p) => `<li${p.fin ? '' : ' class="now"'}>
            <p class="when">${periodo(p.inicio, p.fin)}${p.fin ? '' : `<span class="badge">${e(t.actual)}</span>`}</p>
            <h4>${tx(p.cargo)}</h4>
            <ul>${p.logros[lang].map((l) => `<li>${e(l)}</li>`).join('')}</ul>
          </li>`).join('\n          ');
    return `<div class="xp">
        <div class="xp-head"><h3>${e(x.empresa)}</h3><p class="mono">${tx(x.lugar)}<br>${periodo(inicio, sigue ? null : x.puestos[0].fin)}</p></div>
        <ol class="timeline">
          ${puestos}
        </ol>
      </div>`;
  }).join('\n');
  return `<section class="section wrap" id="experiencia" aria-labelledby="experiencia-titulo">
      <h2 id="experiencia-titulo">${e(t.experiencia)}</h2>
      ${empresas}
    </section>`;
}

function enlacesProyecto(p) {
  const de = t.de(p.nombre);
  const enlaces = [];
  if (p.web) enlaces.push(externo(p.web, p.jugar ? t.jugar : p.privado ? t.demo : t.abrir, 'ext', de));
  if (p.android) enlaces.push(externo(p.android, t.android, 'bajar', de));
  if (p.descarga) enlaces.push(externo(p.descarga, t.descargar, 'bajar', de));
  if (p.privado) enlaces.push(`<span class="plain">${icono('candado')}${e(t.privado)}</span>`);
  else enlaces.push(externo(urlRepo(p), t.codigo, 'ext', de));
  if (p.nota) enlaces.push(`<span class="plain">${e(lang === 'en' ? p.en?.nota ?? p.nota.texto : p.nota.texto)}</span>`);
  return `<p class="links">${enlaces.join('')}</p>`;
}

const slug = (texto) => texto.normalize('NFD').replace(/[^a-zA-Z ]/g, '').trim().toLowerCase().replaceAll(' ', '-');
const etiqueta = (p) => `<span class="tag" data-cat="${slug(p.etiqueta)}">${e(t.etiquetas[p.etiqueta] ?? p.etiqueta)}</span>`;
// La captura enlaza a lo mismo que el primer enlace de la tarjeta. Va fuera del orden de tabulación (el enlace de texto
// ya está) para no duplicar paradas de teclado.
const destino = (p) => p.web ?? p.descarga ?? urlRepo(p);
const captura = (p) => `<a class="shot" href="${destino(p)}" target="_blank" rel="noopener noreferrer" tabindex="-1"><img src="${base}img/proyectos/${p.captura}" width="640" height="400" loading="lazy" decoding="async" alt="${e(enP(p, 'alt'))}"></a>`;
const chips = (lista) => `<ul class="chips" aria-label="${e(t.tecnologias)}">${lista.map((x) => `<li>${tecnologia(x)}</li>`).join('')}</ul>`;

function destacado(p) {
  return `<li class="feat"><article>
          ${captura(p)}
          <div class="feat-body">
            <div class="feat-head"><h3>${e(p.nombre)}</h3>${etiqueta(p)}${p.estado ? `<span class="estado">${e(enP(p, 'estado'))}</span>` : ''}</div>
            <p class="lema">${e(enP(p, 'lema'))}</p>
            <p class="desc">${e(enP(p, 'descripcion'))}</p>
            ${p.tecnologias?.length ? chips(p.tecnologias) : ''}
            ${enlacesProyecto(p)}
          </div>
        </article></li>`;
}

function compacto(p) {
  return `<li class="mini"><article>
          ${captura(p)}
          <div class="feat-head"><h3>${e(p.nombre)}</h3>${etiqueta(p)}</div>
          <p class="lema">${e(enP(p, 'lema'))}</p>
          ${p.tecnologias?.length ? `<p class="pila">${p.tecnologias.map(tecnologia).join(' · ')}</p>` : ''}
          ${enlacesProyecto(p)}
        </article></li>`;
}

function proyectos() {
  const destacados = perfil.destacados.map((repo) => {
    const p = datos.proyectos.find((x) => x.repo === repo);
    if (!p) throw new Error(`perfil.json → destacados: no existe «${repo}» en proyectos.json`);
    return p;
  });
  const resto = datos.proyectos.filter((p) => !destacados.includes(p));
  return `<section class="section wrap" id="proyectos" aria-labelledby="proyectos-titulo">
      <h2 id="proyectos-titulo">${e(t.destacados)}</h2>
      <p class="intro">${e(t.destacadosIntro)}</p>
      <ul class="feat-grid">
        ${destacados.map(destacado).join('\n        ')}
      </ul>
    </section>
    <section class="section wrap" aria-labelledby="mas-titulo">
      <h2 id="mas-titulo">${e(t.mas(resto.length))}</h2>
      <p class="intro">${e(t.masIntro)}</p>
      <ul class="mini-grid">
        ${resto.map(compacto).join('\n        ')}
      </ul>
    </section>`;
}

function habilidades() {
  const filas = perfil.habilidades.map((h) => `<div><dt>${tx(h.categoria)}</dt><dd><ul class="chips">${h.items.map((i) => `<li>${e(habilidad(i))}</li>`).join('')}</ul></dd></div>`);
  filas.push(`<div><dt>${e(t.idiomas)}</dt><dd><ul class="chips">${perfil.idiomas.map((i) => `<li>${tx(i.idioma)} (${tx(i.nivel).toLowerCase()})</li>`).join('')}</ul></dd></div>`);
  return `<section class="section wrap" id="habilidades" aria-labelledby="habilidades-titulo">
      <h2 id="habilidades-titulo">${e(t.habilidades)}</h2>
      <dl class="skills">
        ${filas.join('\n        ')}
      </dl>
    </section>`;
}

function formacion() {
  const estudios = perfil.formacion.map((f) => `<li><p class="when">${f.inicio.split('/')[1]} – ${f.fin.split('/')[1]}</p><h4>${tx(f.titulo)}</h4><p>${e(f.centro)}${f.nota ? ` · <strong>${tx(f.nota)}</strong>` : ''}</p></li>`).join('');
  const certs = perfil.certificaciones.map((c) => `<li><p class="when">${fecha(c.fecha)}</p><h4>${tx(c.nombre)}</h4><p>${e(c.emisor)}</p></li>`).join('');
  return `<section class="section wrap" id="formacion" aria-labelledby="formacion-titulo">
      <h2 id="formacion-titulo">${e(t.formacion)}</h2>
      <div class="edu">
        <div><h3>${e(t.estudios)}</h3><ul class="ledger">${estudios}</ul></div>
        <div><h3>${e(t.certificaciones)}</h3><ul class="ledger">${certs}</ul></div>
      </div>
    </section>`;
}

function mascota() {
  return `<section class="section wrap pet" aria-labelledby="mascota-titulo">
      <div><h2 id="mascota-titulo">${e(t.mascota)}</h2><p>${e(t.mascotaTexto)}</p><p class="links">${externo('https://bertmarti.github.io/commitling/', t.mascotaEnlace)}</p></div>
      <picture><source id="commitling-oscuro" srcset="${MASCOTA}commitling-dark.svg" media="(prefers-color-scheme: dark)"><img src="${MASCOTA}commitling.svg" width="480" height="200" loading="lazy" decoding="async" alt="${e(t.mascotaAlt)}"></picture>
    </section>`;
}

// El correo no aparece nunca escrito en la web: va en dos trozos del revés y app.js lo compone al pulsar el botón.
const alReves = (texto) => [...texto].reverse().join('');

function contacto() {
  const [usuario, dominio] = perfil.contacto.email.split('@');
  return `<section class="section wrap contact" id="contacto" aria-labelledby="contacto-titulo">
      <h2 id="contacto-titulo">${e(t.contacto)}</h2>
      <p class="lead">${e(t.contactoTexto(perfil))}</p>
      <div class="cta">
        <button class="btn" type="button" id="correo" hidden data-a="${e(alReves(usuario))}" data-b="${e(alReves(dominio))}"><span>${e(t.escribeme)}</span>${icono('correo')}</button>
        <a class="btn btn-ghost" href="${perfil.contacto.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn${icono('ext')}</a>
        <a class="btn btn-ghost" href="${perfil.contacto.github}" target="_blank" rel="noopener noreferrer">GitHub${icono('ext')}</a>
        <a class="btn btn-ghost" href="${t.cvArchivo}" download>${e(t.cv)}${icono('bajar')}</a>
      </div>
    </section>`;
}

function pie() {
  return `<footer class="site-footer"><div class="wrap"><span>${e(t.pie)}</span><a href="https://github.com/BertMarti/BertMarti" target="_blank" rel="noopener noreferrer">${e(t.pieCodigo)}</a><a href="https://github.com/BertMarti/BertMarti/blob/main/CHANGELOG.md" target="_blank" rel="noopener noreferrer">v${VERSION}</a></div></footer>`;
}

function pagina(idioma) {
  lang = idioma;
  t = T[lang];
  base = lang === 'es' ? '' : '../';
  return `<!doctype html>
<!-- Generado por scripts/generar-tarjetas.mjs (scripts/web.mjs) desde perfil.json y proyectos.json: no lo edites a mano. -->
<html lang="${lang}">
${cabeza()}
<body>
  ${simbolos()}
  <a class="skip-link" href="#contenido">${e(t.saltar)}</a>
  ${cabecera()}
  <main id="contenido">
    ${hero()}
    ${banda()}
    ${sobreMi()}
    ${experiencia()}
    ${proyectos()}
    ${habilidades()}
    ${formacion()}
    ${mascota()}
    ${contacto()}
  </main>
  ${pie()}
</body>
</html>
`;
}

// Devuelve [[ruta, generar(textoActual) => textoNuevo], …]
export function archivosWeb(d, p) {
  datos = d;
  perfil = p;
  return [['site/index.html', () => pagina('es')], ['site/en/index.html', () => pagina('en')]];
}
