import type { CartLine } from "./createCartStore";
import type { FriesCartItem } from "./fries-cart";
import type { ArepaCartItem } from "./arepas-cart";
import type { SlushCartItem } from "./slush-cart";
import type { LicoresCartItem } from "./licores-cart";
import type { VapersCartItem } from "./vapers-cart";
import type { DeliveryType } from "./delivery";

const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

function deliveryLine(deliveryType: DeliveryType, deliveryAddress: string): string {
  return deliveryType === "domicilio"
    ? `🛵 Entrega: A domicilio — ${deliveryAddress}\n\n`
    : `📍 Entrega: Recoger en el local\n\n`;
}

export function buildFriesOrderMessage(
  lines: CartLine<FriesCartItem>[],
  notes: string,
  total: number,
  customerName: string,
  deliveryType: DeliveryType,
  deliveryAddress: string
): string {
  const items = lines
    .map((l) => {
      const name = l.item.variantName ? `${l.item.productName} (${l.item.variantName})` : l.item.productName;
      return `• ${l.quantity}x ${name} — ${currency.format(l.unitPrice * l.quantity)}`;
    })
    .join("\n");

  return (
    `🍟 NUEVO PEDIDO — TriniFries\n\n` +
    `👤 Nombre: ${customerName}\n\n` +
    deliveryLine(deliveryType, deliveryAddress) +
    `${items}\n\n` +
    (notes ? `📝 Observaciones: ${notes}\n\n` : "") +
    `💰 Total: ${currency.format(total)}`
  );
}

export function buildArepasOrderMessage(
  lines: CartLine<ArepaCartItem>[],
  notes: string,
  total: number,
  customerName: string,
  deliveryType: DeliveryType,
  deliveryAddress: string
): string {
  const items = lines
    .map((l) => {
      const adiciones = l.item.adiciones.length ? `\n   + ${l.item.adiciones.map((a) => a.nombre).join(", ")}` : "";
      const salsas = l.item.salsas.length ? `\n   🥫 ${l.item.salsas.map((s) => s.nombre).join(", ")}` : "";
      return `• ${l.quantity}x ${l.item.baseName}${adiciones}${salsas} — ${currency.format(l.unitPrice * l.quantity)}`;
    })
    .join("\n\n");

  return (
    `🌮 NUEVO PEDIDO — TriniArepas\n\n` +
    `👤 Nombre: ${customerName}\n\n` +
    deliveryLine(deliveryType, deliveryAddress) +
    `${items}\n\n` +
    (notes ? `📝 Observaciones: ${notes}\n\n` : "") +
    `💰 Total: ${currency.format(total)}`
  );
}

export function buildLicoresOrderMessage(
  lines: CartLine<LicoresCartItem>[],
  notes: string,
  total: number,
  customerName: string,
  deliveryType: DeliveryType,
  deliveryAddress: string
): string {
  const items = lines
    .map((l) => {
      const name = l.item.variantName ? `${l.item.productName} (${l.item.variantName})` : l.item.productName;
      return `• ${l.quantity}x ${name} — ${currency.format(l.unitPrice * l.quantity)}`;
    })
    .join("\n");

  return (
    `🥃 NUEVO PEDIDO — Trini Licores\n\n` +
    `👤 Nombre: ${customerName}\n\n` +
    deliveryLine(deliveryType, deliveryAddress) +
    `${items}\n\n` +
    (notes ? `📝 Observaciones: ${notes}\n\n` : "") +
    `💰 Total: ${currency.format(total)}`
  );
}

export function buildVapersOrderMessage(
  lines: CartLine<VapersCartItem>[],
  notes: string,
  total: number,
  customerName: string,
  deliveryType: DeliveryType,
  deliveryAddress: string
): string {
  const items = lines
    .map((l) => {
      const name = l.item.variantName ? `${l.item.productName} (${l.item.variantName})` : l.item.productName;
      return `• ${l.quantity}x ${name} — ${currency.format(l.unitPrice * l.quantity)}`;
    })
    .join("\n");

  return (
    `💨 NUEVO PEDIDO — Trini Vapers\n\n` +
    `👤 Nombre: ${customerName}\n\n` +
    deliveryLine(deliveryType, deliveryAddress) +
    `${items}\n\n` +
    (notes ? `📝 Observaciones: ${notes}\n\n` : "") +
    `💰 Total: ${currency.format(total)}`
  );
}

export function buildSlushOrderMessage(
  lines: CartLine<SlushCartItem>[],
  notes: string,
  total: number,
  customerName: string,
  deliveryType: DeliveryType,
  deliveryAddress: string
): string {
  const items = lines
    .map((l) => `• ${l.quantity}x ${l.item.flavorName} (${l.item.sizeOz} oz) — ${currency.format(l.unitPrice * l.quantity)}`)
    .join("\n");

  return (
    `🥤 NUEVO PEDIDO — TriniSlush\n\n` +
    `👤 Nombre: ${customerName}\n\n` +
    deliveryLine(deliveryType, deliveryAddress) +
    `${items}\n\n` +
    (notes ? `📝 Observaciones: ${notes}\n\n` : "") +
    `💰 Total: ${currency.format(total)}`
  );
}
