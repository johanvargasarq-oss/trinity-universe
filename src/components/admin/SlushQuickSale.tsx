"use client";

import { useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { adminFetch } from "@/lib/admin-auth-client";
import { worlds } from "@/lib/brands";
import slushMenu from "@/data/slush-menu.json";

const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const world = worlds.slush;

interface TicketLine {
  flavor: string;
  sizeOz: number;
  unitPrice: number;
  quantity: number;
}

export default function SlushQuickSale() {
  return (
    <AdminShell>
      <QuickSaleBody />
    </AdminShell>
  );
}

function QuickSaleBody() {
  const [flavor, setFlavor] = useState<string | null>(null);
  const [sizeOz, setSizeOz] = useState<number | null>(null);
  const [qty, setQty] = useState(1);
  const [ticket, setTicket] = useState<TicketLine[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const sizeOption = slushMenu.sabores.tamanos.find((t) => t.onzas === sizeOz);
  const unitPrice = sizeOption?.precio ?? 0;
  const canAdd = Boolean(flavor && sizeOz);
  const ticketTotal = ticket.reduce((s, l) => s + l.unitPrice * l.quantity, 0);

  function addToTicket() {
    if (!flavor || !sizeOz) return;
    setTicket((t) => [...t, { flavor, sizeOz, unitPrice, quantity: qty }]);
    setFlavor(null);
    setSizeOz(null);
    setQty(1);
  }

  function removeLine(i: number) {
    setTicket((t) => t.filter((_, idx) => idx !== i));
  }

  async function registrarVenta() {
    if (ticket.length === 0) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await adminFetch("/api/admin/quick-sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          worldId: "slush",
          lines: ticket.map((l) => ({
            label: `${l.flavor} (${l.sizeOz} oz)`,
            quantity: l.quantity,
            unitPrice: l.unitPrice,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "No se pudo registrar la venta.");
        return;
      }
      setTicket([]);
      setConfirmed(true);
      setTimeout(() => setConfirmed(false), 2000);
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="px-5 sm:px-8 py-8 max-w-xl">
      <h1 className="font-display text-2xl text-white mb-1">🥤 Registrar venta</h1>
      <p className="text-white/40 text-sm mb-8">Para ventas en mostrador, pagadas en el momento.</p>

      <span className="text-xs uppercase tracking-wide text-white/40">Sabor</span>
      <div className="flex flex-wrap gap-2 mt-3 mb-6">
        {slushMenu.sabores.lista.map((s) => (
          <button
            key={s}
            onClick={() => setFlavor(s)}
            className="rounded-full border px-4 py-2 text-sm transition-colors"
            style={{
              borderColor: flavor === s ? world.theme.accent : "rgba(255,255,255,0.14)",
              background: flavor === s ? world.theme.accentSoft : "transparent",
              color: flavor === s ? world.theme.accent : "#f5f5f5",
            }}
          >
            {flavor === s ? "✓ " : ""}
            {s}
          </button>
        ))}
      </div>

      <span className="text-xs uppercase tracking-wide text-white/40">Tamaño</span>
      <div className="grid grid-cols-4 gap-3 mt-3 mb-6">
        {slushMenu.sabores.tamanos.map((t) => (
          <button
            key={t.onzas}
            onClick={() => setSizeOz(t.onzas)}
            className="rounded-xl border p-3 text-center transition-colors"
            style={{
              borderColor: sizeOz === t.onzas ? world.theme.accent : "rgba(255,255,255,0.14)",
              background: sizeOz === t.onzas ? world.theme.accentSoft : "rgba(255,255,255,0.03)",
            }}
          >
            <div className="text-white text-sm font-medium">{t.onzas} oz</div>
            <div className="text-xs mt-1" style={{ color: world.theme.accent }}>
              {currency.format(t.precio)}
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center gap-1.5 rounded-full border border-white/14 px-1">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center text-white/60" aria-label="Restar">
            −
          </button>
          <span className="text-sm w-6 text-center text-white">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="w-9 h-9 flex items-center justify-center text-white/60" aria-label="Sumar">
            +
          </button>
        </div>
        <button
          onClick={addToTicket}
          disabled={!canAdd}
          className="flex-1 rounded-full px-6 py-3 font-medium disabled:opacity-40"
          style={{ background: world.theme.accent, color: "#0a0a0a" }}
        >
          Agregar {canAdd ? `· ${currency.format(unitPrice * qty)}` : ""}
        </button>
      </div>

      {ticket.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 mb-6">
          <div className="text-white/50 text-xs uppercase tracking-wide mb-3">Venta actual</div>
          <div className="space-y-2">
            {ticket.map((l, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-white">
                  {l.quantity}x {l.flavor} · {l.sizeOz} oz
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-white/70">{currency.format(l.unitPrice * l.quantity)}</span>
                  <button onClick={() => removeLine(i)} className="text-white/30 hover:text-red-400" aria-label="Quitar">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-white/10 text-sm">
            <span className="text-white/50">Total</span>
            <span className="text-white font-medium">{currency.format(ticketTotal)}</span>
          </div>
        </div>
      )}

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      {confirmed && <p className="text-emerald-400 text-sm mb-4">✅ Venta registrada.</p>}

      <button
        onClick={registrarVenta}
        disabled={ticket.length === 0 || submitting}
        className="w-full rounded-full px-6 py-4 font-medium disabled:opacity-30"
        style={{ background: "#fff", color: "#0a0a0a" }}
      >
        {submitting ? "Registrando…" : `Registrar venta${ticket.length > 0 ? ` · ${currency.format(ticketTotal)}` : ""}`}
      </button>
    </div>
  );
}
