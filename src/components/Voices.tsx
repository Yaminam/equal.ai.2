"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "../lib/motion";

/*
  Wispr Flow calls this "Love letters to Flow". One-liners only.

  Not a testimonial wall. A wall invites comparison; a line invites envy. Each
  quote is one sentence, and nobody explains why they like it.

  The stock avatars are gone. Premium brands use few, named, high-status proofs
  and no grid of smiling faces — a random face from an avatar service reads as
  filler, and it was a third-party request on every page load. What remains is
  the sentence and the person who said it.

  ------------------------------------------------------------------------
  TODO(equal): THESE THREE QUOTES AND NAMES ARE PLACEHOLDERS. They are not real
  people. "Partner, Accel" in particular attributes an endorsement to a named
  firm that has not given one. Replace with real, consented, attributable
  quotes before this page is public, or delete the section.
  ------------------------------------------------------------------------
*/

const VOICES = [
  {
    quote: "It refused an OTP meant for my father. I put it on his phone that evening.",
    name: "Dr. Priya Nair",
    role: "Cardiologist, Delhi",
    id: "priya",
  },
  {
    quote: "Callers speak Tamil. It answers in Tamil. My parents have never once noticed.",
    name: "Rajesh Kumar",
    role: "Founder, Chennai",
    id: "rajesh",
  },
  {
    quote: "Two calls got through this week. Both of them mattered.",
    name: "Arjun Mehta",
    role: "Investor, Bengaluru",
    id: "arjun",
  },
];

export function Voices() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-20 md:py-24">
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="max-w-[14ch] text-[clamp(1.8rem,3.4vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.035em]"
        >
          The people who stopped picking up.
        </motion.h2>

        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
          {VOICES.map((v, i) => (
            <motion.figure
              key={v.id}
              initial={reduce ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: EASE, delay: i * 0.1 }}
            >
              <span aria-hidden className="mb-7 block h-px w-10 bg-ink/15" />
              <blockquote className="text-[18px] leading-relaxed tracking-tight text-ink/80">
                {v.quote}
              </blockquote>
              <figcaption className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-ink/30">
                {v.name} — {v.role}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
