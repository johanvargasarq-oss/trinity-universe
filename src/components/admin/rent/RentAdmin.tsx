"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-auth-client";
import type { Property } from "@/lib/db/properties";
import type { Reservation } from "@/lib/db/reservations";
import StatCard from "@/components/admin/StatCard";
import { currency } from "./shared";
import ReservasTab from "./ReservasTab";
import CalendarioTab from "./CalendarioTab";
import TriniHouseTab from "./TriniHouseTab";
import ApartamentosTab from "./ApartamentosTab";
import ClientesTab from "./ClientesTab";
import DisponibilidadTab from "./DisponibilidadTab";
import EstadisticasTab from "./EstadisticasTab";

type Tab = "reservas" | "calendario" | "trini-house" | "apartamentos" | "clientes" | "disponibilidad" | "historial" | "estadisticas";

const TABS: { id: Tab; label: string }[] = [
  { id: "reservas", label: "Reservas" },
  { id: "calendario", label: "Calendario" },
  { id: "trini-house", label: "Trini House" },
  { id: "apartamentos", label: "Apartamentos" },
  { id: "clientes", label: "Clientes" },
  { id: "disponibilidad", label: "Disponibilidad" },
  { id: "historial", label: "Historial" },
  { id: "estadisticas", label: "Estadísticas" },
];

export default function RentAdmin() {
  const [tab, setTab] = useState<Tab>("reservas");
  const [properties, setProperties] = useState<Property[] | null>(null);
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [error, setError] = useState("");
  const [seeding, setSeeding] = useState(false);

  function load() {
    Promise.all([
      adminFetch("/api/admin/rent/properties").then((r) => r.json()),
      adminFetch("/api/admin/rent/reservations").then((r) => r.json()),
    ])
      .then(([p, r]) => {
        if (p.error) return setError(p.error);
        if (r.error) return setError(r.error);
        setProperties(p.properties);
        setReservations(r.reservations);
      })
      .catch(() => setError("No se pudo cargar Beach Rental."));
  }

  useEffect(load, []);

  async function sembrarPropiedades() {
    setSeeding(true);
    await adminFetch("/api/admin/rent/properties/seed", { method: "POST" });
    setSeeding(false);
    load();
  }

  function updateReservationInPlace(updated: Reservation) {
    setReservations((all) => all?.map((r) => (r.id === updated.id ? updated : r)) ?? all);
  }
  function updatePropertyInPlace(updated: Property) {
    setProperties((all) => all?.map((p) => (p.id === updated.id ? updated : p)) ?? all);
  }

  if (error) return <p className="text-red-400 text-sm px-5 sm:px-8 py-8">{error}</p>;
  if (!properties || !reservations) return <p className="text-white/40 text-sm px-5 sm:px-8 py-8">Cargando…</p>;

  if (properties.length === 0) {
    return (
      <div className="px-5 sm:px-8 py-8">
        <p className="text-white/60 text-sm mb-4">Todavía no hay propiedades cargadas.</p>
        <button onClick={sembrarPropiedades} disabled={seeding} className="rounded-full bg-white text-black px-6 py-2.5 text-sm font-medium disabled:opacity-60">
          {seeding ? "Sembrando…" : "Sembrar Trini House + 16 apartamentos"}
        </button>
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const pendientes = reservations.filter((r) => r.estado === "pendiente");
  const confirmadas = reservations.filter((r) => r.estado === "confirmada");
  const proximas = confirmadas.filter((r) => r.checkIn >= today);
  const ocupadasHoy = new Set(confirmadas.filter((r) => today >= r.checkIn && today < r.checkOut).map((r) => r.propertyId));
  const ingresos = reservations.filter((r) => r.estado === "confirmada" || r.estado === "finalizada").reduce((s, r) => s + r.total, 0);
  const clientesUnicos = new Set(reservations.map((r) => r.huesped.numeroDocumento || r.huesped.celular));

  return (
    <div className="px-5 sm:px-8 py-8 max-w-7xl">
      <h1 className="font-display text-2xl text-white mb-1">🏖️ Trini Beach Rental</h1>
      <p className="text-white/40 text-sm mb-8">Trini House + 16 apartamentos — reservas, precios y disponibilidad</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
        <StatCard label="Pendientes" value={String(pendientes.length)} accent="#fbbf24" />
        <StatCard label="Confirmadas" value={String(confirmadas.length)} accent="#34d399" />
        <StatCard label="Próximas" value={String(proximas.length)} accent="#60a5fa" />
        <StatCard label="Ocupadas hoy" value={String(ocupadasHoy.size)} />
        <StatCard label="Disponibles hoy" value={String(properties.length - ocupadasHoy.size)} />
        <StatCard label="Ingresos" value={currency.format(ingresos)} accent="#34d399" />
        <StatCard label="Clientes" value={String(clientesUnicos.size)} />
      </div>

      <div className="flex gap-1 overflow-x-auto mb-8 border-b border-white/10">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm whitespace-nowrap border-b-2 transition-colors ${
              tab === t.id ? "border-white text-white" : "border-transparent text-white/40 hover:text-white/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "reservas" && <ReservasTab reservations={reservations} properties={properties} onUpdated={updateReservationInPlace} />}
      {tab === "calendario" && <CalendarioTab properties={properties} reservations={reservations} />}
      {tab === "trini-house" && (
        <TriniHouseTab property={properties.find((p) => p.id === "trini-house")} onSaved={updatePropertyInPlace} />
      )}
      {tab === "apartamentos" && (
        <ApartamentosTab properties={properties} reservations={reservations} onPropertyUpdated={updatePropertyInPlace} />
      )}
      {tab === "clientes" && <ClientesTab reservations={reservations} properties={properties} />}
      {tab === "disponibilidad" && <DisponibilidadTab properties={properties} onPropertyUpdated={updatePropertyInPlace} />}
      {tab === "historial" && (
        <ReservasTab
          reservations={reservations}
          properties={properties}
          onUpdated={updateReservationInPlace}
          estadoFilterDefault={["finalizada", "cancelada", "rechazada"]}
        />
      )}
      {tab === "estadisticas" && <EstadisticasTab reservations={reservations} properties={properties} />}
    </div>
  );
}
