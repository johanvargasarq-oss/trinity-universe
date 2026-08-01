"use client";

import { useEffect } from "react";
import { useTransitionStore } from "@/lib/transition-store";

/** Call from a world page so the TransitionOverlay knows it's safe to reveal. */
export function useRevealWorld() {
  const markRevealReady = useTransitionStore((s) => s.markRevealReady);
  const phase = useTransitionStore((s) => s.phase);

  useEffect(() => {
    if (phase === "covering") {
      const id = requestAnimationFrame(() => markRevealReady());
      return () => cancelAnimationFrame(id);
    }
  }, [phase, markRevealReady]);
}
