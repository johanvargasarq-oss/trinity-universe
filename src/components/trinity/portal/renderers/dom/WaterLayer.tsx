"use client";

import { usePortalScene } from "../../scene-context";

/**
 * Subtle animated glint over the water areas already painted into the base
 * illustration (the Beach Rental shoreline and the Slush waterfall) — not a
 * full water simulation, just enough shimmer to feel alive at rest.
 */
const WATER_PATCHES = [
  { clipPath: "polygon(20% 88%, 74% 88%, 74% 100%, 20% 100%)" }, // Beach Rental shoreline
  { clipPath: "polygon(0% 68%, 20% 68%, 14% 88%, 0% 88%)" }, // Slush waterfall
];

export default function WaterLayer() {
  const { prefersReducedMotion } = usePortalScene();
  if (prefersReducedMotion) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {WATER_PATCHES.map((patch, i) => (
        <div
          key={i}
          className="absolute inset-0 water-shimmer"
          style={{
            clipPath: patch.clipPath,
            mixBlendMode: "screen",
          }}
        />
      ))}
    </div>
  );
}
