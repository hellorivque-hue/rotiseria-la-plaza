# Pendientes

Todo lo que falta confirmar con el comercio antes de publicar, y las decisiones
que tomé solo para no frenar el desarrollo.

El sitio **funciona igual con estos datos sin cargar**: los campos vacíos se
muestran como "Consultar" o "a confirmar", nunca con un número inventado.

---

## 1. Datos que hay que pedirle al local

### 1.1 Precios — BLOQUEANTE para publicar

Ninguno de los precios está cargado. Hoy todos aparecen como **"Consultar"**.

> Los precios que figuran en las fotos de la cartelera **no se cargaron a
> propósito**: el comercio avisó que no están vigentes. Hay que pedir la lista
> actualizada.

La carta en cambio ya está completa: **79 platos en 11 categorías**, tomados de
las fotos de la cartelera del local.

| Dónde | Archivo | Campo |
|---|---|---|
| Menú del día (los 7 días) | `src/data/menu-del-dia.json` | `precio` |
| Todos los ítems de la carta | `src/data/carta.json` | `precio` |
| Promos y combos | `src/data/promos.json` | `precio` |

**Preguntar además:**
- Las empanadas figuran por unidad, media docena, docena, docena y media y dos
  docenas: hacen falta los cinco precios de cada gusto.
- Las tartas van entera, media, porción y cuarto: cuatro precios cada una.
- Fiambre alemán y pionono primavera van entero y medio.
- ¿El menú del día tiene un precio único o cambia según el plato?
- En la cartelera no aparecen las **milanesas y supremas rellenas**, que el
  local sí promociona. ¿Van en la carta? Si van, hay que agregarlas a
  `carta.json`.

### 1.2 Menú del día — BLOQUEANTE para publicar

`src/data/menu-del-dia.json` tiene los 7 días con `principal` y `guarnicion` en
`null`. Mientras estén así, la sección muestra un cartel de "todavía no
cargamos el menú de esta semana" con un botón a WhatsApp.

Hay que pedirle al local el menú de una semana tipo. En
`src/data/menu-del-dia.ejemplo.json` está la estructura ya armada para copiar.

### 1.3 Radio de delivery y costo de envío

- **Radio exacto**: hasta qué calles llegan. Si se puede armar una lista de
  barrios, va en `negocio.json` → `delivery.zonas`. Si esa lista tiene algo, el
  sitio muestra los barrios como etiquetas; si está vacía, muestra solo
  "consultanos por WhatsApp".
- **Costo de envío**: `negocio.json` → `delivery.costoEnvio`. Hoy está en `null`
  y el sitio dice "te lo confirmamos por WhatsApp junto con el pedido".
  ¿Es un monto fijo? ¿Cambia por zona? ¿Hay mínimo de compra?

### 1.4 Medios de pago aceptados

`negocio.json` → `mediosDePago`, hoy en `null`. Preguntar: efectivo,
transferencia / CBU o alias, débito, crédito, Mercado Pago, QR.

> **Ojo:** hoy esa información **no se muestra en ninguna parte del sitio**. Es
> una de las primeras preguntas que hace la gente antes de pedir. Cuando esté
> confirmada, conviene agregarla a la sección "Delivery y horarios".

### 1.5 Pedidos por encargo y bandejas para eventos

¿Toman pedidos por encargo? ¿Hacen bandejas para cumpleaños, reuniones o
empresas? ¿Con cuánta anticipación? Si la respuesta es sí, merece su propio
bloque en la página: es lo que más levanta el ticket promedio.

### 1.6 Menús especiales de fechas (Navidad, Año Nuevo)

El local los comunica, pero no tengo el contenido. Cuando llegue la fecha se
pueden cargar como promos en `promos.json` y se muestran solos.

---

## 2. Logo y fotos

### 2.1 Logo — pedir una versión limpia

El logo actual **tiene impresa la dirección "Brown 402", que está
desactualizada** (la correcta es Brown 406). Por eso el sitio hoy **no usa el
logo**: usa un lockup tipográfico ("Rotisería **La Plaza**", en
`src/components/Logo.astro`).

**Pedir al comercio:** una versión del logo **sin el bloque de dirección ni
teléfono**, en SVG o PNG con fondo transparente, mínimo 512 px de alto.

Cuando llegue, se reemplaza el contenido de `Logo.astro` por la imagen. Mientras
tanto, no usar el logo viejo en ningún tamaño donde el texto de la dirección se
llegue a leer.

### 2.2 Fotos — ya hay, pero provisorias

> La lista completa de fotos a pedir, **ordenada por impacto** y con encuadre,
> orientación y medidas, está en [`public/img/README.md`](public/img/README.md).

Las 8 imágenes del sitio salen del propio Instagram del local
(@rotiserialaplaza.mp), o sea son del comercio. Ya no hay placeholders.

**LA FOTO DEL FRENTE DEL LOCAL SE SACÓ.** La única disponible era un recorte en
blanco y negro de un story y no representaba bien al local. La sección "Dónde
estamos" quedó con el mapa solo, que es lo que de verdad se necesita ahí. En
`src/components/Ubicacion.astro` está comentado el código exacto para volver a
ponerla cuando llegue la foto buena: **apaisada 3:2, 1400 × 933 o más, en
color**.

**Las que quedaron siguen siendo provisorias:** Instagram recomprime todo, y
varias vienen de stories (640 px de ancho). Conviene pedirle a quien las sacó **los archivos originales de la galería
del celular**: mismo encuadre, sin recomprimir.

Falta también el link a cada publicación: en `src/data/instagram.json` el campo
`url` está en `null` y las fotos llevan al perfil, no al post.

**El detalle de qué reemplazar y con qué medidas está en
[`public/img/README.md`](public/img/README.md).**

**Primero revisar la ficha de Google.** Si el local ya subió fotos propias a su
Perfil de Empresa, se pueden descargar y usar directamente: son de ellos. El
paso a paso está en `public/img/README.md`.

Lo que **no** se puede hacer es bajar imágenes de Google Maps o de Street View
para publicarlas en el sitio: son de Google o de quien las subió, y va contra
sus términos. Tampoco sirven las fotos que subieron los clientes a la ficha,
aunque se vean ahí mismo: cada una es de su autor. Y en el caso puntual de
Street View hay un problema extra — las imágenes suelen tener años, así que es
probable que muestren el cartel viejo con la dirección "Brown 402".

### 2.3 Instagram

`src/data/instagram.json` tiene 6 publicaciones con imagen placeholder, sin
caption y sin link (`url: null`, así que por ahora llevan al perfil). Hay que
cargar las 6 imágenes reales y el link a cada post.

---

## 3. Cosas técnicas a definir antes de publicar

### 3.1 Dominio final

**Ya no hay que tocar código para esto.** `astro.config.mjs` toma el dominio de
la variable `URL` que Netlify inyecta en cada build, así que el `canonical`, el
Open Graph, el `sitemap.xml` y el `robots.txt` salen correctos tanto en
`algo.netlify.app` como con dominio propio.

Lo que sí falta decidir con el comercio: **si van a comprar un dominio propio**
(algo tipo `rotiserialaplaza.com.ar`) o si alcanza con el subdominio gratis de
Netlify. Si compran uno, se conecta desde el panel de Netlify y el sitio se
actualiza solo en el build siguiente.

En Vercel o Cloudflare Pages, en cambio, hay que definir `SITE_URL` a mano en
las variables de entorno del proyecto.

### 3.2 Crédito del desarrollador

Se sacó del pie hasta tener el nombre y el link: no queda bien un `TODO` a la
vista en el sitio publicado. Para volver a ponerlo, en
`src/components/Footer.astro` está comentada la línea exacta.

### 3.3 Coordenadas del local

`negocio.json` → `coordenadas` tiene el centro de Punta Alta, marcado con
`aproximadas: true`. **No son la puerta del local.**

No hace falta corregirlas para que el sitio funcione: el mapa embebido busca por
dirección, no por coordenadas, y el JSON-LD **no declara `geo` a propósito**
(declarar una ubicación falsa es peor que no declarar ninguna). Si algún día se
quiere agregar `geo`, primero hay que sacar las coordenadas reales de Google
Maps y poner `aproximadas: false`.

### 3.4 Google Business Profile

Conviene revisar que la ficha de Google Maps tenga **Brown 406** y no Brown 402,
por el mismo motivo que el logo. El sitio no puede arreglar eso desde acá.

---

## 4. Decisiones que tomé yo (revisar si no están de acuerdo)

Ninguna de estas frenó el desarrollo, pero conviene que alguien las confirme.

1. **Los datos sin confirmar van en `null`, no con texto "TODO" a la vista.**
   La interfaz los muestra como "Consultar" / "a confirmar". Me pareció mejor
   que ensuciar la pantalla con marcadores, y evita que se publique un precio
   inventado por accidente.

2. **Hay un cartel negro arriba de todo** que dice "Sitio en armado: todavía
   estamos cargando los platos y los precios". Se apaga poniendo
   `"datosEnCarga": false` en `negocio.json`. Apagarlo recién cuando estén
   cargados los precios y el menú.

3. **El puntaje de Google (4,3 sobre 35 opiniones) se muestra en "Dónde
   estamos", al lado de la dirección y con la fuente a la vista**, pero **no** se declara como `aggregateRating` en los
   datos estructurados. Las guías de Google no aceptan que un negocio publique
   en su propio sitio el puntaje que le puso otra plataforma, y puede costar una
   penalización manual.

4. **Las pestañas de categorías de la carta son enlaces, no `role="tab"`.** Navegan sin
   recargar, funcionan sin JavaScript y ya traen navegación por teclado del
   navegador. Se descartó el patrón `role="tab"`, que había que reimplementar
   entero a mano y se rompe sin JS.

5. **El pedido no se borra solo después de mandarlo a WhatsApp.** Si la app no
   abrió, o la persona quiere corregir algo, tiene que poder volver y
   reenviarlo. Se vacía con el botón de `/gracias`.

6. **Las promos se apagan vaciando el archivo.** Con `promos.json` en `[]` la
   sección no se renderiza y el link "Promos" desaparece solo del menú.

7. **El menú del día resalta "hoy" desde el navegador, no desde el build.** Un
   sitio compilado un lunes mostraría "lunes" toda la semana si no fuera así.
   Se resuelve antes de dibujar (script en el `<head>`), así no hay salto.

8. **Tres textos de la sección "Por qué La Plaza" los redacté yo** a partir de
   lo que el local ya comunica (todo al horno, cocina casera, menú distinto cada
   día, delivery propio). No hay premios, años de trayectoria ni cantidad de
   clientes: nada de eso está confirmado. Están en
   `src/components/PorQue.astro` por si los quieren reescribir con las palabras
   del local.

---

## 4b. Decisiones del rediseño visual (octubre 2026)

El porqué de cada una está en [`DISENO.md`](DISENO.md).

1. **El hero ES el menú del día.** Lo primero que se ve es el plato de hoy en
   grande. Si hoy no hay menú cargado dice "¿Qué hay hoy?" y lleva a
   preguntar por WhatsApp; los domingos dice "Hoy descansamos".
2. **La foto de arriba es siempre la misma** (la milanesa con fideos) y lleva
   la etiqueta "De nuestra cocina", para que no parezca el plato del día.
   Cuando haya una foto por plato se puede pensar en mostrarla según el día.
3. **"Pedir este menú" en el hero agrega el menú y abre el pedido directo.**
   Es el camino más corto a WhatsApp. En la carta y en la semana, el botón +
   solo agrega (la gente suele pedir varias cosas).
4. **Mientras la carta no tenga ningún precio, no se repite "Consultar" en
   cada plato**: hay un solo aviso arriba. Apenas se carga un precio, aparece
   la columna de precios.
5. **El puntaje de Google pasó del hero a "Dónde estamos"**, junto al botón
   "Cómo llegar": el hero quedó para el plato.
6. **La página `/estilo`** (guía visual) está publicada pero no va al buscador.
   Se puede borrar antes de entregar si no la quieren.
7. **Los textos de los estados vacíos y del domingo los redacté yo**, con los
   datos que ya estaban (horarios, delivery con radio limitado). Están en
   `src/components/Hero.astro` y `MenuDelDia.astro`.

---

## 5. Ideas para más adelante

- **Medios de pago en la sección de delivery** (ver 1.4), apenas se confirmen.
- **Bandejas para eventos** como bloque propio (ver 1.5).
- **Instagram automático:** hoy las fotos se actualizan a mano, que es lo
  correcto para este tamaño de negocio. Automatizarlo requiere convertir la
  cuenta a **Business**, conectarla a una página de Facebook y usar el
  **Instagram Graph API** con un token propio que hay que renovar. No se puede
  hacer con scraping: se rompe solo y va contra los términos de Instagram.
- **Sacar el cartel de "sitio en armado"** (ver decisión 2).
