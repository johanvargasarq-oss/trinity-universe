"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import StatCard from "@/components/admin/StatCard";
import { adminFetch } from "@/lib/admin-auth-client";
import type { Order, OrderEstado, OrderWorldId } from "@/lib/db/orders";
import type { WorldConfig } from "@/lib/brands";

const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

const ESTADOS: OrderEstado[] = ["pendiente", "preparando", "listo", "entregado", "cancelado"];
const ESTADO_COLOR: Record<OrderEstado, string> = {
  pendiente: "#fbbf24",
  preparando: "#60a5fa",
  listo: "#a78bfa",
  entregado: "#34d399",
  cancelado: "#f87171",
};

export default function OrdersAdmin({ world }: { world: WorldConfig }) {
  return (
    <AdminShell>
      <OrdersBody world={world} />
    </AdminShell>
  );
}

// Rendered only once AdminShell confirms the admin is authenticated.
function OrdersBody({ world }: { world: WorldConfig }) {
  const worldId = world.id as OrderWorldId;
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");

  function load() {
    adminFetch(`/api/admin/orders?worldId=${worldId}`)
      .then((res) => res.json())
      .then((d) => (d.error ? setError(d.error) : setOrders(d.orders)))
      .catch(() => setError("No se pudo cargar."));
  }

  useEffect(load, [worldId]);

  async function cambiarEstado(id: string, estado: OrderEstado) {
    await adminFetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, accion: "cambiarEstado", estado }),
    });
    load();
  }

  const today = new Date().toISOString().slice(0, 10);
  const hoy = orders?.filter((o) => o.creadoEn.slice(0, 10) === today) ?? [];
  const pendientes = hoy.filter((o) => o.estado === "pendiente" || o.estado === "preparando" || o.estado === "listo");
  const entregados = hoy.filter((o) => o.estado === "entregado");
  const ventasHoy = hoy.filter((o) => o.estado !== "cancelado").reduce((s, o) => s + o.total, 0);

  return (
      <div className="px-5 sm:px-8 py-8 max-w-5xl">
        <h1 className="font-display text-2xl text-white mb-1">
          {world.emoji} {world.name}
        </h1>
        <p className="text-white/40 text-sm mb-8">Pedidos y actividad de hoy</p>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {orders && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              <StatCard label="Ventas hoy" value={currency.format(ventasHoy)} accent={world.theme.accent} />
              <StatCard label="Pedidos hoy" value={String(hoy.length)} />
              <StatCard label="Pendientes" value={String(pendientes.length)} accent="#fbbf24" />
              <StatCard label="Entregados hoy" value={String(entregados.length)} accent="#34d399" />
            </div>

            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="text-white font-medium">{o.clienteNombre || "Cliente"}</div>
                      <div className="text-white/40 text-xs">
                        {o.clienteTelefono} · {new Date(o.creadoEn).toLocaleString("es-CO")}
                      </div>
                    </div>
                    <select
                      value={o.estado}
                      onChange={(e) => cambiarEstado(o.id, e.target.value as OrderEstado)}
                      className="bg-black border rounded px-2 py-1 text-xs"
                      style={{ borderColor: ESTADO_COLOR[o.estado], color: ESTADO_COLOR[o.estado] }}
                    >
                      {ESTADOS.map((e) => (
                        <option key={e} value={e}>
                          {e}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-white/70 text-sm space-y-1">
                    {o.lines.map((l, i) => (
                      <div key={i} className="flex justify-between">
                        <span>
                          {l.quantity}x {l.label}
                        </span>
                        <span>{currency.format(l.unitPrice * l.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  {o.notes && <div className="text-white/40 text-xs mt-2">📝 {o.notes}</div>}
                  <div className="flex justify-between mt-3 pt-3 border-t border-white/10 text-sm">
                    <span className="text-white/50">Total</span>
                    <span className="text-white font-medium">{currency.format(o.total)}</span>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="text-white/30 text-sm py-10 text-center">No hay pedidos todavía.</p>}
            </div>
          </>
        )}
      </div>
  );
}
