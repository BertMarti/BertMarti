// Pruebas del analizador de CSP (node --test scripts/; sin dependencias ni red).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cspDeMeta, analizarPolitica, combinar, scriptsExternos } from './vigilar-csp.mjs';

const avisos = (...politicas) => combinar(politicas.map(analizarPolitica));

test('lee la CSP de <meta http-equiv>, con comillas simples o dobles y entidades', () => {
  const html = `<meta charset="utf-8"><META HTTP-EQUIV='Content-Security-Policy' content="default-src 'none'; script-src &#39;self&#39;">`;
  assert.deepEqual(cspDeMeta(html), ["default-src 'none'; script-src 'self'"]);
  assert.deepEqual(cspDeMeta('<meta name="description" content="x">'), []);
});

test("una CSP estricta no da avisos ('wasm-unsafe-eval' y hashes son aceptables)", () => {
  assert.deepEqual(avisos("default-src 'none'; script-src 'self'"), []);
  assert.deepEqual(avisos("script-src 'self' 'wasm-unsafe-eval' 'sha256-abc='"), []);
  assert.deepEqual(avisos("default-src 'self'"), []);
  assert.deepEqual(avisos("script-src https://bertmarti.github.io/repartito/"), []);
});

test("avisa de 'unsafe-inline', 'unsafe-eval' y hosts externos en script-src", () => {
  assert.deepEqual(avisos("script-src 'self' 'unsafe-inline'"), ["script-src permite 'unsafe-inline'"]);
  assert.deepEqual(avisos("default-src 'self' 'unsafe-eval'"), ["script-src permite 'unsafe-eval'"]);
  assert.deepEqual(avisos("script-src 'self' https://cdn.example.com"), ['script-src permite scripts de fuera: https://cdn.example.com']);
  assert.deepEqual(avisos("script-src *"), ['script-src permite scripts de fuera: *']);
});

test('avisa si la CSP no restringe los scripts', () => {
  assert.equal(avisos("img-src 'self'").length, 1);
});

test('con varias políticas solo avisa de lo que permiten todas', () => {
  assert.deepEqual(avisos("script-src 'self' 'unsafe-inline'", "script-src 'self'"), []);
  assert.deepEqual(avisos("img-src 'self'", "script-src 'self' 'unsafe-eval'"), ["script-src permite 'unsafe-eval'"]);
});

test('detecta <script src> de otro origen y no los propios', () => {
  const base = 'https://bertmarti.github.io/BertMarti/';
  const html = '<script src="app.js"></script><script src="/repartito/x.js"></script><script defer src="https://cdn.example.com/a.js"></script><script src="//evil.example/b.js"></script>';
  assert.deepEqual(scriptsExternos(html, base), ['cdn.example.com', 'evil.example']);
});
