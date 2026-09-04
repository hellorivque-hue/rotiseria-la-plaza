/**
 * Genera las plantillas CSV que se importan a Google Sheets.
 *
 * Sirve para arrancar, y también para cuando se agregan platos nuevos a la
 * carta: se vuelve a correr, se importa el CSV y la planilla queda con los
 * platos nuevos incluidos.
 *
 * Uso:  npm run plantillas
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const escapar = (valor) =>
  /[",\n]/.test(valor) ? `"${valor.replace(/"/g, '""')}"` : valor;

await mkdir('plantillas', { recursive: true });

/* ---------------------------------------------------------------------- */
/* Hoja "precios": una fila por plato de la carta                          */
/* ---------------------------------------------------------------------- */

const carta = JSON.parse(await readFile('src/data/carta.json', 'utf8'));
const filas = ['id,categoria,plato,precio,disponible'];

for (const categoria of carta) {
  for (const item of categoria.items) {
    const nombre = item.unidad ? `${item.nombre} (${item.unidad})` : item.nombre;
    filas.push(
      [
        item.id,
        escapar(categoria.nombre),
        escapar(nombre),
        item.precio ?? '',
        item.disponible ? '' : 'no',
      ].join(','),
    );
  }
}

await writeFile('plantillas/precios.csv', filas.join('\n') + '\n', 'utf8');

/* ---------------------------------------------------------------------- */
/* Hoja "menu": una fila por día                                           */
/* ---------------------------------------------------------------------- */

const menu = JSON.parse(await readFile('src/data/menu-del-dia.json', 'utf8'));
const filasMenu = ['dia,plato,guarnicion,destacado,precio'];

for (const dia of menu) {
  filasMenu.push(
    [
      dia.dia,
      escapar(dia.principal ?? ''),
      escapar(dia.guarnicion ?? ''),
      escapar(dia.destacado ?? ''),
      dia.precio ?? '',
    ].join(','),
  );
}

await writeFile('plantillas/menu-del-dia.csv', filasMenu.join('\n') + '\n', 'utf8');

console.log('Plantillas generadas en plantillas/');
console.log(`  precios.csv        ${filas.length - 1} platos`);
console.log(`  menu-del-dia.csv   ${filasMenu.length - 1} días`);
