"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { WorldConfig } from "@/lib/brands";
import { useTrinityTransition } from "@/hooks/useTrinityTransition";
import { usePortalScene } from "./portal/scene-context";
import { FOCUS_TRAVEL_MS, FOCUS_ARRIVE_MS } from "./portal/focus-constants";

const ARRIVAL_PARTICLES = Array.from({ length: 6 }, (_, i) => i);

export default function IslandHotspot({ world }: { world: WorldConfig }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { enterWorld, phase } = useTrinityTransition();
  const { focusedWorldId, setFocusedWorldId, prefersReducedMotion } = usePortalScene();
  const [arrived, setArrived] = useState(false);
  const isLive = world.status === "live";

  const isFocused = focusedWorldId === world.id;
  const isDimmed = focusedWorldId !== null && !isFocused;

  useEffect(() => {
    if (!isFocused || prefersReducedMotion) {
      setArrived(false);
      return;
    }
    const t = setTimeout(() => setArrived(true), FOCUS_TRAVEL_MS);
    return () => clearTimeout(t);
  }, [isFocused, prefersReducedMotion]);

  function focus() {
    if (phase !== "idle") return;
    setFocusedWorldId(world.id);
  }

  function unfocus() {
    if (focusedWorldId === world.id) setFocusedWorldId(null);
  }

  function handleActivate() {
    if (phase !== "idle" || !ref.current) return;
    if (prefersReducedMotion) {
      enterWorld(world.id, ref.current);
      return;
    }
    // Energy travels to the island first, then the cinematic zoom/fade takes over.
    setFocusedWorldId(world.id);
    setTimeout(() => {
      if (ref.current) enterWorld(world.id, ref.current);
    }, FOCUS_TRAVEL_MS + FOCUS_ARRIVE_MS * 0.4);
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      disabled={phase !== "idle"}
      onClick={handleActivate}
      onMouseEnter={focus}
      onMouseLeave={unfocus}
      onFocus={focus}
      onBlur={unfocus}
      initial={{ opacity: 0, y: 16 }}
      animate={{
        opacity: isDimmed ? 0.55 : 1,
        y: 0,
        scale: isFocused ? 1.045 : 1,
      }}
      transition={
        isFocused
          ? { type: "spring", stiffness: 260, damping: 14 }
          : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
      }
      className="group absolute flex flex-col items-center justify-end rounded-3xl border cursor-pointer border-white/0"
      style={{
        left: `${world.hotspot.x}%`,
        top: `${world.hotspot.y}%`,
        width: `${world.hotspot.w}%`,
        height: `${world.hotspot.h}%`,
      }}
      aria-label={world.name}
    >
      <AnimatePresence>
        {arrived && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ boxShadow: `0 0 50px 12px ${world.theme.accentSoft}, inset 0 0 0 1px ${world.theme.accent}66` }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {arrived &&
          ARRIVAL_PARTICLES.map((i) => {
            const angle = (i / ARRIVAL_PARTICLES.length) * Math.PI * 2;
            return (
              <motion.span
                key={i}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], x: Math.cos(angle) * 34, y: Math.sin(angle) * 34 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full pointer-events-none"
                style={{ background: world.theme.accent }}
              />
            );
          })}
      </AnimatePresence>

      <AnimatePresence>
        {arrived && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-3 flex flex-col items-center pointer-events-none"
          >
            <span
              className="font-display text-base sm:text-lg tracking-wide"
              style={{ color: world.theme.accent, textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}
            >
              {world.name}
            </span>
            <span
              className="mt-1 rounded-full px-3 py-1 text-[10px] sm:text-xs font-medium uppercase tracking-wide"
              style={{
                background: isLive ? world.theme.accent : "rgba(255,255,255,0.12)",
                color: isLive ? "#0a0a0a" : "#f5f5f5",
              }}
            >
              {isLive ? world.cta.label : "Próximamente"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
