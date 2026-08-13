"use client";

import { useEffect, useState } from "react";
import { worlds } from "@/lib/brands";
import { useRevealWorld } from "@/hooks/useRevealWorld";
import type { Property } from "@/lib/db/properties";
import WorldNav from "@/components/world/WorldNav";
import WorldContactBlock from "@/components/world/WorldContactBlock";
import PropertyCard from "@/components/rent/PropertyCard";
import PropertySearchBar, { type SearchParams } from "@/components/rent/PropertySearchBar";

const world = worlds.rent;

type SearchedProperty = Property & { stayTotal: number | null };

export default function ApartamentosPage() {
  useRevealWorld();
  const [properties, setProperties] = useState<SearchedProperty[] | null>(null);
  const [error, setError] = useState("");
  const [activeSearch, setActiveSearch] = useState<SearchParams | null>(null);
  const [loading, setLoading] = useState(false);

  function fetchProperties(search: SearchParams | null) {
    setLoading(true);
    const params = new URLSearchParams({ type: "apartment" });
    if (search) {
      params.set("checkIn", search.checkIn);
      params.set("checkOut", search.checkOut);
      params.set("adultos", String(search.adultos));
      params.set("ninos", String(search.ninos));
    }
    fetch(`/api/rent/properties/search?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) return setError(d.error);
        setProperties(d.properties.filter((p: Property) => p.type === "apartment"));
      })
      .catch(() => setError("No se pudieron cargar los apartamentos."))
      .finally(() => setLoading(false));
  }

  useEffect(() => fetchProperties(null), []);

  function handleSearch(search: SearchParams | null) {
    setActiveSearch(search);
    fetchProperties(search);
  }

  function hrefFor(id: string) {
    if (!activeSearch) return `/rent/apartamentos/${id}`;
    const p = new URLSearchParams({
      checkIn: activeSearch.checkIn,
      checkOut: activeSearch.checkOut,
      adultos: String(activeSearch.adultos),
      ninos: String(activeSearch.ninos),
    });
    return `/rent/apartamentos/${id}?${p.toString()}`;
  }

  return (
    <>
      <WorldNav world={world} />

      <section className="relative pt-32 pb-24 px-5 sm:px-10 bg-world-bg min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-3xl sm:text-4xl text-world-text mb-2 text-center">Apartamentos Trini Beach</h1>
          <p className="text-world-text-muted mb-8 text-center">16 apartamentos independientes, cada uno con su propia disponibilidad.</p>

          <PropertySearchBar onSearch={handleSearch} />

          {activeSearch && (
            <p className="text-world-text-muted text-sm text-center -mt-4 mb-8">
              Mostrando apartamentos disponibles del {activeSearch.checkIn} al {activeSearch.checkOut}
              {properties && ` — ${properties.length} de 16`}
            </p>
          )}

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {loading && <p className="text-world-text-muted text-sm">Buscando…</p>}

          {!loading && properties && properties.length === 0 && (
            <p className="text-world-text-muted text-sm text-center py-10">
              No hay apartamentos disponibles para esas fechas/huéspedes. Prueba con otras fechas.
            </p>
          )}

          {!loading && properties && properties.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p} href={hrefFor(p.id)} stayTotal={p.stayTotal} />
              ))}
            </div>
          )}
        </div>
      </section>

      <WorldContactBlock world={world} />
    </>
  );
}
