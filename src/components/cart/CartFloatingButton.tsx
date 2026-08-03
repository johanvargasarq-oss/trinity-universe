"use client";

import { motion, AnimatePresence } from "motion/react";
import type { WorldConfig } from "@/lib/brands";

export default function CartFloatingButton({
  world,
  count,
  onClick,
}: {
  world: WorldConfig;
  count: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full px-5 py-3.5 shadow-lg"
      style={{ background: world.theme.accent, color: "#0a0a0a" }}
      aria-label="Ver carrito"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      <span className="font-medium text-sm">Tu pedido</span>
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-black/80 text-white text-xs font-bold"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
