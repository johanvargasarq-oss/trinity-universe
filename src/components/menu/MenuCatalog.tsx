"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import type { WorldConfig } from "@/lib/brands";

export interface MenuProductVariant {
  nombre: string;
  precio: number;
}

export interface MenuProduct {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  destacado?: boolean;
  variantes?: MenuProductVariant[];
}

export interface MenuCategory {
  id: string;
  nombre: string;
  productos: MenuProduct[];
}

const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export default function MenuCatalog({
  world,
  categorias,
  onAddToCart,
}: {
  world: WorldConfig;
  categorias: MenuCategory[];
  onAddToCart?: (product: MenuProduct, variant: MenuProductVariant | null, quantity: number) => void;
}) {
  const [active, setActive] = useState(categorias[0]?.id);
  const activeCategoria = categorias.find((c) => c.id === active) ?? categorias[0];

  return (
    <section className="relative py-24 px-5 sm:px-10 bg-world-bg">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-2xl sm:text-3xl text-world-text mb-8">Menú</h2>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-10 -mx-1 px-1">
          {categorias.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className="shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap"
              style={{
                background: active === c.id ? world.theme.accent : world.theme.bgAlt,
                color: active === c.id ? "#0a0a0a" : "var(--world-text-muted)",
              }}
            >
              {c.nombre}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategoria?.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {activeCategoria?.productos.map((p) => (
              <MenuProductCard key={p.id} world={world} product={p} onAddToCart={onAddToCart} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function MenuProductCard({
  world,
  product: p,
  onAddToCart,
}: {
  world: WorldConfig;
  product: MenuProduct;
  onAddToCart?: (product: MenuProduct, variant: MenuProductVariant | null, quantity: number) => void;
}) {
  const [variantIdx, setVariantIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const activeVariant = p.variantes?.[variantIdx] ?? null;
  const unitPrice = activeVariant ? activeVariant.precio : p.precio;

  return (
    <div
      className="rounded-2xl overflow-hidden border flex flex-col"
      style={{ borderColor: world.theme.border, background: world.theme.bgAlt }}
    >
      <div className="relative aspect-[4/3]">
        <Image src={p.imagen} alt={p.nombre} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
        {p.destacado && (
          <span
            className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide"
            style={{ background: world.theme.accent, color: "#0a0a0a" }}
          >
            Destacado
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-world-text font-medium">{p.nombre}</h3>
        {p.descripcion && <p className="text-world-text-muted text-sm mt-1 flex-1">{p.descripcion}</p>}

        {p.variantes ? (
          <div className="mt-3 flex gap-2">
            {p.variantes.map((v, i) => (
              <button
                key={v.nombre}
                onClick={() => setVariantIdx(i)}
                className="flex-1 rounded-lg border px-2 py-1.5 text-xs"
                style={{
                  borderColor: variantIdx === i ? world.theme.accent : world.theme.border,
                  color: variantIdx === i ? world.theme.accent : "var(--world-text-muted)",
                }}
              >
                {v.nombre}
                <br />
                {currency.format(v.precio)}
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-3 font-medium text-sm" style={{ color: world.theme.accent }}>
            {currency.format(p.precio)}
          </div>
        )}

        {onAddToCart && (
          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-full border px-1" style={{ borderColor: world.theme.border }}>
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-6 h-6 flex items-center justify-center text-sm text-world-text-muted"
                aria-label="Restar"
              >
                −
              </button>
              <span className="text-sm w-4 text-center text-world-text">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-6 h-6 flex items-center justify-center text-sm text-world-text-muted"
                aria-label="Sumar"
              >
                +
              </button>
            </div>
            <button
              onClick={() => {
                onAddToCart(p, activeVariant, qty);
                setQty(1);
              }}
              className="flex-1 rounded-full py-2 text-sm font-medium"
              style={{ background: world.theme.accent, color: "#0a0a0a" }}
            >
              Agregar · {currency.format(unitPrice * qty)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
