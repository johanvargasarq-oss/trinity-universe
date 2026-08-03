"use client";

import { worlds } from "@/lib/brands";
import { useRevealWorld } from "@/hooks/useRevealWorld";
import arepasMenu from "@/data/arepas-menu.json";
import WorldNav from "@/components/world/WorldNav";
import WorldHero from "@/components/world/WorldHero";
import BuildYourOwnMenu, { type BuildStep, type BuildSelection } from "@/components/menu/BuildYourOwnMenu";
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

  function handleCheckout() {
    const total = cartTotal(cart.lines);
    const message = buildArepasOrderMessage(cart.lines, cart.notes, total);
    if (!world.contact.whatsapp) return;
    window.open(`https://wa.me/${world.contact.whatsapp}?text=${encodeURIComponent(message)}`, "_blank");
  }

  return (
    <>
      <WorldNav world={world} />
      <WorldHero world={world} />
      <BuildYourOwnMenu world={world} pasos={arepasMenu.pasos as BuildStep[]} onAddToCart={handleAddToCart} />
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
