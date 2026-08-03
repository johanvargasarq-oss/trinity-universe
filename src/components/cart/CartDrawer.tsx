"use client";

import { AnimatePresence, motion } from "motion/react";
import type { WorldConfig } from "@/lib/brands";
import type { CartLine } from "@/lib/cart/createCartStore";

const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export default function CartDrawer<T>({
  world,
  isOpen,
  onClose,
  lines,
  total,
  notes,
  onNotesChange,
  customerName,
  onCustomerNameChange,
  customerPhone,
  onCustomerPhoneChange,
  onUpdateQuantity,
  onRemove,
  renderLine,
  onCheckout,
  checkoutDisabled,
}: {
  world: WorldConfig;
  isOpen: boolean;
  onClose: () => void;
  lines: CartLine<T>[];
  total: number;
  notes: string;
  onNotesChange: (notes: string) => void;
  customerName: string;
  onCustomerNameChange: (name: string) => void;
  customerPhone: string;
  onCustomerPhoneChange: (phone: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  renderLine: (line: CartLine<T>) => React.ReactNode;
  onCheckout: () => void;
  checkoutDisabled?: boolean;
}) {
  const missingCustomerInfo = !customerName.trim() || !customerPhone.trim();
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/60"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 z-[91] h-full w-full sm:w-[420px] flex flex-col"
            style={{ background: world.theme.bg, color: world.theme.text }}
          >
            <div className="flex items-center justify-between px-5 py-5 border-b" style={{ borderColor: world.theme.border }}>
              <h2 className="font-display text-xl">Tu pedido</h2>
              <button onClick={onClose} aria-label="Cerrar carrito" className="text-2xl leading-none opacity-70 hover:opacity-100">
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {lines.length === 0 ? (
                <p className="text-sm opacity-60 text-center py-12">Tu carrito está vacío.</p>
              ) : (
                lines.map((line) => (
                  <div
                    key={line.id}
                    className="rounded-xl border p-3"
                    style={{ borderColor: world.theme.border, background: world.theme.bgAlt }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 text-sm">{renderLine(line)}</div>
                      <button
                        onClick={() => onRemove(line.id)}
                        aria-label="Quitar"
                        className="text-xs opacity-50 hover:opacity-100 shrink-0"
                      >
                        Quitar
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity(line.id, line.quantity - 1)}
                          className="w-7 h-7 rounded-full border flex items-center justify-center text-sm"
                          style={{ borderColor: world.theme.border }}
                          aria-label="Restar"
                        >
                          −
                        </button>
                        <span className="text-sm w-4 text-center">{line.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(line.id, line.quantity + 1)}
                          className="w-7 h-7 rounded-full border flex items-center justify-center text-sm"
                          style={{ borderColor: world.theme.border }}
                          aria-label="Sumar"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-medium" style={{ color: world.theme.accent }}>
                        {currency.format(line.unitPrice * line.quantity)}
                      </span>
                    </div>
                  </div>
                ))
              )}

              {lines.length > 0 && (
                <div className="space-y-3 pt-2">
                  <label className="block">
                    <span className="text-xs opacity-60">Tu nombre</span>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => onCustomerNameChange(e.target.value)}
                      placeholder="¿Cómo te llamas?"
                      className="mt-1 w-full rounded-lg border bg-transparent px-3 py-2 text-sm placeholder:opacity-40"
                      style={{ borderColor: world.theme.border }}
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs opacity-60">Tu WhatsApp</span>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => onCustomerPhoneChange(e.target.value)}
                      placeholder="Ej: 3001234567"
                      className="mt-1 w-full rounded-lg border bg-transparent px-3 py-2 text-sm placeholder:opacity-40"
                      style={{ borderColor: world.theme.border }}
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs opacity-60">Observaciones (opcional)</span>
                    <textarea
                      value={notes}
                      onChange={(e) => onNotesChange(e.target.value)}
                      rows={2}
                      placeholder="Ej: sin cebolla, tocar el timbre..."
                      className="mt-1 w-full rounded-lg border bg-transparent px-3 py-2 text-sm placeholder:opacity-40"
                      style={{ borderColor: world.theme.border }}
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="px-5 py-5 border-t" style={{ borderColor: world.theme.border }}>
              <div className="flex items-center justify-between mb-4 text-base">
                <span className="opacity-70">Total</span>
                <span className="font-display text-lg">{currency.format(total)}</span>
              </div>
              <button
                onClick={onCheckout}
                disabled={lines.length === 0 || missingCustomerInfo || checkoutDisabled}
                className="w-full rounded-full py-3.5 font-medium disabled:opacity-40"
                style={{ background: world.theme.accent, color: "#0a0a0a" }}
              >
                Pedir por WhatsApp
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
