"use client";

import { useMemo, useState } from "react";
import type { Property } from "@/lib/db/properties";
import type { Reservation } from "@/lib/db/reservations";

type DayStatus = "disponible" | "reservado" | "bloqueado" | "pendiente";

const STATUS_COLOR: Record<DayStatus, string> = {
  disponible: "#16351f",
  reservado: "#7f1d1d",
  bloqueado: "#3f3f46",
  pendiente: "#78350f",
};
const STATUS_LABEL: Record<DayStatus, string> = {
  disponible: "Disponible",
  reservado: "Reservado",
  bloqueado: "Bloqueado",
  pendiente: "Pendiente",
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function CalendarioTab({ properties, reservations }: { properties: Property[]; reservations: Reservation[] }) {
  const [monthCursor, setMonthCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [propertyFilter, setPropertyFilter] = useState("todas");
  const [tooltip, setTooltip] = useState<{ propertyId: string; date: string; status: DayStatus; detail?: string } | null>(null);

  const daysInMonth = new Date(monthCursor.year, monthCursor.month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => `${monthCursor.year}-${pad(monthCursor.month + 1)}-${pad(i + 1)}`);

  const visibleProperties = propertyFilter === "todas" ? properties : properties.filter((p) => p.id === propertyFilter);

  function statusFor(propertyId: string, date: string): { status: DayStatus; detail?: string } {
    const confirmed = reservations.find(
      (r) => r.propertyId === propertyId && r.estado === "confirmada" && date >= r.checkIn && date < r.checkOut
    );
    if (confirmed) return { status: "reservado", detail: `${confirmed.codigo} · ${confirmed.huesped.nombreCompleto}` };
    const pending = reservations.find(
      (r) => r.propertyId === propertyId && r.estado === "pendiente" && date >= r.checkIn && date < r.checkOut
    );
    if (pending) return { status: "pendiente", detail: `${pending.codigo} · ${pending.huesped.nombreCompleto}` };
    const property = properties.find((p) => p.id === propertyId);
    const blocked = property?.blockedRanges.find((b) => date >= b.from && date < b.to);
    if (blocked) return { status: "bloqueado", detail: blocked.reason || "Bloqueo manual" };
    return { status: "disponible" };
  }

  const monthLabel = useMemo(
    () => new Date(monthCursor.year, monthCursor.month, 1).toLocaleDateString("es-CO", { month: "long", year: "numeric" }),
    [monthCursor]
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <select value={propertyFilter} onChange={(e) => setPropertyFilter(e.target.value)} className="bg-black border border-white/15 rounded-lg px-3 py-2 text-sm text-white">
          <option value="todas">Todas las propiedades</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setMonthCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }))}
            className="w-8 h-8 rounded-full border border-white/15 text-white/60"
          >
            ‹
          </button>
          <span className="text-white capitalize text-sm w-36 text-center">{monthLabel}</span>
          <button
            onClick={() => setMonthCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }))}
            className="w-8 h-8 rounded-full border border-white/15 text-white/60"
          >
            ›
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-4 text-xs">
        {(Object.keys(STATUS_LABEL) as DayStatus[]).map((s) => (
          <div key={s} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ background: STATUS_COLOR[s] }} />
            <span className="text-white/50">{STATUS_LABEL[s]}</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-auto max-h-[70vh]">
        <table className="text-xs text-left border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 bg-[#0a0a0a] py-2 px-3 text-white/50 z-10">Propiedad</th>
              {days.map((d) => (
                <th key={d} className="py-2 px-1 text-white/40 font-normal text-center w-8">{d.slice(-2)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleProperties.map((p) => (
              <tr key={p.id} className="border-t border-white/5">
                <td className="sticky left-0 bg-[#0a0a0a] py-1.5 px-3 text-white whitespace-nowrap z-10">{p.name}</td>
                {days.map((d) => {
                  const { status, detail } = statusFor(p.id, d);
                  return (
                    <td key={d} className="p-0.5">
                      <button
                        onClick={() => setTooltip({ propertyId: p.id, date: d, status, detail })}
                        className="w-7 h-7 rounded-sm block"
                        style={{ background: STATUS_COLOR[status] }}
                        title={`${p.name} — ${d} — ${STATUS_LABEL[status]}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tooltip && (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm">
          <div className="text-white font-medium mb-1">{properties.find((p) => p.id === tooltip.propertyId)?.name} — {tooltip.date}</div>
          <div style={{ color: STATUS_COLOR[tooltip.status] }}>{STATUS_LABEL[tooltip.status]}</div>
          {tooltip.detail && <div className="text-white/50 mt-1">{tooltip.detail}</div>}
        </div>
      )}
    </div>
  );
}
