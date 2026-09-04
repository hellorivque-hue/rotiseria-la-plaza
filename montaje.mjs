import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { statSync } from 'node:fs';

const base = 'C:/Users/Juegos/Downloads';
const dirs = ['llaplaza_files', 'lllaplaza_files'];
const vistos = new Map();

for (const d of dirs) {
  for (const f of await readdir(`${base}/${d}`)) {
    if (!/\.(jpg|jpeg|png|webp|heic)$/i.test(f)) continue;
    if (vistos.has(f)) continue;
    const ruta = `${base}/${d}/${f}`;
    const kb = statSync(ruta).size / 1024;
    if (kb < 18) continue;
    try {
      const m = await sharp(ruta).metadata();
      if (m.width >= 600) vistos.set(f, { ruta, w: m.width, h: m.height, kb: Math.round(kb) });
    } catch {}
  }
}

const lista = [...vistos.entries()];
console.log('candidatas:', lista.length);
await mkdir('montaje', { recursive: true });

const COL = 4, T = 260;
for (let pagina = 0; pagina * 12 < lista.length; pagina++) {
  const trozo = lista.slice(pagina * 12, pagina * 12 + 12);
  const filas = Math.ceil(trozo.length / COL);
  const capas = [];
  for (let i = 0; i < trozo.length; i++) {
    const [, info] = trozo[i];
    const buf = await sharp(info.ruta).resize(T, T, { fit: 'cover' }).jpeg().toBuffer();
    capas.push({ input: buf, left: (i % COL) * T, top: Math.floor(i / COL) * (T + 26) + 26 });
    const etiqueta = Buffer.from(
      `<svg width="${T}" height="26"><rect width="${T}" height="26" fill="#111"/>` +
      `<text x="6" y="18" font-family="Arial" font-size="15" fill="#fff">${pagina * 12 + i + 1} · ${info.w}x${info.h}</text></svg>`
    );
    capas.push({ input: etiqueta, left: (i % COL) * T, top: Math.floor(i / COL) * (T + 26) });
  }
  await sharp({ create: { width: COL * T, height: filas * (T + 26), channels: 3, background: '#222' } })
    .composite(capas).jpeg({ quality: 82 }).toFile(`montaje/hoja-${pagina + 1}.jpg`);
  console.log('hoja', pagina + 1, trozo.map((t, i) => `${pagina * 12 + i + 1}=${t[0].slice(0, 12)}`).join(' '));
}
await writeFile('montaje/indice.json', JSON.stringify(lista.map(([f, i], n) => ({ n: n + 1, f, ...i })), null, 1));
