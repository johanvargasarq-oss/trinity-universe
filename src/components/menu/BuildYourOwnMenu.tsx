"use client";

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
  opciones: BuildStepOption[];
}

const currency = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export default function BuildYourOwnMenu({ world, pasos }: { world: WorldConfig; pasos: BuildStep[] }) {
  return (
    <section className="relative py-24 px-5 sm:px-10 bg-world-bg">
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
              <span
                className="font-display text-xl"
                style={{ color: world.theme.accent }}
              >
                {paso.numero}
              </span>
              <h3 className="text-world-text text-lg sm:text-xl font-medium">{paso.titulo}</h3>
            </div>
            {paso.nota && <p className="text-world-text-muted text-sm mb-5">{paso.nota}</p>}

            <div className={paso.opciones[0]?.imagen ? "grid sm:grid-cols-3 gap-4" : "grid sm:grid-cols-2 lg:grid-cols-4 gap-3"}>
              {paso.opciones.map((op) =>
                op.imagen ? (
                  <div
                    key={op.id}
                    className="rounded-2xl overflow-hidden border"
                    style={{ borderColor: world.theme.border, background: world.theme.bgAlt }}
                  >
                    <div className="relative aspect-[4/3]">
                      <Image src={op.imagen} alt={op.nombre} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
                    </div>
                    <div className="p-4">
                      <div className="text-world-text font-medium">{op.nombre}</div>
                      {op.precio !== undefined && (
                        <div className="text-sm font-medium mt-1" style={{ color: world.theme.accent }}>
                          {currency.format(op.precio)}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    key={op.id}
                    className="rounded-xl border px-4 py-3"
                    style={{ borderColor: world.theme.border, background: world.theme.bgAlt }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-world-text text-sm font-medium">{op.nombre}</span>
                      {op.precio !== undefined && (
                        <span className="text-sm shrink-0" style={{ color: world.theme.accent }}>
                          {currency.format(op.precio)}
                        </span>
                      )}
                    </div>
                    {op.descripcion && <p className="text-world-text-muted text-xs mt-1">{op.descripcion}</p>}
                  </div>
                )
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
