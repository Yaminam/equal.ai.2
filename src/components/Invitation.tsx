"use client";

import { motion, useReducedMotion } from "motion/react";
import { Magnetic } from "./Magnetic";
import { EASE } from "../lib/motion";
import { inr } from "../lib/format";
import { PLAY_STORE } from "../lib/links";

/*
  The closing scene.

  This is not a conversion block, and the difference matters. A conversion block
  argues; a closing scene resolves. By the time anyone reaches this section they
  have already been told what the product does, six times, in six ways. Saying it
  a seventh time here would not persuade them. It would only reveal that we did
  not trust the first six.

  So there is nothing here to learn. There is only the last frame of the story,
  and the person the visitor has spent the whole page deciding to become.

  ── WHAT WAS CUT, AND WHY ────────────────────────────────────────────────────

  The previous version closed with a 58-word paragraph explaining what a
  gatekeeper is and what Equal does with your calls. Every word of it was true
  and every word of it was in the way. An explanation at the end of a story is a
  writer who does not believe the story worked.

  Four elements survive. A label, a line, a sentence, a button.

  ── THE ONE SENTENCE ─────────────────────────────────────────────────────────

  "The privilege is already waiting on your phone."

  It does two things at once, which is why it earns its place. It closes the arc
  the page opened with (a privilege that belonged to other people), and it
  removes the last obstacle without ever mentioning one: there is nothing to
  request, nothing to join, nothing to wait for. It is already there. Go.

  ── THE RESTRAINT IS THE ARGUMENT ────────────────────────────────────────────

  Big type, a great deal of air, one warm light low on the horizon, and almost
  nothing else. Apple, Linear and Nothing all end this way, and they end this way
  because the last thing a confident brand does is raise its voice. The quiet IS
  the pitch: this is what a page looks like when it has already made its case.
*/

export function Invitation() {
  const reduce = useReducedMotion();

  return (
    <section
      id="invite"
      className="lit-below relative isolate flex min-h-[80svh] items-center overflow-hidden py-24"
    >
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 text-center">
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.2 }}
          className="font-mono text-[11px] uppercase tracking-[0.28em] text-ink/30"
        >
          Your turn
        </motion.p>

        {/* the line the whole page has been walking toward */}
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.3, ease: EASE, delay: 0.15 }}
          className="mx-auto mt-12 max-w-[17ch] text-[clamp(2.3rem,6vw,4.8rem)] font-medium leading-[1.02] tracking-[-0.045em]"
        >
          Some people hire a gatekeeper.{" "}
          <span className="text-green">You just install one.</span>
        </motion.h2>

        {/* one sentence. it closes the arc and removes the last obstacle without
            ever naming one: there is nothing to request. it is already there. */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.55 }}
          className="mx-auto mt-10 max-w-[34ch] text-[clamp(1.1rem,1.9vw,1.5rem)] leading-relaxed text-ink/45"
        >
          The privilege is already waiting on your phone.
        </motion.p>

        {/* the held breath. the line lands, and only then does the door appear. */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.2, ease: EASE, delay: 1.05 }}
          className="mt-12"
        >
          <Magnetic>
            <a
              href={PLAY_STORE}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ink inline-flex items-center rounded-full px-9 py-[18px] text-[15.5px] font-medium text-canvas"
            >
              Get Equal on Google Play
            </a>
          </Magnetic>

          <p className="tnum mt-6 text-[13px] text-ink/30">
            Starts at {inr(249)}/month.
          </p>

          {/*
            iOS, stated once, quietly, and never as a button.

            A greyed-out App Store badge is a dead control: it invites a tap, does
            nothing, and the visitor learns that this page's buttons cannot be
            trusted. A line of type promises nothing and costs nothing. The dot is
            the only ornament, and it is doing the work of a whole badge.
          */}
          <p className="mt-3 flex items-center justify-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink/25">
            <span className="block size-1 rounded-full bg-ink/25" />
            iPhone coming soon
          </p>
        </motion.div>
      </div>
    </section>
  );
}
