"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import StatCard from "@/components/admin/StatCard";
import { adminFetch } from "@/lib/admin-auth-client";
import type { Booking, BookingEstado } from "@/lib/db/bookings";

const ESTADO_COLOR: Record<BookingEstado, string> = {
  pendiente: "#fbbf24",
  confirmada: "#60a5fa",
  finalizada: "#34d399",
  cancelada: "#f87171",
};

export default function BarberiaAdminPage() {
  return (
    <AdminShell>
      <BarberiaBody />
    </AdminShell>
  );
}

// Rendered only once AdminShell confirms the admin is authenticated.
function BarberiaBody() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState("");

  function load() {
    adminFetch("/api/bookings/admin")
      .then((res) => res.json())
      .then((d) => (d.error ? setError(d.error) : setBookings(d.bookings)))
      .catch(() => setError("No se pudo cargar."));
  }

  useEffect(load, []);

  async function cambiarEstado(id: string, estado: BookingEstado) {
    await adminFetch("/api/bookings/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, accion: "cambiarEstado", estado }),
    });
    load();
  }

  const barberiaBookings = bookings?.filter((b) => b.worldId === "barberia") ?? [];
  const today = new Date().toISOString().slice(0, 10);
  const hoy = barberiaBookings.filter((b) => b.fecha === today);
  const pendientes = hoy.filter((b) => b.estado === "pendiente" || b.estado === "confirmada");
  const finalizadas = hoy.filter((b) => b.estado === "finalizada");
  const canceladas = hoy.filter((b) => b.estado === "cancelada");

  const porBarbero = new Map<string, number>();
  for (const b of barberiaBookings) {
    if (b.estado === "cancelada") continue;
    porBarbero.set(b.staff, (porBarbero.get(b.staff) ?? 0) + 1);
  }

  return (
      <div className="px-5 sm:px-8 py-8 max-w-6xl">
        <h1 className="font-display text-2xl text-white mb-1">✂️ Trinity Barbería</h1>
        <p className="text-white/40 text-sm mb-8">Reservas y actividad de hoy</p>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {bookings && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              <StatCard label="Reservas hoy" value={String(hoy.length)} accent="#60a5fa" />
              <StatCard label="Pendientes" value={String(pendientes.length)} accent="#fbbf24" />
              <StatCard label="Finalizadas" value={String(finalizadas.length)} accent="#34d399" />
              <StatCard label="Canceladas" value={String(canceladas.length)} accent="#f87171" />
            </div>

            <div className="grid lg:grid-cols-[1fr_260px] gap-6">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-white/80">
                    <thead className="text-white/40 uppercase text-xs">
                      <tr>
                        <th className="py-3 px-4">Cliente</th>
                        <th className="py-3 px-4">Servicio</th>
                        <th className="py-3 px-4">Barbero</th>
                        <th className="py-3 px-4">Sede</th>
                        <th className="py-3 px-4">Fecha</th>
                        <th className="py-3 px-4">Hora</th>
                        <th className="py-3 px-4">Estado</th>
                        <th className="py-3 px-4">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {barberiaBookings.map((b) => (
                        <tr key={b.id} className="border-t border-white/10">
                          <td className="py-2.5 px-4">
                            {b.nombre}
                            <div className="text-white/40 text-xs">{b.telefono}</div>
                          </td>
                          <td className="py-2.5 px-4">{b.servicio}</td>
                          <td className="py-2.5 px-4">{b.staff}</td>
                          <td className="py-2.5 px-4">{b.sede}</td>
                          <td className="py-2.5 px-4">{b.fecha}</td>
                          <td className="py-2.5 px-4">{b.hora}</td>
                          <td className="py-2.5 px-4">
                            <span style={{ color: ESTADO_COLOR[b.estado] }}>{b.estado}</span>
                          </td>
                          <td className="py-2.5 px-4">
                            <select
                              value={b.estado}
                              onChange={(e) => cambiarEstado(b.id, e.target.value as BookingEstado)}
                              className="bg-black border border-white/20 rounded px-2 py-1 text-xs"
                            >
                              <option value="pendiente">Pendiente</option>
                              <option value="confirmada">Confirmada</option>
                              <option value="finalizada">Finalizada</option>
                              <option value="cancelada">Cancelada</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {barberiaBookings.length === 0 && (
                        <tr>
                          <td colSpan={8} className="py-10 text-center text-white/30">
                            No hay reservas todavía.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 h-fit">
                <h2 className="text-white font-medium mb-4">Barberos</h2>
                {[...porBarbero.entries()].length === 0 ? (
                  <p className="text-white/30 text-sm">Sin datos todavía.</p>
                ) : (
                  <div className="space-y-3">
                    {[...porBarbero.entries()]
                      .sort((a, b) => b[1] - a[1])
                      .map(([staff, count]) => (
                        <div key={staff} className="flex items-center justify-between text-sm">
                          <span className="text-white/60">{staff}</span>
                          <span className="text-white font-medium">{count} citas</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
  );
}
