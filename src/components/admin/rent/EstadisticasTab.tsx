"use client";

import { useMemo, useState } from "react";
import type { Property } from "@/lib/db/properties";
import type { Reservation } from "@/lib/db/reservations";
import { currency } from "./shared";
import StatCard from "@/components/admin/StatCard";

export default function EstadisticasTab({ reservations, properties }: { reservations: Reservation[]; properties: Property[] }) {
  const [propertyFilter, setPropertyFilter] = useState("todas");
  const [monthFilter, setMonthFilter] = useState("todos"); // YYYY-MM or "todos"

  const filtered = reservations
    .filter((r) => propertyFilter === "todas" || r.propertyId === propertyFilter)
    .filter((r) => monthFilter === "todos" || r.checkIn.slice(0, 7) === monthFilter);

  const meses = useMemo(() => {
    const set = new Set(reservations.map((r) => r.checkIn.slice(0, 7)));
    return [...set].sort().reverse();
  }, [reservations]);

  if (reservations.length === 0) {
    return <p className="text-white/30 text-sm py-10 text-center">Sin datos suficientes todavía.</p>;
  }

  const confirmadas = filtered.filter((r) => r.estado === "confirmada" || r.estado === "finalizada");
  const canceladas = filtered.filter((r) => r.estado === "cancelada" || r.estado === "rechazada");
  const ingresos = confirmadas.reduce((s, r) => s + r.total, 0);
  const promedioNoches = confirmadas.length ? confirmadas.reduce((s, r) => s + r.noches, 0) / confirmadas.length : 0;

  const porPropiedad = new Map<string, { count: number; ingresos: number }>();
  for (const r of confirmadas) {
    const cur = porPropiedad.get(r.propertyId) ?? { count: 0, ingresos: 0 };
    cur.count += 1;
    cur.ingresos += r.total;
    porPropiedad.set(r.propertyId, cur);
  }
  const propertyName = (id: string) => properties.find((p) => p.id === id)?.name ?? id;
  const masReservada = [...porPropiedad.entries()].sort((a, b) => b[1].count - a[1].count)[0];
  const mayorIngreso = [...porPropiedad.entries()].sort((a, b) => b[1].ingresos - a[1].ingresos)[0];

  const porMes = new Map<string, number>();
  for (const r of filtered) {
    const key = r.checkIn.slice(0, 7);
    porMes.set(key, (porMes.get(key) ?? 0) + 1);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={propertyFilter} onChange={(e) => setPropertyFilter(e.target.value)} className="bg-black border border-white/15 rounded-lg px-3 py-2 text-sm text-white">
          <option value="todas">Todas las propiedades</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="bg-black border border-white/15 rounded-lg px-3 py-2 text-sm text-white">
          <option value="todos">Todos los meses</option>
          {meses.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total reservas" value={String(filtered.length)} />
        <StatCard label="Confirmadas" value={String(confirmadas.length)} accent="#34d399" />
        <StatCard label="Canceladas / rechazadas" value={String(canceladas.length)} accent="#f87171" />
        <StatCard label="Ingresos" value={currency.format(ingresos)} accent="#34d399" />
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-white font-medium mb-4">Propiedad más reservada</h3>
          {masReservada ? (
            <p className="text-white/70 text-sm">{propertyName(masReservada[0])} — {masReservada[1].count} reservas</p>
          ) : (
            <p className="text-white/30 text-sm">Sin datos suficientes.</p>
          )}
          <h3 className="text-white font-medium mt-6 mb-4">Propiedad con mayor ingreso</h3>
          {mayorIngreso ? (
            <p className="text-white/70 text-sm">{propertyName(mayorIngreso[0])} — {currency.format(mayorIngreso[1].ingresos)}</p>
          ) : (
            <p className="text-white/30 text-sm">Sin datos suficientes.</p>
          )}
          <h3 className="text-white font-medium mt-6 mb-4">Promedio de noches por reserva</h3>
          <p className="text-white/70 text-sm">{promedioNoches ? promedioNoches.toFixed(1) : "Sin datos suficientes"}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-white font-medium mb-4">Reservas por mes</h3>
          {porMes.size === 0 ? (
            <p className="text-white/30 text-sm">Sin datos suficientes.</p>
          ) : (
            <div className="space-y-2">
              {[...porMes.entries()].sort().reverse().map(([mes, count]) => (
                <div key={mes} className="flex justify-between text-sm">
                  <span className="text-white/60">{mes}</span>
                  <span className="text-white font-medium">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
