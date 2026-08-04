"use client";

import { MASTER_GRADIENT } from "@/lib/brands";
import { usePortalScene } from "../../scene-context";

const RING_DELAYS = [0, 2.4, 4.8];

export default function CoreGlowLayer() {
  const { prefersReducedMotion } = usePortalScene();

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {/* periodic outward energy waves — the core "pinging" the universe */}
      {!prefersReducedMotion &&
        RING_DELAYS.map((delay) => (
          <div
            key={delay}
            className="absolute rounded-full core-wave"
            style={{
              width: "6vw",
              height: "6vw",
              maxWidth: 110,
              maxHeight: 110,
              border: `1px solid ${MASTER_GRADIENT.via}`,
              animationDelay: `${delay}s`,
            }}
          />
        ))}

      {/* slow breathing glow */}
      <div
        className={`rounded-full ${prefersReducedMotion ? "" : "core-glow"}`}
        style={{
          width: "18vw",
          height: "18vw",
          maxWidth: 320,
          maxHeight: 320,
          background: `radial-gradient(circle, ${MASTER_GRADIENT.via}55 0%, ${MASTER_GRADIENT.from}22 45%, transparent 70%)`,
          filter: "blur(6px)",
        }}
      />
    </div>
  );
}
