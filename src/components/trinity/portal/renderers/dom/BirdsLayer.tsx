"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { usePortalScene } from "../../scene-context";

/** A tiny chevron silhouette — cheap to animate, reads as a bird at this scale. */
function Bird({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 12" width="18" height="9" className={className}>
      <path
        d="M0 6 Q6 0 12 6 Q18 0 24 6"
        fill="none"
        stroke="rgba(20,20,25,0.55)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function BirdsLayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion, isLowPower } = usePortalScene();

  useGSAP(
    () => {
      if (prefersReducedMotion || isLowPower) return;
      const birds = gsap.utils.toArray<HTMLElement>(".portal-bird");

      birds.forEach((bird, i) => {
        gsap.set(bird, { opacity: 0 });

        function fly() {
          const fromLeft = Math.random() > 0.5;
          const y = 8 + Math.random() * 20;
          gsap.set(bird, {
            x: fromLeft ? "-5vw" : "105vw",
            y: `${y}vh`,
            opacity: 0,
            scaleX: fromLeft ? 1 : -1,
          });
          gsap
            .timeline({ onComplete: fly, delay: 6 + Math.random() * 10 + i * 4 })
            .to(bird, { opacity: 0.8, duration: 0.6 })
            .to(
              bird,
              {
                x: fromLeft ? "105vw" : "-5vw",
                y: `${y - 4}vh`,
                duration: 7 + Math.random() * 3,
                ease: "sine.inOut",
              },
              0
            )
            .to(bird, { opacity: 0, duration: 0.6 }, "-=0.6");
        }
        fly();
      });
    },
    { scope: containerRef, dependencies: [prefersReducedMotion, isLowPower] }
  );

  if (prefersReducedMotion || isLowPower) return null;

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      <Bird className="portal-bird absolute top-0 left-0" />
      <Bird className="portal-bird absolute top-0 left-0" />
    </div>
  );
}
