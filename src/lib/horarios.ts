/**
 * Calculo de "abierto / cerrado" contra los horarios de negocio.json.
 *
 * Funciona igual en el servidor (build) y en el navegador: siempre se resuelve
 * la hora en la zona horaria de Argentina, no en la del visitante. Alguien que
 * abre el sitio desde Espana tiene que ver el mismo estado que un vecino.
 */
import type { ClaveDia, HorarioDia, Turno } from '../types';

export const ORDEN_DIAS: ClaveDia[] = [
  'domingo',
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
];

export interface EstadoApertura {
  abierto: boolean;
  /** Texto corto para el cartelito: "Abierto ahora · cierra 14:00". */
  texto: string;
  /** Frase larga, para el aviso del carrito. */
  detalle: string;
  /** Hora "HH:MM" del proximo cierre (si esta abierto) o apertura. */
  proximoCambio: string | null;
}

/** Convierte "HH:MM" a minutos desde la medianoche. */
export function aMinutos(hora: string): number {
  const [h, m] = hora.split(':');
  return Number(h) * 60 + Number(m);
}

/** Momento actual en la zona horaria del local, sin depender del reloj del visitante. */
export function ahoraEnZona(zona: string, referencia: Date = new Date()) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: zona,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const partes = Object.fromEntries(
    fmt.formatToParts(referencia).map((p) => [p.type, p.value]),
  ) as Record<string, string>;

  const mapaDias: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const indiceDia = mapaDias[partes.weekday ?? 'Sun'] ?? 0;
  // Intl puede devolver "24" a la medianoche con hour12:false.
  const hora = Number(partes.hour) % 24;
  const minuto = Number(partes.minute);

  return { indiceDia, minutos: hora * 60 + minuto };
}

function turnosDe(horarios: HorarioDia[], dia: ClaveDia): Turno[] {
  return horarios.find((h) => h.dia === dia)?.turnos ?? [];
}

function nombreDe(horarios: HorarioDia[], dia: ClaveDia): string {
  return horarios.find((h) => h.dia === dia)?.nombre ?? dia;
}

/**
 * Devuelve si el local esta abierto y que pasa despues.
 * Si no hay ningun horario cargado, se asume cerrado y se invita a consultar.
 */
export function estadoApertura(
  horarios: HorarioDia[],
  zona: string,
  referencia: Date = new Date(),
): EstadoApertura {
  const { indiceDia, minutos } = ahoraEnZona(zona, referencia);
  const hoy = ORDEN_DIAS[indiceDia]!;

  // 1. Estamos dentro de algun turno de hoy?
  for (const turno of turnosDe(horarios, hoy)) {
    if (minutos >= aMinutos(turno.desde) && minutos < aMinutos(turno.hasta)) {
      return {
        abierto: true,
        texto: `Abierto ahora · cierra ${turno.hasta}`,
        detalle: `Estamos abiertos hasta las ${turno.hasta}.`,
        proximoCambio: turno.hasta,
      };
    }
  }

  // 2. Queda algun turno mas hoy?
  const siguienteHoy = turnosDe(horarios, hoy)
    .filter((t) => aMinutos(t.desde) > minutos)
    .sort((a, b) => aMinutos(a.desde) - aMinutos(b.desde))[0];

  if (siguienteHoy) {
    return {
      abierto: false,
      texto: `Cerrado · abre hoy ${siguienteHoy.desde}`,
      detalle: `Ahora estamos cerrados. Hoy abrimos a las ${siguienteHoy.desde}.`,
      proximoCambio: siguienteHoy.desde,
    };
  }

  // 3. Buscamos el proximo dia con atencion (hasta una semana adelante).
  for (let salto = 1; salto <= 7; salto++) {
    const dia = ORDEN_DIAS[(indiceDia + salto) % 7]!;
    const turnos = [...turnosDe(horarios, dia)].sort(
      (a, b) => aMinutos(a.desde) - aMinutos(b.desde),
    );
    const primero = turnos[0];
    if (!primero) continue;

    const cuando =
      salto === 1 ? 'mañana' : `el ${nombreDe(horarios, dia).toLowerCase()}`;
    return {
      abierto: false,
      texto: `Cerrado · abre ${cuando} ${primero.desde}`,
      detalle: `Ahora estamos cerrados. Volvemos a abrir ${cuando} a las ${primero.desde}.`,
      proximoCambio: primero.desde,
    };
  }

  return {
    abierto: false,
    texto: 'Consultanos el horario',
    detalle: 'Escribinos por WhatsApp y te confirmamos el horario de atención.',
    proximoCambio: null,
  };
}

/** Clave del dia de hoy en la zona del local ("lunes", "martes"...). */
export function diaDeHoy(zona: string, referencia: Date = new Date()): ClaveDia {
  return ORDEN_DIAS[ahoraEnZona(zona, referencia).indiceDia]!;
}

/** Horarios en formato schema.org (openingHoursSpecification). */
export function horariosSchema(horarios: HorarioDia[]) {
  const mapaSchema: Record<ClaveDia, string> = {
    lunes: 'Monday',
    martes: 'Tuesday',
    miercoles: 'Wednesday',
    jueves: 'Thursday',
    viernes: 'Friday',
    sabado: 'Saturday',
    domingo: 'Sunday',
  };

  return horarios.flatMap((h) =>
    h.turnos.map((t) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${mapaSchema[h.dia]}`,
      opens: t.desde,
      closes: t.hasta,
    })),
  );
}
