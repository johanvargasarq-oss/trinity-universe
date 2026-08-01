"use client";

import { motion } from "motion/react";
import type { WorldConfig } from "@/lib/brands";

export default function WorldMap({ world }: { world: WorldConfig }) {
  const addresses = world.contact.addresses;
  if (!addresses?.length) return null;

  return (
    <section className="relative py-24 px-5 sm:px-10 bg-world-bg">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-2xl sm:text-3xl text-world-text mb-10">Ubicaciones</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {addresses.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-2xl overflow-hidden border"
              style={{ borderColor: world.theme.border }}
            >
              <div className="aspect-video">
                <iframe
                  title={`Mapa ${a.label}`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(a.line + ", Bucaramanga, Colombia")}&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="p-4" style={{ background: world.theme.bgAlt }}>
                <div className="text-world-text font-medium">{a.label}</div>
                <div className="text-world-text-muted text-sm">{a.line}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
