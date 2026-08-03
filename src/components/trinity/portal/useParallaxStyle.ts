"use client";

import { usePortalScene } from "./scene-context";

/**
 * Returns a transform style that nudges a layer opposite/with the pointer,
 * scaled by `depth` (higher = moves more = feels closer to camera).
 * No-op (identity transform) on touch devices or reduced-motion.
 */
export function useParallaxStyle(depth: number): React.CSSProperties {
  const { pointer, prefersReducedMotion, isTouch } = usePortalScene();

  if (isTouch || prefersReducedMotion) return {};

  const x = pointer.x * depth;
  const y = pointer.y * depth;

  return {
    transform: `translate3d(${x}px, ${y}px, 0)`,
    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
  };
}
