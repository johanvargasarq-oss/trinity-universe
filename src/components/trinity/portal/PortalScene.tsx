"use client";

import { PortalSceneProvider, usePortalScene } from "./scene-context";
import DomPortalRenderer from "./renderers/dom/DomPortalRenderer";

/**
 * Owns the responsive image box (full-bleed on desktop, letterboxed on
 * mobile so no island is ever cropped out) and the shared scene state
 * (pointer/parallax, reduced-motion). `children` are the interactive
 * hotspots — kept outside the renderer so a future WebGL renderer can
 * still sit underneath plain DOM hit-targets.
 */
export default function PortalScene({ children }: { children: React.ReactNode }) {
  return (
    <PortalSceneProvider>
      <PortalSceneBox>{children}</PortalSceneBox>
    </PortalSceneProvider>
  );
}

function PortalSceneBox({ children }: { children: React.ReactNode }) {
  const { isReturning, prefersReducedMotion } = usePortalScene();

  return (
    <div
      className="absolute left-0 right-0 top-1/2 -translate-y-1/2 aspect-video sm:inset-0 sm:translate-y-0 sm:aspect-auto"
      style={
        isReturning && !prefersReducedMotion
          ? { animation: "portal-camera-settle 0.9s cubic-bezier(0.16,1,0.3,1) both" }
          : undefined
      }
    >
      <DomPortalRenderer />
      {children}
    </div>
  );
}
