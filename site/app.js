'use strict';

const root = document.body;
const themeButton = document.querySelector('.theme-toggle');
const mascotDark = document.getElementById('commitling-oscuro');
const english = document.documentElement.lang === 'en';

// Todas las webs de bertmarti.github.io comparten localStorage: la clave lleva el prefijo del proyecto.
const THEME_KEY = 'bertmarti:tema';
const OLD_THEME_KEY = 'portfolio-theme'; // nombre anterior (hasta octubre de 2026), se migra una vez

function systemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function preferredTheme() {
  try {
    let saved = localStorage.getItem(THEME_KEY);
    const old = localStorage.getItem(OLD_THEME_KEY);
    if (!saved && (old === 'dark' || old === 'light')) {
      saved = old;
      localStorage.setItem(THEME_KEY, old);
    }
    if (old !== null) localStorage.removeItem(OLD_THEME_KEY);
    return saved === 'dark' || saved === 'light' ? saved : systemTheme();
  } catch (error) {
    return systemTheme();
  }
}

function setTheme(theme, remember) {
  const dark = theme === 'dark';
  root.dataset.theme = theme;
  // La mascota sigue el tema elegido en la web, no solo el del sistema.
  if (mascotDark) mascotDark.media = dark ? 'all' : 'not all';
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.setAttribute('aria-label', english
    ? (dark ? 'Switch to light mode' : 'Switch to dark mode')
    : (dark ? 'Activar modo claro' : 'Activar modo oscuro'));
  if (remember) try { localStorage.setItem(THEME_KEY, theme); } catch (error) { /* El tema sigue funcionando sin persistencia. */ }
}

setTheme(preferredTheme());
themeButton.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));

// Banda de tecnologías: se para con hover y foco (CSS) y con este botón, que es el control de teclado y táctil.
const band = document.querySelector('.band');
const bandToggle = document.querySelector('.band-toggle');
bandToggle.hidden = false;
bandToggle.addEventListener('click', () => {
  const paused = band.classList.toggle('is-paused');
  bandToggle.setAttribute('aria-pressed', String(paused));
});

// Correo: en el HTML solo hay dos trozos escritos del revés (sin arroba). La dirección se compone al pulsar,
// se abre el programa de correo y queda a la vista por si no hay ninguno configurado.
const mailButton = document.getElementById('correo');
const unreverse = (text) => Array.from(text).reverse().join('');
mailButton.hidden = false;
mailButton.addEventListener('click', () => {
  const address = unreverse(mailButton.dataset.a) + String.fromCharCode(64) + unreverse(mailButton.dataset.b);
  mailButton.firstElementChild.textContent = address;
  window.location.href = 'mailto:' + address;
});
