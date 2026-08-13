"use client";

import { motion } from "motion/react";
import type { Property } from "@/lib/db/properties";
import { worlds } from "@/lib/brands";

const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const world = worlds.rent;

export default function PropertyHero({ property }: { property: Property }) {
  const cover = property.media.images[0];

  return (
    <section className="relative min-h-[70vh] w-full flex items-end overflow-hidden">
      <div className="absolute inset-0">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover.url} alt={cover.alt} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full" style={{ background: world.theme.bgAlt }} />
        )}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(0deg, ${world.theme.bg} 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.35) 100%)` }}
        />
      </div>

      <div className="relative z-10 px-5 sm:px-10 pb-14 sm:pb-20 max-w-3xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="uppercase tracking-[0.3em] text-xs sm:text-sm mb-4"
          style={{ color: world.theme.accent }}
        >
          {property.type === "house" ? "Trini Beach Rental · Casa completa" : "Trini Beach Rental · Apartamento"}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-display text-4xl sm:text-6xl leading-[1.02] text-world-text"
        >
          {property.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-5 text-base sm:text-lg font-medium"
          style={{ color: world.theme.accent }}
        >
          Desde {currency.format(property.pricing.basePrice)} / noche
        </motion.p>
      </div>
    </section>
  );
}
