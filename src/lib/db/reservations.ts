import { hashGetAll, hashSet, hashDelete } from "./redis-client";
import { rangesOverlap } from "./properties";

const HASH_KEY = "trinity:rent-reservations";

export type ReservationEstado = "pendiente" | "confirmada" | "rechazada" | "cancelada" | "finalizada";
export type NotificationStatus = "pendiente" | "enviando" | "enviado" | "error";

export interface ReservationGuest {
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  correo: string;
  celular: string;
  pais: string;
}

export interface Reservation {
  id: string;
  codigo: string; // "TRI-BEACH-00001"
  propertyId: string;
  huesped: ReservationGuest;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  noches: number;
  adultos: number;
  ninos: number;
  bebes: number;
  horaLlegadaEstimada?: string;
  comentarios?: string;
  precioPorNoche: number;
  subtotal: number;
  cargosAdicionales: number;
  total: number;
  estado: ReservationEstado;
  aceptaTerminos: boolean;
  aceptaTratamientoDatos: boolean;
  notificacion: { email: NotificationStatus; whatsapp: NotificationStatus; error?: string };
  creadoEn: string;
  actualizadoEn?: string;
}

export async function getAllReservations(): Promise<Reservation[]> {
  return hashGetAll<Reservation>(HASH_KEY);
}

export async function saveReservation(reservation: Reservation): Promise<void> {
  await hashSet(HASH_KEY, reservation.id, reservation);
}

export async function deleteReservation(id: string): Promise<void> {
  await hashDelete(HASH_KEY, id);
}

export async function nextReservationCode(): Promise<string> {
  const all = await getAllReservations();
  const n = all.length + 1;
  return `TRI-BEACH-${String(n).padStart(5, "0")}`;
}

/** True when [checkIn, checkOut) is free for propertyId — no confirmed reservation and no manual block overlap. */
export async function isRangeAvailable(
  propertyId: string,
  checkIn: string,
  checkOut: string,
  blockedRanges: { from: string; to: string }[],
  excludeReservationId?: string
): Promise<boolean> {
  const all = await getAllReservations();
  const conflictingReservation = all.some(
    (r) =>
      r.id !== excludeReservationId &&
      r.propertyId === propertyId &&
      r.estado === "confirmada" &&
      rangesOverlap(r.checkIn, r.checkOut, checkIn, checkOut)
  );
  if (conflictingReservation) return false;
  const conflictingBlock = blockedRanges.some((b) => rangesOverlap(b.from, b.to, checkIn, checkOut));
  return !conflictingBlock;
}

/** Occupied ranges for a property's calendar: confirmed reservations + manual blocks, tagged by source. */
export async function getOccupiedRanges(
  propertyId: string,
  blockedRanges: { from: string; to: string; reason?: string }[]
): Promise<{ from: string; to: string; source: "reserva" | "bloqueo" }[]> {
  const all = await getAllReservations();
  const reserved = all
    .filter((r) => r.propertyId === propertyId && r.estado === "confirmada")
    .map((r) => ({ from: r.checkIn, to: r.checkOut, source: "reserva" as const }));
  const blocked = blockedRanges.map((b) => ({ from: b.from, to: b.to, source: "bloqueo" as const }));
  return [...reserved, ...blocked];
}
