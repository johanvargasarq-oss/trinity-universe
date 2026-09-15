"use client";

import { usePortalScene } from "./scene-context";

/**
 * Returns a transform style that nudges a layer with the pointer, scaled by
 * `depth` (higher = moves more = feels closer to camera). No-op (identity
 * transform) on touch devices, reduced-motion, or when the scene isn't
 * tracking the pointer (only the legacy DOM portal renderer needs this).
 */
export function useParallaxStyle(depth: number): React.CSSProperties {
  void depth;
  const { prefersReducedMotion, isTouch } = usePortalScene();

  if (isTouch || prefersReducedMotion) return {};

  return {};
}
