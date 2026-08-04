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
  const trailRef = useRef<SVGCircleElement>(null);

  const focusedWorld = worldList.find((w) => w.id === focusedWorldId) ?? null;

  useGSAP(
    () => {
      const el = pulseRef.current;
      const trail = trailRef.current;
      if (!el || !trail || !focusedWorld || prefersReducedMotion) return;

      const islandX = focusedWorld.hotspot.x + focusedWorld.hotspot.w / 2;
      const islandY = focusedWorld.hotspot.y + focusedWorld.hotspot.h / 2;
      const travelS = FOCUS_TRAVEL_MS / 1000;

      gsap.set([el, trail], { attr: { cx: CORE.x, cy: CORE.y }, opacity: 0, fill: focusedWorld.theme.accent });
      gsap
        .timeline()
        .to([el, trail], { opacity: 1, duration: 0.1 })
        .to(
          el,
          { attr: { cx: islandX, cy: islandY }, duration: travelS, ease: "power2.inOut" },
          0.05
        )
        .to(
          trail,
          { attr: { cx: islandX, cy: islandY }, duration: travelS, ease: "power2.inOut" },
          0.18
        )
        .to(el, { attr: { r: 2.6 }, duration: 0.18, ease: "power1.out" }, `-=0.18`)
        .to([el, trail], { opacity: 0, duration: 0.35 }, `-=0.05`)
        .set(el, { attr: { r: 1.6 } });
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
        <filter id="energy-glow-strong" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
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
            strokeWidth={isFocused ? 1.1 : 0.4}
            strokeLinecap="round"
            className={prefersReducedMotion ? undefined : "energy-line"}
            style={{
              opacity: prefersReducedMotion ? 0.3 : isFocused ? 1 : undefined,
              transition: "stroke-width 0.3s ease, opacity 0.3s ease",
              filter: isFocused ? "url(#energy-glow-strong)" : undefined,
            }}
          />
        );
      })}

      {/* comet trail behind the main pulse */}
      <circle ref={trailRef} cx={CORE.x} cy={CORE.y} r="1.1" opacity="0" filter="url(#energy-glow)" />
      <circle ref={pulseRef} cx={CORE.x} cy={CORE.y} r="1.6" opacity="0" filter="url(#energy-glow-strong)" />
    </svg>
  );
}
