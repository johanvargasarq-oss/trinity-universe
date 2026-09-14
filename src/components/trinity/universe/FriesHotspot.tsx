"use client";

import { motion, AnimatePresence } from "motion/react";
import type { WorldConfig } from "@/lib/brands";
import { usePortalScene } from "@/components/trinity/portal/scene-context";

/**
 * Zona interactiva invisible sobre la isla de Trini Fries en el video del
 * universo. A diferencia de IslandHotspot (que dispara la transicion
 * generica de "wash" de color + navegacion directa), el click aqui solo
 * avisa a UniverseHero via `onEnter` — es UniverseHero quien controla el
 * crossfade hacia el video de Trini Fries y navega al terminar.
 *
 * Comparte `focusedWorldId` con PortalSceneProvider, asi que al enfocar
 * Trini Fries las demas islas (IslandHotspot) se atenuan solas, sin tocar
 * su codigo.
 */
export default function FriesHotspot({
  world,
  hotspot,
  disabled,
  onEnter,
}: {
  world: WorldConfig;
  hotspot: { x: number; y: number; w: number; h: number };
  disabled: boolean;
  onEnter: () => void;
}) {
  const { focusedWorldId, setFocusedWorldId, prefersReducedMotion } = usePortalScene();
  const isFocused = focusedWorldId === world.id;
  const isDimmed = focusedWorldId !== null && !isFocused;

  function focus() {
    if (disabled) return;
    setFocusedWorldId(world.id);
  }

  function unfocus() {
    if (focusedWorldId === world.id) setFocusedWorldId(null);
  }

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onEnter}
      onMouseEnter={focus}
      onMouseLeave={unfocus}
      onFocus={focus}
      onBlur={unfocus}
      onTouchStart={focus}
      animate={{
        opacity: isDimmed ? 0.32 : 1,
        scale: isFocused ? 1.045 : 1,
        filter: isDimmed
          ? "brightness(0.5) saturate(0.55)"
          : isFocused
            ? "brightness(1.22) saturate(1.2)"
            : "brightness(1) saturate(1)",
      }}
      transition={
        isFocused
          ? { type: "spring", stiffness: 260, damping: 14 }
          : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
      }
      className="absolute rounded-3xl border border-white/0 cursor-pointer disabled:cursor-default"
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, width: `${hotspot.w}%`, height: `${hotspot.h}%` }}
      aria-label={world.name}
    >
      <AnimatePresence>
        {isFocused && !prefersReducedMotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.55, 0.9, 0.55] }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.4, repeat: Infinity, ease: "easeInOut" } }}
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ boxShadow: `0 0 80px 22px ${world.theme.accentSoft}` }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}
