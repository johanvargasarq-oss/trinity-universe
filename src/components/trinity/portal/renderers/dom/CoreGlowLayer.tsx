"use client";

import { MASTER_GRADIENT } from "@/lib/brands";
import { usePortalScene } from "../../scene-context";

export default function CoreGlowLayer() {
  const { prefersReducedMotion } = usePortalScene();

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
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
