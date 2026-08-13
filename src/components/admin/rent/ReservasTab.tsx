"use client";

import { useMemo, useState } from "react";
import type { Property } from "@/lib/db/properties";
import type { Reservation, ReservationEstado } from "@/lib/db/reservations";
import { currency, ESTADO_COLOR, ESTADO_LABEL } from "./shared";
import ReservationDetailModal from "./ReservationDetailModal";

const ESTADOS: ReservationEstado[] = ["pendiente", "confirmada", "rechazada", "cancelada", "finalizada"];

export default function ReservasTab({
  reservations,
  properties,
  onUpdated,
  estadoFilterDefault,
}: {
  reservations: Reservation[];
  properties: Property[];
  onUpdated: (r: Reservation) => void;
  estadoFilterDefault?: ReservationEstado[];
}) {
  const [propertyFilter, setPropertyFilter] = useState("todas");
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [selected, setSelected] = useState<Reservation | null>(null);

  const propertyById = useMemo(() => new Map(properties.map((p) => [p.id, p])), [properties]);

  const filtered = reservations
    .filter((r) => (estadoFilterDefault ? estadoFilterDefault.includes(r.estado) : true))
    .filter((r) => propertyFilter === "todas" || r.propertyId === propertyFilter)
    .filter((r) => estadoFilter === "todos" || r.estado === estadoFilter);

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-5">
        <select value={propertyFilter} onChange={(e) => setPropertyFilter(e.target.value)} className="bg-black border border-white/15 rounded-lg px-3 py-2 text-sm text-white">
          <option value="todas">Todas las propiedades</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        {!estadoFilterDefault && (
          <select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)} className="bg-black border border-white/15 rounded-lg px-3 py-2 text-sm text-white">
            <option value="todos">Todos los estados</option>
            {ESTADOS.map((e) => (
              <option key={e} value={e}>{ESTADO_LABEL[e]}</option>
            ))}
          </select>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-white/80">
            <thead className="text-white/40 uppercase text-xs">
              <tr>
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Propiedad</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Entrada</th>
                <th className="py-3 px-4">Salida</th>
                <th className="py-3 px-4">Huéspedes</th>
                <th className="py-3 px-4">Valor</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-white/10">
                  <td className="py-2.5 px-4 font-medium">{r.codigo}</td>
                  <td className="py-2.5 px-4">{propertyById.get(r.propertyId)?.name ?? r.propertyId}</td>
                  <td className="py-2.5 px-4">{r.huesped.nombreCompleto}</td>
                  <td className="py-2.5 px-4">{r.checkIn}</td>
                  <td className="py-2.5 px-4">{r.checkOut}</td>
                  <td className="py-2.5 px-4">{r.adultos + r.ninos + r.bebes}</td>
                  <td className="py-2.5 px-4">{currency.format(r.total)}</td>
                  <td className="py-2.5 px-4">
                    <span style={{ color: ESTADO_COLOR[r.estado] }}>{ESTADO_LABEL[r.estado]}</span>
                  </td>
                  <td className="py-2.5 px-4">
                    <button onClick={() => setSelected(r)} className="text-xs underline text-white/60 hover:text-white">Ver reserva</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-white/30">No hay reservas con estos filtros.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <ReservationDetailModal
          reservation={selected}
          property={propertyById.get(selected.propertyId)}
          onClose={() => setSelected(null)}
          onUpdated={(r) => {
            onUpdated(r);
            setSelected(r);
          }}
        />
      )}
    </div>
  );
}
