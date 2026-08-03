"use client";

import { worlds } from "@/lib/brands";
import { useRevealWorld } from "@/hooks/useRevealWorld";
import friesMenu from "@/data/fries-menu.json";
import WorldNav from "@/components/world/WorldNav";
import WorldHero from "@/components/world/WorldHero";
import MenuCatalog, { type MenuProduct, type MenuProductVariant } from "@/components/menu/MenuCatalog";
import WorldContactBlock from "@/components/world/WorldContactBlock";
import CartFloatingButton from "@/components/cart/CartFloatingButton";
import CartDrawer from "@/components/cart/CartDrawer";
import { useFriesCart } from "@/lib/cart/fries-cart";
import { cartCount, cartTotal } from "@/lib/cart/createCartStore";
import { buildFriesOrderMessage } from "@/lib/cart/messages";

const world = worlds.fries;

export default function FriesPage() {
  useRevealWorld();
  const cart = useFriesCart();

  function handleAddToCart(product: MenuProduct, variant: MenuProductVariant | null, quantity: number) {
    cart.addLine({
      id: variant ? `${product.id}__${variant.nombre}` : product.id,
      unitPrice: variant ? variant.precio : product.precio,
      quantity,
      item: { productName: product.nombre, variantName: variant?.nombre },
    });
    cart.open();
  }

  function handleCheckout() {
    const total = cartTotal(cart.lines);
    const message = buildFriesOrderMessage(cart.lines, cart.notes, total);
    if (!world.contact.whatsapp) return;
    window.open(`https://wa.me/${world.contact.whatsapp}?text=${encodeURIComponent(message)}`, "_blank");
  }

  return (
    <>
      <WorldNav world={world} />
      <WorldHero world={world} />
      <MenuCatalog world={world} categorias={friesMenu.categorias} onAddToCart={handleAddToCart} />
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
            <span className="text-world-text font-medium">{line.item.productName}</span>
            {line.item.variantName && <span className="text-world-text-muted"> · {line.item.variantName}</span>}
          </>
        )}
      />
    </>
  );
}
