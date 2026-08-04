"use client";

import { useLayoutEffect, useState } from "react";
import Splash from "@/components/trinity/Splash";
import PortalMap from "@/components/trinity/PortalMap";
import { RETURNING_KEY } from "@/components/trinity/portal/focus-constants";

export default function Home() {
  // Always matches the server-rendered output first (sessionStorage doesn't
  // exist during SSR); useLayoutEffect below adjusts it before paint if
  // we're returning from a world, so there's no visible splash flash.
  const [splashDone, setSplashDone] = useState(false);

  useLayoutEffect(() => {
    if (sessionStorage.getItem(RETURNING_KEY)) setSplashDone(true);
  }, []);

  return (
    <>
      {!splashDone && <Splash onDone={() => setSplashDone(true)} />}
      {splashDone && <PortalMap />}
    </>
  );
}
