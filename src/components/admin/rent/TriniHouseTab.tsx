"use client";

import type { Property } from "@/lib/db/properties";
import PropertyEditor from "./PropertyEditor";

export default function TriniHouseTab({ property, onSaved }: { property: Property | undefined; onSaved: (p: Property) => void }) {
  if (!property) {
    return <p className="text-white/30 text-sm py-10 text-center">Trini House no está sembrada todavía.</p>;
  }
  return (
    <div>
      <h3 className="font-display text-xl text-white mb-6">{property.name}</h3>
      <PropertyEditor property={property} onSaved={onSaved} />
    </div>
  );
}
