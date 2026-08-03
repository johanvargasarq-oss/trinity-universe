import { hashGetAll, hashSet, hashDelete } from "./redis-client";

const HASH_KEY = "trinity:bookings";

export type BookingEstado = "pendiente" | "confirmada" | "finalizada" | "cancelada";

export interface Booking {
  id: string;
  worldId: string;
  nombre: string;
  telefono: string;
  servicio: string;
  total: number;
  staff: string;
  sede: string;
  fecha: string;
  hora: string;
  estado: BookingEstado;
  creadoEn: string;
  actualizadoEn?: string;
}

export async function getAllBookings(): Promise<Booking[]> {
  return hashGetAll<Booking>(HASH_KEY);
}

export async function saveBooking(booking: Booking): Promise<void> {
  await hashSet(HASH_KEY, booking.id, booking);
}

export async function deleteBooking(id: string): Promise<void> {
  await hashDelete(HASH_KEY, id);
}
