"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { worlds } from "@/lib/brands";
import { useRevealWorld } from "@/hooks/useRevealWorld";
import WorldNav from "@/components/world/WorldNav";
import WorldHero from "@/components/world/WorldHero";
import WorldContactBlock from "@/components/world/WorldContactBlock";

const world = worlds.rent;

export default function RentPage() {
  useRevealWorld();

  return (
    <>
      <WorldNav world={world} />
      <WorldHero world={world} />

      <section className="relative py-24 px-5 sm:px-10 bg-world-bg">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display text-2xl sm:text-3xl text-world-text mb-4">Elige tu alojamiento</h2>
          <p className="text-world-text-muted">
            Una casa completa para grupos grandes, o uno de nuestros 16 apartamentos independientes. Cada uno con su
            propia disponibilidad, precio y reserva.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden border relative aspect-[4/5] flex items-end group"
            style={{ borderColor: world.theme.border }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/rent/hero.png" alt="Trini House" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(0deg, ${world.theme.bg} 0%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0.2) 100%)` }} />
            <div className="relative z-10 p-6 w-full">
              <div className="uppercase tracking-[0.2em] text-xs mb-2" style={{ color: world.theme.accent }}>Casa completa</div>
              <h3 className="font-display text-2xl text-world-text mb-4">Trini House</h3>
              <Link
                href="/rent/trini-house"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 font-medium"
                style={{ background: world.theme.accent, color: "#0a0a0a" }}
              >
                Ver Trini House
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl overflow-hidden border relative aspect-[4/5] flex items-end group"
            style={{ borderColor: world.theme.border }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/rent/experiencias.png" alt="Apartamentos Trini Beach" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(0deg, ${world.theme.bg} 0%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0.2) 100%)` }} />
            <div className="relative z-10 p-6 w-full">
              <div className="uppercase tracking-[0.2em] text-xs mb-2" style={{ color: world.theme.accent }}>16 apartamentos</div>
              <h3 className="font-display text-2xl text-world-text mb-4">Apartamentos Trini Beach</h3>
              <Link
                href="/rent/apartamentos"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 font-medium"
                style={{ background: world.theme.accent, color: "#0a0a0a" }}
              >
                Ver apartamentos
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <WorldContactBlock world={world} />
    </>
  );
}
