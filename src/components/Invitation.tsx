"use client";

import { motion, useReducedMotion } from "motion/react";
import { Device, ScreenAmma } from "./Device";
import { Magnetic } from "./Magnetic";
import { EASE } from "../lib/motion";
import { inr } from "../lib/format";
import { PLAY_STORE } from "../lib/links";

/*
  The closing scene.

  ── THE PROBLEM WAS NEVER THE COPY ───────────────────────────────────────────

  Five rewrites of this section changed the words and never changed the shape:
  centred label, centred headline, centred line, centred button, centred
  footnote. Which is to say it kept being ANOTHER HERO — the same composition the
  page opens with, at the point where the page is supposed to end.

  A story does not end in the same shot it began in.

  So the composition is now asymmetric: the argument on the left, and on the
  right, at last, the thing the whole page has been about.

  ── THE ONE VISUAL ───────────────────────────────────────────────────────────

  A phone. Ringing. And it is Amma.

  This is the only image on the page that is a REWARD rather than an
  explanation. The site opens with a phone that will not stop ringing for people
  who do not matter, spends nine sections taking those calls away, and now — here,
  in the last frame — the phone rings once, and it is your mother.

  Nobody needs that explained. It is the payoff, and a payoff you have to caption
  is not a payoff.

  ── GREEN IS SPENT ON THE PAYOFF, NOT ON DECORATION ──────────────────────────

  The accent falls in exactly two places: the word "You" in the headline, and the
  ringing call. Both are the emotional turn. The button does NOT flare green on
  hover; it deepens. An accent used for emphasis is decoration. An accent used
  for meaning is a brand.

  ── THE ACTION IS ONE OBJECT, NOT FOUR ───────────────────────────────────────

  The button, the price, and the iPhone note used to be four separate pieces of
  text floating at four different distances. They are one decision, so they are
  now one grouped block with a hairline above it: a thing you act on, not a list
  you read.
*/

export function Invitation() {
  const reduce = useReducedMotion();

  /* cinematic entrance: the argument, then the reward. */
  const step = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 } as const,
    transition: { duration: 1, ease: EASE, delay: 0.1 + i * 0.14 },
  });

  return (
    <section
      id="invite"
      className="lit-below relative isolate overflow-hidden pb-24 pt-24 md:pb-28 md:pt-28"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-24">
          {/* ── THE ARGUMENT ─────────────────────────────────────────────── */}
          <div className="min-w-0">
            <motion.div {...step(0)} className="flex items-center gap-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-ink/30">
                Your turn
              </span>
              <span aria-hidden className="block h-px flex-1 bg-ink/10" />
            </motion.div>

            {/* the type is big, and everything under it is deliberately small.
                uniform hierarchy is what made this read as a hero. */}
            <motion.h2
              {...step(1)}
              className="mt-10 max-w-[13ch] text-[clamp(2.3rem,5vw,4.2rem)] font-medium leading-[1.02] tracking-[-0.045em]"
            >
              Some people hire a gatekeeper.{" "}
              <span className="font-semibold" style={{ color: "#159c47" }}>
                You
              </span>{" "}
              just install one.
            </motion.h2>

            <motion.p
              {...step(2)}
              className="mt-8 text-[clamp(1.1rem,1.7vw,1.4rem)] text-ink/45"
            >
              The privilege is yours.
            </motion.p>

            {/* ONE OBJECT. a decision, not a list. */}
            <motion.div {...step(3)} className="mt-12 border-t border-ink/10 pt-10">
              <Magnetic>
                <a
                  href={PLAY_STORE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-solid inline-flex items-center rounded-full px-12 py-[21px] text-[16.5px] font-medium text-canvas"
                >
                  Get Equal
                </a>
              </Magnetic>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
                <p className="tnum text-[13px] tracking-tight text-ink/35">
                  {inr(249)}/month &nbsp;·&nbsp; Cancel anytime
                </p>
                <p className="text-[13px] text-ink/[0.22]">
                  Android today. iPhone soon.
                </p>
              </div>
            </motion.div>
          </div>

          {/* ── THE REWARD ───────────────────────────────────────────────── */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 26, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.65 }}
            className="relative mx-auto w-full max-w-[264px]"
          >
            {/* the only light in the composition, and it is hers */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-16 -z-10 rounded-full blur-[70px]"
              style={{ background: "radial-gradient(closest-side, rgba(0,177,64,0.30), transparent)" }}
            />

            {/* the rings. it is ringing. */}
            {!reduce &&
              [0, 1, 2].map((r) => (
                <motion.span
                  key={r}
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 size-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-green/30"
                  animate={{ scale: [0.9, 1.9], opacity: [0.55, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut", delay: r * 0.85 }}
                />
              ))}

            {/*
              THE REAL HANDSET.

              This was a bespoke rounded card with a name on it, and a bespoke card
              is a GRAPHIC. The same phone the rest of the page uses -- with its
              status bar, its Dynamic Island, its Accept and Decline buttons and its
              home indicator -- is a CALL. The whole argument of this section is that
              this is your phone doing the ordinary thing it is meant to do, exactly
              once, so it has to be the ordinary phone.
            */}
            <Device>
              <ScreenAmma />
            </Device>
          </motion.div>
        </div>

        {/* the signature. the last thing anyone reads, and it says nothing new. */}
        <motion.p
          {...step(5)}
          className="mt-24 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-ink/40"
        >
          Designed to protect your attention
        </motion.p>
      </div>
    </section>
  );
}
