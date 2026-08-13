"use client";

import { useState } from "react";
import type { Property } from "@/lib/db/properties";
import { worlds } from "@/lib/brands";

const world = worlds.rent;

export default function PropertyGalleryBooking({ property }: { property: Property }) {
  const images = property.media.images;
  const [lightbox, setLightbox] = useState<number | null>(null);
  const visibleThumbs = images.slice(1, 5);
  const extraCount = images.length - 5;

  return (
    <section className="relative pt-8 pb-16 px-5 sm:px-10 bg-world-bg">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl text-world-text">{property.name}</h1>
            <p className="text-world-text-muted text-sm mt-1">{property.location.address}</p>
          </div>
          <a
            href="#reservar"
            className="rounded-full px-6 py-3 font-medium text-sm whitespace-nowrap"
            style={{ background: world.theme.accent, color: "#0a0a0a" }}
          >
            Reserva tu {property.type === "house" ? "casa" : "apartamento"}
          </a>
        </div>

        <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
          {/* Photo grid */}
          <div className="grid grid-cols-2 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-[280px] sm:h-[400px]">
            <button className="relative row-span-2 col-span-1" onClick={() => images[0] && setLightbox(0)}>
              {images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={images[0].url} alt={images[0].alt} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full" style={{ background: world.theme.bgAlt }} />
              )}
            </button>
            {visibleThumbs.map((img, i) => (
              <button key={img.url + i} className="relative" onClick={() => setLightbox(i + 1)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                {i === visibleThumbs.length - 1 && extraCount > 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-medium">
                    +{extraCount} fotos más
                  </div>
                )}
              </button>
            ))}
            {Array.from({ length: Math.max(0, 4 - visibleThumbs.length) }).map((_, i) => (
              <div key={`empty-${i}`} style={{ background: world.theme.bgAlt }} />
            ))}
          </div>

          {/* Map card */}
          <div className="rounded-2xl overflow-hidden border flex flex-col" style={{ borderColor: world.theme.border }}>
            <div className="flex-1 min-h-[140px]">
              <iframe
                title={`Mapa ${property.name}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(property.location.address)}&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="p-4" style={{ background: world.theme.bgAlt }}>
              <div className="text-world-text-muted text-xs mb-2">{property.location.address}</div>
              {property.location.mapsUrl && (
                <a href={property.location.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium" style={{ color: world.theme.accent }}>
                  Ver ubicación exacta →
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {lightbox !== null && images[lightbox] && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-6" onClick={() => setLightbox(null)}>
          <button className="absolute top-5 right-5 text-white text-2xl" onClick={() => setLightbox(null)}>×</button>
          {lightbox > 0 && (
            <button
              className="absolute left-5 text-white text-3xl"
              onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i !== null ? i - 1 : i)); }}
            >
              ‹
            </button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[lightbox].url}
            alt={images[lightbox].alt}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          {lightbox < images.length - 1 && (
            <button
              className="absolute right-5 text-white text-3xl"
              onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i !== null ? i + 1 : i)); }}
            >
              ›
            </button>
          )}
        </div>
      )}
    </section>
  );
}
