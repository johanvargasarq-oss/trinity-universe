"use client";

import Image from "next/image";
import ParticleField from "@/components/trinity/ParticleField";
import { useParallaxStyle } from "../../useParallaxStyle";
import WaterLayer from "./WaterLayer";
import CloudsLayer from "./CloudsLayer";
import EnergyLinesLayer from "./EnergyLinesLayer";
import CoreGlowLayer from "./CoreGlowLayer";

/**
 * Phase 1 renderer: the 4k illustration plus independent animated DOM/CSS
 * layers on top. A Phase 2 `WebglPortalRenderer` can implement the same
 * "just render into this box" contract later — PortalScene doesn't care
 * which one it's holding.
 */
export default function DomPortalRenderer() {
  const imageParallax = useParallaxStyle(2);

  return (
    <>
      <div className="absolute inset-0" style={imageParallax}>
        <Image
          src="/media/trinity/portal-map.png"
          alt="Universo Trinity: Barbería, Fries, Slush, Arepas y Rent"
          fill
          priority
          className="object-contain sm:object-cover"
          sizes="100vw"
        />
      </div>

      <WaterLayer />
      <EnergyLinesLayer />
      <CoreGlowLayer />
      <CloudsLayer />
      <div className="absolute inset-0">
        <ParticleField kind="fireflies" count={28} />
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 22%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.35) 100%)",
        }}
      />
    </>
  );
}
