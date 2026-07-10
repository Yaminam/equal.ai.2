"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

/*
  A slow green light that trails the pointer. It does not replace the system
  cursor. On a light page this is (c) of the anti-flat trio: without a moving
  glow, warm white reads as paper, not as a surface.
*/
export function CursorSpotlight() {
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const sx = useSpring(x, { stiffness: 90, damping: 22, mass: 0.8 });
  const sy = useSpring(y, { stiffness: 90, damping: 22, mass: 0.8 });
  const [on, setOn] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setOn(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX - 320);
      y.set(e.clientY - 320);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  if (!on) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-0 size-[640px] rounded-full"
    >
      <div
        className="size-full rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,177,64,0.07), rgba(186,255,41,0.05) 40%, transparent 65%)",
        }}
      />
    </motion.div>
  );
}
