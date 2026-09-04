/** Formateo de precios y textos. Un solo lugar para que todo se vea igual. */

const formateador = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Precio para pantalla.
 * `null` significa "todavia no confirmado con el local", no "gratis".
 */
export function precio(valor: number | null | undefined): string {
  if (valor === null || valor === undefined) return 'Consultar';
  return formateador.format(valor);
}

/** Version corta para el carrito y el mensaje de WhatsApp. */
export function precioPlano(valor: number | null | undefined): string {
  if (valor === null || valor === undefined) return 'a confirmar';
  return formateador.format(valor);
}

export function hayValor(v: string | null | undefined): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}
