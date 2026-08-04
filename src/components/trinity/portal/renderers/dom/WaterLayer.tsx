"use client";

import { usePortalScene } from "../../scene-context";

/**
 * Real turquoise-water loop (Higgsfield-generated, downscaled to ~640px —
 * it only ever shows inside these small clipped patches, never full-screen)
 * over the water already painted into the base illustration: the Beach
 * Rental shoreline and the Slush waterfall.
 */
const WATER_PATCHES = [
  { clipPath: "polygon(20% 88%, 74% 88%, 74% 100%, 20% 100%)" }, // Beach Rental shoreline
  { clipPath: "polygon(0% 68%, 20% 68%, 14% 88%, 0% 88%)" }, // Slush waterfall
];

export default function WaterLayer() {
  const { prefersReducedMotion } = usePortalScene();
  if (prefersReducedMotion) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {WATER_PATCHES.map((patch, i) => (
        <div key={i} className="absolute inset-0" style={{ clipPath: patch.clipPath }}>
          <video
            className="absolute inset-0 w-full h-full object-cover"
            style={{ mixBlendMode: "soft-light", opacity: 0.9 }}
            src="/media/trinity/water-loop-sm.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        </div>
      ))}
      {/* extra sparkle on top so the seam between video and illustration stays soft */}
      {WATER_PATCHES.map((patch, i) => (
        <div
          key={`shimmer-${i}`}
          className="absolute inset-0 water-shimmer"
          style={{ clipPath: patch.clipPath, mixBlendMode: "screen", opacity: 0.5 }}
        />
      ))}
    </div>
  );
}
