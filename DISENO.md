# Diseño del sitio — "Cartel de barrio"

Guía corta para quien siga el proyecto. La referencia en vivo, con cada token y
componente dibujado, está en **`/estilo`** (no va al buscador). Los tokens viven
en un solo lugar: el `@theme` de `src/styles/global.css`.

## La idea

El sitio se ve como la vidriera de una rotisería de toda la vida: letras de
cartel pintado, papel de envolver y un sello de goma. **Apetitoso antes que
elegante.** Lo que manda es el plato de hoy: es lo más grande de la página, en
el celular y en la computadora.

## Tres reglas que no se negocian

1. **El plato del día es lo más grande de la página.** Usa `text-cartel` (o
   `text-cartel-largo` si el nombre pasa de 22 letras). Ningún otro texto usa
   esos tamaños.
2. **Sansita es la voz y aparece poco.** Va en títulos y nombres de platos
   (clase `.cartel`). Nunca en párrafos, botones ni datos. Todo lo demás es
   Archivo.
3. **Un solo adorno: el sello** (`.sello`, `.sello-rect`, `<Sello />`). Va en
   cuatro lugares y en ninguno más: el sello redondo (uno por pantalla), HOY en
   el plato del día, CERRADO (hero del domingo y carrito) y AGOTADO en la 404.
   Si una sección "pide" decoración, no se decora: se resuelve con tipografía,
   escala o un cambio de fondo.

## Tokens

**Color — 7 y no más.** La paleta por defecto de Tailwind está apagada
(`--color-*: initial`): si alguien escribe `bg-blue-500`, no existe.

| Token | Hex | Rol |
|---|---|---|
| `crema` | `#fbf4e6` | Fondo base |
| `papel` | `#f1e4cc` | Fondo alternativo (carta, dónde estamos) y texto secundario sobre oscuro |
| `tinta` | `#1c1411` | Texto; fondo de franjas oscuras (delivery, promos, pie) |
| `tinta-suave` | `#5b4a40` | Texto secundario sobre claro |
| `ladrillo` | `#a21b12` | La marca: hero a sangre, botón principal, sellos |
| `ladrillo-hondo` | `#7a130c` | Solo hover/presionado del ladrillo |
| `perejil` | `#2f5a3a` | El acento: "abierto", "precios por WhatsApp", confirmación de agregado. **Nunca sobre ladrillo** |

Todos los pares de texto que usa el sitio están medidos (tabla en `/estilo`):
el peor da 6,18:1. Se verificó además con un barrido de todo el texto visible de
la home, gracias y 404, en 390 y 1440 px: cero pares por debajo de AA.

**Tipografía.** Sansita Black Itálica (22 KB) + Archivo variable (54 KB,
recortada a peso 400–900 y ancho 62–100). Escala fluida entre 390 y 1440 px:
`rotulo` 13 · `chico` 14 · `base` 17 · `lead` 19→22 · `titulo-3` 22→28 ·
`titulo-2` 32→56 · `titulo-1` 44→80 · `cartel-largo` 44→108 · `cartel` 52→136.
Las fuentes de respaldo tienen métricas medidas para que no haya salto al
cargar (CLS 0).

**Ritmo.** Tres densidades entre secciones: `py-denso`, `py-seccion`, `py-aire`.
`gutter` es el margen lateral (16 px en el celular). El orden de fondos de la
home alterna a propósito: ladrillo → crema → papel → (tinta si hay promos) →
crema con aire → tinta → crema → papel → tinta.

**Forma.** Radios casi rectos: `sello` 2 px, `control` 6 px (botones, campos),
`foto` 3 px. **Una sola sombra** (`shadow-flota`) y solo para lo que flota de
verdad: la barra del pedido. Lo que agrupa es un filete o un cambio de fondo,
no una tarjeta con sombra.

## Componentes base (en `global.css`)

- **Superficies** `.sup-crema` `.sup-papel` `.sup-ladrillo` `.sup-tinta`: fijan
  fondo, texto y el color del anillo de foco (`--anillo`). Toda franja de color
  usa una.
- **Texto** `.cartel` `.rotulo` `.subtitulo` `.enlace`.
- **Botones** `.btn` + `.btn-ladrillo` (principal sobre claro) / `.btn-crema`
  (principal sobre oscuro) / `.btn-linea` (secundario); `.btn-chico`;
  `.btn-agregar` (el + de los renglones, 44 × 44, con el icono en CSS).
- **Fotos** `.foto`: un solo tratamiento de color para todas.
- **Carta** `.guia`: la línea de puntos entre el plato y el precio.
- **Campos** `.campo`.
- **Variante `hoy:`** — estilos que valen solo para el día de hoy en Punta
  Alta (`hoy:bg-papel`, `hoy:font-bold`). El elemento tiene que llevar
  `data-dia="lunes"` (etc.). No anidar elementos con `data-dia`.

## Reglas para no romper la coherencia

- **Mobile primero de verdad.** Cada cambio se mira a 390 px antes que en
  escritorio. Los dos layouts en columnas arrancan en `md` (768 px).
- **Nada de grillas de tarjetas iguales.** Listas con filetes (carta, semana,
  horarios) o composición asimétrica (hero, mosaico de Instagram).
- **No repetir "Consultar" en cada renglón.** Mientras toda la carta esté sin
  precio, va un solo aviso arriba; la columna de precios aparece sola cuando se
  carga el primero.
- **Las fotos chicas no se agrandan.** Las de 640 px (stories) nunca pasan de
  ~250 px en pantalla. Ver `public/img/README.md`.
- **Objetivos táctiles de 44 px** como mínimo (verificado en toda la home).
- **Foco siempre visible**: lo resuelve `--anillo`; no sacar `outline` sin
  reemplazo.
- **Movimiento solo con `transform`/`opacity`** y siempre respetando
  `prefers-reduced-motion` (la regla global de la base ya lo hace).
- **Cero emojis como íconos.** Los íconos son SVG (o máscaras CSS en los botones
  repetidos, para no inflar el DOM).
- **Performance:** antes de agregar una fuente, una librería o un efecto,
  medir con Lighthouse en mobile. La home está en 97–99 con 900 elementos de
  DOM; no subir de ahí sin motivo.

## Lo que se probó y se descartó

- **`content-visibility: auto` en la carta.** Ganaba algo de performance pero
  rompía los saltos de las pestañas (calculaba con altos estimados y la
  categoría quedaba fuera de lugar). No volver a ponerlo sin resolver eso.
- **Direcciones B (pizarrón, letra a mano) y C (diario de barrio).** Se
  maquetaron en la Fase 2; ganó esta. Las capturas quedaron en
  `capturas/fase-2` (fuera del repo).

## Cómo se recortaron las fuentes

Origen: Fontsource (`@fontsource/sansita`, archivo `sansita-latin-900-italic`, y
`@fontsource-variable/archivo`, archivo `archivo-latin-wdth-normal`), licencia
SIL OFL. Se recortaron con [`subset-font`](https://www.npmjs.com/package/subset-font)
a los caracteres del castellano (ASCII, Latin-1, comillas, rayas, `€`, `−`, `✓`)
y, en Archivo, a los ejes que se usan:

```js
await subsetFont(archivo, texto, {
  targetFormat: 'woff2',
  variationAxes: { wght: { min: 400, max: 900 }, wdth: { min: 62, max: 100 } },
});
```

Si se cambia de fuente o se agrega un peso, hay que volver a medir las fuentes
de respaldo (los `size-adjust` de `global.css`): se miden en Chrome con canvas,
comparando el ancho de un mismo texto con la fuente real y con la de respaldo.
