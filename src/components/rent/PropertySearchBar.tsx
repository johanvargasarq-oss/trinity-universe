"use client";

import { useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { worlds } from "@/lib/brands";

const world = worlds.rent;

function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function formatShort(d: Date): string {
  return d.toLocaleDateString("es-CO", { weekday: "short", day: "numeric", month: "short" });
}

export interface SearchParams {
  checkIn: string;
  checkOut: string;
  adultos: number;
  ninos: number;
}

export default function PropertySearchBar({ onSearch }: { onSearch: (params: SearchParams | null) => void }) {
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [adultos, setAdultos] = useState(2);
  const [ninos, setNinos] = useState(0);
  const [openPanel, setOpenPanel] = useState<"fechas" | "huespedes" | null>(null);

  function buscar() {
    setOpenPanel(null);
    if (range?.from && range?.to) {
      onSearch({ checkIn: toISO(range.from), checkOut: toISO(range.to), adultos, ninos });
    } else {
      onSearch(null);
    }
  }

  function limpiar() {
    setRange(undefined);
    setOpenPanel(null);
    onSearch(null);
  }

  const fechasLabel = range?.from && range?.to ? `${formatShort(range.from)} — ${formatShort(range.to)}` : "Selecciona fechas (opcional)";
  const huespedesLabel = `${adultos} adulto${adultos !== 1 ? "s" : ""}${ninos ? ` · ${ninos} niño${ninos !== 1 ? "s" : ""}` : ""}`;

  return (
    <div className="relative max-w-3xl mx-auto mb-10">
      <div
        className="flex flex-col sm:flex-row rounded-2xl sm:rounded-full border overflow-visible"
        style={{ borderColor: world.theme.accent, background: world.theme.bgAlt }}
      >
        <button
          onClick={() => setOpenPanel(openPanel === "fechas" ? null : "fechas")}
          className="flex-1 text-left px-5 py-3.5 border-b sm:border-b-0 sm:border-r"
          style={{ borderColor: world.theme.border }}
        >
          <div className="text-[10px] uppercase tracking-wide text-world-text-muted">📅 Fechas</div>
          <div className="text-sm text-world-text">{fechasLabel}</div>
        </button>
        <button
          onClick={() => setOpenPanel(openPanel === "huespedes" ? null : "huespedes")}
          className="flex-1 text-left px-5 py-3.5"
        >
          <div className="text-[10px] uppercase tracking-wide text-world-text-muted">👤 Huéspedes</div>
          <div className="text-sm text-world-text">{huespedesLabel}</div>
        </button>
        <button
          onClick={buscar}
          className="m-1.5 rounded-full px-8 py-2.5 font-medium sm:self-center"
          style={{ background: world.theme.accent, color: "#0a0a0a" }}
        >
          Buscar
        </button>
      </div>

      {openPanel === "fechas" && (
        <div className="absolute z-30 mt-2 rounded-2xl border p-3 max-w-[95vw] overflow-x-auto" style={{ borderColor: world.theme.border, background: world.theme.bg }}>
          <DayPicker
            mode="range"
            numberOfMonths={2}
            selected={range}
            onSelect={setRange}
            disabled={{ before: new Date() }}
            style={{ "--rdp-accent-color": world.theme.accent, "--rdp-accent-background-color": world.theme.accentSoft } as React.CSSProperties}
            className="w-fit"
          />
          <div className="flex justify-between px-2 pb-2">
            <button onClick={limpiar} className="text-xs text-world-text-muted underline">Limpiar</button>
            <button onClick={() => setOpenPanel(null)} className="text-xs" style={{ color: world.theme.accent }}>Listo</button>
          </div>
        </div>
      )}

      {openPanel === "huespedes" && (
        <div className="absolute z-30 right-0 mt-2 rounded-2xl border p-4 w-64" style={{ borderColor: world.theme.border, background: world.theme.bg }}>
          {[
            { label: "Adultos", value: adultos, set: setAdultos, min: 1 },
            { label: "Niños", value: ninos, set: setNinos, min: 0 },
          ].map((g) => (
            <div key={g.label} className="flex items-center justify-between py-2">
              <span className="text-sm text-world-text">{g.label}</span>
              <div className="flex items-center gap-3">
                <button onClick={() => g.set(Math.max(g.min, g.value - 1))} className="w-7 h-7 rounded-full border" style={{ borderColor: world.theme.border, color: "var(--world-text)" }}>−</button>
                <span className="w-4 text-center text-sm text-world-text">{g.value}</span>
                <button onClick={() => g.set(g.value + 1)} className="w-7 h-7 rounded-full border" style={{ borderColor: world.theme.border, color: "var(--world-text)" }}>+</button>
              </div>
            </div>
          ))}
          <button onClick={() => setOpenPanel(null)} className="mt-2 w-full text-xs" style={{ color: world.theme.accent }}>Listo</button>
        </div>
      )}
    </div>
  );
}
