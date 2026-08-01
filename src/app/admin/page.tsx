"use client";

import { useState } from "react";
import type { Booking } from "@/lib/redis";

export default function AdminPage() {
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load(passValue: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings/admin", { headers: { "x-admin-pass": passValue } });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error");
        setAuthed(false);
        return;
      }
      setBookings(data.bookings);
      setAuthed(true);
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  async function accion(id: string, accion: "confirmar" | "eliminar") {
    await fetch("/api/bookings/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-pass": pass },
      body: JSON.stringify({ id, accion }),
    });
    load(pass);
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl text-white mb-6 text-center">Panel Trinity</h1>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load(pass)}
            placeholder="Clave de administrador"
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/40"
          />
          <button
            onClick={() => load(pass)}
            disabled={loading}
            className="w-full mt-3 rounded-lg bg-white text-black py-3 font-medium disabled:opacity-60"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
          {error && <p className="text-red-400 text-sm mt-3 text-center">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl text-white">Reservas Trinity</h1>
          <button onClick={() => load(pass)} className="text-sm text-white/60 hover:text-white">
            Actualizar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-white/80">
            <thead className="text-white/40 uppercase text-xs">
              <tr>
                <th className="py-2 pr-4">Mundo</th>
                <th className="py-2 pr-4">Nombre</th>
                <th className="py-2 pr-4">WhatsApp</th>
                <th className="py-2 pr-4">Servicio</th>
                <th className="py-2 pr-4">Staff</th>
                <th className="py-2 pr-4">Sede</th>
                <th className="py-2 pr-4">Fecha</th>
                <th className="py-2 pr-4">Hora</th>
                <th className="py-2 pr-4">Estado</th>
                <th className="py-2 pr-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t border-white/10">
                  <td className="py-2 pr-4">{b.worldId}</td>
                  <td className="py-2 pr-4">{b.nombre}</td>
                  <td className="py-2 pr-4">{b.telefono}</td>
                  <td className="py-2 pr-4">{b.servicio}</td>
                  <td className="py-2 pr-4">{b.staff}</td>
                  <td className="py-2 pr-4">{b.sede}</td>
                  <td className="py-2 pr-4">{b.fecha}</td>
                  <td className="py-2 pr-4">{b.hora}</td>
                  <td className="py-2 pr-4">
                    <span className={b.estado === "confirmada" ? "text-emerald-400" : "text-amber-400"}>
                      {b.estado}
                    </span>
                  </td>
                  <td className="py-2 pr-4 flex gap-2">
                    {b.estado !== "confirmada" && (
                      <button onClick={() => accion(b.id, "confirmar")} className="text-emerald-400 hover:underline">
                        Confirmar
                      </button>
                    )}
                    <button onClick={() => accion(b.id, "eliminar")} className="text-red-400 hover:underline">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-white/40">
                    No hay reservas todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
