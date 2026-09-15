"use client";

import { motion, AnimatePresence } from "motion/react";
import type { WorldConfig } from "@/lib/brands";
import { usePortalScene } from "@/components/trinity/portal/scene-context";

/**
 * Zona interactiva invisible sobre una isla del video del universo, para
 * las islas que ya tienen su propio video de transicion cinematografica
 * (ver VIDEO_TRANSITIONS en UniverseHero.tsx). A diferencia de
 * IslandHotspot (que dispara la transicion generica de "wash" de color +
 * navegacion directa), el click aqui solo avisa a UniverseHero via
 * `onEnter` — es UniverseHero quien controla el crossfade hacia el video
 * de esa isla y navega al terminar.
 *
 * Comparte `focusedWorldId` con PortalSceneProvider, asi que al enfocar
 * esta isla las demas (IslandHotspot u otro VideoTransitionHotspot) se
 * atenuan solas, sin tocar su codigo. El hover/glow es solo mientras se
 * elige la isla: al hacer click se limpia el foco de inmediato para que
 * ninguna animacion CSS quede corriendo sobre las islas durante el video
 * de transicion (esa animacion ya vive dentro del video).
 */
export default function VideoTransitionHotspot({
  world,
  hotspot,
  disabled,
  onEnter,
  onHoverStart,
}: {
  world: WorldConfig;
  hotspot: { x: number; y: number; w: number; h: number };
  disabled: boolean;
  onEnter: () => void;
  /** Isla enfocada por primera vez: buena señal para empezar a bufferizar su video de transicion antes del click. */
  onHoverStart?: () => void;
}) {
  const { focusedWorldId, setFocusedWorldId, prefersReducedMotion } = usePortalScene();
  const isFocused = focusedWorldId === world.id;
  const isDimmed = focusedWorldId !== null && !isFocused;

  function focus() {
    if (disabled) return;
    if (focusedWorldId !== world.id) onHoverStart?.();
    setFocusedWorldId(world.id);
  }

  function unfocus() {
    if (focusedWorldId === world.id) setFocusedWorldId(null);
  }

  function handleClick() {
    if (disabled) return;
    setFocusedWorldId(null);
    onEnter();
  }

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={handleClick}
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
