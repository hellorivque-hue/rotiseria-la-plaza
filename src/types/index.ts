/**
 * Tipos del contenido editable del sitio.
 *
 * Todo lo que se edita a mano vive en `src/data/*.json`.
 * Estas interfaces son el contrato: si un JSON no cumple, `npm run build`
 * avisa antes de publicar.
 *
 * Convencion importante:
 *   `null` = dato todavia no confirmado con el local.
 *   La interfaz lo muestra como "a confirmar" en vez de inventarlo.
 */

/* -------------------------------------------------------------------------- */
/* negocio.json                                                               */
/* -------------------------------------------------------------------------- */

export type ClaveDia =
  | 'lunes'
  | 'martes'
  | 'miercoles'
  | 'jueves'
  | 'viernes'
  | 'sabado'
  | 'domingo';

/** Un turno de atencion, en horario local (24h, "HH:MM"). */
export interface Turno {
  desde: string;
  hasta: string;
}

export interface HorarioDia {
  dia: ClaveDia;
  /** Como se escribe el dia en pantalla. */
  nombre: string;
  /** Si esta cerrado todo el dia, `turnos` va vacio. */
  turnos: Turno[];
}

export interface Direccion {
  calle: string;
  localidad: string;
  partido: string;
  provincia: string;
  codigoPostal: string;
  pais: string;
  /** Como se muestra en una sola linea. */
  completa: string;
}

export interface Coordenadas {
  lat: number;
  lng: number;
  /** true = son del centro de Punta Alta, no del local. Ver PENDIENTES.md */
  aproximadas: boolean;
}

export interface Telefono {
  /** Como se lee en pantalla: "2932 54-0100" */
  visible: string;
  /** Para el href tel: "+5492932540100" */
  link: string;
  /** Solo digitos, formato wa.me: "5492932540100" */
  whatsapp: string;
}

export interface Delivery {
  propio: boolean;
  radioLimitado: boolean;
  /** Texto que se muestra en la seccion de delivery. */
  descripcion: string;
  /** null = todavia no confirmado si cobran envio. */
  costoEnvio: string | null;
  /** Lista de barrios/zonas confirmadas. Vacio = "consultanos". */
  zonas: string[];
}

export interface Negocio {
  nombre: string;
  lema: string;
  descripcionCorta: string;
  descripcionLarga: string;
  direccion: Direccion;
  coordenadas: Coordenadas;
  telefono: Telefono;
  zonaHoraria: string;
  horarios: HorarioDia[];
  horariosTexto: string;
  delivery: Delivery;
  redes: {
    instagram: { usuario: string; url: string };
  };
  /** null = todavia no confirmado. */
  mediosDePago: string[] | null;
  /** Rango de precios para SEO ("$", "$$"...). */
  rangoPrecios: string;
  /** Reputacion publica, con la fuente a la vista. */
  reputacion: {
    fuente: string;
    puntaje: number;
    cantidadOpiniones: number;
  } | null;
  /**
   * true mientras el local todavia no cargo precios y platos.
   * Muestra un aviso arriba del sitio. Poner en false al terminar la carga.
   */
  datosEnCarga: boolean;
}

/* -------------------------------------------------------------------------- */
/* menu-del-dia.json                                                          */
/* -------------------------------------------------------------------------- */

export interface MenuDia {
  dia: ClaveDia;
  nombre: string;
  /** null = todavia sin cargar. Se muestra "a confirmar". */
  principal: string | null;
  guarnicion: string | null;
  /** Frase corta opcional: "el mas pedido", "solo mediodia", etc. */
  destacado?: string | null;
  /** Precio en pesos. null = a confirmar al hacer el pedido. */
  precio?: number | null;
}

/* -------------------------------------------------------------------------- */
/* carta.json                                                                 */
/* -------------------------------------------------------------------------- */

export interface ItemCarta {
  /** Identificador estable, se usa en el carrito. No repetir. */
  id: string;
  nombre: string;
  descripcion: string | null;
  /** Precio en pesos. null = "consultar". */
  precio: number | null;
  disponible: boolean;
  recomendado: boolean;
  /** Aclaracion de unidad: "por docena", "porcion", "grande". */
  unidad?: string | null;
}

export interface CategoriaCarta {
  id: string;
  nombre: string;
  /** Bajada corta que se muestra debajo del titulo de la categoria. */
  descripcion: string | null;
  items: ItemCarta[];
}

/* -------------------------------------------------------------------------- */
/* promos.json                                                                */
/* -------------------------------------------------------------------------- */

export interface Promo {
  id: string;
  titulo: string;
  descripcion: string;
  /** Texto corto de la etiqueta: "Combo familiar", "Solo hoy". */
  etiqueta?: string | null;
  precio?: number | null;
  /** Letra chica: condiciones, dias, horarios. */
  condiciones?: string | null;
  /** true = se muestra mas grande que las demas. */
  destacada?: boolean;
}

/* -------------------------------------------------------------------------- */
/* instagram.json                                                             */
/* -------------------------------------------------------------------------- */

export interface PostInstagram {
  id: string;
  /** Ruta dentro de src/assets/instagram/ */
  imagen: string;
  /** Texto alternativo, obligatorio por accesibilidad. */
  alt: string;
  caption: string;
  /** Link al post. null = todavia sin cargar, linkea al perfil. */
  url: string | null;
}

/* -------------------------------------------------------------------------- */
/* Carrito (solo cliente)                                                     */
/* -------------------------------------------------------------------------- */

export interface ItemPedido {
  id: string;
  nombre: string;
  precio: number | null;
  cantidad: number;
  aclaracion?: string;
  /** De donde salio: menu del dia, carta o promo. */
  origen: 'menu' | 'carta' | 'promo';
}

export type ModalidadEntrega = 'delivery' | 'retiro';

export interface EstadoPedido {
  items: ItemPedido[];
  nombre: string;
  direccion: string;
  modalidad: ModalidadEntrega;
  notas: string;
}
