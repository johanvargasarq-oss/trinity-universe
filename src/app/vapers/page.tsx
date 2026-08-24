"use client";

import { useState } from "react";
import { worlds } from "@/lib/brands";
import { useRevealWorld } from "@/hooks/useRevealWorld";
import vapersMenu from "@/data/vapers-menu.json";
import WorldNav from "@/components/world/WorldNav";
import WorldHero from "@/components/world/WorldHero";
import MenuCatalog, { type MenuProduct, type MenuProductVariant } from "@/components/menu/MenuCatalog";
import WorldMap from "@/components/world/WorldMap";
import WorldContactBlock from "@/components/world/WorldContactBlock";
import CartFloatingButton from "@/components/cart/CartFloatingButton";
import CartDrawer from "@/components/cart/CartDrawer";
import { useVapersCart } from "@/lib/cart/vapers-cart";
import { cartCount, cartTotal } from "@/lib/cart/createCartStore";
import { buildVapersOrderMessage } from "@/lib/cart/messages";
import type { DeliveryType } from "@/lib/cart/delivery";

const world = worlds.vapers;

export default function VapersPage() {
  useRevealWorld();
  const cart = useVapersCart();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("local");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  function handleAddToCart(product: MenuProduct, variant: MenuProductVariant | null, quantity: number) {
    cart.addLine({
      id: variant ? `${product.id}__${variant.nombre}` : product.id,
      unitPrice: variant ? variant.precio : product.precio,
      quantity,
      item: { productName: product.nombre, variantName: variant?.nombre },
    });
    cart.open();
  }

  async function handleCheckout() {
    const total = cartTotal(cart.lines);
    const message = buildVapersOrderMessage(cart.lines, cart.notes, total, customerName, deliveryType, deliveryAddress);

    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          worldId: "vapers",
          lines: cart.lines.map((l) => ({
            label: l.item.variantName ? `${l.item.productName} (${l.item.variantName})` : l.item.productName,
            quantity: l.quantity,
            unitPrice: l.unitPrice,
          })),
          notes: cart.notes,
          total,
          clienteNombre: customerName,
          clienteTelefono: customerPhone,
          entregaTipo: deliveryType,
          entregaDireccion: deliveryAddress,
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
    setDeliveryType("local");
    setDeliveryAddress("");
  }

  return (
    <>
      <WorldNav world={world} />
      <WorldHero world={world} />
      <MenuCatalog world={world} categorias={vapersMenu.categorias} onAddToCart={handleAddToCart} />
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
        deliveryType={deliveryType}
        onDeliveryTypeChange={setDeliveryType}
        deliveryAddress={deliveryAddress}
        onDeliveryAddressChange={setDeliveryAddress}
        onUpdateQuantity={cart.updateQuantity}
        onRemove={cart.removeLine}
        onCheckout={handleCheckout}
        checkoutDisabled={!world.contact.whatsapp}
        renderLine={(line) => (
          <>
            <span className="text-world-text font-medium">{line.item.productName}</span>
            {line.item.variantName && <span className="text-world-text-muted"> · {line.item.variantName}</span>}
          </>
        )}
      />
    </>
  );
}
