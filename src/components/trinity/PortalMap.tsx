"use client";

import { worldList } from "@/lib/brands";
import { useIsMobileViewport } from "@/hooks/useIsMobileViewport";
import IslandHotspot from "./IslandHotspot";
import PortalScene from "./portal/PortalScene";
import SoundToggle from "./portal/SoundToggle";

export default function PortalMap() {
  const isMobile = useIsMobileViewport();

  // Unknown until the client measures the viewport — hold off rendering
  // so we never flash the wrong hotspot layout.
  if (isMobile === null) return <section className="h-screen w-screen bg-black" />;

  // Neither portal-map image includes Trini Vapers yet — only render
  // hotspots for worlds that actually appear in the currently shown art.
  const worldsToShow = worldList.filter((world) =>
    isMobile ? Boolean(world.mobileHotspot) : world.id !== "vapers"
  );

  return (
    <section className="relative h-screen w-screen overflow-hidden bg-black">
      <PortalScene isMobile={isMobile}>
        {worldsToShow.map((world) => (
          <IslandHotspot key={world.id} world={world} hotspot={isMobile ? world.mobileHotspot : undefined} />
        ))}
      </PortalScene>

      <SoundToggle />
    </section>
  );
}
