"use client";

import { useState } from "react";
import Splash from "@/components/trinity/Splash";
import PortalMap from "@/components/trinity/PortalMap";

export default function Home() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      <Splash onDone={() => setSplashDone(true)} />
      {splashDone && <PortalMap />}
    </>
  );
}
