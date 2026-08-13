"use client";

import { useEffect, useState } from "react";
import { worlds } from "@/lib/brands";
import { useRevealWorld } from "@/hooks/useRevealWorld";
import type { Property } from "@/lib/db/properties";
import WorldNav from "@/components/world/WorldNav";
import WorldContactBlock from "@/components/world/WorldContactBlock";
import PropertyCard from "@/components/rent/PropertyCard";

const world = worlds.rent;

export default function ApartamentosPage() {
  useRevealWorld();
  const [properties, setProperties] = useState<Property[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/rent/properties")
      .then((r) => r.json())
      .then((d) => (d.error ? setError(d.error) : setProperties(d.properties.filter((p: Property) => p.type === "apartment"))))
      .catch(() => setError("No se pudieron cargar los apartamentos."));
  }, []);

  return (
    <>
      <WorldNav world={world} />

      <section className="relative pt-32 pb-24 px-5 sm:px-10 bg-world-bg min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-3xl sm:text-4xl text-world-text mb-2">Apartamentos Trini Beach</h1>
          <p className="text-world-text-muted mb-12">16 apartamentos independientes, cada uno con su propia disponibilidad.</p>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {!properties && !error && <p className="text-world-text-muted text-sm">Cargando…</p>}

          {properties && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p} href={`/rent/apartamentos/${p.id}`} />
              ))}
            </div>
          )}
        </div>
      </section>

      <WorldContactBlock world={world} />
    </>
  );
}
