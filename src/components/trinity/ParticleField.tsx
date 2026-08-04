"use client";

import { useEffect, useRef } from "react";

export type ParticleKind = "ember" | "fireflies" | "dust";

interface Particle {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  o: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

const KIND_CONFIG: Record<
  ParticleKind,
  { color: string; vyRange: [number, number]; vxRange: [number, number]; rRange: [number, number]; twinkle: boolean; glow: number }
> = {
  ember: { color: "236, 72, 153", vyRange: [0.05, 0.3], vxRange: [0, 0], rRange: [0.5, 2.4], twinkle: false, glow: 6 },
  fireflies: { color: "255, 214, 140", vyRange: [-0.07, 0.07], vxRange: [-0.12, 0.12], rRange: [1.3, 3.2], twinkle: true, glow: 10 },
  dust: { color: "210, 220, 235", vyRange: [0.01, 0.06], vxRange: [-0.03, 0.03], rRange: [0.3, 1], twinkle: false, glow: 0 },
};

export default function ParticleField({
  count = 60,
  kind = "ember",
}: {
  count?: number;
  kind?: ParticleKind;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cfg = KIND_CONFIG[kind];
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const rand = (range: [number, number]) => range[0] + Math.random() * (range[1] - range[0]);

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: rand(cfg.rRange),
      vy: rand(cfg.vyRange),
      vx: rand(cfg.vxRange),
      o: Math.random() * 0.4 + 0.45,
      twinkleSpeed: 0.5 + Math.random() * 1.5,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    let raf: number;
    let t = 0;
    const render = () => {
      t += 0.016;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.y -= p.vy;
        p.x += p.vx;
        if (p.y < -4) p.y = height + 4;
        if (p.y > height + 4) p.y = -4;
        if (p.x < -4) p.x = width + 4;
        if (p.x > width + 4) p.x = -4;

        const opacity = cfg.twinkle ? p.o * (0.35 + 0.65 * Math.abs(Math.sin(t * p.twinkleSpeed + p.twinklePhase))) : p.o;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cfg.color}, ${opacity})`;
        if (cfg.glow > 0) {
          ctx.shadowBlur = cfg.glow;
          ctx.shadowColor = `rgba(${cfg.color}, ${Math.min(1, opacity * 1.4)})`;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(render);
    };
    render();

    const onResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [count, kind]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}
