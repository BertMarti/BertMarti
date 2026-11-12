"""Regenera img/banner.svg e img/banner-dark.svg (cabecera del README) desde perfil.json.

En un SVG que GitHub muestra como <img> no cargan las fuentes web, así que el texto se convierte
a formas con las fuentes de site/fonts/ (Schibsted Grotesk y JetBrains Mono). Solo hace falta
volver a ejecutarlo si cambian el nombre, el titular o la ubicación de perfil.json:

    pip install fonttools brotli
    python docs/rediseno/generar-banner.py
"""
import json
from pathlib import Path
from xml.sax.saxutils import escape

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

RAIZ = Path(__file__).resolve().parents[2]
FUENTES = RAIZ / "site/fonts"
ANCHO, ALTO, MARGEN = 1200, 320, 72


def fuente(archivo, peso):
    return instantiateVariableFont(TTFont(FUENTES / archivo), {"wght": peso})


def trazo(f, texto, x, y, cuerpo, tracking=0.0):
    """Devuelve (d, ancho) del texto como un único path, con la línea base en (x, y). Sin kerning."""
    escala = cuerpo / f["head"].unitsPerEm
    glifos, cmap, hmtx = f.getGlyphSet(), f.getBestCmap(), f["hmtx"]
    pen, cx = SVGPathPen(glifos, ntos=lambda n: f"{n:.1f}".rstrip("0").rstrip(".")), x
    for c in texto:
        nombre = cmap[ord(c)]  # KeyError si el subconjunto latino no trae el carácter: mejor fallar que dibujar un hueco
        glifos[nombre].draw(TransformPen(pen, (escala, 0, 0, -escala, cx, y)))
        cx += hmtx[nombre][0] * escala + tracking * cuerpo
    return pen.getCommands(), cx - x


# Monograma «AM» en pixel (5x7 cada letra): el motivo propio, como firma.
LETRAS = {
    "A": [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
    "M": ["#...#", "##.##", "#.#.#", "#...#", "#...#", "#...#", "#...#"],
}
PX = 18
SUELTOS = [(-2, 6), (12, -1), (13, -2), (12, 3)]  # píxeles turquesa que se escapan (columna, fila)


def monograma(violeta, turquesa):
    x0, y0 = ANCHO - MARGEN - 11 * PX - 2 * PX, (ALTO - 7 * PX) // 2
    rect = lambda col, fil: f'<rect x="{x0 + col * PX}" y="{y0 + fil * PX}" width="{PX}" height="{PX}"/>'
    letras = "".join(
        rect(i * 6 + col, fil)
        for i, letra in enumerate("AM")
        for fil, linea in enumerate(LETRAS[letra])
        for col, c in enumerate(linea) if c == "#"
    )
    sueltos = "".join(rect(col, fil) for col, fil in SUELTOS)
    return f'<g fill="{violeta}">{letras}</g><g fill="{turquesa}">{sueltos}</g>'


def banner(perfil, c):
    negra = fuente("schibsted-grotesk-latin-wght-normal.woff2", 800)
    media = fuente("schibsted-grotesk-latin-wght-normal.woff2", 500)
    mono = fuente("jetbrains-mono-latin-wght-normal.woff2", 500)
    rol, *resto = perfil["titular"]["es"].split(" · ")
    lugar = f'{perfil["ubicacion"]["es"]} · {perfil["modalidad"]["es"]}'
    partes = [
        (mono, rol.upper(), 20, 0.08, 86, c["violeta"]),
        (negra, perfil["nombreCorto"], 88, -0.02, 172, c["tinta"]),
        (media, " · ".join(resto), 27, 0, 222, c["tinta2"]),
        (mono, lugar, 18, 0, 268, c["apagado"]),
    ]
    tope = ANCHO - MARGEN - 13 * PX - 40
    caminos = []
    for f, texto, cuerpo, tracking, y, color in partes:
        d, ancho = trazo(f, texto, MARGEN, y, cuerpo, tracking)
        assert MARGEN + ancho <= tope, f"«{texto}» no cabe ({ancho:.0f} px): baja el cuerpo o acorta el texto"
        caminos.append(f'<path fill="{color}" d="{d}"/>')
    titulo, desc = escape(perfil["nombreCorto"]), escape(f'{perfil["titular"]["es"]}. {lugar}')
    return "\n".join([
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {ANCHO} {ALTO}" role="img" aria-labelledby="title desc">',
        f'  <title id="title">{titulo}</title><desc id="desc">{desc}</desc>',
        f'  <rect x="1" y="1" width="{ANCHO - 2}" height="{ALTO - 2}" rx="24" fill="{c["fondo"]}" stroke="{c["borde"]}" stroke-width="2"/>',
        f'  {monograma(c["violeta"], c["turquesa"])}',
        *(f"  {p}" for p in caminos),
        "</svg>",
        "",
    ])


TEMAS = {
    "banner.svg": dict(fondo="#FAF6EF", borde="#E9E1D4", tinta="#1E1A2B", tinta2="#3F3A52", apagado="#6B6580",
                       violeta="#6D28D9", turquesa="#0F766E"),
    "banner-dark.svg": dict(fondo="#14121C", borde="#2B2738", tinta="#F4F1FA", tinta2="#CFC9DF", apagado="#9A93AE",
                            violeta="#A78BFA", turquesa="#2DD4BF"),
}

if __name__ == "__main__":
    perfil = json.loads((RAIZ / "perfil.json").read_text(encoding="utf-8"))
    for nombre, colores in TEMAS.items():
        (RAIZ / "img" / nombre).write_text(banner(perfil, colores), encoding="utf-8", newline="\n")
        print(f"img/{nombre}: regenerado")
