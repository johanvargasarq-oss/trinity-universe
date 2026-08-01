"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, ensureGsapRegistered } from "@/lib/gsap";
import type { WorldConfig } from "@/lib/brands";

export interface GalleryItem {
  src: string;
  alt: string;
}

export default function WorldGallery({
  world,
  items,
  title = "Galería",
}: {
  world: WorldConfig;
  items: GalleryItem[];
  title?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      ensureGsapRegistered();
      const cards = gsap.utils.toArray<HTMLElement>(".gallery-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: { trigger: containerRef.current, start: "top 75%" },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="relative py-24 px-5 sm:px-10 bg-world-bg-alt">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-2xl sm:text-3xl text-world-text mb-10">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {items.map((item) => (
            <div
              key={item.src}
              className="gallery-card relative aspect-[4/3] rounded-xl overflow-hidden group"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
