"use client";

import { usePortalScene } from "../../scene-context";

/** Subtle static light rays from above the core, pure CSS — no assets. */
export default function GodRaysLayer() {
  const { prefersReducedMotion } = usePortalScene();

  return (
    <div
      className="absolute inset-0 pointer-events-none flex justify-center"
      style={{ mixBlendMode: "screen" }}
    >
      <div
        className={`w-[70vw] max-w-[900px] h-full ${prefersReducedMotion ? "" : "god-rays"}`}
        style={{
          background:
            "conic-gradient(from 90deg at 50% -10%, transparent 82%, rgba(255,235,200,0.16) 86%, transparent 90%, transparent 94%, rgba(255,235,200,0.12) 97%, transparent 100%)",
        }}
      />
    </div>
  );
}
