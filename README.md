# Rotisería La Plaza — sitio web

Sitio de una página para **Rotisería La Plaza**, Brown 406, Punta Alta (Buenos
Aires). El objetivo es simple: que alguien que llega desde Instagram o Google
entienda en 5 segundos qué se come hoy y termine mandando el pedido por
WhatsApp.

- **Astro 5 + Tailwind 4 + TypeScript.** Sin React, sin Vue, sin librerías de UI.
- **100 % estático.** No hay servidor ni base de datos. El resultado del build es
  una carpeta de archivos que se sube a cualquier hosting.
- **Funciona sin JavaScript**, salvo el carrito. Sin JS, cada plato muestra un
  link directo a WhatsApp con el pedido ya escrito.
- **12 KB de JavaScript** en total (unos 5 KB comprimidos), carrito incluido.

> **¿Sos el dueño del local o quien le carga el menú?**
> Andá directo a [Cómo cambio el menú del día](#cómo-cambio-el-menú-del-día).
> No hace falta saber programar.

---

## Índice

- **[PUBLICAR.md](PUBLICAR.md) — ponerlo online y conectar la planilla del menú**
- [Levantarlo en tu computadora](#levantarlo-en-tu-computadora)
- [Hacer el build](#hacer-el-build)
- [Publicarlo](#publicarlo)
- **Guía para cargar contenido (sin saber programar)**
  - [Cómo cambio el menú del día](#cómo-cambio-el-menú-del-día)
  - [Cómo cambio un precio](#cómo-cambio-un-precio)
  - [Cómo agrego o saco un plato](#cómo-agrego-o-saco-un-plato)
  - [Cómo pongo y saco promociones](#cómo-pongo-y-saco-promociones)
  - [Cómo cambio los horarios](#cómo-cambio-los-horarios)
  - [Cómo actualizo las fotos de Instagram](#cómo-actualizo-las-fotos-de-instagram)
  - [Cómo saco el cartel de "sitio en armado"](#cómo-saco-el-cartel-de-sitio-en-armado)
  - [Reglas de oro](#reglas-de-oro-para-no-romper-nada)
- [Cómo está armado por dentro](#cómo-está-armado-por-dentro)
- [Qué falta](#qué-falta)

---

## Levantarlo en tu computadora

Hace falta [Node.js](https://nodejs.org) 20 o más nuevo.

```bash
npm install
```

```bash
npm run dev
```

Queda andando en `http://localhost:4321`. Los cambios se ven solos, sin recargar.

## Hacer el build

```bash
npm run build
```

Genera la carpeta `dist/`. Ese comando además revisa los tipos: si alguien rompe
un archivo de datos (por ejemplo, se come una coma en un JSON), el build **falla
antes de publicar** en vez de dejar el sitio roto.

Para ver el resultado final antes de subirlo:

```bash
npm run preview
```

## Publicarlo

El sitio es estático: sirve cualquier hosting. **No necesita ninguna variable de
entorno.**

### Netlify (es lo que está configurado)

En la raíz hay un `netlify.toml` con todo resuelto: comando de build, carpeta a
publicar, versión de Node y cacheo de archivos. Al conectar el repositorio,
Netlify no pregunta nada.

**El dominio no se escribe en ningún archivo.** Netlify inyecta la variable
`URL` en cada build y `astro.config.mjs` la usa. O sea: cuando conectes el
dominio propio desde el panel de Netlify (*Domain management → Add a domain*),
el `canonical`, el Open Graph, el `sitemap.xml` y el `robots.txt` pasan a usarlo
**solos, en el build siguiente**, sin tocar código.

Pasos:

1. Subir esta carpeta a un repositorio de GitHub.
2. En Netlify: *Add new site → Import an existing project* y elegir el repo.
3. Deploy. Queda andando en `algo.netlify.app`.
4. (Opcional) Conectar el dominio propio desde *Domain management*.

### Otros hostings

| Hosting | Qué configurar |
|---|---|
| **Vercel** | Detecta Astro solo. Output: `dist`. Definir `SITE_URL` en las variables de entorno del proyecto. |
| **Cloudflare Pages** | Build: `npm run build` · Output: `dist`. Definir `SITE_URL`. |
| **Hosting compartido (cPanel, FTP)** | Correr `SITE_URL=https://tudominio.com npm run build` en tu compu y subir **el contenido** de `dist/` a `public_html/` |

Vercel y Cloudflare no exponen la variable `URL`, por eso ahí hay que definir
`SITE_URL` a mano. En hosting compartido, además, revisá que el `404.html` que
queda en `dist/` esté configurado como página de error del servidor.

---

# Guía para cargar contenido

Esta parte está escrita para alguien que **no** programa.

Todo lo que se cambia seguido vive en la carpeta `src/data/`, en archivos que se
abren con cualquier editor de texto (el Bloc de notas sirve, pero es mejor
[Visual Studio Code](https://code.visualstudio.com), que avisa cuando algo está
mal escrito).

Después de cualquier cambio hay que **volver a publicar el sitio** (o correr
`npm run build` y subir `dist/`).

## Cómo cambio el menú del día

> **Si el sitio ya está conectado a la planilla de Google, no leas esto:**
> se edita desde la planilla y no hay que tocar ningún archivo. Está explicado
> en **[PUBLICAR.md](PUBLICAR.md)**. Lo de abajo es para editar a mano.

**Archivo: `src/data/menu-del-dia.json`** — es el único que se toca a diario.

Adentro hay un bloque por cada día de la semana. Se ve así:

```json
{
  "dia": "lunes",
  "nombre": "Lunes",
  "principal": null,
  "guarnicion": null,
  "destacado": null,
  "precio": null
}
```

Cambiás **solamente** lo que está a la derecha de los dos puntos:

```json
{
  "dia": "lunes",
  "nombre": "Lunes",
  "principal": "Pollo al horno",
  "guarnicion": "papas españolas",
  "destacado": "El más pedido",
  "precio": 12500
}
```

Qué es cada cosa:

| Campo | Qué poner |
|---|---|
| `dia`, `nombre` | **No los toques.** Son la referencia del día. |
| `principal` | El plato. Entre comillas. |
| `guarnicion` | Con qué viene. Entre comillas. En la página sale como "con papas españolas". |
| `destacado` | Una frase corta opcional: `"El más pedido"`, `"Solo mediodía"`. Si no querés ninguna, poné `null`. |
| `precio` | **Sin comillas, sin `$` y sin puntos.** `12500`, no `"$12.500"`. Si todavía no sabés el precio, dejá `null` y en la página va a decir "Consultar". |

**El día de hoy se resalta solo.** No hace falta que marques nada: el sitio mira
la fecha del visitante (en horario de Argentina), le pone el cartel **HOY** y
lo manda al primer lugar de la grilla.

Si dejás todos los días en `null`, la sección muestra un cartel que invita a
consultar por WhatsApp. No queda rota ni vacía.

En `src/data/menu-del-dia.ejemplo.json` hay una semana entera ya armada para
copiar y pegar.

## Cómo cambio un precio

**Archivo: `src/data/carta.json`** (o `menu-del-dia.json` para el menú del día).

Buscá el plato y cambiá el número de `precio`:

```json
{
  "id": "empanadas-1",
  "nombre": "Empanadas",
  "descripcion": null,
  "precio": 1200,
  "disponible": true,
  "recomendado": true,
  "unidad": null
}
```

- Se escribe **el número pelado**: `1200`. Nada de `"$1200"`, `1.200` ni `1200.00`.
- El sitio le pone solo el `$` y el punto de los miles: en pantalla sale `$ 1.200`.
- Si todavía no hay precio, `null` (sin comillas). En pantalla dice "Consultar".

En todo el sitio hay una aclaración de que los precios son informativos y se
confirman al hacer el pedido — también sale en el mensaje de WhatsApp.

## Cómo agrego o saco un plato

**Archivo: `src/data/carta.json`**

**Para sacarlo un rato** (se acabó, vuelve mañana): cambiá `disponible` a
`false`. Desaparece de la página, del carrito y del buscador, pero el plato
queda escrito para cuando vuelva.

**Para agregarlo:** copiá un bloque entero de esa categoría, pegalo abajo
separado por una coma, y cambiale los datos. Lo único importante:

> **El `id` no se puede repetir.** Es lo que usa el carrito para saber qué
> pediste. Si dos platos tienen el mismo `id`, se pisan.

```json
{
  "id": "empanadas-2",
  "nombre": "Empanada de carne",
  "descripcion": "Cortada a cuchillo",
  "precio": 1200,
  "disponible": true,
  "recomendado": false,
  "unidad": "por unidad"
}
```

- `descripcion`: una línea corta, o `null`.
- `recomendado`: `true` le pone arriba del nombre el rótulo rojo "Recomendado".
- `unidad`: aclaración como `"por docena"` o `"porción"`, o `null`.

Si una categoría se queda sin ningún plato disponible, **la categoría entera
desaparece sola** de la página y de la barra de pestañas.

## Cómo pongo y saco promociones

**Archivo: `src/data/promos.json`**

**Para que NO haya promos:** dejá el archivo con dos corchetes y nada adentro:

```json
[]
```

Así viene ahora. La sección entera desaparece: no queda un espacio vacío ni un
"no hay promociones", y el link "Promos" también desaparece del menú de arriba.

**Para poner promos:** copiá el contenido de `src/data/promos.ejemplo.json`, que
ya tiene tres armadas, y editalas.

```json
{
  "id": "combo-familiar",
  "titulo": "Combo familiar",
  "descripcion": "Pollo al horno + guarnición + 6 empanadas.",
  "etiqueta": "Para compartir",
  "precio": 24000,
  "condiciones": "Viernes y sábados, hasta agotar stock.",
  "destacada": true
}
```

`destacada: true` la muestra más grande y con borde amarillo. Conviene que haya
**una sola** destacada.

## Cómo cambio los horarios

**Archivo: `src/data/negocio.json`**, parte de `horarios`.

Cada día tiene sus turnos:

```json
{
  "dia": "lunes",
  "nombre": "Lunes",
  "turnos": [
    { "desde": "11:00", "hasta": "14:00" },
    { "desde": "20:00", "hasta": "22:30" }
  ]
}
```

- Las horas van **entre comillas y en formato de 24 horas**: `"20:00"`, no `"8 PM"`.
- Un día que cierra lleva los corchetes vacíos: `"turnos": []`.
- Si un día abre de corrido, dejá un solo turno.

Cambiar esto actualiza **al mismo tiempo** la tabla de horarios, el pie de
página, el cartel de "Abierto / Cerrado" y lo que ve Google. No hay que tocar
nada más.

El cartel de abierto/cerrado se calcula siempre **en horario de Argentina**, así
que alguien que entra desde otro país ve el estado real del local.

## Cómo actualizo las fotos de Instagram

Son **dos pasos**:

1. Poné las 6 imágenes en `src/assets/instagram/`, con los nombres
   `post-1.jpg` … `post-6.jpg` (cuadradas, 1080 × 1080).
2. Abrí `src/data/instagram.json` y por cada una completá:

```json
{
  "id": "ig-1",
  "imagen": "post-1.jpg",
  "alt": "Bandeja de empanadas recién salidas del horno",
  "caption": "Recién salidas",
  "url": "https://www.instagram.com/p/CODIGO/"
}
```

- `alt` **es obligatorio**: es lo que lee en voz alta el celular de una persona
  ciega. Describí lo que se ve, en una línea.
- `url` es el link al post. Si lo dejás en `null`, la foto lleva al perfil.
- `caption` puede quedar vacío (`""`).

**Esto se actualiza a mano y es a propósito.** No hay scraping ni APIs no
oficiales de Instagram: se rompen solos y van contra los términos del servicio.
Para automatizarlo haría falta convertir la cuenta a **Business**, vincularla a
una página de Facebook y usar el **Instagram Graph API** con un token propio que
hay que renovar cada tanto. Para un local de barrio, cambiar 6 fotos cada varios
meses es más simple y no se rompe nunca.

## Cómo saco el cartel de "sitio en armado"

Arriba de todo hay una franja negra que dice *"Sitio en armado: todavía estamos
cargando los platos y los precios"*. Sirve para que nadie tome por definitivos
los precios que faltan.

Cuando el menú y los precios estén cargados, abrí `src/data/negocio.json` y
cambiá:

```json
"datosEnCarga": true
```

por

```json
"datosEnCarga": false
```

## Reglas de oro para no romper nada

Los archivos `.json` son quisquillosos con la puntuación. Cinco reglas:

1. **Cada cosa entre comillas dobles**, salvo los números, `true`, `false` y
   `null`.
2. **Los precios van sin comillas y sin símbolos:** `12500`.
3. **Coma entre bloques, pero no después del último.**
4. **`null` va sin comillas.** `"null"` (con comillas) es el texto "null" y se
   va a ver así en la página.
5. **Si dudás, hacé una copia del archivo antes de tocarlo.**

Si algo quedó mal escrito, `npm run build` **falla y avisa dónde**. El sitio
publicado no se rompe: sigue andando la versión anterior hasta que subas una
nueva.

---

## Cómo está armado por dentro

```
src/
  data/          Todo lo editable (JSON). Es lo único que se toca seguido.
  types/         Las interfaces de TypeScript: el contrato de los JSON.
  lib/           datos.ts (carga y tipa), horarios.ts (abierto/cerrado),
                 formato.ts (precios en pesos)
  scripts/       carrito.ts: el estado del pedido y el armado del mensaje
  components/    Un archivo por sección de la página
  layouts/       Base.astro: <head>, SEO, header y footer
  pages/         index.astro, gracias.astro, 404.astro, robots.txt.ts
plantillas/      Los CSV para importar a Google Sheets
.github/         La automatización que lee la planilla cada 20 minutos
netlify.toml     Build, cacheo y cabeceras para Netlify
  assets/        Fotos que Astro optimiza en el build
  styles/        global.css: los tokens de diseño (colores, tipografías,
                 espaciado) y los componentes base. Las reglas, en DISENO.md
public/          Se copia tal cual: fuentes, favicon, imagen para compartir
scripts/         generar-placeholders.mjs (utilidad de desarrollo)
```

Algunas decisiones que conviene conocer antes de tocar el código:

- **Los componentes nunca importan los JSON directo**, siempre pasan por
  `src/lib/datos.ts`. Así el tipado se valida en un solo lugar.
- **El día de hoy se resuelve en el navegador, no en el build.** Un sitio
  compilado un lunes mostraría "lunes" toda la semana si no fuera así. Lo
  resuelve un script chiquito en el `<head>` (antes de dibujar nada) y el CSS
  muestra el plato que corresponde: no hay salto al cargar.
- **El panel del carrito es un `<dialog>` nativo** abierto con `showModal()`: el
  navegador ya se ocupa del foco atrapado, del Escape y de dejar inerte el
  fondo.
- **Las pestañas de la carta son enlaces `<a href="#...">`**, no pestañas de
  JavaScript. Navegan sin recargar y funcionan sin JS.
- **Las fuentes están self-hosted y recortadas** (Sansita + Archivo, 76 KB
  entre las dos), con fuentes de respaldo de métricas ajustadas para que el
  texto no salte mientras cargan.
- **El diseño tiene reglas escritas** en [`DISENO.md`](DISENO.md) y una guía
  visual en vivo en `/estilo`. Leelas antes de agregar colores, fuentes o
  adornos.
- **Escribir en el carrito no repinta la lista.** Si repintara, el cursor se
  perdería en medio de la palabra.

### Medido, no estimado

Lighthouse 12, emulación mobile, sobre el sitio compilado:

| | |
|---|---|
| Performance | **97 a 99** (cuatro corridas) |
| Accesibilidad | **100** |
| Buenas prácticas | **100** |
| SEO | **100** |
| LCP | 2,0 s |
| CLS | 0 |
| Bloqueo del hilo principal (TBT) | 20 a 90 ms |

---

## Qué falta

Los precios, el menú de la semana, el radio de delivery, los medios de pago, el
logo sin la dirección vieja y las 9 fotos. Todo está listado, con el detalle de
a quién preguntarle qué, en:

- **[`PENDIENTES.md`](PENDIENTES.md)** — datos a confirmar con el comercio y las
  decisiones que tomé sin consultar.
- **[`public/img/README.md`](public/img/README.md)** — las fotos a pedir, con
  medidas y peso máximo, y un texto listo para pasarle al local.
