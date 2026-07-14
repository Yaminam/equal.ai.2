"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Magnetic } from "./Magnetic";
import { EASE } from "../lib/motion";
import { inr } from "../lib/format";
import { PLAY_STORE } from "../lib/links";

/*
  The door.

  This was once an invite form: a phone field, a fake queue, and the line
  "invitations open in small numbers each month." The app is already on Google
  Play, so all of that was a lie standing between a willing buyer and a button
  that exists. Scarcity you do not enforce is not prestige, it is friction, and
  the first person who searches the store and finds it sitting there installable
  stops trusting the rest of the page.

  So the prestige stays in the language and leaves the mechanics.

  ── THE HEADLINE IS THE WHOLE POSITIONING ────────────────────────────────────

  "Some people hire a gatekeeper. You just install one."

  That sentence does in eight words what the rest of the page spends nine
  sections on: it names the elite thing, and then it hands it to you. It is the
  only line on the site that contains both halves of the pitch.

  ── AND THE BODY REFRAMES THE PRODUCT ONE LAST TIME ──────────────────────────

  A gatekeeper is not about keeping people out. That is the spam-filter reading,
  and it is the reading we have spent the whole page refusing. It is about
  protecting what matters most: your attention. The final paragraph says so
  plainly, because this is the last thing anyone reads before they decide.

  No em dash in it. The original copy had "what matters most—your attention";
  a colon does the same work and the site has none.
*/

export function Invitation() {
  const reduce = useReducedMotion();

  return (
    <section
      id="invite"
      className="lit-below relative isolate flex min-h-[82svh] items-center overflow-hidden py-24"
    >
      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 text-center">
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9 }}
          className="mb-10 font-mono text-[11px] uppercase tracking-[0.24em] text-ink/30"
        >
          Your turn
        </motion.p>

        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="mx-auto max-w-[18ch] text-[clamp(2rem,5.2vw,4rem)] font-medium leading-[1.04] tracking-[-0.04em]"
        >
          Some people hire a gatekeeper.{" "}
          <span className="text-green">You just install one.</span>
        </motion.h2>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
          className="mx-auto mt-10 max-w-[58ch] text-pretty text-[16.5px] leading-relaxed text-ink/45"
        >
          A gatekeeper isn&rsquo;t about keeping people out. It&rsquo;s about
          protecting what matters most: your attention. Equal quietly answers
          every call, handles routine conversations, filters distractions, and
          forwards only the ones that deserve your time. You stay available for
          what matters, without being interrupted by everything else.
        </motion.p>

        {/* held breath: the argument lands, and only then does the door appear */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, ease: EASE, delay: 0.8 }}
          className="mt-14"
        >
          <Magnetic>
            <a
              href={PLAY_STORE}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ink group inline-flex items-center gap-2.5 rounded-full px-7 py-4 text-[15px] font-medium text-canvas"
            >
              Get Equal on Google Play
              <ArrowUpRight
                weight="bold"
                size={16}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </Magnetic>

          {/* the price, said once, plainly, at the door. never in the hero, and
              never measured against a beverage. */}
          <p className="tnum mt-8 text-[13px] text-ink/30">
            Starts at {inr(249)} a month. Cancel anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
