"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/** Opt-in ambience — never autoplays. One click fades it in; another fades it out. */
export default function SoundToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const audio = new Audio("/audio/portal-ambience.mp3");
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;
    return () => {
      audio.pause();
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (!enabled) {
      audio.play().catch(() => {});
      gsap.to(audio, { volume: 0.35, duration: 1.2 });
    } else {
      gsap.to(audio, {
        volume: 0,
        duration: 0.8,
        onComplete: () => audio.pause(),
      });
    }
    setEnabled(!enabled);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Silenciar ambiente" : "Activar sonido ambiente"}
      className="fixed bottom-5 right-5 z-40 flex items-center justify-center w-11 h-11 rounded-full bg-black/40 backdrop-blur-sm border border-white/15 text-white/80 hover:text-white hover:border-white/30 transition-colors"
    >
      {enabled ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
}
