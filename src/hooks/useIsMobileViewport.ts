"use client";

import { useEffect, useState } from "react";

/**
 * True/false once the viewport width is known client-side, null before that
 * (first paint / SSR) so callers can hold off rendering either layout until
 * they know which one to show — avoids a flash of the wrong layout.
 */
export function useIsMobileViewport(breakpointPx = 640): boolean | null {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpointPx - 1}px)`);
    setIsMobile(query.matches);
    const onChange = () => setIsMobile(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [breakpointPx]);

  return isMobile;
}
