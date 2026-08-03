"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { usePortalScene } from "../../scene-context";
import { useParallaxStyle } from "../../useParallaxStyle";

interface Cloud {
  top: string;
  left: string;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

const CLOUDS: Cloud[] = [
  { top: "6%", left: "-10%", size: 260, opacity: 0.16, duration: 55, delay: 0 },
  { top: "14%", left: "30%", size: 180, opacity: 0.1, duration: 70, delay: -20 },
  { top: "4%", left: "60%", size: 220, opacity: 0.14, duration: 62, delay: -40 },
  { top: "22%", left: "-5%", size: 150, opacity: 0.08, duration: 80, delay: -10 },
];

export default function CloudsLayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion } = usePortalScene();
  const parallaxStyle = useParallaxStyle(6);

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      const clouds = gsap.utils.toArray<HTMLElement>(".portal-cloud");
      clouds.forEach((cloud, i) => {
        const cfg = CLOUDS[i];
        gsap.to(cloud, {
          x: "+=120vw",
          duration: cfg.duration,
          delay: cfg.delay,
          ease: "none",
          repeat: -1,
          modifiers: {
            x: (x) => `${parseFloat(x) % 140 - 20}vw`,
          },
        });
      });
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none" style={parallaxStyle}>
      {CLOUDS.map((cloud, i) => (
        <div
          key={i}
          className="portal-cloud absolute rounded-full"
          style={{
            top: cloud.top,
            left: cloud.left,
            width: cloud.size,
            height: cloud.size * 0.4,
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.9), transparent 70%)",
            opacity: cloud.opacity,
            filter: "blur(18px)",
          }}
        />
      ))}
    </div>
  );
}
