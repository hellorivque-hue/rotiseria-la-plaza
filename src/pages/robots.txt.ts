/**
 * robots.txt generado en el build.
 *
 * Se genera en vez de escribirse a mano para que la linea del sitemap use
 * siempre el dominio configurado en astro.config.mjs. Si el dominio cambia,
 * no hay que acordarse de tocar este archivo.
 */
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://rotiserialaplaza.com.ar');

  const contenido = `# Rotisería La Plaza
User-agent: *
Allow: /

# Páginas de apoyo: no aportan nada en el buscador.
Disallow: /gracias
Disallow: /estilo

Sitemap: ${new URL('sitemap-index.xml', base).href}
`;

  return new Response(contenido, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
