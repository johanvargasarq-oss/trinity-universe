"use client";

import { useTransitionStore } from "@/lib/transition-store";
import type { WorldId } from "@/lib/brands";

export function useTrinityTransition() {
  const enterWorld = useTransitionStore((s) => s.enterWorld);
  const phase = useTransitionStore((s) => s.phase);

  return {
    phase,
    enterWorld: (worldId: WorldId, el: HTMLElement) => {
      if (phase !== "idle") return;
      enterWorld(worldId, el.getBoundingClientRect());
    },
  };
}
