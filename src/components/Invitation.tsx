"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Magnetic } from "./Magnetic";
import { EASE } from "../lib/motion";
import { inr } from "../lib/format";
import { PLAY_STORE } from "../lib/links";

/*
  The door.

  This used to be an invite form: a phone field, a fake queue, and the line
  "invitations open in small numbers each month." The app is already on the
  Play Store, so all of that was a lie standing between a willing buyer and a
  button that exists. Scarcity you don't actually enforce is not prestige, it
  is friction — and the first person who searches the store and finds it sitting
  there, installable, stops trusting the rest of the page.

  So the prestige stays in the language and leaves the mechanics. We still say
  not everyone needs this. Then we get out of the way.
*/
export function Invitation() {
  const reduce = useReducedMotion();

  // The door is the brightest place on the page. The light comes from below and
  // behind it (origin off-canvas at 185%), so it reads as a lit doorway rather
  // than a lime blob sitting on the page.
  return (
    <section
      id="invite"
      className="lit-below relative isolate flex min-h-[76svh] items-center overflow-hidden py-24"
    >
      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 text-center">
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9 }}
          className="mb-10 font-mono text-[11px] uppercase tracking-[0.24em] text-ink/30"
        >
          Membership
        </motion.p>

        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="text-[clamp(2.2rem,6vw,4.8rem)] font-medium leading-[1]"
        >
          not everyone needs a gatekeeper.
        </motion.h2>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
          className="mx-auto mt-8 max-w-[34ch] text-[16.5px] leading-relaxed text-ink/45"
        >
          If you do, it is already waiting on your phone.
        </motion.p>

        {/* held breath: the line lands, then the door appears */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, ease: EASE, delay: 0.85 }}
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

          {/* Said once, plainly, at the door — never in the hero, never against a
              beverage. The trust lines live in Creed, immediately above. */}
          <p className="tnum mt-8 text-[13px] text-ink/30">
            Membership, {inr(249)} a month.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
