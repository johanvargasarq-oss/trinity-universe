"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { worldList, MASTER_GRADIENT } from "@/lib/brands";
import { usePortalScene } from "../../scene-context";
import { FOCUS_TRAVEL_MS } from "../../focus-constants";

const CORE = { x: 50, y: 48 };

export default function EnergyLinesLayer() {
  const { prefersReducedMotion, focusedWorldId } = usePortalScene();
  const pulseRef = useRef<SVGCircleElement>(null);

  const focusedWorld = worldList.find((w) => w.id === focusedWorldId) ?? null;

  useGSAP(
    () => {
      const el = pulseRef.current;
      if (!el || !focusedWorld || prefersReducedMotion) return;

      const islandX = focusedWorld.hotspot.x + focusedWorld.hotspot.w / 2;
      const islandY = focusedWorld.hotspot.y + focusedWorld.hotspot.h / 2;

      gsap.set(el, { attr: { cx: CORE.x, cy: CORE.y }, opacity: 0, fill: focusedWorld.theme.accent });
      gsap
        .timeline()
        .to(el, { opacity: 1, duration: 0.1 })
        .to(el, {
          attr: { cx: islandX, cy: islandY },
          duration: FOCUS_TRAVEL_MS / 1000,
          ease: "power2.inOut",
        })
        .to(el, { opacity: 0, duration: 0.25 }, `-=0.1`);
    },
    { dependencies: [focusedWorldId], revertOnUpdate: true }
  );

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="energy-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={MASTER_GRADIENT.from} stopOpacity="0" />
          <stop offset="50%" stopColor={MASTER_GRADIENT.via} stopOpacity="0.8" />
          <stop offset="100%" stopColor={MASTER_GRADIENT.to} stopOpacity="0" />
        </linearGradient>
        <filter id="energy-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="1.1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {worldList.map((world) => {
        const islandX = world.hotspot.x + world.hotspot.w / 2;
        const islandY = world.hotspot.y + world.hotspot.h / 2;
        const isFocused = focusedWorldId === world.id;
        return (
          <line
            key={world.id}
            x1={CORE.x}
            y1={CORE.y}
            x2={islandX}
            y2={islandY}
            stroke={isFocused ? world.theme.accent : "url(#energy-gradient)"}
            strokeWidth={isFocused ? 0.55 : 0.3}
            strokeLinecap="round"
            className={prefersReducedMotion ? undefined : "energy-line"}
            style={{
              opacity: prefersReducedMotion ? 0.25 : isFocused ? 1 : undefined,
              transition: "stroke-width 0.3s ease, opacity 0.3s ease",
              filter: isFocused ? "url(#energy-glow)" : undefined,
            }}
          />
        );
      })}

      <circle ref={pulseRef} cx={CORE.x} cy={CORE.y} r="0.9" opacity="0" filter="url(#energy-glow)" />
    </svg>
  );
}
