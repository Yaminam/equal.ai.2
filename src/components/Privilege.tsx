"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE } from "../lib/motion";

/*
  The privilege. Just the words.

  Eight attempts sit behind this file: a dot-matrix stat, an evening timeline, a
  dark room with a phone in it, a departure-board roll of names, two hundred words
  converging to spell YOU, an engraved honour board. Every one of them was me
  reaching for a mechanic when the section only ever needed a sentence.

  So this is a sentence. One idea, set large, on the darkest ground on the page,
  with more air around it than anything else gets.

  The only motion is the line arriving — each word hinged up from below, clipped,
  staggered. Nothing else moves. The restraint IS the premium signal: this is the
  one place on the page confident enough to just say the thing and stop.

  Two details are load-bearing:

  · THE SPACES ARE REAL. Each word is clipped in its own inline-block so it can
    hinge, and the gaps between them are real text nodes, not `margin-right`. A
    margin looks like a space and is not one — the DOM used to read
    "Nowtheprivilegeisyours." and that is what a screen reader said out loud.

  · "YOURS" IS THE ONLY GREEN WORD. The whole section is one colour decision, and
    it falls on the word that transfers ownership.
*/

const LINE = "The privilege is yours now.";
const WORDS = LINE.split(" ");

export function Privilege() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-ink py-32 text-canvas md:py-44">
      <div className="relative mx-auto max-w-5xl px-6">
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9 }}
          className="mb-16 font-mono text-[11px] uppercase tracking-[0.24em] text-canvas/30"
        >
          The privilege
        </motion.p>

        <motion.h2
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          className="max-w-[15ch] text-[clamp(2.4rem,7vw,6rem)] font-medium leading-[1] tracking-[-0.045em]"
        >
          {WORDS.map((w, i) => (
            <Fragment key={`${w}-${i}`}>
              <span className="inline-block overflow-hidden pb-[0.11em] align-bottom">
                <motion.span
                  variants={{
                    hidden: { y: "115%" },
                    show: { y: 0, transition: { duration: 0.9, ease: EASE } },
                  }}
                  className={`inline-block ${w.startsWith("yours") ? "text-green" : ""}`}
                >
                  {w}
                </motion.span>
              </span>
              {/* a real space. a margin is a picture of a space; only a space is one. */}
              {i < WORDS.length - 1 ? " " : null}
            </Fragment>
          ))}
        </motion.h2>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: EASE, delay: 0.65 }}
          className="mt-14 max-w-[42ch] text-[clamp(1.05rem,1.6vw,1.35rem)] leading-relaxed text-canvas/45"
        >
          Once, only the powerful had someone who answered before they did.
          Today, your business can sound just as established, because your time
          deserves protection.
        </motion.p>
      </div>
    </section>
  );
}
