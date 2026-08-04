"use client";

import { MASTER_GRADIENT } from "@/lib/brands";
import { usePortalScene } from "../../scene-context";
import ParticleField from "@/components/trinity/ParticleField";

const RING_DELAYS = [0, 1.6, 3.2];

export default function CoreGlowLayer() {
  const { prefersReducedMotion, isLowPower } = usePortalScene();

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {/* periodic outward energy waves — the core "pinging" the universe */}
      {!prefersReducedMotion &&
        RING_DELAYS.map((delay) => (
          <div
            key={delay}
            className="absolute rounded-full core-wave"
            style={{
              width: "7vw",
              height: "7vw",
              maxWidth: 130,
              maxHeight: 130,
              border: `2px solid ${MASTER_GRADIENT.via}`,
              boxShadow: `0 0 20px 4px ${MASTER_GRADIENT.via}88`,
              animationDelay: `${delay}s`,
            }}
          />
        ))}

      {/* slow breathing glow */}
      <div
        className={`rounded-full ${prefersReducedMotion ? "" : "core-glow"}`}
        style={{
          width: "20vw",
          height: "20vw",
          maxWidth: 360,
          maxHeight: 360,
          background: `radial-gradient(circle, ${MASTER_GRADIENT.via}77 0%, ${MASTER_GRADIENT.from}33 45%, transparent 70%)`,
          filter: "blur(5px)",
        }}
      />

      {/* small particles continuously drifting off the core */}
      {!prefersReducedMotion && !isLowPower && (
        <div className="absolute" style={{ width: "22vw", height: "22vw", maxWidth: 380, maxHeight: 380 }}>
          <ParticleField kind="fireflies" count={14} />
        </div>
      )}
    </div>
  );
}
