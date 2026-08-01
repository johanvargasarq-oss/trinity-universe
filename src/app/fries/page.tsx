"use client";

import { worlds } from "@/lib/brands";
import { useRevealWorld } from "@/hooks/useRevealWorld";
import friesMenu from "@/data/fries-menu.json";
import WorldNav from "@/components/world/WorldNav";
import WorldHero from "@/components/world/WorldHero";
import MenuCatalog from "@/components/menu/MenuCatalog";
import WorldContactBlock from "@/components/world/WorldContactBlock";

const world = worlds.fries;

export default function FriesPage() {
  useRevealWorld();

  return (
    <>
      <WorldNav world={world} />
      <WorldHero world={world} />
      <MenuCatalog world={world} categorias={friesMenu.categorias} />
      <WorldContactBlock world={world} />
    </>
  );
}
