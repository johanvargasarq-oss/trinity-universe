"use client";

import { PortalSceneProvider } from "./scene-context";
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
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 aspect-video sm:inset-0 sm:translate-y-0 sm:aspect-auto">
        <DomPortalRenderer />
        {children}
      </div>
    </PortalSceneProvider>
  );
}
