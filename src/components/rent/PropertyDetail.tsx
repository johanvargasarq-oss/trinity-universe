"use client";

import { worlds } from "@/lib/brands";
import type { Property } from "@/lib/db/properties";
import WorldGallery from "@/components/world/WorldGallery";
import WorldContactBlock from "@/components/world/WorldContactBlock";
import PropertyHero from "./PropertyHero";
import PropertyAmenities from "./PropertyAmenities";
import ReservationFlow from "./ReservationFlow";

const world = worlds.rent;

export default function PropertyDetail({ property }: { property: Property }) {
  return (
    <>
      <PropertyHero property={property} />

      <section className="relative py-16 px-5 sm:px-10 bg-world-bg">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl text-world-text mb-4">Descripción</h2>
          <p className="text-world-text-muted leading-relaxed">{property.description}</p>
        </div>
      </section>

      <WorldGallery
        world={world}
        items={property.media.images.map((img) => ({ src: img.url, alt: img.alt }))}
        title="Galería"
      />

      {property.media.videos.length > 0 && (
        <section className="relative py-16 px-5 sm:px-10 bg-world-bg-alt">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="font-display text-2xl sm:text-3xl text-world-text mb-2">Video</h2>
            {property.media.videos.map((v) => (
              <video key={v.url} className="w-full rounded-2xl" src={v.url} controls />
            ))}
          </div>
        </section>
      )}

      <PropertyAmenities property={property} />

      <section className="relative py-16 px-5 sm:px-10 bg-world-bg">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl text-world-text mb-4">Ubicación</h2>
          <p className="text-world-text-muted mb-4">{property.location.address}</p>
          {property.location.mapsUrl && (
            <a
              href={property.location.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium"
              style={{ color: world.theme.accent }}
            >
              Ver en Google Maps →
            </a>
          )}
        </div>
      </section>

      <ReservationFlow property={property} />

      <WorldContactBlock world={world} />
    </>
  );
}
