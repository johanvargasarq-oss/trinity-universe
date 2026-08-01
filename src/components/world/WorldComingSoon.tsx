"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { WorldConfig } from "@/lib/brands";
import { useRevealWorld } from "@/hooks/useRevealWorld";
import WorldNav from "./WorldNav";

export default function WorldComingSoon({ world }: { world: WorldConfig }) {
  useRevealWorld();

  return (
    <>
      <WorldNav world={world} />
      <section className="min-h-screen w-full flex flex-col items-center justify-center px-6 text-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-6xl mb-6"
        >
          {world.emoji}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl text-world-text"
        >
          {world.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-world-text-muted max-w-md"
        >
          {world.description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col items-center gap-4"
        >
          <span
            className="rounded-full px-5 py-2 text-sm font-medium uppercase tracking-wide"
            style={{ background: world.theme.accentSoft, color: world.theme.accent }}
          >
            Próximamente
          </span>
          <a
            href={world.contact.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-world-text-muted hover:text-world-text transition-colors text-sm"
          >
            Síguenos en {world.contact.instagram.handle}
          </a>
          <Link href="/" className="text-sm text-world-text-muted hover:text-world-text transition-colors">
            ← Volver al universo Trinity
          </Link>
        </motion.div>
      </section>
    </>
  );
}
