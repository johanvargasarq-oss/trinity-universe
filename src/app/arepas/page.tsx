"use client";

import { worlds } from "@/lib/brands";
import { useRevealWorld } from "@/hooks/useRevealWorld";
import arepasMenu from "@/data/arepas-menu.json";
import WorldNav from "@/components/world/WorldNav";
import WorldHero from "@/components/world/WorldHero";
import BuildYourOwnMenu from "@/components/menu/BuildYourOwnMenu";
import WorldContactBlock from "@/components/world/WorldContactBlock";
import type { BuildStep } from "@/components/menu/BuildYourOwnMenu";

const world = worlds.arepas;

export default function ArepasPage() {
  useRevealWorld();

  return (
    <>
      <WorldNav world={world} />
      <WorldHero world={world} />
      <BuildYourOwnMenu world={world} pasos={arepasMenu.pasos as BuildStep[]} />
      <WorldContactBlock world={world} />
    </>
  );
}
