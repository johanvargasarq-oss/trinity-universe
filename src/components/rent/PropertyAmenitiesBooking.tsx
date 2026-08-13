"use client";

import type { Property } from "@/lib/db/properties";
import { worlds } from "@/lib/brands";

const world = worlds.rent;

// Best-effort categorization by keyword — amenities stay a simple editable
// text list in the CMS (PropertyEditor), this just groups them for display.
const CATEGORIES: { label: string; icon: string; match: RegExp }[] = [
  { label: "Ideal para tu estancia", icon: "🛎️", match: /mascota|aire|parking|parqueadero|wifi|tv|cocina|lavador|terraza|vista|balc[oó]n|seguridad/i },
  { label: "Cocina", icon: "🍳", match: /cocina|nevera|lavador|microondas/i },
  { label: "Exteriores", icon: "🌴", match: /piscina|terraza|jard[ií]n|bbq|vista|balc[oó]n/i },
  { label: "Zonas comunes", icon: "🛋️", match: /zona|social|sal[oó]n|comun/i },
];

const ICON_BY_WORD: Record<string, string> = {
  wifi: "📶",
  piscina: "🏊",
  parqueadero: "🅿️",
  parking: "🅿️",
  aire: "❄️",
  cocina: "🍳",
  vista: "🌅",
  "balc[oó]n": "🌇",
  seguridad: "🛡️",
  tv: "📺",
  terraza: "🌴",
  bbq: "🍖",
};

function iconFor(amenity: string): string {
  const lower = amenity.toLowerCase();
  for (const [word, icon] of Object.entries(ICON_BY_WORD)) {
    if (new RegExp(word, "i").test(lower)) return icon;
  }
  return "✔️";
}

export default function PropertyAmenitiesBooking({ property }: { property: Property }) {
  const amenities = property.amenities;
  const popular = amenities.slice(0, 5);

  const grouped = new Map<string, string[]>();
  for (const a of amenities) {
    const cat = CATEGORIES.find((c) => c.match.test(a));
    const label = cat?.label ?? "Otros";
    if (!grouped.has(label)) grouped.set(label, []);
    grouped.get(label)!.push(a);
  }

  return (
    <section className="relative py-16 px-5 sm:px-10 bg-world-bg-alt">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-2xl sm:text-3xl text-world-text mb-6">Servicios y características</h2>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border p-4 text-center" style={{ borderColor: world.theme.border, background: world.theme.bg }}>
            <div className="font-display text-xl text-world-text">{property.capacity.maxGuests}</div>
            <div className="text-world-text-muted text-xs mt-1">Huéspedes máx.</div>
          </div>
          <div className="rounded-xl border p-4 text-center" style={{ borderColor: world.theme.border, background: world.theme.bg }}>
            <div className="font-display text-xl text-world-text">{property.rooms.bedrooms} hab · {property.rooms.beds} camas</div>
            <div className="text-world-text-muted text-xs mt-1">Habitaciones</div>
          </div>
          <div className="rounded-xl border p-4 text-center" style={{ borderColor: world.theme.border, background: world.theme.bg }}>
            <div className="font-display text-xl text-world-text">{property.rooms.bathrooms}</div>
            <div className="text-world-text-muted text-xs mt-1">Baños</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-10 pb-8 border-b" style={{ borderColor: world.theme.border }}>
          {popular.map((a) => (
            <span key={a} className="inline-flex items-center gap-2 text-sm text-world-text-muted">
              <span>{iconFor(a)}</span> {a}
            </span>
          ))}
        </div>

        <div className="grid sm:grid-cols-3 gap-x-8 gap-y-6">
          {[...grouped.entries()].map(([label, items]) => (
            <div key={label}>
              <h3 className="text-world-text font-medium text-sm mb-3">{label}</h3>
              <ul className="space-y-2">
                {items.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm text-world-text-muted">
                    <span>{iconFor(a)}</span> {a}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
