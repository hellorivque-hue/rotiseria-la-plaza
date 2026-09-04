/**
 * Importa las fotos del propio Instagram del local a src/assets.
 *
 * Son fotos publicadas por la cuenta @rotiserialaplaza.mp, es decir del
 * comercio, tomadas de una copia guardada del perfil. No se usa ninguna foto
 * subida por clientes ni imagenes de terceros.
 *
 * NO se importa el logo que aparece en el perfil: tiene impresa la direccion
 * vieja "Brown 402". Ver PENDIENTES.md
 *
 * Uso:  node scripts/importar-fotos-instagram.mjs
 */
import sharp from 'sharp';
import { readFile, mkdir } from 'node:fs/promises';

const indice = JSON.parse(await readFile('montaje/indice.json', 'utf8'));
const porNumero = (n) => indice.find((x) => x.n === n).ruta;

const piezas = [
  // Hero: milanesa con fideos, 1440x1440 de origen.
  { n: 10, salida: 'src/assets/hero-plato.jpg', w: 1200, h: 1200 },
  // Frente del local. Origen vertical y en blanco y negro (es un story).
  // La franja se elige a mano: mas arriba entra el texto sobreimpreso del
  // story, y mas abajo se pierde el cartel de "La Plaza".
  {
    n: 17,
    salida: 'src/assets/local.jpg',
    w: 640,
    h: 427,
    franja: { left: 0, top: 250, width: 640, height: 427 },
  },
  // Imagen para compartir por WhatsApp.
  { n: 10, salida: 'public/img/og.jpg', w: 1200, h: 630 },
  // Grilla de Instagram, cuadradas.
  { n: 23, salida: 'src/assets/instagram/post-1.jpg', w: 640, h: 640 },
  { n: 3, salida: 'src/assets/instagram/post-2.jpg', w: 640, h: 640 },
  { n: 5, salida: 'src/assets/instagram/post-3.jpg', w: 1080, h: 1080 },
  { n: 11, salida: 'src/assets/instagram/post-4.jpg', w: 640, h: 640 },
  { n: 15, salida: 'src/assets/instagram/post-5.jpg', w: 640, h: 640, recorte: 'centre' },
  { n: 6, salida: 'src/assets/instagram/post-6.jpg', w: 1080, h: 1080 },
];

for (const p of piezas) {
  await mkdir(p.salida.split('/').slice(0, -1).join('/'), { recursive: true });
  const origen = sharp(porNumero(p.n));
  if (p.franja) origen.extract(p.franja);

  await origen
    // "attention" recorta buscando la parte con mas contenido: en fotos
    // verticales de plato, evita que quede cortado el plato.
    .resize(p.w, p.h, {
      fit: 'cover',
      // "attention" recorta buscando la zona con mas contenido. Anda bien para
      // platos, pero para algunas fotos conviene forzar el recorte a mano.
      position: p.recorte ?? sharp.strategy.attention,
    })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(p.salida);
  console.log('importada', p.salida, `${p.w}x${p.h}`);
}
