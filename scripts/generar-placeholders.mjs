/**
 * Genera las imagenes placeholder del sitio.
 *
 * NO son fotos del local: son cuadros con la proporcion correcta para que el
 * maquetado no se mueva cuando lleguen las fotos reales.
 * La lista de fotos a pedirle al comercio esta en public/img/README.md
 *
 * Uso:  node scripts/generar-placeholders.mjs
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const CREMA = '#f6ead6';
const LADRILLO = '#a21b12';
const TINTA = '#5b4a40';

/** @param {{w:number,h:number,titulo:string,detalle:string}} o */
function svg({ w, h, titulo, detalle }) {
  const base = Math.min(w, h);
  const t1 = Math.round(base * 0.062);
  const t2 = Math.round(base * 0.04);
  const m = Math.round(base * 0.045);
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${CREMA}"/>
  <g fill="${LADRILLO}" opacity="0.09">
    ${Array.from({ length: Math.ceil(w / 46) * Math.ceil(h / 46) }, (_, i) => {
      const cols = Math.ceil(w / 46);
      return `<circle cx="${(i % cols) * 46 + 12}" cy="${Math.floor(i / cols) * 46 + 12}" r="3"/>`;
    }).join('')}
  </g>
  <rect x="${m}" y="${m}" width="${w - m * 2}" height="${h - m * 2}" fill="none"
        stroke="${LADRILLO}" stroke-width="${Math.max(2, base * 0.006)}"
        stroke-dasharray="${base * 0.05} ${base * 0.03}" rx="${base * 0.03}" opacity="0.55"/>
  <text x="50%" y="46%" text-anchor="middle" font-family="Georgia, serif" font-weight="bold"
        font-size="${t1}" fill="${LADRILLO}">${titulo}</text>
  <text x="50%" y="46%" dy="${t1 * 1.35}" text-anchor="middle" font-family="Arial, sans-serif"
        font-size="${t2}" fill="${TINTA}">${detalle}</text>
</svg>`);
}

const piezas = [
  { salida: 'src/assets/hero-plato.jpg', w: 1200, h: 1200, titulo: 'FOTO PENDIENTE', detalle: 'Hero · plato al horno · 1:1' },
  { salida: 'src/assets/local.jpg', w: 1400, h: 933, titulo: 'FOTO PENDIENTE', detalle: 'Frente del local · 3:2' },
  { salida: 'public/img/og.jpg', w: 1200, h: 630, titulo: 'ROTISERIA LA PLAZA', detalle: 'Imagen para compartir · 1200x630' },
  ...Array.from({ length: 6 }, (_, i) => ({
    salida: `src/assets/instagram/post-${i + 1}.jpg`,
    w: 1080,
    h: 1080,
    titulo: 'FOTO PENDIENTE',
    detalle: `Instagram ${i + 1} · 1:1`,
  })),
];

for (const p of piezas) {
  const destino = resolve(raiz, p.salida);
  await mkdir(dirname(destino), { recursive: true });
  await sharp(svg(p)).jpeg({ quality: 78, mozjpeg: true }).toFile(destino);
  console.log('generado', p.salida);
}
