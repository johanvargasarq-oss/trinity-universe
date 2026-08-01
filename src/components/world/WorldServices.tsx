"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ensureGsapRegistered } from "@/lib/gsap";
import type { WorldConfig } from "@/lib/brands";

export interface Service {
  title: string;
  description: string;
  meta?: string;
}

export default function WorldServices({
  world,
  services,
  title = "Servicios",
}: {
  world: WorldConfig;
  services: Service[];
  title?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      ensureGsapRegistered();
      const cards = gsap.utils.toArray<HTMLElement>(".service-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="relative py-24 px-5 sm:px-10 bg-world-bg">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-2xl sm:text-3xl text-world-text mb-10">{title}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {services.map((s) => (
            <div
              key={s.title}
              className="service-card rounded-2xl p-6 border flex items-start justify-between gap-4"
              style={{ borderColor: world.theme.border, background: world.theme.bgAlt }}
            >
              <div>
                <h3 className="text-world-text font-medium text-lg mb-1">{s.title}</h3>
                <p className="text-world-text-muted text-sm">{s.description}</p>
              </div>
              {s.meta && (
                <span
                  className="shrink-0 text-sm font-medium whitespace-nowrap"
                  style={{ color: world.theme.accent }}
                >
                  {s.meta}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
