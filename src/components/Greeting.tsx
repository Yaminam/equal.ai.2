"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "../lib/motion";

/*
  The caller's side.

  Truecaller announces itself to the person calling you: "the person you're
  calling is using a screening service." It is cold, bureaucratic, and it tells
  every caller that you have put a machine between you and them. That single
  sentence is most of why the category reads downmarket.

  A gatekeeper does not announce that it is a gatekeeper. It is simply poised,
  warm, and unmistakably not you. Showing this line does two jobs at once: it is
  the most human moment on the page, and it quietly answers the fear that an AI
  is out there pretending to be you.

  TODO(equal): this greeting must match the assistant's real opening line.
*/

const LINE = "Hello. I answer this phone. May I ask who's calling?";

export function Greeting() {
  const reduce = useReducedMotion();

  return (
    <section className="lit-above relative isolate overflow-hidden bg-sand py-28 md:py-32">
      {/* the section edge dissolves rather than cutting — a hard seam between two
          grounds is the stacked-blocks look that reads as a template */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{ background: "linear-gradient(#faf9f6, #faf9f600)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{ background: "linear-gradient(#faf9f600, #faf9f6)" }}
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9 }}
          className="mb-12 font-mono text-[11px] uppercase tracking-[0.24em] text-ink/30"
        >
          What your callers hear
        </motion.p>

        <motion.blockquote
          initial={reduce ? false : { opacity: 0, y: 18, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="text-balance text-[clamp(1.5rem,3.6vw,3rem)] font-medium leading-[1.18] tracking-[-0.03em]"
        >
          <span className="text-ink/25">&ldquo;</span>
          {LINE}
          <span className="text-ink/25">&rdquo;</span>
        </motion.blockquote>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
          className="mx-auto mt-12 max-w-[38ch] text-[16px] leading-relaxed text-ink/45"
        >
          Never a script read by a robot. Never a copy of your voice.
        </motion.p>
      </div>
    </section>
  );
}
