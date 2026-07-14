"use client";

import { motion, useReducedMotion } from "motion/react";
import { Magnetic } from "./Magnetic";
import { EASE } from "../lib/motion";
import { inr } from "../lib/format";
import { PLAY_STORE } from "../lib/links";

/*
  The closing scene.

  Not a conversion block. A conversion block argues; a closing scene resolves. By
  the time anyone arrives here they have been told what the product does six
  times in six ways. A seventh would not persuade them, it would only reveal that
  we did not trust the first six.

  ── ONE WORD IS GREEN ────────────────────────────────────────────────────────

  The whole second sentence used to be green, and it dominated the composition:
  a five-word block of colour that shouted louder than the idea it was meant to
  carry. Colour is emphasis, and emphasis on everything is emphasis on nothing.

  So the accent falls on a single word: YOU.

  It is the right word, and not merely the shortest one. The entire page has been
  about a privilege that belonged to other people. "Some people hire a
  gatekeeper" is them. "You" is the turn. One word, and it is the only word in
  the sentence that names the reader.

  Apple does not highlight sentences. Nobody confident does.

  ── AND THE NARRATIVE CLOSES ON THE WORD IT OPENED WITH ──────────────────────

  The page is built on one idea — the privilege — and it was used twice and then
  abandoned. So it is said once more, at the end, as the last line before the
  door: "Welcome to the privilege."

  That is not a tagline. It is the sentence a doorman says, and the whole site has
  been about having someone at the door.

  ── THE BUTTON IS A NAME, NOT AN INSTRUCTION ─────────────────────────────────

  "Get Equal on Google Play" is a sentence with logistics in it. "Get Equal", with
  the store named quietly beneath, is a decision. The button carries the verb; the
  fine print carries the paperwork.
*/

export function Invitation() {
  const reduce = useReducedMotion();

  /* the scene assembles in order: label, line, the word, the promise, the door.
     nothing dramatic — just a sequence, so the eye is led rather than dropped. */
  const step = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 } as const,
    transition: { duration: 1.1, ease: EASE, delay: 0.15 + i * 0.28 },
  });

  return (
    <section
      id="invite"
      className="lit-below relative isolate flex min-h-[80svh] items-center overflow-hidden py-20"
    >
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 text-center">
        <motion.p
          {...step(0)}
          className="font-mono text-[11px] uppercase tracking-[0.28em] text-ink/30"
        >
          Your turn
        </motion.p>

        {/* one word is green, and it is the one that names the reader */}
        <motion.h2
          {...step(1)}
          className="mx-auto mt-10 max-w-[16ch] text-[clamp(2.3rem,6vw,4.8rem)] font-medium leading-[1.03] tracking-[-0.045em]"
        >
          Some people hire a gatekeeper.{" "}
          <span className="text-green">You</span> just install one.
        </motion.h2>

        {/* the idea the whole page is built on, said one last time */}
        <motion.p
          {...step(2)}
          className="mx-auto mt-9 text-[clamp(1.15rem,2vw,1.6rem)] leading-relaxed text-ink/45"
        >
          Welcome to the privilege.
        </motion.p>

        {/* the door. it needs its own air — it is the only thing here you can do. */}
        <motion.div {...step(3)} className="mt-11">
          <Magnetic>
            <a
              href={PLAY_STORE}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ink inline-flex items-center rounded-full px-11 py-[19px] text-[16px] font-medium text-canvas"
            >
              Get Equal
            </a>
          </Magnetic>

          {/* the button carries the verb. the paperwork lives down here. */}
          <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink/30">
            Available on Google Play
          </p>

          <p className="tnum mt-2 text-[13px] text-ink/30">
            {inr(249)}/month &nbsp;·&nbsp; Cancel anytime
          </p>
        </motion.div>

        {/*
          iOS, once, as type. Never as a button.

          A greyed-out App Store badge is a dead control: it invites a tap, does
          nothing, and teaches the visitor that this page's buttons cannot be
          trusted — on the one screen where every button must be. And it now says
          the same word the section closes on, so the wait is framed as an
          inheritance rather than an absence.
        */}
        <motion.p
          {...step(4)}
          className="mx-auto mt-12 max-w-[22ch] text-[13.5px] leading-relaxed text-ink/30"
        >
          The same privilege.
          <br />
          Coming to iPhone.
        </motion.p>

        {/* the signature. almost invisible, and the last thing anyone reads. */}
        <motion.p
          {...step(5)}
          className="mt-14 font-mono text-[10px] uppercase tracking-[0.3em] text-ink/20"
        >
          Your calls. Your time. Your control.
        </motion.p>
      </div>
    </section>
  );
}
