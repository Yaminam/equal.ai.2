"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";

/*
  A magnetic button.

  Within a proximity radius the element leans toward the pointer, then settles
  back. Three rules that separate this from the gimmick version:

  1. IT IS ON THE PRIMARY CTA ONLY. On every button it becomes a toy. On one
     button it reads as confidence.
  2. THE PULL IS CAPPED (10px) and the follow factor is low (0.28). The button
     leans; it does not chase the cursor around the page.
  3. THE SPRING IS OVERDAMPED — it never overshoots. Bounce reads as a toy;
     weight reads as expensive. This is the whole difference.

  Gated on a fine pointer: on touch there is no hover, and a magnetic element
  that can never be approached is dead weight.
*/
const RADIUS = 110;
const PULL = 0.28;
const MAX = 10;

export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 180, damping: 30, mass: 0.6 });
  const y = useSpring(my, { stiffness: 180, damping: 30, mass: 0.6 });

  function move(e: React.MouseEvent) {
    const el = ref.current;
    if (!el || reduce) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);

    if (Math.hypot(dx, dy) > RADIUS + Math.max(r.width, r.height) / 2) return;

    mx.set(Math.max(-MAX, Math.min(MAX, dx * PULL)));
    my.set(Math.max(-MAX, Math.min(MAX, dy * PULL)));
  }

  function leave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={move}
      onMouseLeave={leave}
      style={reduce ? undefined : { x, y }}
      className={`inline-block ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}
