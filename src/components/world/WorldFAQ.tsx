"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { WorldConfig } from "@/lib/brands";

export interface FaqItem {
  question: string;
  answer: string;
}

export default function WorldFAQ({
  world,
  items,
  title = "Preguntas frecuentes",
  subtitle,
}: {
  world: WorldConfig;
  items: FaqItem[];
  title?: string;
  subtitle?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-24 px-5 sm:px-10 bg-world-bg-alt">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl sm:text-3xl text-world-text mb-3">{title}</h2>
          {subtitle && <p className="text-world-text-muted">{subtitle}</p>}
        </div>

        <div className="flex flex-col gap-3">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            const panelId = `faq-panel-${i}`;
            const buttonId = `faq-button-${i}`;

            return (
              <div
                key={item.question}
                className="rounded-2xl border overflow-hidden transition-colors"
                style={{
                  borderColor: isOpen ? world.theme.accent : world.theme.border,
                  background: world.theme.bg,
                }}
              >
                <h3 className="m-0">
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-4 sm:py-5"
                  >
                    <span className="text-world-text font-medium text-base sm:text-lg">{item.question}</span>
                    <span className="relative shrink-0 w-4 h-4" aria-hidden="true">
                      <span
                        className="absolute inset-y-0 my-auto left-0 w-4 h-[2px] rounded-full"
                        style={{ background: world.theme.accent }}
                      />
                      <motion.span
                        className="absolute inset-x-0 mx-auto top-0 w-[2px] h-4 rounded-full"
                        style={{ background: world.theme.accent }}
                        animate={{ scaleY: isOpen ? 0 : 1 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      />
                    </span>
                  </button>
                </h3>

                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 sm:px-6 pb-4 sm:pb-5 text-world-text-muted leading-relaxed">{item.answer}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
