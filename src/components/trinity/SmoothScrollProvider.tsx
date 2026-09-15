"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { ensureGsapRegistered, gsap, ScrollTrigger } from "@/lib/gsap";
import { useTransitionStore } from "@/lib/transition-store";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const phase = useTransitionStore((s) => s.phase);
  // El universo ("/") es una escena fullscreen fija que nunca hace scroll:
  // arrancar el ticker de Lenis/GSAP ahi corre calculos de scroll en cada
  // frame para siempre, sin ningun beneficio, compitiendo con el video y
  // las animaciones de las islas. Las demas rutas si scrollean y si lo
  // necesitan (catalogos, ScrollTrigger de las paginas de cada negocio).
  const pathname = usePathname();
  const isUniverse = pathname === "/";

  useEffect(() => {
    if (isUniverse) return;
    ensureGsapRegistered();

    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    setLenisInstance(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
    };
    // Se re-ejecuta cuando isUniverse cambia (navegacion cliente entre "/"
    // y una pagina de negocio, sin remount de este provider raiz): arranca
    // el ticker al salir del universo, lo apaga la (cleanup) al volver.
  }, [isUniverse]);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (phase === "covering") {
      lenis.stop();
    } else if (phase === "idle") {
      lenis.scrollTo(0, { immediate: true });
      lenis.start();
    }
  }, [phase]);

  return <LenisContext.Provider value={lenisInstance}>{children}</LenisContext.Provider>;
}
