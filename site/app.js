'use strict';

const root = document.body;
const themeButton = document.querySelector('.theme-toggle');
const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.project-card');
const mascotDark = document.getElementById('commitling-oscuro');

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
  root.dataset.theme = theme;
  // La mascota sigue el tema elegido en la web, no solo el del sistema.
  if (mascotDark) mascotDark.media = theme === 'dark' ? 'all' : 'not all';
  themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
  themeButton.setAttribute('aria-label', theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro');
  themeButton.firstChild.textContent = theme === 'dark' ? '☀ ' : '☾ ';
  if (remember) try { localStorage.setItem(THEME_KEY, theme); } catch (error) { /* El tema sigue funcionando sin persistencia. */ }
}

setTheme(preferredTheme());
themeButton.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));

filters.forEach((filter) => filter.addEventListener('click', () => {
  const category = filter.dataset.filter;
  filters.forEach((button) => {
    const active = button === filter;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  cards.forEach((card) => { card.hidden = category !== 'all' && card.dataset.category !== category; });
}));
