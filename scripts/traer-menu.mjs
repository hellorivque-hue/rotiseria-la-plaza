/**
 * Trae el menú del día y los precios desde una planilla de Google.
 *
 * COMO FUNCIONA
 * -------------
 * La planilla se publica en la web (Archivo → Compartir → Publicar en la web),
 * lo que da una URL que devuelve la hoja en formato CSV. Este script la lee,
 * la valida y escribe src/data/menu-del-dia.json y los precios de carta.json.
 *
 * No hace falta clave de Google ni cuenta de programador: la URL publicada es
 * pública y de solo lectura.
 *
 * REGLA DE ORO
 * ------------
 * Este script NUNCA hace fallar nada. Si Google no responde, si la planilla
 * está mal armada o si alguien borró una columna, avisa por consola y deja los
 * archivos como estaban. El sitio sigue online con el último menú que funcionó.
 * Un sitio caído porque una planilla no cargó es peor que no tener planilla.
 *
 * USO
 * ---
 *   PLANILLA_MENU_URL=... PLANILLA_PRECIOS_URL=... node scripts/traer-menu.mjs
 *
 * Si las variables no están definidas, no hace nada y termina bien. Por eso
 * `npm run build` sigue funcionando en cualquier computadora sin configurar nada.
 */
import { readFile, writeFile } from 'node:fs/promises';

const URL_MENU = process.env.PLANILLA_MENU_URL;
const URL_PRECIOS = process.env.PLANILLA_PRECIOS_URL;

const RUTA_MENU = 'src/data/menu-del-dia.json';
const RUTA_CARTA = 'src/data/carta.json';

const DIAS_VALIDOS = [
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
  'domingo',
];

/* -------------------------------------------------------------------------- */
/* Utilidades                                                                 */
/* -------------------------------------------------------------------------- */

function aviso(mensaje) {
  console.warn(`[planilla] ${mensaje}`);
}

/**
 * Parser de CSV.
 *
 * Chico pero completo: entiende comillas, comas adentro de comillas, comillas
 * escapadas ("") y saltos de línea de Windows. Se escribe a mano para no sumar
 * una dependencia por 40 líneas.
 */
function parsearCsv(texto) {
  const filas = [];
  let fila = [];
  let campo = '';
  let enComillas = false;

  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];

    if (enComillas) {
      if (c === '"') {
        if (texto[i + 1] === '"') {
          campo += '"';
          i++;
        } else {
          enComillas = false;
        }
      } else {
        campo += c;
      }
      continue;
    }

    if (c === '"') enComillas = true;
    else if (c === ',') {
      fila.push(campo);
      campo = '';
    } else if (c === '\n') {
      fila.push(campo);
      filas.push(fila);
      fila = [];
      campo = '';
    } else if (c !== '\r') {
      campo += c;
    }
  }

  if (campo !== '' || fila.length > 0) {
    fila.push(campo);
    filas.push(fila);
  }

  return filas.filter((f) => f.some((v) => v.trim() !== ''));
}

/** Convierte las filas en objetos usando la primera fila como encabezado. */
function aObjetos(filas) {
  const [encabezado, ...resto] = filas;
  if (!encabezado) return [];

  const claves = encabezado.map((c) => c.trim().toLowerCase());

  return resto.map((f) => {
    const obj = {};
    claves.forEach((clave, i) => {
      obj[clave] = (f[i] ?? '').trim();
    });
    return obj;
  });
}

/**
 * Lee un precio escrito por una persona.
 *
 * Acepta "12500", "$12.500", "12.500", "$ 12500", "12500,00" y devuelve 12500.
 * Cualquier cosa que no sea un número devuelve null, que en el sitio se
 * muestra como "Consultar". Nunca inventa un precio.
 */
function leerPrecio(valor) {
  if (typeof valor !== 'string') return null;

  const limpio = valor.trim();
  if (limpio === '') return null;

  // Se sacan simbolos y separadores de miles; la coma se toma como decimal.
  const soloNumero = limpio
    .replace(/[^0-9.,]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');

  if (soloNumero === '') return null;

  const numero = Number(soloNumero);
  if (!Number.isFinite(numero) || numero < 0) return null;

  return Math.round(numero);
}

/** Texto de una celda, o null si está vacía. */
function leerTexto(valor) {
  const limpio = (valor ?? '').trim();
  return limpio === '' ? null : limpio;
}

async function bajarCsv(url, nombre) {
  const respuesta = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(20_000),
  });

  if (!respuesta.ok) {
    throw new Error(`${nombre}: Google respondió ${respuesta.status}`);
  }

  const texto = await respuesta.text();

  // Si la planilla no está publicada, Google devuelve una página HTML de error
  // en vez del CSV. Conviene detectarlo acá y no romper el JSON después.
  if (texto.trimStart().startsWith('<')) {
    throw new Error(
      `${nombre}: la URL no devolvió un CSV. Revisá que la planilla esté publicada en la web.`,
    );
  }

  return texto;
}

/* -------------------------------------------------------------------------- */
/* Menú del día                                                               */
/* -------------------------------------------------------------------------- */

async function sincronizarMenu() {
  const csv = await bajarCsv(URL_MENU, 'menú');
  const filas = aObjetos(parsearCsv(csv));

  if (filas.length === 0) throw new Error('menú: la planilla vino vacía');

  const actual = JSON.parse(await readFile(RUTA_MENU, 'utf8'));
  let cargados = 0;

  const nuevo = actual.map((dia) => {
    const fila = filas.find((f) => (f.dia ?? '').toLowerCase() === dia.dia);
    if (!fila) return dia;

    const principal = leerTexto(fila.plato ?? fila.principal);
    if (principal) cargados++;

    return {
      ...dia,
      principal,
      guarnicion: leerTexto(fila.guarnicion),
      destacado: leerTexto(fila.destacado),
      precio: leerPrecio(fila.precio),
    };
  });

  const diasEnPlanilla = filas
    .map((f) => (f.dia ?? '').toLowerCase())
    .filter((d) => d !== '' && !DIAS_VALIDOS.includes(d));

  if (diasEnPlanilla.length > 0) {
    aviso(
      `estos días de la planilla no se reconocen y se ignoraron: ${diasEnPlanilla.join(', ')}`,
    );
  }

  await writeFile(RUTA_MENU, JSON.stringify(nuevo, null, 2) + '\n', 'utf8');
  console.log(`[planilla] menú del día: ${cargados} de 7 días con plato cargado`);
}

/* -------------------------------------------------------------------------- */
/* Precios de la carta                                                        */
/* -------------------------------------------------------------------------- */

async function sincronizarPrecios() {
  const csv = await bajarCsv(URL_PRECIOS, 'precios');
  const filas = aObjetos(parsearCsv(csv));

  if (filas.length === 0) throw new Error('precios: la planilla vino vacía');

  const carta = JSON.parse(await readFile(RUTA_CARTA, 'utf8'));

  const porId = new Map();
  for (const fila of filas) {
    const id = leerTexto(fila.id);
    if (id) porId.set(id, fila);
  }

  const idsDeLaCarta = new Set();
  let conPrecio = 0;

  for (const categoria of carta) {
    for (const item of categoria.items) {
      idsDeLaCarta.add(item.id);

      const fila = porId.get(item.id);
      if (!fila) continue;

      item.precio = leerPrecio(fila.precio);
      if (item.precio !== null) conPrecio++;

      // La disponibilidad tambien se puede manejar desde la planilla:
      // escribir "no" en la columna `disponible` saca el plato del sitio.
      const disp = (fila.disponible ?? '').trim().toLowerCase();
      if (disp !== '') {
        item.disponible = !['no', 'n', 'false', '0'].includes(disp);
      }
    }
  }

  const desconocidos = [...porId.keys()].filter((id) => !idsDeLaCarta.has(id));
  if (desconocidos.length > 0) {
    aviso(
      `estos id de la planilla no existen en la carta y se ignoraron: ${desconocidos.join(', ')}`,
    );
  }

  const faltantes = [...idsDeLaCarta].filter((id) => !porId.has(id));
  if (faltantes.length > 0) {
    aviso(`${faltantes.length} platos de la carta no figuran en la planilla`);
  }

  await writeFile(RUTA_CARTA, JSON.stringify(carta, null, 2) + '\n', 'utf8');
  console.log(
    `[planilla] carta: ${conPrecio} de ${idsDeLaCarta.size} platos con precio cargado`,
  );
}

/* -------------------------------------------------------------------------- */
/* Principal                                                                  */
/* -------------------------------------------------------------------------- */

if (!URL_MENU && !URL_PRECIOS) {
  console.log(
    '[planilla] sin planilla configurada, se usan los datos que ya están en src/data. Todo bien.',
  );
  process.exit(0);
}

// Cada hoja se sincroniza por separado: si falla una, la otra igual se aplica.
for (const [url, tarea, nombre] of [
  [URL_MENU, sincronizarMenu, 'menú del día'],
  [URL_PRECIOS, sincronizarPrecios, 'precios'],
]) {
  if (!url) continue;

  try {
    await tarea();
  } catch (error) {
    aviso(`NO se pudo actualizar ${nombre}: ${error.message}`);
    aviso('se deja lo que ya estaba cargado. El sitio no se rompe.');
  }
}

// Siempre sale bien, a propósito: la publicación del sitio no depende de Google.
process.exit(0);
