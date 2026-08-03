"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

export interface PortalPointer {
  /** -1..1, 0 = center. Only updates on fine-pointer (mouse) devices. */
  x: number;
  y: number;
}

export interface PortalSceneState {
  pointer: PortalPointer;
  prefersReducedMotion: boolean;
  isTouch: boolean;
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
});

export const usePortalScene = () => useContext(PortalSceneContext);

export function PortalSceneProvider({ children }: { children: React.ReactNode }) {
  const [pointer, setPointer] = useState<PortalPointer>({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touchQuery = window.matchMedia("(pointer: coarse)");
    setPrefersReducedMotion(motionQuery.matches);
    setIsTouch(touchQuery.matches);

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

  return (
    <PortalSceneContext.Provider value={{ pointer, prefersReducedMotion, isTouch }}>
      {children}
    </PortalSceneContext.Provider>
  );
}
