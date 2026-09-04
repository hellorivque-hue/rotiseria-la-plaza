// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Dominio del sitio. De el salen el canonical, el Open Graph, el sitemap.xml
 * y el robots.txt, asi que tiene que ser el dominio real.
 *
 * No hace falta escribirlo a mano en ningun lado: se resuelve por orden.
 *
 *   1. SITE_URL  - si alguien lo define explicitamente, manda.
 *   2. URL       - Netlify la inyecta sola en cada build, y ya trae el dominio
 *                  propio apenas se conecta uno. Es decir: al enchufar el
 *                  dominio en el panel de Netlify, este archivo NO se toca.
 *   3. El ultimo valor es solo una red de seguridad para builds locales.
 *
 * Vercel y Cloudflare Pages no exponen `URL`, asi que ahi conviene definir
 * SITE_URL en las variables de entorno del proyecto.
 */
const SITE_URL =
  process.env.SITE_URL ?? process.env.URL ?? 'http://localhost:4321';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // /gracias es una pagina de paso: no tiene nada que indexar.
      filter: (pagina) => !pagina.includes('/gracias'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: 'auto',
  },
  image: {
    // Sin servicios remotos: todo se procesa en build.
    responsiveStyles: true,
  },
});
