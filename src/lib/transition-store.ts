import { create } from "zustand";
import type { WorldId } from "@/lib/brands";

export type TransitionPhase = "idle" | "activating" | "covering" | "revealing";

interface TransitionState {
  phase: TransitionPhase;
  worldId: WorldId | null;
  originRect: DOMRect | null;
  beginActivation: (worldId: WorldId) => void;
  enterWorld: (worldId: WorldId, rect: DOMRect) => void;
  markRevealReady: () => void;
  reset: () => void;
}

export const useTransitionStore = create<TransitionState>((set) => ({
  phase: "idle",
  worldId: null,
  originRect: null,
  // Fires the instant a click is accepted, well before the camera-zoom
  // covering phase — this is what makes disabled={phase !== "idle"} on
  // every island button take effect immediately, so a second click during
  // the pre-travel animation can't hijack the in-flight transition.
  beginActivation: (worldId) => set({ phase: "activating", worldId }),
  enterWorld: (worldId, rect) => set({ phase: "covering", worldId, originRect: rect }),
  markRevealReady: () => set({ phase: "revealing" }),
  reset: () => set({ phase: "idle", worldId: null, originRect: null }),
}));
