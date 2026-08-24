"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import StatCard from "@/components/admin/StatCard";
import { adminFetch } from "@/lib/admin-auth-client";
import { worlds } from "@/lib/brands";

const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

interface DashboardData {
  ventasHoy: number;
  ventasMes: number;
  pedidosPendientes: number;
  pedidosEntregadosHoy: number;
  reservasHoy: number;
  clientesNuevosHoy: number;
  topProductos: { nombre: string; cantidad: number }[];
  ingresosPorNegocio: { barberia: number; fries: number; arepas: number; slush: number; licores: number; vapers: number };
  pedidosPorNegocioHoy: { fries: number; arepas: number; slush: number; licores: number; vapers: number };
  rentReservasPendientes: number;
  rentReservasHoy: number;
  rentIngresos: number;
  rentOcupacion: number;
}

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <DashboardBody />
    </AdminShell>
  );
}

// Rendered only once AdminShell confirms the admin is authenticated, so this
// never fires its fetch before login (and never races the login request).
function DashboardBody() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((d) => (d.error ? setError(d.error) : setData(d)))
      .catch(() => setError("No se pudo cargar el dashboard."));
  }, []);

  return (
      <div className="px-5 sm:px-8 py-8 max-w-6xl">
        <h1 className="font-display text-2xl text-white mb-1">Dashboard General</h1>
        <p className="text-white/40 text-sm mb-8">Resumen de todo el universo Trinity</p>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {data && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
              <StatCard label="Ventas del día" value={currency.format(data.ventasHoy)} accent="#34d399" />
              <StatCard label="Ventas del mes" value={currency.format(data.ventasMes)} accent="#34d399" />
              <StatCard label="Pedidos pendientes" value={String(data.pedidosPendientes)} accent="#fbbf24" />
              <StatCard label="Reservas de hoy" value={String(data.reservasHoy)} accent="#60a5fa" />
              <StatCard label="Clientes nuevos hoy" value={String(data.clientesNuevosHoy)} />
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h2 className="text-white font-medium mb-4">Ingresos por negocio</h2>
                <div className="space-y-3">
                  {(["barberia", "fries", "arepas", "slush", "licores", "vapers"] as const).map((id) => (
                    <div key={id} className="flex items-center justify-between text-sm">
                      <span className="text-white/60">
                        {worlds[id].emoji} {worlds[id].name}
                      </span>
                      <span className="text-white font-medium">{currency.format(data.ingresosPorNegocio[id])}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <h2 className="text-white font-medium mb-4">Productos más vendidos</h2>
                {data.topProductos.length === 0 ? (
                  <p className="text-white/30 text-sm">Todavía no hay pedidos suficientes.</p>
                ) : (
                  <div className="space-y-3">
                    {data.topProductos.map((p) => (
                      <div key={p.nombre} className="flex items-center justify-between text-sm">
                        <span className="text-white/60 truncate pr-3">{p.nombre}</span>
                        <span className="text-white font-medium shrink-0">{p.cantidad}x</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 mb-10">
              <h2 className="text-white font-medium mb-4">Pedidos de hoy por negocio</h2>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                {(["fries", "arepas", "slush", "licores", "vapers"] as const).map((id) => (
                  <div key={id} className="text-center">
                    <div className="text-2xl font-display text-white">{data.pedidosPorNegocioHoy[id]}</div>
                    <div className="text-white/50 text-xs mt-1">
                      {worlds[id].emoji} {worlds[id].shortName}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-white font-medium mb-4">🏖️ Trini Beach Rental</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-display text-white">{data.rentReservasPendientes}</div>
                  <div className="text-white/50 text-xs mt-1">Pendientes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-display text-white">{data.rentReservasHoy}</div>
                  <div className="text-white/50 text-xs mt-1">Reservas hoy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-display text-white">{currency.format(data.rentIngresos)}</div>
                  <div className="text-white/50 text-xs mt-1">Ingresos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-display text-white">{Math.round(data.rentOcupacion * 100)}%</div>
                  <div className="text-white/50 text-xs mt-1">Ocupación hoy</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
  );
}
