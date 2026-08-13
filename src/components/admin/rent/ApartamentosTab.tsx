"use client";

import { useState } from "react";
import type { Property } from "@/lib/db/properties";
import type { Reservation } from "@/lib/db/reservations";
import { currency } from "./shared";
import PropertyEditor from "./PropertyEditor";

export default function ApartamentosTab({
  properties,
  reservations,
  onPropertyUpdated,
}: {
  properties: Property[];
  reservations: Reservation[];
  onPropertyUpdated: (p: Property) => void;
}) {
  const [editing, setEditing] = useState<Property | null>(null);
  const apartments = properties.filter((p) => p.type === "apartment").sort((a, b) => a.order - b.order);

  function nextReservation(propertyId: string): Reservation | undefined {
    const today = new Date().toISOString().slice(0, 10);
    return reservations
      .filter((r) => r.propertyId === propertyId && r.estado === "confirmada" && r.checkIn >= today)
      .sort((a, b) => (a.checkIn < b.checkIn ? -1 : 1))[0];
  }

  if (editing) {
    return (
      <div>
        <button onClick={() => setEditing(null)} className="text-xs text-white/60 hover:text-white underline mb-6">← Volver a apartamentos</button>
        <h3 className="font-display text-xl text-white mb-6">{editing.name}</h3>
        <PropertyEditor
          property={editing}
          onSaved={(p) => {
            onPropertyUpdated(p);
            setEditing(p);
          }}
        />
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {apartments.map((p) => {
        const next = nextReservation(p.id);
        return (
          <div key={p.id} className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
            <div className="relative aspect-video">
              {p.media.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.media.images[0].url} alt={p.media.images[0].alt} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/5" />
              )}
            </div>
            <div className="p-4">
              <div className="text-white font-medium">{p.name}</div>
              <div className="text-white/50 text-xs mt-0.5">{currency.format(p.pricing.basePrice)} / noche</div>
              <div className="text-white/40 text-xs mt-1">Capacidad: {p.capacity.maxGuests}</div>
              <div className="text-xs mt-1" style={{ color: p.status === "activa" ? "#34d399" : "#9ca3af" }}>
                {p.status === "activa" ? "Activa" : "Inactiva"}
              </div>
              {next && <div className="text-white/40 text-xs mt-1">Próxima reserva: {next.checkIn}</div>}
              <button
                onClick={() => setEditing(p)}
                className="w-full mt-3 rounded-full border border-white/15 text-white text-xs py-2 hover:bg-white/10"
              >
                Administrar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
