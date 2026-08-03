"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import type { WorldConfig } from "@/lib/brands";

export interface BuildStepOption {
  id: string;
  nombre: string;
  precio?: number;
  descripcion?: string;
  imagen?: string;
}

export interface BuildStep {
  id: string;
  numero: number;
  titulo: string;
  seleccion: "una" | "multiple";
  nota?: string;
  precioExtra?: number;
  incluidas?: number;
  opciones: BuildStepOption[];
}

export interface BuildSelection {
  base: BuildStepOption;
  extras: { step: BuildStep; opciones: BuildStepOption[] }[];
}

const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export default function BuildYourOwnMenu({
  world,
  pasos,
  onAddToCart,
}: {
  world: WorldConfig;
  pasos: BuildStep[];
  onAddToCart?: (selection: BuildSelection, unitPrice: number, quantity: number) => void;
}) {
  const baseStep = pasos.find((p) => p.seleccion === "una");
  const multiSteps = pasos.filter((p) => p.seleccion === "multiple");

  const [baseId, setBaseId] = useState<string | null>(null);
  const [selectedByStep, setSelectedByStep] = useState<Record<string, string[]>>({});
  const [qty, setQty] = useState(1);

  const base = baseStep?.opciones.find((o) => o.id === baseId) ?? null;

  function toggle(stepId: string, optionId: string) {
    setSelectedByStep((prev) => {
      const current = prev[stepId] ?? [];
      const next = current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId];
      return { ...prev, [stepId]: next };
    });
  }

  const { extras, extraCost, extraSummary } = useMemo(() => {
    const extras: { step: BuildStep; opciones: BuildStepOption[] }[] = [];
    let extraCost = 0;
    const extraSummary: string[] = [];

    for (const step of multiSteps) {
      const ids = selectedByStep[step.id] ?? [];
      const opciones = ids.map((id) => step.opciones.find((o) => o.id === id)).filter((o): o is BuildStepOption => Boolean(o));
      extras.push({ step, opciones });

      const priced = opciones.reduce((sum, o) => sum + (o.precio ?? 0), 0);
      extraCost += priced;

      if (step.incluidas !== undefined && step.precioExtra) {
        const overIncluded = Math.max(0, opciones.length - step.incluidas);
        if (overIncluded > 0) {
          extraCost += overIncluded * step.precioExtra;
          extraSummary.push(`+${overIncluded} ${step.titulo.toLowerCase()} extra`);
        }
      }
    }
    return { extras, extraCost, extraSummary };
  }, [multiSteps, selectedByStep]);

  const unitPrice = (base?.precio ?? 0) + extraCost;
  const canAdd = Boolean(base);

  function handleAdd() {
    if (!base) return;
    onAddToCart?.({ base, extras }, unitPrice, qty);
    setQty(1);
  }

  return (
    <section className="relative py-24 px-5 sm:px-10 bg-world-bg pb-40">
      <div className="max-w-5xl mx-auto space-y-16">
        <h2 className="font-display text-2xl sm:text-3xl text-world-text">Arma tu pedido</h2>

        {pasos.map((paso, i) => (
          <motion.div
            key={paso.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
          >
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-display text-xl" style={{ color: world.theme.accent }}>
                {paso.numero}
              </span>
              <h3 className="text-world-text text-lg sm:text-xl font-medium">{paso.titulo}</h3>
              {paso.seleccion === "una" && !base && (
                <span className="text-xs opacity-60 text-world-text-muted">(obligatorio)</span>
              )}
            </div>
            {paso.nota && <p className="text-world-text-muted text-sm mb-5">{paso.nota}</p>}
            {paso.incluidas !== undefined && (
              <p className="text-world-text-muted text-xs mb-4">
                {(selectedByStep[paso.id] ?? []).length} seleccionadas · {paso.incluidas} incluidas
                {(selectedByStep[paso.id] ?? []).length > paso.incluidas && paso.precioExtra
                  ? ` · +${currency.format(((selectedByStep[paso.id] ?? []).length - paso.incluidas) * paso.precioExtra)}`
                  : ""}
              </p>
            )}

            <div className={paso.opciones[0]?.imagen ? "grid sm:grid-cols-3 gap-4" : "grid sm:grid-cols-2 lg:grid-cols-4 gap-3"}>
              {paso.opciones.map((op) => {
                const isSelected = paso.seleccion === "una" ? baseId === op.id : (selectedByStep[paso.id] ?? []).includes(op.id);
                const handleClick = () => (paso.seleccion === "una" ? setBaseId(op.id) : toggle(paso.id, op.id));

                return op.imagen ? (
                  <button
                    key={op.id}
                    onClick={handleClick}
                    className="rounded-2xl overflow-hidden border text-left transition-colors"
                    style={{ borderColor: isSelected ? world.theme.accent : world.theme.border, background: world.theme.bgAlt }}
                  >
                    <div className="relative aspect-[4/3]">
                      <Image src={op.imagen} alt={op.nombre} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
                      {isSelected && (
                        <div
                          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: world.theme.accent, color: "#0a0a0a" }}
                        >
                          ✓
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-world-text font-medium">{op.nombre}</div>
                      {op.precio !== undefined && (
                        <div className="text-sm font-medium mt-1" style={{ color: world.theme.accent }}>
                          {currency.format(op.precio)}
                        </div>
                      )}
                    </div>
                  </button>
                ) : (
                  <button
                    key={op.id}
                    onClick={handleClick}
                    className="rounded-xl border px-4 py-3 text-left transition-colors"
                    style={{ borderColor: isSelected ? world.theme.accent : world.theme.border, background: isSelected ? world.theme.accentSoft : world.theme.bgAlt }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-world-text text-sm font-medium">
                        {isSelected ? "✓ " : ""}
                        {op.nombre}
                      </span>
                      {op.precio !== undefined && (
                        <span className="text-sm shrink-0" style={{ color: world.theme.accent }}>
                          {currency.format(op.precio)}
                        </span>
                      )}
                    </div>
                    {op.descripcion && <p className="text-world-text-muted text-xs mt-1">{op.descripcion}</p>}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {onAddToCart && (
        <div
          className="fixed bottom-0 inset-x-0 z-30 border-t backdrop-blur-md"
          style={{ borderColor: world.theme.border, background: `${world.theme.bg}ee` }}
        >
          <div className="max-w-5xl mx-auto px-5 sm:px-10 py-4 flex items-center gap-4">
            <div className="flex items-center gap-1.5 rounded-full border px-1" style={{ borderColor: world.theme.border }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center text-world-text-muted" aria-label="Restar">
                −
              </button>
              <span className="text-sm w-5 text-center text-world-text">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-8 h-8 flex items-center justify-center text-world-text-muted" aria-label="Sumar">
                +
              </button>
            </div>
            <div className="hidden sm:block text-sm text-world-text-muted flex-1 truncate">
              {base ? base.nombre : "Elige una base para empezar"}
              {extraSummary.length > 0 && ` · ${extraSummary.join(", ")}`}
            </div>
            <button
              onClick={handleAdd}
              disabled={!canAdd}
              className="rounded-full px-6 py-3 font-medium disabled:opacity-40 whitespace-nowrap"
              style={{ background: world.theme.accent, color: "#0a0a0a" }}
            >
              Agregar · {currency.format(unitPrice * qty)}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
