"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Property } from "@/lib/db/properties";
import { worlds } from "@/lib/brands";

const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const world = worlds.rent;

export default function PropertyCard({ property, href }: { property: Property; href: string }) {
  const cover = property.media.images[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl overflow-hidden border"
      style={{ borderColor: world.theme.border, background: world.theme.bgAlt }}
    >
      <div className="relative aspect-[4/3]">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover.url} alt={cover.alt} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: world.theme.bg }} />
        )}
        <span
          className="absolute top-3 right-3 rounded-full px-3 py-1 text-[10px] uppercase tracking-wide font-medium"
          style={{ background: world.theme.accent, color: "#0a0a0a" }}
        >
          Disponible
        </span>
      </div>
      <div className="p-5">
        <div className="text-world-text font-medium mb-1">{property.name}</div>
        <div className="text-world-text-muted text-sm mb-3">
          {property.capacity.maxGuests} huéspedes · {property.rooms.bedrooms} hab · {property.rooms.bathrooms} baños
        </div>
        <div className="text-sm mb-4">
          <span className="text-world-text-muted">Desde </span>
          <span className="font-medium" style={{ color: world.theme.accent }}>{currency.format(property.pricing.basePrice)}</span>
          <span className="text-world-text-muted"> / noche</span>
        </div>
        <Link
          href={href}
          className="block text-center rounded-full py-2.5 text-sm font-medium"
          style={{ background: world.theme.accent, color: "#0a0a0a" }}
        >
          Ver apartamento
        </Link>
      </div>
    </motion.div>
  );
}
