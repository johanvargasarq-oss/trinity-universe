"use client";

import { usePortalScene } from "../../scene-context";
import { useParallaxStyle } from "../../useParallaxStyle";

/** Very light volumetric haze low over the water/beach areas. */
export default function FogLayer() {
  const { prefersReducedMotion } = usePortalScene();
  const parallaxStyle = useParallaxStyle(3);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={parallaxStyle}>
      <div
        className={`absolute inset-x-0 bottom-0 h-[40%] ${prefersReducedMotion ? "" : "portal-fog"}`}
        style={{
          background: "linear-gradient(0deg, rgba(230,240,245,0.10) 0%, transparent 75%)",
          filter: "blur(10px)",
        }}
      />
    </div>
  );
}
