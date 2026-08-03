"use client";

import { worldList, MASTER_GRADIENT } from "@/lib/brands";
import { usePortalScene } from "../../scene-context";

const CORE = { x: 50, y: 48 };

export default function EnergyLinesLayer() {
  const { prefersReducedMotion } = usePortalScene();

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
      </defs>
      {worldList.map((world) => {
        const islandX = world.hotspot.x + world.hotspot.w / 2;
        const islandY = world.hotspot.y + world.hotspot.h / 2;
        return (
          <line
            key={world.id}
            x1={CORE.x}
            y1={CORE.y}
            x2={islandX}
            y2={islandY}
            stroke="url(#energy-gradient)"
            strokeWidth="0.3"
            strokeLinecap="round"
            className={prefersReducedMotion ? undefined : "energy-line"}
            style={{ opacity: prefersReducedMotion ? 0.25 : undefined }}
          />
        );
      })}
    </svg>
  );
}
