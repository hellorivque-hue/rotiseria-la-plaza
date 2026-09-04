/**
 * Carrito del pedido.
 *
 * Es lo unico del sitio que necesita JavaScript. Guarda el estado en memoria y
 * lo persiste en localStorage, asi alguien que cierra la pestana y vuelve no
 * pierde lo que habia cargado.
 *
 * No hay framework: un objeto de estado, una lista de suscriptores y funciones
 * que modifican y avisan. Alcanza y sobra para un carrito de rotiseria.
 */
import type { EstadoPedido, ItemPedido, ModalidadEntrega } from '../types';
import { precioPlano } from '../lib/formato';

/** Si algun dia cambia la forma del estado, subir la version invalida lo viejo. */
const CLAVE = 'laplaza:pedido:v1';

const estadoInicial: EstadoPedido = {
  items: [],
  nombre: '',
  direccion: '',
  modalidad: 'delivery',
  notas: '',
};

type Oyente = (estado: EstadoPedido) => void;

const oyentes = new Set<Oyente>();

/* -------------------------------------------------------------------------- */
/* Persistencia                                                               */
/* -------------------------------------------------------------------------- */

/**
 * localStorage puede fallar (modo incognito, cookies bloqueadas, cuota llena).
 * Si falla, el carrito sigue andando en memoria: no se rompe nada.
 */
function leerDeLocalStorage(): EstadoPedido {
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (!crudo) return { ...estadoInicial };

    const guardado = JSON.parse(crudo) as Partial<EstadoPedido>;
    const items = Array.isArray(guardado.items) ? guardado.items : [];

    return {
      ...estadoInicial,
      ...guardado,
      // Se sanea lo que venga: un localStorage editado a mano no puede romper la UI.
      items: items
        .filter((i): i is ItemPedido => Boolean(i && typeof i.id === 'string'))
        .map((i) => ({
          id: i.id,
          nombre: String(i.nombre ?? ''),
          precio: typeof i.precio === 'number' ? i.precio : null,
          cantidad: Math.min(Math.max(Math.trunc(Number(i.cantidad) || 1), 1), 99),
          aclaracion: typeof i.aclaracion === 'string' ? i.aclaracion.slice(0, 200) : '',
          origen: i.origen === 'menu' || i.origen === 'promo' ? i.origen : 'carta',
        })),
      modalidad: guardado.modalidad === 'retiro' ? 'retiro' : 'delivery',
    };
  } catch {
    return { ...estadoInicial };
  }
}

let estado: EstadoPedido = leerDeLocalStorage();

function guardar() {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
  } catch {
    // Sin persistencia, pero el pedido en curso sigue funcionando.
  }
}

function avisar() {
  guardar();
  for (const oyente of oyentes) oyente(estado);
}

/* -------------------------------------------------------------------------- */
/* Lectura                                                                    */
/* -------------------------------------------------------------------------- */

export function obtener(): EstadoPedido {
  return estado;
}

export function suscribir(oyente: Oyente): () => void {
  oyentes.add(oyente);
  oyente(estado);
  return () => oyentes.delete(oyente);
}

export function cantidadTotal(): number {
  return estado.items.reduce((suma, i) => suma + i.cantidad, 0);
}

export interface Total {
  /** Suma de lo que si tiene precio cargado. */
  confirmado: number;
  /** Cuantos items todavia no tienen precio. */
  aConfirmar: number;
}

export function total(): Total {
  let confirmado = 0;
  let aConfirmar = 0;

  for (const item of estado.items) {
    if (item.precio === null) aConfirmar += item.cantidad;
    else confirmado += item.precio * item.cantidad;
  }

  return { confirmado, aConfirmar };
}

/** Total listo para mostrar: "$ 12.500" o "$ 12.500 + a confirmar". */
export function totalTexto(): string {
  const { confirmado, aConfirmar } = total();

  if (confirmado === 0 && aConfirmar > 0) return 'A confirmar';
  if (aConfirmar > 0) return `${precioPlano(confirmado)} + a confirmar`;
  return precioPlano(confirmado);
}

/* -------------------------------------------------------------------------- */
/* Escritura                                                                  */
/* -------------------------------------------------------------------------- */

export function agregar(nuevo: Omit<ItemPedido, 'cantidad'>, cantidad = 1) {
  const existente = estado.items.find((i) => i.id === nuevo.id);

  if (existente) {
    existente.cantidad = Math.min(existente.cantidad + cantidad, 99);
  } else {
    estado.items = [...estado.items, { ...nuevo, cantidad }];
  }

  avisar();
}

export function establecerCantidad(id: string, cantidad: number) {
  const item = estado.items.find((i) => i.id === id);
  if (!item) return;

  const limpia = Math.trunc(Number(cantidad) || 0);
  if (limpia <= 0) {
    quitar(id);
    return;
  }

  item.cantidad = Math.min(limpia, 99);
  avisar();
}

export function sumar(id: string, delta: number) {
  const item = estado.items.find((i) => i.id === id);
  if (item) establecerCantidad(id, item.cantidad + delta);
}

export function quitar(id: string) {
  estado.items = estado.items.filter((i) => i.id !== id);
  avisar();
}

/**
 * Aclaracion de un item.
 *
 * No dispara el repintado a proposito: el texto ya esta en pantalla porque lo
 * acaba de escribir la persona. Si rearmaramos la lista en cada tecla, el
 * cursor se perderia en el medio de la palabra.
 */
export function ponerAclaracion(id: string, texto: string) {
  const item = estado.items.find((i) => i.id === id);
  if (!item) return;
  item.aclaracion = texto.slice(0, 200);
  guardar();
}

/** Igual que arriba: se guarda mientras escriben, sin repintar. */
export function actualizarCampos(parcial: Partial<Omit<EstadoPedido, 'items'>>) {
  estado = { ...estado, ...parcial };
  guardar();
}

/** Para cambios que si tienen que repintar la interfaz (la modalidad). */
export function actualizarDatos(parcial: Partial<Omit<EstadoPedido, 'items'>>) {
  estado = { ...estado, ...parcial };
  avisar();
}

export function establecerModalidad(modalidad: ModalidadEntrega) {
  actualizarDatos({ modalidad });
}

export function vaciar() {
  estado = { ...estadoInicial };
  avisar();
}

/* -------------------------------------------------------------------------- */
/* Mensaje de WhatsApp                                                        */
/* -------------------------------------------------------------------------- */

export interface DatosLocal {
  nombre: string;
  abierto: boolean;
  /** Solo la parte del horario: "abre hoy 11:00", "abre el lunes 11:00". */
  proximoHorario: string;
}

/**
 * Arma el texto del pedido.
 *
 * WhatsApp entiende *negrita* y _cursiva_. Se usa poco y bien: si el mensaje
 * llega prolijo, en la cocina lo leen de un vistazo.
 */
export function armarMensaje(local: DatosLocal): string {
  const lineas: string[] = [];

  lineas.push(`*Pedido — ${local.nombre}*`);
  lineas.push('');

  for (const item of estado.items) {
    const precioLinea =
      item.precio === null ? 'a confirmar' : precioPlano(item.precio * item.cantidad);

    lineas.push(`• ${item.cantidad} x ${item.nombre} — ${precioLinea}`);

    if (item.aclaracion?.trim()) {
      lineas.push(`   ${item.aclaracion.trim()}`);
    }
  }

  lineas.push('');
  lineas.push(`*Total:* ${totalTexto()}`);
  lineas.push('');

  lineas.push(
    estado.modalidad === 'retiro'
      ? '*Entrega:* retiro en el local'
      : '*Entrega:* envío a domicilio',
  );

  if (estado.nombre.trim()) lineas.push(`*Nombre:* ${estado.nombre.trim()}`);

  if (estado.modalidad === 'delivery' && estado.direccion.trim()) {
    lineas.push(`*Dirección:* ${estado.direccion.trim()}`);
  }

  if (estado.notas.trim()) lineas.push(`*Aclaraciones:* ${estado.notas.trim()}`);

  if (!local.abierto) {
    lineas.push('');
    lineas.push(
      `_Lo mando con el local cerrado (${local.proximoHorario}). Espero la confirmación cuando abran._`,
    );
  }

  lineas.push('');
  lineas.push('_Precios informativos, confirmar al hacer el pedido._');

  return lineas.join('\n');
}

/** URL de wa.me lista para abrir. */
export function linkPedido(whatsapp: string, local: DatosLocal): string {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(armarMensaje(local))}`;
}
