import { create } from "zustand";
import type { WorldId } from "@/lib/brands";

export type TransitionPhase = "idle" | "covering" | "revealing";

interface TransitionState {
  phase: TransitionPhase;
  worldId: WorldId | null;
  originRect: DOMRect | null;
  enterWorld: (worldId: WorldId, rect: DOMRect) => void;
  markRevealReady: () => void;
  reset: () => void;
}

export const useTransitionStore = create<TransitionState>((set) => ({
  phase: "idle",
  worldId: null,
  originRect: null,
  enterWorld: (worldId, rect) => set({ phase: "covering", worldId, originRect: rect }),
  markRevealReady: () => set({ phase: "revealing" }),
  reset: () => set({ phase: "idle", worldId: null, originRect: null }),
}));
