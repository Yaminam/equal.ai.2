"use client";

import { motion, useReducedMotion } from "motion/react";
import { CountUp } from "./primitives";
import { EASE } from "../lib/motion";

/*
  Proof as flex, not reassurance.

  One number, once, cold. No press logos, no badges, no metrics band. Lime
  appears here and nowhere else on the page: it is the single loudest moment,
  and it is spent on this.
*/
export function Proof() {
  const reduce = useReducedMotion();

  // second beat of the dark chapter; Aspire closes the gap from its side
  return (
    <section className="relative flex items-center overflow-hidden bg-ink pb-32 pt-16 text-canvas">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(250,249,246,0.07) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          maskImage: "radial-gradient(58% 58% at 50% 50%, black, transparent 78%)",
          WebkitMaskImage: "radial-gradient(58% 58% at 50% 50%, black, transparent 78%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-6">
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8 }}
          className="mb-9 font-mono text-[11px] uppercase tracking-[0.24em] text-canvas/30"
        >
          Last month
        </motion.p>

        {/* The number and its meaning share a baseline; the number is never alone.
            Fixed fractions, not auto: CountUp grows from "0" to "2,84,193", and an
            auto column would drag the caption sideways for the whole count. */}
        <div className="grid gap-y-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-x-14">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1, ease: EASE }}
            className="tnum text-[clamp(3.2rem,11vw,9rem)] font-medium leading-[0.88] tracking-[-0.055em] text-lime"
          >
            <CountUp to={284193} duration={2.2} />
          </motion.p>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
            className="max-w-[22ch] text-[clamp(1.05rem,1.7vw,1.45rem)] leading-snug text-canvas/45 lg:pb-3"
          >
            calls answered. None of them yours to take.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
