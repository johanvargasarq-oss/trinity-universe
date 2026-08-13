"use client";

import { useEffect, useMemo, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { worlds } from "@/lib/brands";
import type { Property } from "@/lib/db/properties";
import { getStayTotal } from "@/lib/rent-pricing";

const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
const world = worlds.rent;

type Step = "fechas" | "huespedes" | "datos" | "resumen";
const STEPS: { id: Step; label: string }[] = [
  { id: "fechas", label: "Fechas" },
  { id: "huespedes", label: "Huéspedes" },
  { id: "datos", label: "Tus datos" },
  { id: "resumen", label: "Resumen" },
];

const TIPOS_DOCUMENTO = ["Cédula de ciudadanía", "Cédula de extranjería", "Pasaporte", "Otro"];

function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function ReservationFlow({
  property,
  initialCheckIn,
  initialCheckOut,
  initialAdultos,
  initialNinos,
}: {
  property: Property;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialAdultos?: number;
  initialNinos?: number;
}) {
  const [step, setStep] = useState<Step>("fechas");
  const [occupied, setOccupied] = useState<{ from: string; to: string }[]>([]);
  const [range, setRange] = useState<DateRange | undefined>(
    initialCheckIn && initialCheckOut ? { from: new Date(initialCheckIn + "T00:00:00"), to: new Date(initialCheckOut + "T00:00:00") } : undefined
  );
  const [rangeError, setRangeError] = useState("");

  const [adultos, setAdultos] = useState(initialAdultos ?? 1);
  const [ninos, setNinos] = useState(initialNinos ?? 0);
  const [bebes, setBebes] = useState(0);

  const [nombreCompleto, setNombreCompleto] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState(TIPOS_DOCUMENTO[0]);
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [correo, setCorreo] = useState("");
  const [celular, setCelular] = useState("");
  const [pais, setPais] = useState("Colombia");
  const [horaLlegadaEstimada, setHoraLlegadaEstimada] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [aceptaTratamientoDatos, setAceptaTratamientoDatos] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState<{ codigo: string; total: number; noches: number } | null>(null);

  useEffect(() => {
    fetch(`/api/rent/reservations/availability?propertyId=${property.id}`)
      .then((r) => r.json())
      .then((d) => setOccupied(d.occupied || []))
      .catch(() => setOccupied([]));
  }, [property.id]);

  const checkIn = range?.from ? toISO(range.from) : "";
  const checkOut = range?.to ? toISO(range.to) : "";
  const noches = checkIn && checkOut ? Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000) : 0;
  const subtotal = checkIn && checkOut && noches > 0 ? getStayTotal(property, checkIn, checkOut) : 0;
  const total = subtotal;

  const disabledMatchers = useMemo(
    () => [{ before: new Date() }, ...occupied.map((o) => ({ from: new Date(o.from), to: new Date(new Date(o.to).getTime() - 86400000) }))],
    [occupied]
  );

  function rangeHitsOccupied(from: string, to: string): boolean {
    return occupied.some((o) => from < o.to && to > o.from);
  }

  function handleSelectRange(next: DateRange | undefined) {
    setRange(next);
    setRangeError("");
  }

  function goToStep(target: Step) {
    if (target === "huespedes" || target === "datos" || target === "resumen") {
      if (!checkIn || !checkOut || noches <= 0) {
        setRangeError("Elige tu fecha de entrada y salida.");
        return;
      }
      if (rangeHitsOccupied(checkIn, checkOut)) {
        setRangeError("Ese rango incluye fechas no disponibles. Elige otras fechas.");
        return;
      }
    }
    if (target === "datos" || target === "resumen") {
      const totalGuests = adultos + ninos;
      if (adultos < 1) {
        setError("Debe haber al menos 1 adulto.");
        return;
      }
      if (totalGuests > property.capacity.maxGuests || adultos > property.capacity.maxAdults) {
        setError(`Esta propiedad admite máximo ${property.capacity.maxGuests} huéspedes.`);
        return;
      }
    }
    if (target === "resumen") {
      if (!nombreCompleto.trim() || !numeroDocumento.trim() || !correo.trim() || !celular.trim() || !pais.trim()) {
        setError("Completa todos los datos del huésped.");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        setError("Correo inválido.");
        return;
      }
      if (!aceptaTerminos || !aceptaTratamientoDatos) {
        setError("Debes aceptar los términos y el tratamiento de datos personales.");
        return;
      }
    }
    setError("");
    setStep(target);
  }

  async function confirmarReserva() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/rent/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          checkIn,
          checkOut,
          adultos,
          ninos,
          bebes,
          horaLlegadaEstimada: horaLlegadaEstimada || undefined,
          comentarios: comentarios || undefined,
          huesped: { nombreCompleto, tipoDocumento, numeroDocumento, correo, celular, pais },
          aceptaTerminos,
          aceptaTratamientoDatos,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "No se pudo crear la reserva.");
        setSubmitting(false);
        return;
      }
      setConfirmed({ codigo: data.codigo, total: data.total, noches: data.noches });
    } catch {
      setError("No pudimos conectar con el servidor. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmed) {
    return (
      <section id="reservar" className="relative py-24 px-5 sm:px-10 bg-world-bg-alt">
        <div
          className="max-w-lg mx-auto rounded-2xl border p-8 text-center"
          style={{ borderColor: world.theme.accent, background: world.theme.bgAlt }}
        >
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="font-display text-2xl text-world-text mb-2">Solicitud de reserva enviada</h2>
          <p className="text-world-text-muted mb-6">
            Tu código de reserva es <span className="font-medium" style={{ color: world.theme.accent }}>{confirmed.codigo}</span>.
            Queda en estado <strong>pendiente</strong> hasta que el equipo de Trinity la confirme — te avisaremos por correo y WhatsApp.
          </p>
          <div className="text-sm text-world-text-muted space-y-1">
            <div>Propiedad: {property.name}</div>
            <div>Noches: {confirmed.noches}</div>
            <div>Total: {currency.format(confirmed.total)}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="reservar" className="relative py-24 px-5 sm:px-10 bg-world-bg-alt">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display text-2xl sm:text-3xl text-world-text mb-2">Reservar {property.name}</h2>
        <p className="text-world-text-muted mb-8 text-sm">
          Desde {currency.format(property.pricing.basePrice)} / noche · capacidad {property.capacity.maxGuests} huéspedes
        </p>

        {/* Step tracker */}
        <div className="flex flex-wrap gap-2 mb-8">
          {STEPS.map((s, i) => {
            const currentIndex = STEPS.findIndex((x) => x.id === step);
            const isPast = i < currentIndex;
            const isClickable = isPast || s.id === step;
            return (
              <button
                key={s.id}
                type="button"
                disabled={!isClickable}
                onClick={() => isPast && goToStep(s.id)}
                className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs transition-colors"
                style={{
                  background: step === s.id ? world.theme.accentSoft : "transparent",
                  color: step === s.id ? world.theme.accent : isPast ? "var(--world-text)" : "var(--world-text-muted)",
                  border: `1px solid ${step === s.id ? world.theme.accent : world.theme.border}`,
                  cursor: isPast ? "pointer" : "default",
                  opacity: isClickable ? 1 : 0.5,
                }}
              >
                {i + 1}. {s.label}
              </button>
            );
          })}
        </div>

        {/* Persistent summary once dates are chosen */}
        {checkIn && checkOut && noches > 0 && (
          <div
            className="rounded-xl border p-4 mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm"
            style={{ borderColor: world.theme.border, background: world.theme.bgAlt }}
          >
            <div>
              <div className="text-world-text-muted text-xs">Fechas</div>
              <div className="text-world-text">{checkIn} → {checkOut}</div>
            </div>
            <div>
              <div className="text-world-text-muted text-xs">Huéspedes</div>
              <div className="text-world-text">{adultos + ninos + bebes}</div>
            </div>
            <div>
              <div className="text-world-text-muted text-xs">Noches</div>
              <div className="text-world-text">{noches}</div>
            </div>
            <div>
              <div className="text-world-text-muted text-xs">Total</div>
              <div className="font-medium" style={{ color: world.theme.accent }}>{currency.format(total)}</div>
            </div>
          </div>
        )}

        {step === "fechas" && (
          <div>
            <div className="overflow-x-auto pb-2">
              <DayPicker
                mode="range"
                numberOfMonths={2}
                selected={range}
                onSelect={handleSelectRange}
                disabled={disabledMatchers}
                style={{ "--rdp-accent-color": world.theme.accent, "--rdp-accent-background-color": world.theme.accentSoft } as React.CSSProperties}
                className="mx-auto w-fit"
              />
            </div>
            {rangeError && <p className="text-red-400 text-sm mt-3">{rangeError}</p>}
            <button
              onClick={() => goToStep("huespedes")}
              className="mt-6 w-full rounded-full py-3.5 font-medium"
              style={{ background: world.theme.accent, color: "#0a0a0a" }}
            >
              Continuar
            </button>
          </div>
        )}

        {step === "huespedes" && (
          <div>
            <div className="space-y-4">
              {[
                { label: "Adultos", value: adultos, set: setAdultos, min: 1 },
                { label: "Niños", value: ninos, set: setNinos, min: 0 },
                { label: "Bebés", value: bebes, set: setBebes, min: 0 },
              ].map((g) => (
                <div key={g.label} className="flex items-center justify-between rounded-xl border p-4" style={{ borderColor: world.theme.border }}>
                  <span className="text-world-text">{g.label}</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => g.set(Math.max(g.min, g.value - 1))}
                      className="w-8 h-8 rounded-full border flex items-center justify-center"
                      style={{ borderColor: world.theme.border }}
                    >
                      −
                    </button>
                    <span className="w-4 text-center text-world-text">{g.value}</span>
                    <button
                      onClick={() => g.set(g.value + 1)}
                      className="w-8 h-8 rounded-full border flex items-center justify-center"
                      style={{ borderColor: world.theme.border }}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-world-text-muted text-xs mt-3">Capacidad máxima: {property.capacity.maxGuests} huéspedes.</p>
            {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep("fechas")} className="rounded-full px-6 py-3.5 border" style={{ borderColor: world.theme.border, color: "var(--world-text)" }}>
                Atrás
              </button>
              <button
                onClick={() => goToStep("datos")}
                className="flex-1 rounded-full py-3.5 font-medium"
                style={{ background: world.theme.accent, color: "#0a0a0a" }}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === "datos" && (
          <div className="space-y-4">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="text-world-text-muted">Nombre completo</span>
              <input value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} className="rounded-lg border bg-transparent px-3 py-2.5 text-world-text" style={{ borderColor: world.theme.border, background: world.theme.bgAlt }} />
            </label>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="text-world-text-muted">Tipo de documento</span>
                <select value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)} className="rounded-lg border bg-transparent px-3 py-2.5 text-world-text" style={{ borderColor: world.theme.border, background: world.theme.bgAlt }}>
                  {TIPOS_DOCUMENTO.map((t) => (
                    <option key={t} value={t} className="text-black">{t}</option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="text-world-text-muted">Número de documento</span>
                <input value={numeroDocumento} onChange={(e) => setNumeroDocumento(e.target.value)} className="rounded-lg border bg-transparent px-3 py-2.5 text-world-text" style={{ borderColor: world.theme.border, background: world.theme.bgAlt }} />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="text-world-text-muted">Correo electrónico</span>
                <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} className="rounded-lg border bg-transparent px-3 py-2.5 text-world-text" style={{ borderColor: world.theme.border, background: world.theme.bgAlt }} />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="text-world-text-muted">Celular / WhatsApp</span>
                <input type="tel" value={celular} onChange={(e) => setCelular(e.target.value)} placeholder="Ej: 3001234567" className="rounded-lg border bg-transparent px-3 py-2.5 text-world-text" style={{ borderColor: world.theme.border, background: world.theme.bgAlt }} />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="text-world-text-muted">País de residencia</span>
                <input value={pais} onChange={(e) => setPais(e.target.value)} className="rounded-lg border bg-transparent px-3 py-2.5 text-world-text" style={{ borderColor: world.theme.border, background: world.theme.bgAlt }} />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="text-world-text-muted">Hora estimada de llegada (opcional)</span>
                <input type="time" value={horaLlegadaEstimada} onChange={(e) => setHoraLlegadaEstimada(e.target.value)} className="rounded-lg border bg-transparent px-3 py-2.5 text-world-text" style={{ borderColor: world.theme.border, background: world.theme.bgAlt }} />
              </label>
            </div>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="text-world-text-muted">Comentarios o solicitudes especiales (opcional)</span>
              <textarea value={comentarios} onChange={(e) => setComentarios(e.target.value)} rows={2} className="rounded-lg border bg-transparent px-3 py-2.5 text-world-text" style={{ borderColor: world.theme.border, background: world.theme.bgAlt }} />
            </label>

            <label className="flex items-start gap-2 text-xs text-world-text-muted">
              <input type="checkbox" checked={aceptaTerminos} onChange={(e) => setAceptaTerminos(e.target.checked)} className="mt-0.5" />
              Acepto los términos y condiciones de Trinity Beach Rental.
            </label>
            <label className="flex items-start gap-2 text-xs text-world-text-muted">
              <input type="checkbox" checked={aceptaTratamientoDatos} onChange={(e) => setAceptaTratamientoDatos(e.target.checked)} className="mt-0.5" />
              Autorizo el tratamiento de mis datos personales para gestionar esta reserva.
            </label>

            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="flex gap-3">
              <button onClick={() => setStep("huespedes")} className="rounded-full px-6 py-3.5 border" style={{ borderColor: world.theme.border, color: "var(--world-text)" }}>
                Atrás
              </button>
              <button
                onClick={() => goToStep("resumen")}
                className="flex-1 rounded-full py-3.5 font-medium"
                style={{ background: world.theme.accent, color: "#0a0a0a" }}
              >
                Ver resumen
              </button>
            </div>
          </div>
        )}

        {step === "resumen" && (
          <div>
            <div className="rounded-2xl border p-6 space-y-3 text-sm" style={{ borderColor: world.theme.border, background: world.theme.bgAlt }}>
              <div className="font-display text-lg text-world-text mb-2">Trini Beach Rental</div>
              <div className="flex justify-between"><span className="text-world-text-muted">Propiedad</span><span className="text-world-text">{property.name}</span></div>
              <div className="flex justify-between"><span className="text-world-text-muted">Fecha de entrada</span><span className="text-world-text">{checkIn}</span></div>
              <div className="flex justify-between"><span className="text-world-text-muted">Fecha de salida</span><span className="text-world-text">{checkOut}</span></div>
              <div className="flex justify-between"><span className="text-world-text-muted">Número de noches</span><span className="text-world-text">{noches}</span></div>
              <div className="flex justify-between"><span className="text-world-text-muted">Adultos</span><span className="text-world-text">{adultos}</span></div>
              <div className="flex justify-between"><span className="text-world-text-muted">Niños</span><span className="text-world-text">{ninos}</span></div>
              {bebes > 0 && <div className="flex justify-between"><span className="text-world-text-muted">Bebés</span><span className="text-world-text">{bebes}</span></div>}
              <div className="flex justify-between"><span className="text-world-text-muted">Precio por noche</span><span className="text-world-text">{currency.format(Math.round(subtotal / noches))}</span></div>
              <div className="flex justify-between"><span className="text-world-text-muted">Subtotal</span><span className="text-world-text">{currency.format(subtotal)}</span></div>
              <div className="flex justify-between pt-3 border-t" style={{ borderColor: world.theme.border }}>
                <span className="text-world-text font-medium">TOTAL</span>
                <span className="font-display text-lg" style={{ color: world.theme.accent }}>{currency.format(total)}</span>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep("datos")} className="rounded-full px-6 py-3.5 border" style={{ borderColor: world.theme.border, color: "var(--world-text)" }}>
                Atrás
              </button>
              <button
                onClick={confirmarReserva}
                disabled={submitting}
                className="flex-1 rounded-full py-3.5 font-medium disabled:opacity-60"
                style={{ background: world.theme.accent, color: "#0a0a0a" }}
              >
                {submitting ? "Enviando…" : "Confirmar reserva"}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
