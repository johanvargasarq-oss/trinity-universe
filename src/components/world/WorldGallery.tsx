"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, ensureGsapRegistered } from "@/lib/gsap";
import type { WorldConfig } from "@/lib/brands";

export interface GalleryItem {
  /** Cover image. Also used as the video poster when `video` is set. */
  src: string;
  alt: string;
  /** When set, the card plays this video (click to play) instead of showing a static image. */
  video?: string;
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
            <GalleryCard key={item.src} item={item} accent={world.theme.accent} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryCard({ item, accent }: { item: GalleryItem; accent: string }) {
  const [playing, setPlaying] = useState(false);

  if (item.video && playing) {
    return (
      <div className="gallery-card relative aspect-[4/3] rounded-xl overflow-hidden">
        <video
          src={item.video}
          poster={item.src}
          autoPlay
          muted
          loop
          playsInline
          controls
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => item.video && setPlaying(true)}
      className="gallery-card relative aspect-[4/3] rounded-xl overflow-hidden group block w-full text-left"
      aria-label={item.video ? `Reproducir video: ${item.alt}` : item.alt}
    >
      <Image
        src={item.src}
        alt={item.alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        sizes="(max-width: 640px) 50vw, 33vw"
      />
      {item.video && (
        <>
          <div className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/35" />
          <div
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <div
              className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
              style={{ background: "rgba(0,0,0,0.45)", boxShadow: `0 0 0 2px ${accent}` }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" fill={accent}>
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </>
      )}
    </button>
  );
}
