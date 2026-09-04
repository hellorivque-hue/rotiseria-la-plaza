# Cómo poner el sitio online y dejar que carguen el menú solos

Dos partes. La primera se hace **una sola vez**. La segunda es la que el local
va a usar **todos los días**.

Todo lo de acá es **gratis**. Lo único que se paga, si algún día lo quieren, es
un dominio propio.

---

# Parte 1 · Ponerlo online (una sola vez, ~15 minutos)

## 1.1 Subir el código a GitHub

1. Crear una cuenta en <https://github.com> (gratis).
2. *New repository* → nombre `rotiseria-la-plaza` → **Private** o **Public**.
3. Subir esta carpeta.

> **Público o privado:** con el repositorio **público**, la automatización del
> menú no tiene tope de uso. Con uno **privado**, GitHub da una cantidad de
> minutos por mes que para este uso alcanza, pero conviene mirarla. Si el
> código no tiene nada sensible —y este no tiene: no hay claves ni datos de
> clientes— público es lo más cómodo.

## 1.2 Conectar Netlify

1. Crear cuenta en <https://netlify.com> entrando **con GitHub** (así no hay
   otra contraseña que recordar).
2. *Add new site* → *Import an existing project* → GitHub → elegir el repo.
3. **No tocar nada de la configuración**: el archivo `netlify.toml` ya le dice
   cómo compilar y qué publicar.
4. *Deploy*.

A los dos minutos queda online en una dirección tipo
`rotiseria-la-plaza.netlify.app`.

## 1.3 (Opcional) Dominio propio

En Netlify: *Domain management* → *Add a domain*. **No hay que tocar código:**
el sitio detecta solo el dominio y actualiza la dirección que ve Google, la
vista previa de WhatsApp y el mapa del sitio.

Es lo único que cuesta plata: lo cobra quien vende el dominio, no Netlify.

---

# Parte 2 · La planilla del menú

La idea: **el local edita una planilla de Google y el sitio se actualiza solo.**
Nadie toca código ni archivos raros.

## 2.1 Crear la planilla

1. Entrar a <https://sheets.google.com> y crear una planilla nueva.
2. Ponerle de nombre **Menú Rotisería La Plaza**.
3. Va a tener **dos hojas** (las pestañas de abajo). Renombrarlas a **`menu`** y
   **`precios`**.
4. Importar las plantillas que están en la carpeta `plantillas/` de este
   proyecto:
   - En la hoja `menu`: *Archivo → Importar → Subir* → `menu-del-dia.csv` →
     **Reemplazar hoja actual**.
   - En la hoja `precios`: lo mismo con `precios.csv`.

La hoja `precios` ya viene con **los 79 platos cargados**, uno por fila. Solo
hay que escribir el precio al lado de cada uno.

## 2.2 Publicar la planilla en la web

Esto es lo que le permite al sitio leerla. **No comparte la planilla con nadie
para editar**: la deja disponible solo para leer.

1. *Archivo → Compartir → **Publicar en la web***.
2. Pestaña **Vínculo**.
3. En el primer desplegable elegir la hoja **`menu`** (no "Documento completo").
4. En el segundo elegir **Valores separados por comas (.csv)**.
5. *Publicar* → copiar la URL que aparece.
6. **Repetir** para la hoja **`precios`** y copiar esa segunda URL.

Quedan dos URLs largas que arrancan con
`https://docs.google.com/spreadsheets/d/e/2PACX-...`

## 2.3 Enchufarlas al sitio

En GitHub, en el repositorio:

*Settings → Secrets and variables → Actions →* pestaña **Variables** →
*New repository variable*. Crear dos:

| Nombre | Valor |
|---|---|
| `PLANILLA_MENU_URL` | la URL de la hoja `menu` |
| `PLANILLA_PRECIOS_URL` | la URL de la hoja `precios` |

Listo. Ya está todo conectado.

---

# Cómo se usa todos los días

**El local abre la planilla desde el celular, escribe el menú del día y listo.**
En unos minutos está online.

Cada 20 minutos, entre las 10 y las 24, el sistema mira la planilla. Si algo
cambió, publica el sitio solo. Si no cambió nada, no hace nada.

**Para que salga en el momento**, sin esperar: en GitHub, pestaña *Actions* →
*Sincronizar menú desde la planilla* → botón **Run workflow**. Conviene dejar
ese link guardado en la pantalla de inicio del celular.

## Qué se puede cambiar desde la planilla

**Hoja `menu`** — una fila por día:

| Columna | Qué va |
|---|---|
| `dia` | **No tocar.** Es la referencia del día. |
| `plato` | El plato principal. Si se deja vacío, el sitio dice "a confirmar". |
| `guarnicion` | Con qué viene. En la página sale "con puré". |
| `destacado` | Frase corta opcional: "El más pedido", "Solo mediodía". |
| `precio` | Solo el número. Vacío = "Consultar". |

**Hoja `precios`** — una fila por plato:

| Columna | Qué va |
|---|---|
| `id` | **No tocar nunca.** Es lo que conecta la fila con el plato del sitio. |
| `categoria`, `plato` | Solo para que sepas cuál es cuál. Cambiarlos no afecta al sitio. |
| `precio` | El número. Vacío = "Consultar". |
| `disponible` | Escribir **`no`** para sacar el plato del sitio (se acabó). Vacío = se muestra. |

Los precios se pueden escribir como venga: `12500`, `$12.500`, `$ 12500`. El
sitio los entiende igual y los muestra siempre como **$ 12.500**.

Si en la casilla del precio hay texto en vez de un número (por ejemplo "ver"),
el sitio muestra **"Consultar"**. Nunca inventa un precio.

---

# Qué pasa si algo falla

Está pensado para que **nada rompa el sitio**:

| Si pasa esto | Qué hace el sitio |
|---|---|
| Google no responde | Se queda con el último menú que funcionó y sigue online |
| La planilla se despublicó | Igual: sigue con lo último, y avisa en el registro |
| Alguien borra una columna | Ignora esa columna, el resto se actualiza |
| Alguien escribe mal un precio | Ese plato queda en "Consultar" |
| Alguien borra una fila entera | Ese plato queda como estaba |
| Alguien borra la planilla | El sitio sigue igual. Se rehace con `npm run plantillas` |

**La publicación del sitio no depende de Google.** La planilla se lee aparte y
el resultado queda guardado en el repositorio; recién ahí se publica. Aunque
Google esté caído, el sitio se puede publicar igual.

Y como cada cambio queda registrado, siempre se puede ver **qué se cambió, qué
día** y volver atrás.

---

# Si se agregan platos nuevos a la carta

La planilla no se actualiza sola con platos nuevos: los platos viven en el
código, los precios en la planilla.

Cuando se agregue un plato a `src/data/carta.json`:

```bash
npm run plantillas
```

Eso regenera `plantillas/precios.csv` con los platos nuevos **y con los precios
que ya estaban cargados**. Se vuelve a importar en la hoja `precios` y listo.

---

# Probarlo en tu computadora

```bash
PLANILLA_MENU_URL="..." PLANILLA_PRECIOS_URL="..." npm run menu
```

Muestra cuántos días y cuántos precios levantó, y avisa si hay filas con
problemas. Después, `npm run dev` para verlo.
