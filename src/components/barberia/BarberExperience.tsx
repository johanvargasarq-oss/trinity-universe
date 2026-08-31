"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { WorldConfig } from "@/lib/brands";

interface Experience {
  key: string;
  title: string;
  description: string;
  image?: string;
}

const EXPERIENCES: Experience[] = [
  {
    key: "playstation",
    title: "PlayStation",
    description: "Juega tus títulos favoritos mientras esperas.",
  },
  {
    key: "simulador",
    title: "Simulador de conducción",
    description: "Pon a prueba tus habilidades al volante.",
    image: "/media/barberia/gaming-simulador.jpg",
  },
  {
    key: "vr",
    title: "Realidad Virtual",
    description: "Entra en nuevos mundos y vive una experiencia inmersiva.",
    image: "/media/barberia/gaming-vr.jpg",
  },
  {
    key: "gaming",
    title: "Gaming Experience",
    description: "Disfruta diferentes juegos y experiencias mientras esperas.",
    image: "/media/barberia/gaming-experience.jpg",
  },
];

/** Barbería-only: the waiting-room gaming/VR/sim-racing zone. Not reused by other worlds. */
export default function BarberExperience({ world }: { world: WorldConfig }) {
  return (
    <section className="relative py-24 px-5 sm:px-10 overflow-hidden bg-world-bg">
      <div
        className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 w-[520px] h-[520px] rounded-full blur-[120px] opacity-[0.15]"
        style={{ background: world.theme.accent }}
      />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span
            className="text-xs uppercase tracking-[0.3em] font-medium"
            style={{ color: world.theme.accent }}
          >
            Mientras esperas
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-world-text mt-3 mb-4 uppercase tracking-wide">
            Trini Barbería Experience
          </h2>
          <p className="text-lg sm:text-xl font-display italic mb-5" style={{ color: world.theme.accent }}>
            &ldquo;Tu turno puede esperar. La diversión no.&rdquo;
          </p>
          <p className="text-world-text-muted leading-relaxed">
            En Trinity Barbería convertimos la espera en parte de la experiencia. Mientras llega tu
            turno, disfruta de nuestra zona gaming, simulador de conducción y experiencias de
            realidad virtual.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {EXPERIENCES.map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.03 }}
              whileFocus={{ y: -6, scale: 1.03 }}
              tabIndex={0}
              className="group relative rounded-2xl overflow-hidden border outline-none"
              style={{ borderColor: world.theme.border, background: world.theme.bgAlt }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-focus:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div
                    className="h-full w-full flex items-center justify-center text-6xl transition-transform duration-700 ease-out group-hover:scale-110 group-focus:scale-110"
                    style={{ background: `linear-gradient(160deg, ${world.theme.bgAlt}, #000000)` }}
                  >
                    🎮
                  </div>
                )}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-500"
                  style={{
                    boxShadow: `inset 0 0 0 2px ${world.theme.accent}, 0 0 30px -6px ${world.theme.accent}`,
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.75) 100%)",
                  }}
                />
              </div>

              <div className="p-5">
                <h3 className="font-display text-lg text-world-text mb-1.5 uppercase tracking-wide">
                  {item.title}
                </h3>
                <p className="text-world-text-muted text-sm leading-relaxed transition-colors duration-300 group-hover:text-world-text group-focus:text-world-text">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
