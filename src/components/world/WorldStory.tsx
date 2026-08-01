"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { WorldConfig } from "@/lib/brands";

export default function WorldStory({
  world,
  title,
  paragraphs,
  image,
}: {
  world: WorldConfig;
  title: string;
  paragraphs: string[];
  image: string;
}) {
  return (
    <section className="relative py-24 px-5 sm:px-10 bg-world-bg">
      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative aspect-[4/3] rounded-2xl overflow-hidden order-2 sm:order-1"
        >
          <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="order-1 sm:order-2"
        >
          <span
            className="text-xs uppercase tracking-[0.25em] font-medium"
            style={{ color: world.theme.accent }}
          >
            Nuestra historia
          </span>
          <h2 className="font-display text-2xl sm:text-3xl text-world-text mt-2 mb-5">{title}</h2>
          <div className="space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-world-text-muted leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
