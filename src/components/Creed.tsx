"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "../lib/motion";

/*
  Trust, said as a creed rather than a compliance block.

  A thing that answers your phone and refuses your OTPs is the trust-critical
  case. The brands that stayed silent about it on the page — Friend, Bee — were
  the ones that got called dystopian. The brands that put one plain, precise
  line high up — Granola, Google Call Screen — did not.

  So it is not fine print, and it is not a row of padlock badges. It is three
  short promises on a dark ground, in the brand's own voice, immediately before
  the door. Almost no consumer app in India names the DPDP Act; naming it reads
  as confidence.

  TODO(equal): every line below is a factual claim about how the product runs.
  Verify each against the real architecture before launch. If audio or
  transcripts leave the device, line two is false.
*/

const CREED = [
  "It works for you. Not for a database.",
  "Calls are screened on your phone.",
  "No ads. Nothing sold. Ever.",
];

export function Creed() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-ink py-28 text-canvas md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-1/4 top-1/2 size-[720px] -translate-y-1/2 rounded-full blur-[160px]"
        style={{ background: "radial-gradient(closest-side, rgba(0,177,64,0.14), transparent)" }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9 }}
          className="mb-14 font-mono text-[11px] uppercase tracking-[0.24em] text-canvas/30"
        >
          The terms
        </motion.p>

        <div className="grid gap-4 md:grid-cols-3">
          {CREED.map((line, i) => (
            <motion.div
              key={line}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: EASE, delay: i * 0.12 }}
              className="rounded-2xl p-7 transition-colors duration-500 hover:bg-canvas/[0.03]"
              style={{
                // on ink, the light comes from above as a faint white top edge and
                // the border is canvas at 8% — the same material logic, inverted
                boxShadow: "0 0 0 1px #faf9f614, inset 0 1px 0 #ffffff14",
              }}
            >
              <span aria-hidden className="mb-7 block h-px w-10 bg-green/50" />
              <p className="max-w-[22ch] text-[clamp(1.15rem,1.8vw,1.5rem)] leading-snug tracking-tight text-canvas/85">
                {line}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-16 font-mono text-[11px] uppercase tracking-[0.16em] text-canvas/25"
        >
          Handled under the DPDP Act, 2023
        </motion.p>
      </div>
    </section>
  );
}
