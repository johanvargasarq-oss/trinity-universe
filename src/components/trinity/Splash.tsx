"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import EmblemMark from "./EmblemMark";
import ParticleField from "./ParticleField";

export default function Splash({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);
  const doneRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2600);
    return () => clearTimeout(timer);
  }, []);

  const handleExitComplete = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black overflow-hidden"
        >
          <ParticleField />
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <EmblemMark size={140} className="drop-shadow-[0_0_50px_rgba(236,72,153,0.45)]" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 12, letterSpacing: "0.3em" }}
            animate={{ opacity: 1, y: 0, letterSpacing: "0.4em" }}
            transition={{ duration: 0.9, delay: 0.9, ease: "easeOut" }}
            className="font-display text-2xl sm:text-3xl text-white mt-6 uppercase"
          >
            Trinity
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
