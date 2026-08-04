"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { WorldConfig } from "@/lib/brands";
import { useTrinityTransition } from "@/hooks/useTrinityTransition";
import { usePortalScene } from "./portal/scene-context";
import { FOCUS_TRAVEL_MS, FOCUS_ARRIVE_MS } from "./portal/focus-constants";

const ARRIVAL_PARTICLES = Array.from({ length: 10 }, (_, i) => i);

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
        opacity: isDimmed ? 0.32 : 1,
        y: 0,
        scale: isFocused ? 1.045 : 1,
        filter: isDimmed
          ? "brightness(0.5) saturate(0.55)"
          : isFocused
            ? "brightness(1.18) saturate(1.15)"
            : "brightness(1) saturate(1)",
      }}
      transition={
        isFocused
          ? { type: "spring", stiffness: 260, damping: 14 }
          : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
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
      {/* immediate hover halo — visible from the moment you enter, before energy arrives */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 0.85, 0.5] }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.6, repeat: Infinity, ease: "easeInOut" } }}
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ boxShadow: `0 0 70px 18px ${world.theme.accentSoft}` }}
          />
        )}
      </AnimatePresence>

      {/* stronger arrival halo — the energy "lands" */}
      <AnimatePresence>
        {arrived && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              boxShadow: `0 0 90px 26px ${world.theme.accentSoft}, inset 0 0 0 2px ${world.theme.accent}`,
            }}
          />
        )}
      </AnimatePresence>

      {/* arrival ring burst */}
      <AnimatePresence>
        {arrived && (
          <motion.div
            initial={{ opacity: 0.9, scale: 0.3 }}
            animate={{ opacity: 0, scale: 1.6 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full pointer-events-none"
            style={{ border: `2px solid ${world.theme.accent}` }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {arrived &&
          ARRIVAL_PARTICLES.map((i) => {
            const angle = (i / ARRIVAL_PARTICLES.length) * Math.PI * 2;
            const dist = 55 + (i % 3) * 12;
            return (
              <motion.span
                key={i}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                animate={{ opacity: [0, 1, 0], x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, scale: [0.5, 1.3, 0.6] }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="absolute left-1/2 top-1/2 w-2.5 h-2.5 rounded-full pointer-events-none"
                style={{ background: world.theme.accent, boxShadow: `0 0 8px 2px ${world.theme.accent}` }}
              />
            );
          })}
      </AnimatePresence>

      <AnimatePresence>
        {arrived && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-3 flex flex-col items-center pointer-events-none"
          >
            <span
              className="font-display text-lg sm:text-2xl tracking-wide px-4 py-1 rounded-full"
              style={{
                color: world.theme.accent,
                background: "rgba(5,5,8,0.55)",
                backdropFilter: "blur(4px)",
                textShadow: `0 0 20px ${world.theme.accent}`,
              }}
            >
              {world.name}
            </span>
            <span
              className="mt-2 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-semibold uppercase tracking-wide"
              style={{
                background: isLive ? world.theme.accent : "rgba(255,255,255,0.12)",
                color: isLive ? "#0a0a0a" : "#f5f5f5",
                boxShadow: isLive ? `0 0 16px 2px ${world.theme.accent}` : undefined,
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
