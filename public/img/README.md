# Fotos que hay que pedirle al local

## Estado actual: fotos provisorias, sacadas del Instagram del local

Ya no hay placeholders. Las 8 imágenes que se ven salen del **propio Instagram
de @rotiserialaplaza.mp**, o sea son del comercio. Se importaron con
`scripts/importar-fotos-instagram.mjs`.

> **Falta la del frente del local.** Se retiró: la única que había era un
> recorte en blanco y negro de un story. Hoy la sección "Dónde estamos" muestra
> solo el mapa. Es **la foto más urgente de conseguir**: apaisada 3:2, de día,
> en color, que se lea el cartel.

**Pero son provisorias**, por dos motivos concretos:

1. **Baja resolución.** Instagram recomprime todo lo que se sube, y varias de
   estas salieron de stories, que son todavía más chicas (640 px de ancho). En
   una pantalla de celular moderna se ven un poco blandas.
2. **La del frente del local está en blanco y negro** y es el recorte de un
   story, no una foto sacada para esto.

Conviene reemplazarlas por los archivos originales, que la persona que las sacó
seguramente tiene en la galería del celular. Es el mismo encuadre, sin
recomprimir.

| Archivo | Qué se ve hoy | Origen |
|---|---|---|
| `src/assets/hero-plato.jpg` | Milanesa de ternera con fideos | Post, 1440 px |
| `public/img/og.jpg` | Igual que el hero, recortada | Post, 1440 px |
| `src/assets/instagram/post-1.jpg` | Milanesa rellena cortada | Story, 640 px |
| `post-2.jpg` | Filet de merluza con puré | Story, 640 px |
| `post-3.jpg` | Pastas caseras recién armadas | Post, 1440 px |
| `post-4.jpg` | Bandeja de jamón y queso al horno | Story, 640 px |
| `post-5.jpg` | Panqueques | Story, 640 px |
| `post-6.jpg` | Carne al horno con arroz | Post, 1440 px |

**El logo del perfil no se importó a propósito:** tiene impresa la dirección
vieja "Brown 402".

Los links a cada publicación de Instagram tampoco están: en
`src/data/instagram.json` el campo `url` está en `null`, así que por ahora las
fotos llevan al perfil y no al post.

---

## Lista de las fotos a pedir (para reemplazar las provisorias)

| # | Qué | Proporción | Medida mínima | Peso máx. | Dónde va |
|---|---|---|---|---|---|
| 1 | **Plato estrella al horno**, bien de cerca, luz natural. Es la primera foto que se ve. | 1:1 (cuadrada) | 1200 × 1200 px | 1,5 MB | `src/assets/hero-plato.jpg` |
| 2 | **Frente del local**, de día, que se lea el cartel | 3:2 (apaisada) | 1400 × 933 px | 1,5 MB | `src/assets/local.jpg` |
| 3-8 | **6 fotos de Instagram**: platos, el mostrador, el horno, la gente trabajando | 1:1 (cuadrada) | 1080 × 1080 px | 1 MB c/u | `src/assets/instagram/post-1.jpg` … `post-6.jpg` |
| 9 | **Imagen para compartir** (la que aparece cuando mandan el link por WhatsApp). Puede ser la #1 recortada, con el logo. | 1200 × 630 px exacto | 1200 × 630 px | 300 KB | `public/img/og.jpg` |

**Total: 9 fotos.**

### Y el logo

Pedir aparte una versión del logo **sin el bloque de dirección y teléfono** — el
logo actual tiene impresa la dirección vieja "Brown 402". En SVG, o PNG con
fondo transparente de 512 px de alto para arriba. Ver `PENDIENTES.md`.

---

## Atajo: las fotos que el local ya subió a Google

Antes de sacar fotos nuevas, conviene revisar si el local ya tiene fotos propias
en su ficha de Google. Si las subieron ellos, **son de ellos** y las pueden usar
en el sitio sin ningún problema.

> **Ojo con esto:** en la ficha de Google se mezclan las fotos que subió el
> local con las que subieron los clientes. **Solo sirven las que subió el
> local.** Las de los clientes son de cada cliente, no del negocio, y no se
> pueden usar. Por eso este paso lo tiene que hacer alguien del local con la
> cuenta que administra la ficha: es la única forma de saber cuál es cuál.

### Desde la computadora (es la mejor calidad)

1. Entrar a <https://business.google.com> con la cuenta que administra la ficha.
2. Elegir Rotisería La Plaza.
3. Ir a **Fotos**.
4. Abrir cada foto propia y usar el botón de **descargar**.

### Desde el celular

1. Abrir la app de Google Maps con la cuenta que administra la ficha.
2. Buscar Rotisería La Plaza y entrar a **Fotos**.
3. Ir a la pestaña de fotos **del propietario** (no la de "todas" ni la de los
   visitantes).
4. Abrir la foto y descargarla desde el menú de los tres puntitos.

### Mejor todavía: el archivo original

Google le baja la calidad y le cambia el tamaño a todo lo que se sube. Si la
persona que sacó la foto todavía la tiene **en la galería del celular**, esa
copia es mejor que la descargada de Google. Vale la pena preguntar antes.

---

## Cómo pedirlas (para pasarle al comercio)

> Necesitamos 9 fotos para el sitio. Las podés sacar con el celular, no hace
> falta fotógrafo. Tres cosas nomás:
>
> 1. **Luz natural.** Cerca de la ventana o en la puerta, de día. Nada de flash.
> 2. **Mandalas sin comprimir.** Por WhatsApp elegí "Documento" en vez de
>    "Galería", o mandalas por mail o Drive. Si las mandás como foto normal,
>    WhatsApp las achica y se ven mal en pantalla grande.
> 3. **Horizontales o cuadradas**, según la lista. No verticales.
>
> Y no hace falta que las recortes: de eso nos encargamos nosotros.

---

## Cómo se reemplazan (para quien maneje el sitio)

1. Poner el archivo en la ruta de la columna "Dónde va", **con el mismo nombre**
   que el placeholder que reemplaza.
2. Correr `npm run build`.

No hace falta recortar ni redimensionar a mano: Astro genera solo las versiones
chicas para el celular, las convierte a WebP y les pone el `width` y el `height`
para que no se mueva el diseño mientras cargan. Por eso las fotos van en
`src/assets/` y no en `public/`: lo que está en `public/` se copia tal cual, sin
optimizar.

**La única excepción es `public/img/og.jpg`**, que sí va en `public/`: la usan
WhatsApp y Facebook para la vista previa del link y necesitan una URL fija.
Tiene que medir 1200 × 630 exacto.

### Volver a generar los placeholders

Si hace falta regenerarlos (por ejemplo, después de borrarlos por error):

```bash
node scripts/generar-placeholders.mjs
```

Ese comando **pisa** las fotos reales que estén en esas rutas. Usarlo solo si
todavía no se cargaron las verdaderas.
