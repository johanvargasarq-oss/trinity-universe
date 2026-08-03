"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import type { WorldConfig } from "@/lib/brands";
import { useTrinityTransition } from "@/hooks/useTrinityTransition";

export default function IslandHotspot({ world }: { world: WorldConfig }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { enterWorld, phase } = useTrinityTransition();
  const isLive = world.status === "live";

  return (
    <motion.button
      ref={ref}
      type="button"
      disabled={phase !== "idle"}
      onClick={() => ref.current && enterWorld(world.id, ref.current)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.07, y: -6 }}
      whileTap={{ scale: 0.98, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group absolute flex flex-col items-center justify-end rounded-3xl border cursor-pointer border-white/0"
      style={{
        left: `${world.hotspot.x}%`,
        top: `${world.hotspot.y}%`,
        width: `${world.hotspot.w}%`,
        height: `${world.hotspot.h}%`,
      }}
      aria-label={world.name}
    >
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: `0 0 40px 8px ${world.theme.accentSoft}, inset 0 0 0 1px ${world.theme.accent}55`,
        }}
      />
      <span
        className="relative mb-3 rounded-full px-4 py-1.5 text-xs sm:text-sm font-display tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: isLive ? world.theme.accent : "rgba(255,255,255,0.12)",
          color: isLive ? "#0a0a0a" : "#f5f5f5",
        }}
      >
        {isLive ? world.cta.label : "Próximamente"}
      </span>
    </motion.button>
  );
}
