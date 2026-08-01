"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { useTransitionStore } from "@/lib/transition-store";
import { worlds } from "@/lib/brands";

export default function TransitionOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const phase = useTransitionStore((s) => s.phase);
  const worldId = useTransitionStore((s) => s.worldId);
  const originRect = useTransitionStore((s) => s.originRect);
  const reset = useTransitionStore((s) => s.reset);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el || phase !== "covering" || !originRect || !worldId) return;

    const world = worlds[worldId];
    el.style.background = `linear-gradient(135deg, ${world.theme.bg}, ${world.theme.accent})`;

    gsap.set(el, {
      position: "fixed",
      top: originRect.top,
      left: originRect.left,
      width: originRect.width,
      height: originRect.height,
      borderRadius: 24,
      opacity: 0,
      pointerEvents: "auto",
    });

    const routerPushed = { current: false };

    const tl = gsap.timeline();
    tl.to(el, { opacity: 1, duration: 0.15, ease: "power1.out" }).to(el, {
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
      duration: 0.65,
      ease: "expo.inOut",
      onUpdate: function () {
        if (this.progress() > 0.55 && !routerPushed.current) {
          routerPushed.current = true;
          router.push(world.slug);
        }
      },
    });

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, worldId, originRect]);

  useEffect(() => {
    if (phase === "revealing") {
      const el = overlayRef.current;
      if (!el) return;
      gsap.to(el, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(el, { pointerEvents: "none" });
          reset();
        },
      });
    }
  }, [phase, reset]);

  return (
    <div
      ref={overlayRef}
      className="opacity-0"
      style={{ pointerEvents: "none", zIndex: 100 }}
    />
  );
}
