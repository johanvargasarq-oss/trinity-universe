"use client";

import { useState } from "react";
import { worlds } from "@/lib/brands";
import { useRevealWorld } from "@/hooks/useRevealWorld";
import arepasMenu from "@/data/arepas-menu.json";
import WorldNav from "@/components/world/WorldNav";
import WorldHero from "@/components/world/WorldHero";
import BuildYourOwnMenu, { type BuildStep, type BuildSelection } from "@/components/menu/BuildYourOwnMenu";
import WorldMap from "@/components/world/WorldMap";
import WorldContactBlock from "@/components/world/WorldContactBlock";
import CartFloatingButton from "@/components/cart/CartFloatingButton";
import CartDrawer from "@/components/cart/CartDrawer";
import { useArepasCart } from "@/lib/cart/arepas-cart";
import { cartCount, cartTotal } from "@/lib/cart/createCartStore";
import { buildArepasOrderMessage } from "@/lib/cart/messages";

const world = worlds.arepas;

export default function ArepasPage() {
  useRevealWorld();
  const cart = useArepasCart();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  function handleAddToCart(selection: BuildSelection, unitPrice: number, quantity: number) {
    const adicionesStep = selection.extras.find((e) => e.step.id === "adiciones");
    const salsasStep = selection.extras.find((e) => e.step.id === "salsas");
    const adiciones = adicionesStep?.opciones.map((o) => ({ id: o.id, nombre: o.nombre })) ?? [];
    const salsas = salsasStep?.opciones.map((o) => ({ id: o.id, nombre: o.nombre })) ?? [];
    const id = `${selection.base.id}__${adiciones.map((a) => a.id).sort().join(",")}__${salsas.map((s) => s.id).sort().join(",")}`;

    cart.addLine({
      id,
      unitPrice,
      quantity,
      item: { baseName: selection.base.nombre, adiciones, salsas },
    });
    cart.open();
  }

  async function handleCheckout() {
    const total = cartTotal(cart.lines);
    const message = buildArepasOrderMessage(cart.lines, cart.notes, total, customerName);

    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          worldId: "arepas",
          lines: cart.lines.map((l) => ({
            label: [l.item.baseName, ...l.item.adiciones.map((a) => a.nombre), ...l.item.salsas.map((s) => s.nombre)].join(" + "),
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
      <BuildYourOwnMenu world={world} pasos={arepasMenu.pasos as BuildStep[]} onAddToCart={handleAddToCart} />
      <WorldMap world={world} />
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
            <span className="text-world-text font-medium">{line.item.baseName}</span>
            {line.item.adiciones.length > 0 && (
              <div className="text-world-text-muted text-xs mt-0.5">+ {line.item.adiciones.map((a) => a.nombre).join(", ")}</div>
            )}
            {line.item.salsas.length > 0 && (
              <div className="text-world-text-muted text-xs mt-0.5">🥫 {line.item.salsas.map((s) => s.nombre).join(", ")}</div>
            )}
          </>
        )}
      />
    </>
  );
}
