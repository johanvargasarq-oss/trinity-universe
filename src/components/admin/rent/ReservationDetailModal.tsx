"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/admin-auth-client";
import type { Property } from "@/lib/db/properties";
import type { Reservation, ReservationEstado } from "@/lib/db/reservations";
import { currency, ESTADO_COLOR, ESTADO_LABEL } from "./shared";

export default function ReservationDetailModal({
  reservation,
  property,
  onClose,
  onUpdated,
}: {
  reservation: Reservation;
  property: Property | undefined;
  onClose: () => void;
  onUpdated: (r: Reservation) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function cambiarEstado(estado: ReservationEstado) {
    setBusy(true);
    setError("");
    try {
      const res = await adminFetch("/api/admin/rent/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: reservation.id, accion: "cambiarEstado", estado }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "No se pudo actualizar.");
        return;
      }
      onUpdated(data.reservation);
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setBusy(false);
    }
  }

  const row = (label: string, value: React.ReactNode) => (
    <div className="flex justify-between py-1.5 text-sm border-b border-white/5">
      <span className="text-white/50">{label}</span>
      <span className="text-white text-right">{value}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <div
        className="bg-[#0a0a0a] border border-white/10 rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg text-white">{reservation.codigo}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none">×</button>
        </div>

        <span
          className="inline-block rounded-full px-3 py-1 text-xs mb-4"
          style={{ color: ESTADO_COLOR[reservation.estado], background: `${ESTADO_COLOR[reservation.estado]}22` }}
        >
          {ESTADO_LABEL[reservation.estado]}
        </span>

        <div className="space-y-0">
          {row("Propiedad", property?.name ?? reservation.propertyId)}
          {row("Huésped", reservation.huesped.nombreCompleto)}
          {row("Documento", `${reservation.huesped.tipoDocumento} ${reservation.huesped.numeroDocumento}`)}
          {row("Correo", reservation.huesped.correo)}
          {row("WhatsApp", reservation.huesped.celular)}
          {row("País", reservation.huesped.pais)}
          {row("Entrada", reservation.checkIn)}
          {row("Salida", reservation.checkOut)}
          {row("Noches", reservation.noches)}
          {row("Adultos", reservation.adultos)}
          {row("Niños", reservation.ninos)}
          {reservation.bebes > 0 && row("Bebés", reservation.bebes)}
          {reservation.horaLlegadaEstimada && row("Llegada estimada", reservation.horaLlegadaEstimada)}
          {row("Precio / noche", currency.format(reservation.precioPorNoche))}
          {row("Total", currency.format(reservation.total))}
          {row("Solicitada", new Date(reservation.creadoEn).toLocaleString("es-CO"))}
          {row("Email notificación", reservation.notificacion.email)}
          {row("WhatsApp notificación", reservation.notificacion.whatsapp)}
        </div>
        {reservation.notificacion.error && (
          <p className="text-amber-400 text-xs mt-2">⚠ {reservation.notificacion.error}</p>
        )}
        {reservation.comentarios && (
          <p className="text-white/60 text-sm mt-3">📝 {reservation.comentarios}</p>
        )}

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

        <div className="flex flex-wrap gap-2 mt-6">
          {reservation.estado === "pendiente" && (
            <>
              <button disabled={busy} onClick={() => cambiarEstado("confirmada")} className="rounded-full px-5 py-2 text-sm font-medium bg-emerald-500 text-black disabled:opacity-50">
                Aprobar reserva
              </button>
              <button disabled={busy} onClick={() => cambiarEstado("rechazada")} className="rounded-full px-5 py-2 text-sm font-medium bg-red-500/20 text-red-300 disabled:opacity-50">
                Rechazar
              </button>
            </>
          )}
          {reservation.estado === "confirmada" && (
            <>
              <button disabled={busy} onClick={() => cambiarEstado("finalizada")} className="rounded-full px-5 py-2 text-sm font-medium bg-blue-500/20 text-blue-300 disabled:opacity-50">
                Marcar finalizada
              </button>
              <button disabled={busy} onClick={() => cambiarEstado("cancelada")} className="rounded-full px-5 py-2 text-sm font-medium bg-white/10 text-white/70 disabled:opacity-50">
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
