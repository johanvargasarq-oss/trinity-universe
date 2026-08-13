"use client";

import { useEffect, useState } from "react";
import { worlds } from "@/lib/brands";
import { useRevealWorld } from "@/hooks/useRevealWorld";
import type { Property } from "@/lib/db/properties";
import WorldNav from "@/components/world/WorldNav";
import PropertyDetail from "@/components/rent/PropertyDetail";

const world = worlds.rent;

export default function TriniHousePage() {
  useRevealWorld();
  const [property, setProperty] = useState<Property | null | undefined>(undefined);

  useEffect(() => {
    fetch(`/api/rent/properties/trini-house`)
      .then((r) => r.json())
      .then((d) => setProperty(d.error ? null : d.property))
      .catch(() => setProperty(null));
  }, []);

  return (
    <>
      <WorldNav world={world} />
      {property === undefined && (
        <div className="min-h-screen flex items-center justify-center bg-world-bg text-world-text-muted text-sm">Cargando…</div>
      )}
      {property === null && (
        <div className="min-h-screen flex items-center justify-center bg-world-bg text-world-text-muted text-sm">
          No encontramos Trini House. Es posible que aún no se hayan cargado las propiedades.
        </div>
      )}
      {property && <PropertyDetail property={property} />}
    </>
  );
}
