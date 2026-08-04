"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { WorldId } from "@/lib/brands";
import { RETURNING_KEY } from "./focus-constants";

export interface PortalPointer {
  /** -1..1, 0 = center. Only updates on fine-pointer (mouse) devices. */
  x: number;
  y: number;
}

export interface PortalSceneState {
  pointer: PortalPointer;
  prefersReducedMotion: boolean;
  isTouch: boolean;
  /** Reduce particle counts / skip nonessential layers on weak hardware. */
  isLowPower: boolean;
  focusedWorldId: WorldId | null;
  setFocusedWorldId: (id: WorldId | null) => void;
  /** True for a moment right after navigating back from a world — drives the "camera pulls back" settle. */
  isReturning: boolean;
}

/**
 * Shared "world state" any renderer (DOM/CSS today, WebGL/Three.js later)
 * can read without knowing about the others. Swapping the renderer in
 * PortalScene.tsx later only means implementing a new component against
 * this same context — no changes needed here or in the hotspot/data layer.
 */
const PortalSceneContext = createContext<PortalSceneState>({
  pointer: { x: 0, y: 0 },
  prefersReducedMotion: false,
  isTouch: false,
  isLowPower: false,
  focusedWorldId: null,
  setFocusedWorldId: () => {},
  isReturning: false,
});

export const usePortalScene = () => useContext(PortalSceneContext);

export function PortalSceneProvider({ children }: { children: React.ReactNode }) {
  const [pointer, setPointer] = useState<PortalPointer>({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [isLowPower, setIsLowPower] = useState(false);
  const [focusedWorldId, setFocusedWorldId] = useState<WorldId | null>(null);
  const [isReturning, setIsReturning] = useState(false);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touchQuery = window.matchMedia("(pointer: coarse)");
    setPrefersReducedMotion(motionQuery.matches);
    setIsTouch(touchQuery.matches);
    const cores = navigator.hardwareConcurrency ?? 8;
    const mem = (navigator as { deviceMemory?: number }).deviceMemory ?? 8;
    setIsLowPower(cores <= 4 || mem <= 4);

    const onMotionChange = () => setPrefersReducedMotion(motionQuery.matches);
    const onTouchChange = () => setIsTouch(touchQuery.matches);
    motionQuery.addEventListener("change", onMotionChange);
    touchQuery.addEventListener("change", onTouchChange);

    return () => {
      motionQuery.removeEventListener("change", onMotionChange);
      touchQuery.removeEventListener("change", onTouchChange);
    };
  }, []);

  useEffect(() => {
    if (isTouch || prefersReducedMotion) return;

    const onMove = (e: PointerEvent) => {
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        setPointer({
          x: (e.clientX / window.innerWidth) * 2 - 1,
          y: (e.clientY / window.innerHeight) * 2 - 1,
        });
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [isTouch, prefersReducedMotion]);

  // If we just navigated back from a world (TrinityCorner sets this before
  // pushing to "/"), briefly re-focus that island so energy visibly
  // "returns to the core" instead of the portal just appearing neutral.
  useEffect(() => {
    const returningFrom = sessionStorage.getItem(RETURNING_KEY);
    if (!returningFrom) return;
    sessionStorage.removeItem(RETURNING_KEY);
    setFocusedWorldId(returningFrom as WorldId);
    setIsReturning(true);
    const t = setTimeout(() => {
      setFocusedWorldId(null);
      setIsReturning(false);
    }, 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <PortalSceneContext.Provider
      value={{ pointer, prefersReducedMotion, isTouch, isLowPower, focusedWorldId, setFocusedWorldId, isReturning }}
    >
      {children}
    </PortalSceneContext.Provider>
  );
}
