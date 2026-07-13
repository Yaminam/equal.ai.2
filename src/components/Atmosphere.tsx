"use client";

import { useReducedMotion } from "motion/react";

/*
  The only thing on this page that moves while you are still.

  A minimal page with nothing alive on it does not read as restrained — it
  reads as a screenshot. Every award-tier site has one slow ambient loop
  somewhere, and it never asks for attention; it just proves the page is not a
  picture of itself.

  Two blurred blobs on 34s and 46s loops. They are:

  - COPRIME-ish in period, so the pair never visibly repeats.
  - Animated on TRANSFORM ONLY, so they live on the compositor. A keyframe on
    `filter` or `background-position` would repaint a 900px blurred surface
    every frame and melt a mid-range Android.
  - Brand hues at 6-10% alpha. Template gradients live at 40-80%; that is the
    entire difference between "lit room" and "AI slop".
  - Fixed and behind everything, so they light the whole page rather than
    decorating one section.
*/
export function Atmosphere() {
  const reduce = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* key light: warm green, lower right, drifting up */}
      <div
        className="absolute -right-[15%] top-[8%] size-[46rem] rounded-full blur-[130px]"
        style={{
          background: "radial-gradient(closest-side, #00b14017, #00b14000 72%)",
          animation: reduce ? undefined : "drift-a 34s ease-in-out infinite",
          willChange: "transform",
        }}
      />

      {/* fill light: lime, far left, cooler and slower */}
      <div
        className="absolute -left-[18%] top-[52%] size-[40rem] rounded-full blur-[140px]"
        style={{
          background: "radial-gradient(closest-side, #baff2914, #baff2900 70%)",
          animation: reduce ? undefined : "drift-b 46s ease-in-out infinite",
          willChange: "transform",
        }}
      />
    </div>
  );
}
