"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/admin-auth-client";
import type { Property } from "@/lib/db/properties";

export default function DisponibilidadTab({
  properties,
  onPropertyUpdated,
}: {
  properties: Property[];
  onPropertyUpdated: (p: Property) => void;
}) {
  const [propertyId, setPropertyId] = useState(properties[0]?.id ?? "");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("Mantenimiento");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const property = properties.find((p) => p.id === propertyId);

  async function bloquear() {
    if (!from || !to || to <= from) {
      setError("Elige un rango de fechas válido.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await adminFetch(`/api/admin/rent/properties/${propertyId}/block`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "bloquear", from, to, reason }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "No se pudo bloquear.");
        return;
      }
      onPropertyUpdated(data.property);
      setFrom("");
      setTo("");
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setBusy(false);
    }
  }

  async function desbloquear(blockId: string) {
    setBusy(true);
    setError("");
    try {
      const res = await adminFetch(`/api/admin/rent/properties/${propertyId}/block`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accion: "desbloquear", blockId }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "No se pudo desbloquear.");
        return;
      }
      onPropertyUpdated(data.property);
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <label className="block mb-4">
        <span className="text-white/50 text-xs uppercase tracking-wide block mb-1.5">Propiedad</span>
        <select value={propertyId} onChange={(e) => setPropertyId(e.target.value)} className="bg-black border border-white/15 rounded-lg px-3 py-2 text-sm text-white w-full">
          {properties.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </label>

      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <label>
          <span className="text-white/50 text-xs uppercase tracking-wide block mb-1.5">Desde</span>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="bg-black border border-white/15 rounded-lg px-3 py-2 text-sm text-white w-full" />
        </label>
        <label>
          <span className="text-white/50 text-xs uppercase tracking-wide block mb-1.5">Hasta</span>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="bg-black border border-white/15 rounded-lg px-3 py-2 text-sm text-white w-full" />
        </label>
        <label>
          <span className="text-white/50 text-xs uppercase tracking-wide block mb-1.5">Motivo (opcional)</span>
          <select value={reason} onChange={(e) => setReason(e.target.value)} className="bg-black border border-white/15 rounded-lg px-3 py-2 text-sm text-white w-full">
            <option>Mantenimiento</option>
            <option>Uso personal</option>
            <option>Otro</option>
          </select>
        </label>
      </div>

      {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
      <button onClick={bloquear} disabled={busy} className="rounded-full bg-white text-black px-6 py-2.5 text-sm font-medium disabled:opacity-60">
        Bloquear fecha
      </button>

      <h3 className="text-white font-medium mt-10 mb-3">Bloqueos activos — {property?.name}</h3>
      <div className="space-y-2">
        {(property?.blockedRanges.length ?? 0) === 0 && <p className="text-white/30 text-sm">Sin fechas bloqueadas.</p>}
        {property?.blockedRanges.map((b) => (
          <div key={b.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm">
            <span className="text-white">{b.from} → {b.to}</span>
            <span className="text-white/50">{b.reason}</span>
            <button onClick={() => desbloquear(b.id)} disabled={busy} className="text-xs text-red-300 underline">Desbloquear</button>
          </div>
        ))}
      </div>
    </div>
  );
}
