"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import type { WorldConfig } from "@/lib/brands";

export interface BookingStaff {
  id: string;
  nombre: string;
  rol?: string;
  foto?: string;
}

export interface BookingService {
  id: string;
  nombre: string;
  precio: number;
  duracionMin: number;
  descripcion: string;
}

export interface BookingFormProps {
  world: WorldConfig;
  whatsapp: string;
  staffLabel?: string;
  staff: BookingStaff[];
  services: BookingService[];
  sedes: string[];
  horasDisponibles: string[];
}

const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export default function BookingForm({
  world,
  whatsapp,
  staffLabel = "profesional",
  staff,
  services,
  sedes,
  horasDisponibles,
}: BookingFormProps) {
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [servicio, setServicio] = useState("");
  const [sede, setSede] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ocupadas, setOcupadas] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "checking" | "sending" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useEffect(() => {
    if (!sede || !fecha || !selectedStaff) {
      setOcupadas([]);
      return;
    }
    const params = new URLSearchParams({ worldId: world.id, sede, fecha, staff: selectedStaff });
    fetch(`/api/bookings/availability?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setOcupadas(data.ocupadas || []))
      .catch(() => setOcupadas([]));
  }, [sede, fecha, selectedStaff, world.id]);

  const horasLibres = horasDisponibles.filter((h) => !ocupadas.includes(h));

  async function handleSubmit() {
    setErrorMsg("");
    if (!servicio || !sede || !fecha || !hora || !nombre.trim() || !telefono.trim()) {
      setErrorMsg("Completa todos los campos, incluyendo tu WhatsApp.");
      return;
    }
    if (!selectedStaff) {
      setErrorMsg(`Elige tu ${staffLabel}.`);
      return;
    }

    setStatus("checking");
    try {
      const params = new URLSearchParams({ worldId: world.id, sede, fecha, staff: selectedStaff });
      const availRes = await fetch(`/api/bookings/availability?${params.toString()}`);
      const availData = await availRes.json();
      if (availData.ocupadas?.includes(hora)) {
        setErrorMsg("Ese horario ya fue confirmado. Por favor elige otro.");
        setOcupadas(availData.ocupadas);
        setStatus("idle");
        return;
      }

      setStatus("sending");
      const staffNombre = staff.find((s) => s.id === selectedStaff)?.nombre ?? selectedStaff;
      const servicioObj = services.find((s) => s.id === servicio);
      const servicioLabel = servicioObj ? `${servicioObj.nombre} — ${currency.format(servicioObj.precio)}` : servicio;

      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          worldId: world.id,
          nombre,
          telefono,
          servicio: servicioLabel,
          total: servicioObj?.precio ?? 0,
          staff: staffNombre,
          sede,
          fecha,
          hora,
        }),
      });

      const fechaFmt = new Date(fecha + "T12:00").toLocaleDateString("es-CO", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const msg =
        `Hola! Quiero reservar una cita en ${world.name} ${world.emoji}\n\n` +
        `👤 Nombre: ${nombre}\n💈 Servicio: ${servicioLabel}\n🧑‍🔧 ${staffLabel[0].toUpperCase() + staffLabel.slice(1)}: ${staffNombre}\n` +
        `📍 Sede: ${sede}\n📅 Fecha: ${fechaFmt}\n🕐 Hora: ${hora}\n\n¿Tienen disponibilidad?`;
      window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
      setStatus("idle");
    } catch {
      setErrorMsg("No pudimos conectar con el servidor de reservas. Intenta de nuevo.");
      setStatus("error");
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <span className="text-sm text-world-text-muted uppercase tracking-wide">
          Elige tu {staffLabel}
        </span>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {staff.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedStaff(s.id)}
              className="rounded-xl border overflow-hidden text-left transition-colors"
              style={{
                borderColor: selectedStaff === s.id ? world.theme.accent : world.theme.border,
                background: selectedStaff === s.id ? world.theme.accentSoft : world.theme.bgAlt,
              }}
            >
              {s.foto && (
                <div className="relative w-full aspect-[3/4]">
                  <Image src={s.foto} alt={s.nombre} fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
                </div>
              )}
              <div className="p-3">
                <div className="text-world-text text-sm font-medium">{s.nombre}</div>
                {s.rol && <div className="text-world-text-muted text-xs mt-0.5">{s.rol}</div>}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-world-text-muted">Servicio</span>
          <select
            value={servicio}
            onChange={(e) => setServicio(e.target.value)}
            className="rounded-lg border bg-transparent px-3 py-2.5 text-world-text"
            style={{ borderColor: world.theme.border, background: world.theme.bgAlt }}
          >
            <option value="">— Selecciona un servicio —</option>
            {services.map((s) => (
              <option key={s.id} value={s.id} className="text-black">
                {s.nombre} — {currency.format(s.precio)} · {s.duracionMin} min
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-world-text-muted">Sede</span>
          <select
            value={sede}
            onChange={(e) => setSede(e.target.value)}
            className="rounded-lg border bg-transparent px-3 py-2.5 text-world-text"
            style={{ borderColor: world.theme.border, background: world.theme.bgAlt }}
          >
            <option value="">— Selecciona una sede —</option>
            {sedes.map((s) => (
              <option key={s} value={s} className="text-black">
                {s}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-world-text-muted">Fecha</span>
          <input
            type="date"
            min={minDate}
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="rounded-lg border bg-transparent px-3 py-2.5 text-world-text"
            style={{ borderColor: world.theme.border, background: world.theme.bgAlt }}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-world-text-muted">Hora</span>
          <select
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="rounded-lg border bg-transparent px-3 py-2.5 text-world-text"
            style={{ borderColor: world.theme.border, background: world.theme.bgAlt }}
          >
            <option value="">— Selecciona una hora —</option>
            {horasLibres.map((h) => (
              <option key={h} value={h} className="text-black">
                {h}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-world-text-muted">Tu nombre</span>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="¿Cómo te llamas?"
            className="rounded-lg border bg-transparent px-3 py-2.5 text-world-text placeholder:text-world-text-muted"
            style={{ borderColor: world.theme.border, background: world.theme.bgAlt }}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="text-world-text-muted">Tu WhatsApp</span>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Ej: 3001234567"
            className="rounded-lg border bg-transparent px-3 py-2.5 text-world-text placeholder:text-world-text-muted"
            style={{ borderColor: world.theme.border, background: world.theme.bgAlt }}
          />
        </label>
      </div>

      {errorMsg && <p className="text-sm text-red-400 mt-4">{errorMsg}</p>}

      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={status === "checking" || status === "sending"}
        className="mt-6 w-full rounded-full py-3.5 font-medium disabled:opacity-60"
        style={{ background: world.theme.accent, color: "#0a0a0a" }}
      >
        {status === "checking"
          ? "Verificando disponibilidad…"
          : status === "sending"
            ? "Abriendo WhatsApp…"
            : "Confirmar cita por WhatsApp"}
      </motion.button>
      <p className="text-xs text-world-text-muted text-center mt-3">
        Al confirmar se abrirá WhatsApp con todos los datos de tu cita.
      </p>
    </div>
  );
}
