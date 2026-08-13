"use client";

import { worlds } from "@/lib/brands";
import type { Property } from "@/lib/db/properties";
import WorldContactBlock from "@/components/world/WorldContactBlock";
import PropertyGalleryBooking from "./PropertyGalleryBooking";
import PropertyAmenitiesBooking from "./PropertyAmenitiesBooking";
import ReservationFlow from "./ReservationFlow";

const world = worlds.rent;

export default function PropertyDetail({
  property,
  initialCheckIn,
  initialCheckOut,
  initialAdultos,
  initialNinos,
}: {
  property: Property;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialAdultos?: number;
  initialNinos?: number;
}) {
  return (
    <>
      <div className="pt-20">
        <PropertyGalleryBooking property={property} />
      </div>

      <section className="relative py-16 px-5 sm:px-10 bg-world-bg-alt">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl text-world-text mb-4">Descripción</h2>
          <p className="text-world-text-muted leading-relaxed">{property.description}</p>
        </div>
      </section>

      {property.media.videos.length > 0 && (
        <section className="relative py-16 px-5 sm:px-10 bg-world-bg">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="font-display text-2xl sm:text-3xl text-world-text mb-2">Video</h2>
            {property.media.videos.map((v) => (
              <video key={v.url} className="w-full rounded-2xl" src={v.url} controls />
            ))}
          </div>
        </section>
      )}

      <PropertyAmenitiesBooking property={property} />

      <ReservationFlow
        property={property}
        initialCheckIn={initialCheckIn}
        initialCheckOut={initialCheckOut}
        initialAdultos={initialAdultos}
        initialNinos={initialNinos}
      />

      <WorldContactBlock world={world} />
    </>
  );
}
