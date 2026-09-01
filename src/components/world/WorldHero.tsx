"use client";

import { motion } from "motion/react";
import type { WorldConfig } from "@/lib/brands";

export default function WorldHero({ world }: { world: WorldConfig }) {
  return (
    <section className="relative min-h-screen w-full flex items-end overflow-hidden">
      <div className="absolute inset-0">
        {world.media.heroVideo ? (
          <video
            className="h-full w-full object-cover"
            src={world.media.heroVideo}
            poster={world.media.heroImage}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : world.media.heroImageMobile ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={world.media.heroImageMobile}
              alt={world.name}
              className="h-full w-full object-cover sm:hidden"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={world.media.heroImage}
              alt={world.name}
              className="hidden h-full w-full object-cover sm:block"
            />
          </>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={world.media.heroImage} alt={world.name} className="h-full w-full object-cover" />
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(0deg, ${world.theme.bg} 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.35) 100%)`,
          }}
        />
      </div>

      <div className="relative z-10 px-5 sm:px-10 pb-16 sm:pb-24 max-w-3xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="uppercase tracking-[0.3em] text-xs sm:text-sm mb-4"
          style={{ color: world.theme.accent }}
        >
          {world.tagline}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-display text-4xl sm:text-6xl md:text-7xl leading-[1.02] text-world-text"
        >
          {world.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-6 text-base sm:text-lg text-world-text-muted max-w-xl"
        >
          {world.description}
        </motion.p>
      </div>
    </section>
  );
}
