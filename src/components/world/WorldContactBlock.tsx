"use client";

import { motion } from "motion/react";
import type { WorldConfig } from "@/lib/brands";

export default function WorldContactBlock({ world }: { world: WorldConfig }) {
  const { contact } = world;
  const hasVisitInfo = Boolean(contact.addresses?.length || contact.hours);

  return (
    <section className="relative py-24 px-5 sm:px-10 bg-world-bg-alt">
      <div
        className={`max-w-4xl mx-auto grid gap-10 ${hasVisitInfo ? "sm:grid-cols-2" : "sm:justify-items-center sm:text-center"}`}
      >
        {hasVisitInfo && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-2xl sm:text-3xl text-world-text mb-6">Visítanos</h2>
            <ul className="space-y-3">
              {contact.addresses?.map((a) => (
                <li key={a.label} className="text-world-text-muted">
                  <span className="text-world-text font-medium">{a.label}: </span>
                  {a.line}
                </li>
              ))}
              {contact.hours && (
                <li className="text-world-text-muted pt-2">
                  <span className="text-world-text font-medium">Horario: </span>
                  {contact.hours}
                </li>
              )}
            </ul>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`flex flex-col gap-3 ${hasVisitInfo ? "sm:items-end sm:text-right" : "sm:items-center"}`}
        >
          {!hasVisitInfo && (
            <h2 className="font-display text-2xl sm:text-3xl text-world-text mb-2">Síguenos</h2>
          )}
          {contact.whatsapp && (
            <a
              href={`https://wa.me/${contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 font-medium transition-transform hover:scale-105"
              style={{ background: world.theme.accent, color: "#0a0a0a" }}
            >
              {world.cta.label} por WhatsApp
            </a>
          )}
          <a
            href={contact.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-world-text-muted hover:text-world-text transition-colors text-sm"
          >
            {contact.instagram.handle} en Instagram
          </a>
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="text-world-text-muted hover:text-world-text transition-colors text-sm"
            >
              {contact.phone}
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
