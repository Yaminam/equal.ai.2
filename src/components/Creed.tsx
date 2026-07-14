"use client";

import { motion, useReducedMotion } from "motion/react";
import { LockSimple, DeviceMobile, SlidersHorizontal } from "@phosphor-icons/react";
import { EASE } from "../lib/motion";

/*
  Why people trust it.

  A thing that answers your phone and refuses your OTPs is the trust-critical
  case. The products that stayed silent about it — Friend, Bee — are the ones
  that got called dystopian. This is not a compliance block and it is not a row
  of padlock badges. It is three commitments, in the brand's own voice, before
  the door.

  ── THEY ARE PROMISES, NOT FEATURES ──────────────────────────────────────────

  A feature says what the software does. A promise says what we will never do.
  "Everything stays on your phone" is a spec; "Never shared. Never sold." is an
  undertaking. The whole section is written in the second register, because
  trust is a thing you give, not a thing you install.

  ── HIERARCHY: ONE THING IS LOUD ─────────────────────────────────────────────

  Three levels, and the contrast between them is deliberately violent: a 10px
  label, a ~26px promise, a 14px support line. The eye lands on the promise and
  nothing competes with it. Every card is laid out identically, so the pattern is
  learned on the first card and the other two are read for free.

  ── AND IT ENDS ON A PROMISE, NOT A STATUTE ──────────────────────────────────

  It used to close on "Handled under the DPDP Act, 2023." Nobody ever trusted a
  company because of paperwork. The Act moved to the footer, where a legal
  citation belongs — it has not been dropped, because almost no Indian consumer
  app names it and naming it reads as confidence.

  ────────────────────────────────────────────────────────────────────────────
  TODO(equal): every line below is a factual claim about how the product runs.
  "Everything happens on your phone" is the load-bearing one. If any audio or
  transcript touches a server, that card is FALSE. Verify against the real
  architecture before this page is public.
  ────────────────────────────────────────────────────────────────────────────
*/

type Commitment = {
  word: string;
  promise: string;
  support: string;
  icon: typeof LockSimple;
  /** each card gets its own accent, so three cards are not one card printed thrice */
  accent: string;
  glow: string;
};

const CREED: Commitment[] = [
  {
    word: "Private",
    promise: "Your conversations stay yours.",
    support: "Never shared. Never sold.",
    icon: LockSimple,
    accent: "linear-gradient(90deg, #00b140, rgba(0,177,64,0))",
    glow: "rgba(0,177,64,0.45)",
  },
  {
    word: "Local",
    promise: "Everything happens on your phone.",
    support: "Nothing leaves your device without you.",
    icon: DeviceMobile,
    accent: "linear-gradient(90deg, #baff29, rgba(186,255,41,0))",
    glow: "rgba(186,255,41,0.4)",
  },
  {
    word: "Control",
    promise: "You decide what it handles.",
    support: "And who is worth interrupting you.",
    icon: SlidersHorizontal,
    accent: "linear-gradient(90deg, #faf9f6, rgba(250,249,246,0))",
    glow: "rgba(250,249,246,0.35)",
  },
];

export function Creed() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-ink pb-20 pt-20 text-canvas md:pb-24 md:pt-24">
      <div className="relative mx-auto max-w-6xl px-6">
        {/* 1 — the section title */}
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9 }}
          className="font-mono text-[11px] uppercase tracking-[0.24em] text-canvas/30"
        >
          Why people trust it
        </motion.p>

        {/* 2 — the philosophy, so the turn into the section is not abrupt */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
          className="mt-8 max-w-[42ch] text-[15px] leading-relaxed text-canvas/40"
        >
          Privacy isn&rsquo;t something we added later. It&rsquo;s where we started.
        </motion.p>

        {/* 3 — the headline. short enough to remember. */}
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, ease: EASE, delay: 0.3 }}
          className="mt-6 max-w-[16ch] text-[clamp(2rem,4.4vw,3.6rem)] font-medium leading-[1.04] tracking-[-0.04em]"
        >
          Trust isn&rsquo;t a feature.{" "}
          <span className="text-green">It&rsquo;s the foundation.</span>
        </motion.h2>

        {/* 4 — the commitments, one after another */}
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {CREED.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.word}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.85, ease: EASE, delay: 0.5 + i * 0.14 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl px-8 py-10 transition-all duration-500 hover:-translate-y-2"
                style={{
                  background: "rgba(250,249,246,0.035)",
                  boxShadow:
                    "0 0 0 1px rgba(250,249,246,0.10), inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
              >
                {/* each card's own accent, drawn on hover */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 transition-transform duration-700 ease-out group-hover:scale-x-100"
                  style={{ background: c.accent }}
                />

                {/* the border warms, and the ground lifts a little with it */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: "rgba(250,249,246,0.02)",
                    boxShadow: `0 0 0 1px ${c.glow}, inset 0 1px 0 rgba(255,255,255,0.14), 0 28px 56px -28px ${c.glow}`,
                  }}
                />

                <span className="relative flex items-center gap-2.5">
                  <Icon
                    weight="bold"
                    size={13}
                    className="text-canvas/25 transition-colors duration-500 group-hover:text-canvas/50"
                  />
                  <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-canvas/40 transition-colors duration-500 group-hover:text-canvas/70">
                    {c.word}
                  </span>
                </span>

                {/* THE PROMISE. the only loud thing on the card. */}
                <p className="relative mt-12 text-[clamp(1.3rem,2vw,1.65rem)] font-medium leading-[1.25] tracking-tight text-canvas/90 transition-colors duration-500 group-hover:text-canvas">
                  {c.promise}
                </p>

                <p className="relative mt-7 text-[14px] leading-relaxed text-canvas/30 transition-colors duration-500 group-hover:text-canvas/55">
                  {c.support}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* 5 — the conclusion. it needs enough air to read as the end of the
            section rather than a fourth card, and no more than that. mt-32/40 was
            a canyon: the line floated with nothing on either side of it. */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
          className="mx-auto mt-16 max-w-[22ch] text-center text-[clamp(1.5rem,3vw,2.4rem)] font-medium leading-[1.15] tracking-tight md:mt-20"
        >
          Built for people.{" "}
          <span className="text-green">Not advertisers.</span>
        </motion.p>
      </div>
    </section>
  );
}
