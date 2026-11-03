# Fotos del sitio: qué hay y qué pedirle al local

## Qué hay hoy

Las 8 fotos que se ven salen del **propio Instagram de @rotiserialaplaza.mp**, o
sea son del comercio (se importaron con `scripts/importar-fotos-instagram.mjs`).
Son **provisorias**: Instagram recomprime todo y cinco vienen de stories, de
640 px de ancho.

El diseño está hecho **para estas fotos y no contra ellas** (ver `DISENO.md`):

- **Un solo tratamiento de color** (clase `.foto`): un poco más de calidez y
  contraste, para que fotos sacadas con luces distintas parezcan de la misma
  cocina.
- **Recortes apretados**: el plato, no la mesa. Las proporciones (4:3, 4:5, 1:1)
  no dependen de tener una foto apaisada perfecta.
- **Las chicas no se agrandan**: las de 640 px nunca pasan de ~250 px en
  pantalla; en el mosaico de Instagram van en los cuadros chicos.
- Tres fotos de stories traían **bandas negras arriba y abajo** adentro del
  archivo. Se recortaron (`post-1`, `post-2` y `post-4`).

| Archivo | Qué se ve | Origen | Dónde aparece |
|---|---|---|---|
| `src/assets/hero-plato.jpg` | Milanesa de ternera con fideos | Post, 1200 px | Arriba de todo, al lado del plato del día |
| `public/img/og.jpg` | La misma, recortada | Post | Vista previa al compartir el link |
| `src/assets/instagram/post-3.jpg` | Pastas caseras crudas | Post, 1080 px | Mosaico, cuadro grande |
| `src/assets/instagram/post-6.jpg` | Carne al horno con arroz | Post, 1080 px | Mosaico, cuadro grande |
| `src/assets/instagram/post-1.jpg` | Milanesa rellena cortada | Story, 640 px | Mosaico, cuadro chico |
| `src/assets/instagram/post-2.jpg` | Merluza con puré | Story, 640 px | Mosaico, cuadro chico |
| `src/assets/instagram/post-4.jpg` | Bandeja de jamón y queso | Story, 640 px | Mosaico, cuadro chico |
| `src/assets/instagram/post-5.jpg` | Panqueques | Story, 640 px | Mosaico, cuadro chico |

**Falta la del frente del local.** Se sacó porque la única que había era un
recorte en blanco y negro. El código para volver a ponerla está comentado en
`src/components/Ubicacion.astro`.

**El logo no se usa:** el del perfil tiene impresa la dirección vieja "Brown
402". El sitio usa "La Plaza" escrito en la tipografía del sitio hasta que
manden uno sin dirección.

---

## Las fotos a pedir, ordenadas por impacto

Ordenadas por cuánto mejoran el sitio. **Si solo pueden mandar una, que sea la 1.**

| # | Qué | Encuadre | Orientación y medida mínima | Peso máx. | Va en |
|---|---|---|---|---|---|
| **1** | **El plato estrella, recién salido del horno.** Es lo primero que se ve, al lado del menú del día. | Plato entero bien de cerca, desde arriba en diagonal (45°). **Con aire alrededor**: en el celular se recorta a 4:3 y en la compu a 4:5, así que lo importante tiene que estar en el centro. Fondo liso. | **Vertical 4:5**, 1600 × 2000 px | 2 MB | `src/assets/hero-plato.jpg` |
| **2** | **Dos fotos de textura**, para los cuadros grandes del mosaico. Ej.: la bandeja de milanesas gratinadas saliendo del horno, pastas recién armadas, una tarta cortada. | Muy de cerca, que llene el cuadro: la textura es la foto. Nada de platos enteros con mesa alrededor. | **Cuadrada**, 1200 × 1200 px | 1,5 MB c/u | `src/assets/instagram/post-3.jpg` y `post-6.jpg` |
| **3** | **El frente del local**, de día. | Que se lea el cartel de "La Plaza" y se vea la puerta. Parado enfrente, sin autos tapando. | **Apaisada 3:2**, 1400 × 933 px | 1,5 MB | `src/assets/local.jpg` (y descomentar en `Ubicacion.astro`) |
| **4** | **Cuatro fotos de platos y del trabajo**: el mostrador, el horno abierto, alguien armando empanadas, un plato del día. | De cerca. Con luz natural. | **Cuadradas**, 1080 × 1080 px | 1 MB c/u | `src/assets/instagram/post-1.jpg`, `post-2`, `post-4`, `post-5` |
| **5** | **Imagen para compartir** (la que aparece cuando mandan el link por WhatsApp). Puede ser la #1 recortada. | El plato a la derecha; a la izquierda queda lugar para el nombre si después se le agrega. | **1200 × 630 px exacto** | 300 KB | `public/img/og.jpg` |
| **6** | **El logo sin dirección ni teléfono.** | Solo el nombre/marca. | **SVG**, o PNG con fondo transparente de 512 px de alto | — | Reemplaza a `src/components/Logo.astro` |

### Qué NO sirve

- **Verticales tipo story (9:16).** Se recortan tanto que se pierde el plato.
- **Fotos con texto, stickers o flechas encima** (como las de los stories).
- **Fotos de Google Maps o de clientes**: no son del local. Ver abajo.
- **Fotos de stock de comida que no es la del local.**

---

## Cómo pedirlas (texto para pasarle al comercio)

> Necesitamos unas fotos para el sitio. Las podés sacar con el celular, no hace
> falta fotógrafo. Tres cosas nomás:
>
> 1. **Luz natural.** Cerca de la ventana o en la puerta, de día. Nada de flash.
> 2. **Mandalas sin comprimir.** Por WhatsApp elegí "Documento" en vez de
>    "Galería", o mandalas por mail o Drive. Si las mandás como foto normal,
>    WhatsApp las achica y se ven mal.
> 3. **De cerca y sin nada escrito encima.** El plato tiene que llenar la foto.
>
> La más importante: **el plato que más sale, recién salido del horno, en
> vertical y con un poco de lugar alrededor.** Si mandás solo una, que sea esa.

---

## Atajo: las fotos que el local ya subió a Google

Si el local subió fotos a su ficha de Google, **son de ellos** y se pueden usar.
Pero en la ficha se mezclan con las que suben los clientes, que **no** se pueden
usar. Por eso lo tiene que hacer alguien del local, con la cuenta que administra
la ficha:

- **Desde la compu (mejor calidad):** <https://business.google.com> → Rotisería
  La Plaza → Fotos → abrir cada foto propia → descargar.
- **Desde el celular:** Google Maps → Rotisería La Plaza → Fotos → pestaña de
  fotos **del propietario** → tres puntitos → descargar.

Mejor todavía: si la persona que sacó la foto la tiene **en la galería del
celular**, esa copia es mejor que la de Google (Google la recomprime).

---

## Cómo se reemplazan (para quien maneje el sitio)

1. Poner el archivo en la ruta de la columna "Va en", **con el mismo nombre**.
2. Correr `npm run build`.

No hace falta recortar ni achicar a mano: Astro genera las versiones para cada
pantalla, las pasa a WebP y les pone el `width` y el `height` para que nada se
mueva mientras cargan. Por eso las fotos van en `src/assets/` y no en `public/`.

**La única excepción es `public/img/og.jpg`**, que va en `public/` porque
WhatsApp y Facebook necesitan una URL fija. Tiene que medir 1200 × 630 exacto.

**El mosaico de Instagram se arma solo:** las fotos de 1000 px o más van a los
dos cuadros grandes y las más chicas a los cuatro chicos. Si no hay exactamente
dos grandes y cuatro chicas, se arma una grilla pareja de tres columnas.

### Volver a generar los placeholders

```bash
node scripts/generar-placeholders.mjs
```

Ese comando **pisa** las fotos que estén en esas rutas. Usarlo solo si todavía
no se cargaron las verdaderas.
