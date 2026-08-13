"use client";

import type { Property } from "@/lib/db/properties";
import { worlds } from "@/lib/brands";

const world = worlds.rent;

export default function PropertyAmenities({ property }: { property: Property }) {
  return (
    <section className="relative py-16 px-5 sm:px-10 bg-world-bg">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-2xl sm:text-3xl text-world-text mb-8">Servicios y características</h2>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="rounded-xl border p-4 text-center" style={{ borderColor: world.theme.border, background: world.theme.bgAlt }}>
            <div className="font-display text-xl text-world-text">{property.capacity.maxGuests}</div>
            <div className="text-world-text-muted text-xs mt-1">Huéspedes máx.</div>
          </div>
          <div className="rounded-xl border p-4 text-center" style={{ borderColor: world.theme.border, background: world.theme.bgAlt }}>
            <div className="font-display text-xl text-world-text">
              {property.rooms.bedrooms} hab · {property.rooms.beds} camas
            </div>
            <div className="text-world-text-muted text-xs mt-1">Habitaciones</div>
          </div>
          <div className="rounded-xl border p-4 text-center" style={{ borderColor: world.theme.border, background: world.theme.bgAlt }}>
            <div className="font-display text-xl text-world-text">{property.rooms.bathrooms}</div>
            <div className="text-world-text-muted text-xs mt-1">Baños</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {property.amenities.map((a) => (
            <span
              key={a}
              className="rounded-full border px-4 py-2 text-sm text-world-text-muted"
              style={{ borderColor: world.theme.border, background: world.theme.bgAlt }}
            >
              {a}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
