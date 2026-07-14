"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE } from "../lib/motion";

/*
  The aspiration.

  CRED never mentions the bill. It sells the payer: "crafted for the
  creditworthy", "not everyone makes it in". The chore disappears and
  membership remains.

  Answering a spam call is equally unglamorous. So we never sell screening. We
  sell the thing a gatekeeper has always meant: that your time is spoken for,
  and someone else deals with the door.

  This is the beat where the visitor decides they want to be that person.
*/

/*
  Present tense, and it answers the Stage.

  The story just said "Once, only the powerful didn't." So this chapter says
  "Now." Past tense ("was always a privilege") reads as a history lesson and
  puts the status safely in someone else's hands. Present tense hands it to the
  reader, which is the entire point of the section.

  There used to be a second line here: "It costs less than a coffee a week."
  It is gone. You cannot call something a privilege and then price it against a
  beverage in the next breath — anchoring to a consumable is the register of
  boAt, OnePlus EMI banners and Truecaller, not of a brand anyone aspires to.
  Premium Indian brands mute the price or hide it. Ours now lives once, quietly,
  at the door.
*/
const WORDS = "Now the privilege is yours.".split(" ");

/*
  The trigger lives on the h2, never on the words.

  Each word starts at y:112%, i.e. fully outside its own overflow-hidden parent.
  IntersectionObserver clips a target against every ancestor's overflow box, so
  such a word reports ratio 0 and can never satisfy a whileInView amount. It
  would wait forever to become visible, while being invisible. The h2 is not
  clipped, so it observes cleanly and staggers the words in as children.
*/
const HEADLINE = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055 } },
};

const WORD = {
  hidden: { y: "112%" },
  show: { y: 0, transition: { duration: 0.85, ease: EASE } },
};

/*
  Aspire and Proof share one ground. They are two beats of a single dark
  chapter, so the space between them is set by padding on each, not by a
  min-height: a min-height scales the gap with the viewport rather than the
  content, and on a tall screen it opens into a void.
*/
export function Aspire() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[70svh] items-center overflow-hidden bg-ink pb-16 pt-32 text-canvas">
      {/* the ground goes quiet here. one light behind the words, one far off. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-1/4 top-1/2 size-[900px] -translate-y-1/2 rounded-full blur-[160px]"
        style={{ background: "radial-gradient(closest-side, rgba(0,177,64,0.16), transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-0 size-[560px] rounded-full blur-[150px]"
        style={{ background: "radial-gradient(closest-side, rgba(186,255,41,0.07), transparent)" }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-6">
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9 }}
          className="mb-11 font-mono text-[11px] uppercase tracking-[0.24em] text-canvas/30"
        >
          The privilege
        </motion.p>

        {/* the words hold the left; the line answers them from the right, on the
            last baseline. nothing is centred, and nothing is left hanging. */}
        <div className="grid gap-y-14 lg:grid-cols-[1.45fr_0.55fr] lg:items-end lg:gap-x-16">
          <motion.h2
            variants={HEADLINE}
            initial={reduce ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            className="max-w-[13ch] text-[clamp(2.4rem,6.4vw,5.8rem)] font-medium leading-[0.98]"
          >
            {/*
              THE SPACES ARE REAL, AND THEY HAVE TO BE.

              Each word is clipped in its own inline-block so it can hinge up
              from below. The gaps between them used to be `margin-right` — which
              LOOKS like spacing and is not: the DOM read "Nowtheprivilegeisyours."
              Copy the headline and you got that. A screen reader said that. A
              crawler indexed that.

              A margin is a picture of a space. A space is a space. So the words
              are separated by real text nodes, and the margin is gone.
            */}
            {WORDS.map((w, i) => (
              <Fragment key={`${w}-${i}`}>
                <span className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                  <motion.span
                    variants={WORD}
                    className={`inline-block ${w.startsWith("privilege") ? "text-green" : ""}`}
                  >
                    {w}
                  </motion.span>
                </span>
                {i < WORDS.length - 1 ? " " : null}
              </Fragment>
            ))}
          </motion.h2>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
            className="lg:pb-3"
          >
            <span className="mb-6 block h-px w-12 bg-canvas/20" />
            <p className="max-w-[30ch] text-[17px] leading-relaxed text-canvas/45">
              Equal is for people whose time is already spoken for.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
