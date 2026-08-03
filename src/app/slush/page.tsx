"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { worlds } from "@/lib/brands";
import { useRevealWorld } from "@/hooks/useRevealWorld";
import slushMenu from "@/data/slush-menu.json";
import WorldNav from "@/components/world/WorldNav";
import WorldHero from "@/components/world/WorldHero";
import WorldContactBlock from "@/components/world/WorldContactBlock";
import CartFloatingButton from "@/components/cart/CartFloatingButton";
import CartDrawer from "@/components/cart/CartDrawer";
import { useSlushCart } from "@/lib/cart/slush-cart";
import { cartCount, cartTotal } from "@/lib/cart/createCartStore";
import { buildSlushOrderMessage } from "@/lib/cart/messages";

const world = worlds.slush;
const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export default function SlushPage() {
  useRevealWorld();
  const cart = useSlushCart();
  const [flavor, setFlavor] = useState<string | null>(null);
  const [sizeOz, setSizeOz] = useState<number | null>(null);
  const [qty, setQty] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const sizeOption = slushMenu.sabores.tamanos.find((t) => t.onzas === sizeOz);
  const unitPrice = sizeOption?.precio ?? 0;
  const canAdd = Boolean(flavor && sizeOz);

  function handleAdd() {
    if (!flavor || !sizeOz) return;
    cart.addLine({
      id: `${flavor}__${sizeOz}`,
      unitPrice,
      quantity: qty,
      item: { flavorName: flavor, sizeOz },
    });
    cart.open();
    setQty(1);
  }

  async function handleCheckout() {
    const total = cartTotal(cart.lines);
    const message = buildSlushOrderMessage(cart.lines, cart.notes, total, customerName);

    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          worldId: "slush",
          lines: cart.lines.map((l) => ({
            label: `${l.item.flavorName} (${l.item.sizeOz} oz)`,
            quantity: l.quantity,
            unitPrice: l.unitPrice,
          })),
          notes: cart.notes,
          total,
          clienteNombre: customerName,
          clienteTelefono: customerPhone,
        }),
      });
    } catch {
      // Order persistence failing should never block the customer from reaching WhatsApp.
    }

    if (world.contact.whatsapp) {
      window.open(`https://wa.me/${world.contact.whatsapp}?text=${encodeURIComponent(message)}`, "_blank");
    }
    cart.clear();
    setCustomerName("");
    setCustomerPhone("");
  }

  return (
    <>
      <WorldNav world={world} />
      <WorldHero world={world} />

      <section className="relative py-24 px-5 sm:px-10 bg-world-bg">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl text-world-text mb-2">Vasos coleccionables</h2>
          <p className="text-world-text-muted mb-10">{slushMenu.vasosColeccionables.descripcion}</p>
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

      <section className="relative py-24 px-5 sm:px-10 bg-world-bg-alt pb-40">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-display text-2xl sm:text-3xl text-world-text">Arma tu granizado</h2>
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

          <span className="text-xs uppercase tracking-wide text-world-text-muted">1. Elige tu sabor</span>
          <div className="flex flex-wrap gap-2 mt-3 mb-8">
            {slushMenu.sabores.lista.map((s) => (
              <button
                key={s}
                onClick={() => setFlavor(s)}
                className="rounded-full border px-4 py-2 text-sm transition-colors"
                style={{
                  borderColor: flavor === s ? world.theme.accent : world.theme.border,
                  background: flavor === s ? world.theme.accentSoft : "transparent",
                  color: flavor === s ? world.theme.accent : "var(--world-text)",
                }}
              >
                {flavor === s ? "✓ " : ""}
                {s}
              </button>
            ))}
          </div>

          <span className="text-xs uppercase tracking-wide text-world-text-muted">2. Elige tu tamaño</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
            {slushMenu.sabores.tamanos.map((t) => (
              <button
                key={t.onzas}
                onClick={() => setSizeOz(t.onzas)}
                className="rounded-xl border p-4 text-center transition-colors"
                style={{
                  borderColor: sizeOz === t.onzas ? world.theme.accent : world.theme.border,
                  background: sizeOz === t.onzas ? world.theme.accentSoft : world.theme.bgAlt,
                }}
              >
                <div className="text-world-text font-medium">{t.onzas} oz</div>
                <div className="text-sm mt-1" style={{ color: world.theme.accent }}>
                  {currency.format(t.precio)}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div
          className="fixed bottom-0 inset-x-0 z-30 border-t backdrop-blur-md"
          style={{ borderColor: world.theme.border, background: `${world.theme.bg}ee` }}
        >
          <div className="max-w-4xl mx-auto px-5 sm:px-10 py-4 flex items-center gap-4">
            <div className="flex items-center gap-1.5 rounded-full border px-1" style={{ borderColor: world.theme.border }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center text-world-text-muted" aria-label="Restar">
                −
              </button>
              <span className="text-sm w-5 text-center text-world-text">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-8 h-8 flex items-center justify-center text-world-text-muted" aria-label="Sumar">
                +
              </button>
            </div>
            <div className="hidden sm:block text-sm text-world-text-muted flex-1 truncate">
              {flavor && sizeOz ? `${flavor} · ${sizeOz} oz` : "Elige sabor y tamaño"}
            </div>
            <button
              onClick={handleAdd}
              disabled={!canAdd}
              className="rounded-full px-6 py-3 font-medium disabled:opacity-40 whitespace-nowrap"
              style={{ background: world.theme.accent, color: "#0a0a0a" }}
            >
              Agregar · {currency.format(unitPrice * qty)}
            </button>
          </div>
        </div>
      </section>

      <WorldContactBlock world={world} />

      <CartFloatingButton world={world} count={cartCount(cart.lines)} onClick={cart.open} />
      <CartDrawer
        world={world}
        isOpen={cart.isOpen}
        onClose={cart.close}
        lines={cart.lines}
        total={cartTotal(cart.lines)}
        notes={cart.notes}
        onNotesChange={cart.setNotes}
        customerName={customerName}
        onCustomerNameChange={setCustomerName}
        customerPhone={customerPhone}
        onCustomerPhoneChange={setCustomerPhone}
        onUpdateQuantity={cart.updateQuantity}
        onRemove={cart.removeLine}
        onCheckout={handleCheckout}
        checkoutDisabled={!world.contact.whatsapp}
        renderLine={(line) => (
          <>
            <span className="text-world-text font-medium">{line.item.flavorName}</span>
            <span className="text-world-text-muted"> · {line.item.sizeOz} oz</span>
          </>
        )}
      />
    </>
  );
}
