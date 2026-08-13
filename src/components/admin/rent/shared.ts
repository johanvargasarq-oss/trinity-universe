import type { ReservationEstado } from "@/lib/db/reservations";

export const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export const ESTADO_COLOR: Record<ReservationEstado, string> = {
  pendiente: "#fbbf24",
  confirmada: "#34d399",
  rechazada: "#f87171",
  cancelada: "#9ca3af",
  finalizada: "#60a5fa",
};

export const ESTADO_LABEL: Record<ReservationEstado, string> = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  rechazada: "Rechazada",
  cancelada: "Cancelada",
  finalizada: "Finalizada",
};
