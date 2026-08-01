"use client";

import { motion } from "motion/react";
import { worlds } from "@/lib/brands";
import { useRevealWorld } from "@/hooks/useRevealWorld";
import WorldNav from "@/components/world/WorldNav";
import WorldHero from "@/components/world/WorldHero";
import WorldStory from "@/components/world/WorldStory";
import WorldGallery from "@/components/world/WorldGallery";
import WorldContactBlock from "@/components/world/WorldContactBlock";

const world = worlds.rent;

const galeria = [
  { src: "/media/rent/hero.png", alt: "Terraza frente al mar Trinity Rent" },
  { src: "/media/rent/experiencias.png", alt: "Cena al atardecer Trinity Rent" },
];

export default function RentPage() {
  useRevealWorld();

  return (
    <>
      <WorldNav world={world} />
      <WorldHero world={world} />

      <WorldStory
        world={world}
        title="Experiencias frente al mar"
        paragraphs={[
          "Desde una cena al atardecer hasta una tarde entera frente al mar: TriniRent está pensado para que desconectes sin perder el estándar premium del universo Trinity.",
          "Estamos terminando de definir el contenido oficial (fotos, videos y disponibilidad) junto al cliente — esta página ya está lista para recibirlo.",
        ]}
        image="/media/rent/experiencias.png"
      />

      <section className="relative py-24 px-5 sm:px-10 bg-world-bg-alt overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl text-world-text mb-8">En movimiento</h2>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 1.03 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="max-w-5xl mx-auto relative aspect-video rounded-2xl overflow-hidden"
        >
          <video
            className="w-full h-full object-cover"
            src={world.media.heroVideo}
            poster={world.media.heroImage}
            autoPlay
            muted
            loop
            playsInline
          />
        </motion.div>
      </section>

      <WorldGallery world={world} items={galeria} />

      <section className="relative py-24 px-5 sm:px-10 bg-world-bg text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto"
        >
          <h2 className="font-display text-2xl sm:text-3xl text-world-text mb-3">¿Listo para desconectar?</h2>
          <p className="text-world-text-muted mb-8">
            Escríbenos y te contamos disponibilidad, fechas y todo lo que necesitas para tu estadía.
          </p>
          <a
            href={world.contact.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full px-8 py-3.5 font-medium transition-transform hover:scale-105"
            style={{ background: world.theme.accent, color: "#0a0a0a" }}
          >
            Escríbenos por Instagram
          </a>
        </motion.div>
      </section>

      <WorldContactBlock world={world} />
    </>
  );
}
