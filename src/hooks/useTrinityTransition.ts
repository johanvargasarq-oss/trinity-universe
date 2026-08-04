"use client";

import { useTransitionStore } from "@/lib/transition-store";
import type { WorldId } from "@/lib/brands";

export function useTrinityTransition() {
  const phase = useTransitionStore((s) => s.phase);
  const beginActivation = useTransitionStore((s) => s.beginActivation);
  const enterWorld = useTransitionStore((s) => s.enterWorld);

  return {
    phase,
    // Locks out every island immediately (phase leaves "idle" synchronously).
    // Returns false if a click already won the race so callers can bail.
    activate: (worldId: WorldId) => {
      if (phase !== "idle") return false;
      beginActivation(worldId);
      return true;
    },
    enterWorld: (worldId: WorldId, el: HTMLElement) => {
      enterWorld(worldId, el.getBoundingClientRect());
    },
  };
}
