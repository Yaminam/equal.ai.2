"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";
import { Reveal } from "./primitives";
import { EASE } from "../lib/motion";

/*
  A sticky index on the left tracks the active reason as the blocks scroll past.
  Reason 05 hands off to the testimonials directly below.
*/

type Reason = { n: string; label: string; title: ReactNode; body: string };

const REASONS: Reason[] = [
  {
    n: "01",
    label: "A new standard",
    title: <>Everyone deserves a gatekeeper.</>,
    body: "Until now, only the powerful had someone to manage their calls. A secretary was a status symbol. Equal makes one cost less than a coffee a week.",
  },
  {
    n: "02",
    label: "Not a blocklist",
    title: (
      <>
        It answers first.
        <br />
        Then it decides.
      </>
    ),
    body: "Blocking is a blunt instrument. Equal hears the caller out, understands what they want, and only then chooses to ring you, take a message, or say a polite no.",
  },
  {
    n: "03",
    label: "Built for Indian fraud",
    title: <>It knows a fake KYC call when it hears one.</>,
    body: "OTP requests, refund traps, loan bots, recovery agents on the wrong number, electricity disconnection threats. Equal was trained on the scams that actually happen here.",
  },
  {
    n: "04",
    label: "Origin",
    title: (
      <>
        Built for India.
        <br />
        Made in India.
      </>
    ),
    body: "Equal understands Indian context: brokers, courier callers, family rhythms, the way people switch language mid-sentence. Built by Indians who got thirty spam calls a day.",
  },
];

export function WhyEqual() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <Reveal>
        <h2 className="max-w-[19ch] text-[clamp(2rem,4.6vw,3.6rem)] font-medium leading-[1.02]">
          Five reasons people are quietly switching.
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[0.4fr_0.6fr]">
        {/* sticky index */}
        <div className="hidden lg:block">
          <div className="sticky top-32">
            <div className="relative h-[190px]">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={active}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -18 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="tnum absolute text-[clamp(5rem,11vw,10rem)] font-medium leading-none tracking-tight text-green"
                >
                  {REASONS[active].n}
                </motion.span>
              </AnimatePresence>
            </div>
            <p className="mt-1 font-mono text-[11.5px] uppercase tracking-[0.18em] text-ink/50">
              {REASONS[active].label}
            </p>

            <div className="mt-8 space-y-3">
              {REASONS.map((r, i) => (
                <div key={r.n} className="flex items-center gap-3">
                  <span
                    className={`h-px transition-all duration-500 ${
                      i === active ? "w-10 bg-green" : "w-5 bg-ink/15"
                    }`}
                  />
                  <span
                    className={`tnum font-mono text-[11px] transition-colors duration-500 ${
                      i === active ? "text-ink" : "text-ink/30"
                    }`}
                  >
                    {r.n}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* the reasons */}
        <div>
          {REASONS.map((r, i) => (
            <motion.div
              key={r.n}
              onViewportEnter={() => setActive(i)}
              viewport={{ amount: 0.6, margin: "-22% 0px -22% 0px" }}
              className="flex flex-col justify-center border-t border-ink/10 py-10 first:border-t-0 lg:min-h-[44vh]"
            >
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <span className="tnum block font-mono text-[13px] text-green lg:hidden">{r.n}</span>
                <h3 className="mt-2 text-[clamp(1.7rem,3.2vw,2.6rem)] font-medium leading-[1.05]">
                  {r.title}
                </h3>
                <p className="mt-4 max-w-[44ch] text-[16px] leading-relaxed text-ink/55">{r.body}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 05, the handoff */}
      <Reveal>
        <div className="mt-6 border-t border-ink/10 pt-16 text-center">
          <span className="tnum text-[2.6rem] font-medium leading-none text-green">05</span>
          <p className="mx-auto mt-5 max-w-[24ch] text-[clamp(1.5rem,3.2vw,2.4rem)] font-medium leading-[1.1]">
            Loved by founders, doctors, parents, and everyone tired of picking up.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
