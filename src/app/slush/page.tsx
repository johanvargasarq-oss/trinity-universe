"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { worlds } from "@/lib/brands";
import { useRevealWorld } from "@/hooks/useRevealWorld";
import slushMenu from "@/data/slush-menu.json";
import WorldNav from "@/components/world/WorldNav";
import WorldHero from "@/components/world/WorldHero";
import WorldContactBlock from "@/components/world/WorldContactBlock";

const world = worlds.slush;
const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export default function SlushPage() {
  useRevealWorld();

  return (
    <>
      <WorldNav world={world} />
      <WorldHero world={world} />

      <section className="relative py-24 px-5 sm:px-10 bg-world-bg">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl text-world-text mb-2">Vasos coleccionables</h2>
          <p className="text-world-text-muted mb-10">
            {slushMenu.vasosColeccionables.descripcion}
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {slushMenu.vasosColeccionables.opciones.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="rounded-2xl overflow-hidden border"
                style={{ borderColor: world.theme.border, background: world.theme.bgAlt }}
              >
                <div className="relative aspect-square">
                  <Image src={v.imagen} alt={v.nombre} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
                </div>
                <div className="p-5 flex items-center justify-between">
                  <span className="text-world-text font-medium">{v.nombre}</span>
                  <div className="text-right">
                    <div className="text-sm text-world-text-muted">
                      Cómpralo <span className="font-medium" style={{ color: world.theme.accent }}>{currency.format(v.precioCompra)}</span>
                    </div>
                    <div className="text-sm text-world-text-muted">
                      Recárgalo <span className="font-medium" style={{ color: world.theme.accent }}>{currency.format(v.precioRecarga)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 px-5 sm:px-10 bg-world-bg-alt">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-display text-2xl sm:text-3xl text-world-text">Sabores</h2>
            <span
              className="rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide"
              style={{ background: world.theme.accentSoft, color: world.theme.accent }}
            >
              Menú temporal
            </span>
          </div>
          <p className="text-world-text-muted mb-8 text-sm">
            Estamos terminando de confirmar la carta oficial con el cliente. Estos sabores y precios son de ejemplo,
            no definitivos.
          </p>

          <div className="flex flex-wrap gap-2 mb-10">
            {slushMenu.sabores.lista.map((s) => (
              <span
                key={s}
                className="rounded-full border px-4 py-2 text-sm text-world-text"
                style={{ borderColor: world.theme.border }}
              >
                {s}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {slushMenu.sabores.tamanos.map((t) => (
              <div
                key={t.onzas}
                className="rounded-xl border p-4 text-center"
                style={{ borderColor: world.theme.border, background: world.theme.bgAlt }}
              >
                <div className="text-world-text font-medium">{t.onzas} oz</div>
                <div className="text-sm mt-1" style={{ color: world.theme.accent }}>
                  {currency.format(t.precio)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WorldContactBlock world={world} />
    </>
  );
}
