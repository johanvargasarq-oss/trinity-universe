"use client";

import { useMemo, useState } from "react";
import type { Property } from "@/lib/db/properties";
import type { Reservation } from "@/lib/db/reservations";
import { currency } from "./shared";

interface ClienteAgregado {
  key: string;
  nombre: string;
  documento: string;
  celular: string;
  correo: string;
  reservas: Reservation[];
}

export default function ClientesTab({ reservations, properties }: { reservations: Reservation[]; properties: Property[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const propertyById = useMemo(() => new Map(properties.map((p) => [p.id, p])), [properties]);

  const clientes = useMemo(() => {
    const map = new Map<string, ClienteAgregado>();
    for (const r of reservations) {
      const key = r.huesped.numeroDocumento || r.huesped.celular;
      if (!map.has(key)) {
        map.set(key, {
          key,
          nombre: r.huesped.nombreCompleto,
          documento: r.huesped.numeroDocumento,
          celular: r.huesped.celular,
          correo: r.huesped.correo,
          reservas: [],
        });
      }
      map.get(key)!.reservas.push(r);
    }
    return [...map.values()].sort((a, b) => b.reservas.length - a.reservas.length);
  }, [reservations]);

  const cliente = clientes.find((c) => c.key === selected);

  if (cliente) {
    const ultima = [...cliente.reservas].sort((a, b) => (a.creadoEn < b.creadoEn ? 1 : -1))[0];
    return (
      <div>
        <button onClick={() => setSelected(null)} className="text-xs text-white/60 hover:text-white underline mb-4">← Volver a clientes</button>
        <h3 className="text-white font-medium text-lg mb-1">{cliente.nombre}</h3>
        <p className="text-white/40 text-sm mb-6">{cliente.documento} · {cliente.celular} · {cliente.correo}</p>
        <h4 className="text-white/50 text-xs uppercase tracking-wide mb-2">Historial de reservas ({cliente.reservas.length})</h4>
        <div className="space-y-2">
          {cliente.reservas
            .sort((a, b) => (a.creadoEn < b.creadoEn ? 1 : -1))
            .map((r) => (
              <div key={r.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm flex justify-between">
                <span className="text-white">{r.codigo} · {propertyById.get(r.propertyId)?.name ?? r.propertyId}</span>
                <span className="text-white/50">{r.checkIn} → {r.checkOut} · {currency.format(r.total)} · {r.estado}</span>
              </div>
            ))}
        </div>
        <p className="text-white/30 text-xs mt-4">Última reserva: {new Date(ultima.creadoEn).toLocaleDateString("es-CO")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-white/80">
          <thead className="text-white/40 uppercase text-xs">
            <tr>
              <th className="py-3 px-4">Nombre</th>
              <th className="py-3 px-4">Documento</th>
              <th className="py-3 px-4">WhatsApp</th>
              <th className="py-3 px-4">Correo</th>
              <th className="py-3 px-4">Reservas</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((c) => (
              <tr key={c.key} className="border-t border-white/10">
                <td className="py-2.5 px-4">{c.nombre}</td>
                <td className="py-2.5 px-4">{c.documento}</td>
                <td className="py-2.5 px-4">{c.celular}</td>
                <td className="py-2.5 px-4">{c.correo}</td>
                <td className="py-2.5 px-4">{c.reservas.length}</td>
                <td className="py-2.5 px-4">
                  <button onClick={() => setSelected(c.key)} className="text-xs underline text-white/60 hover:text-white">Ver historial</button>
                </td>
              </tr>
            ))}
            {clientes.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-white/30">Sin datos suficientes.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
