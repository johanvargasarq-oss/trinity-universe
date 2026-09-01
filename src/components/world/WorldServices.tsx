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
  eyebrow = "Catálogo de servicios",
  subtitle,
  video,
  bookingHref = "#reservas",
}: {
  world: WorldConfig;
  services: Service[];
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  /** Optional video shown alongside the catalog (mp4 path). Falls back to a centered layout without it. */
  video?: string;
  bookingHref?: string;
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

  const cards = (
    <div className="grid sm:grid-cols-2 gap-4">
      {services.map((s) => (
        <div
          key={s.title}
          className="service-card rounded-2xl p-6 border flex flex-col gap-4"
          style={{ borderColor: world.theme.border, background: world.theme.bgAlt }}
        >
          <div>
            <h3 className="text-world-text font-medium text-lg mb-1">{s.title}</h3>
            <p className="text-world-text-muted text-sm">{s.description}</p>
          </div>
          <div className="mt-auto flex items-end justify-between gap-3">
            {s.meta && (
              <span className="text-sm font-medium whitespace-nowrap" style={{ color: world.theme.accent }}>
                {s.meta}
              </span>
            )}
            <a
              href={bookingHref}
              className="shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-transform hover:scale-105"
              style={{ background: world.theme.accent, color: "#0a0a0a" }}
            >
              Reservar
            </a>
          </div>
        </div>
      ))}
    </div>
  );

  if (!video) {
    return (
      <section ref={containerRef} className="relative py-24 px-5 sm:px-10 bg-world-bg">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl text-world-text mb-10">{title}</h2>
          {cards}
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="relative py-24 px-5 sm:px-10 bg-world-bg">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div className="relative rounded-2xl overflow-hidden aspect-[4/5] lg:aspect-auto lg:self-stretch lg:min-h-[560px]">
          <video
            src={video}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div>
          <span
            className="inline-block text-xs uppercase tracking-[0.25em] font-medium rounded-full px-4 py-1.5 mb-5"
            style={{ color: world.theme.accent, background: world.theme.accentSoft }}
          >
            {eyebrow}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-world-text mb-3">{title}</h2>
          {subtitle && <p className="text-world-text-muted mb-8 leading-relaxed">{subtitle}</p>}
          {cards}
        </div>
      </div>
    </section>
  );
}
