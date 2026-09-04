/**
 * Punto unico de entrada a los datos editables.
 *
 * Los componentes importan desde aca y nunca desde los JSON directamente:
 * asi el tipado se valida en un solo lugar y `npm run build` falla si alguien
 * rompe un archivo de datos.
 */
import negocioJson from '../data/negocio.json';
import menuJson from '../data/menu-del-dia.json';
import cartaJson from '../data/carta.json';
import promosJson from '../data/promos.json';
import instagramJson from '../data/instagram.json';

import type {
  CategoriaCarta,
  MenuDia,
  Negocio,
  PostInstagram,
  Promo,
} from '../types';

export const negocio = negocioJson as Negocio;
export const menuSemanal = menuJson as MenuDia[];
export const carta = cartaJson as CategoriaCarta[];
export const promos = promosJson as Promo[];
export const instagram = instagramJson as PostInstagram[];

/** Solo las categorias que tienen al menos un item disponible. */
export const cartaVisible: CategoriaCarta[] = carta
  .map((c) => ({ ...c, items: c.items.filter((i) => i.disponible) }))
  .filter((c) => c.items.length > 0);

/** Link de WhatsApp con un mensaje ya escrito. */
export function linkWhatsApp(mensaje: string): string {
  return `https://wa.me/${negocio.telefono.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

/** URL para el iframe del mapa: busca por direccion, no necesita API key. */
export function urlMapaEmbed(): string {
  const consulta = `${negocio.nombre}, ${negocio.direccion.completa}`;
  return `https://maps.google.com/maps?q=${encodeURIComponent(consulta)}&z=16&output=embed`;
}

/** URL de "Como llegar" en Google Maps. */
export function urlComoLlegar(): string {
  const consulta = `${negocio.direccion.calle}, ${negocio.direccion.localidad}, ${negocio.direccion.provincia}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(consulta)}`;
}
