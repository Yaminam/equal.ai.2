"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight, LockKey, Play } from "@phosphor-icons/react";
import { Magnetic } from "./primitives";
import { CallConsole } from "./CallConsole";
import { EASE } from "../lib/motion";

/*
  Hero, drawn from a study of twenty of them.

  - No rotating word. Not one premium hero uses one; Linear retired theirs.
  - The entrance is the signature: every word hinges up out of its own clipped
    box (family.co) while de-blurring in sequence (Linear).
  - Each WORD is clipped, never the line. Clipping the line means a headline
    that wraps loses its second row entirely.
  - Four elements, no more: badge, headline, one sentence, two buttons. The
    proof lives in the band directly below, so it is not said twice.
  - The console rings, is answered, and drifts past the fold to bait the scroll.
*/

const LINES = [
  ["Not", "all", "calls"],
  ["deserve", "your", "attention."],
];

function Headline() {
  const reduce = useReducedMotion();
  let n = 0;

  return (
    <h1 className="text-[clamp(2.6rem,5.8vw,4.6rem)] font-medium leading-[0.96] tracking-[-0.04em]">
      {LINES.map((line, li) => (
        <span key={li} className="block">
          {line.map((word) => {
            const delay = 0.12 + n * 0.075;
            n += 1;
            const accent = word === "attention.";
            return (
              // the clip lives on the word, so a wrapped line never disappears
              <span
                key={word}
                className="mr-[0.2em] inline-block overflow-hidden pb-[0.1em] align-bottom"
                style={{ perspective: "700px" }}
              >
                <motion.span
                  initial={
                    reduce ? false : { y: "108%", rotateX: -42, opacity: 0, filter: "blur(7px)" }
                  }
                  animate={{ y: 0, rotateX: 0, opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.9, ease: EASE, delay }}
                  style={{ transformOrigin: "bottom center" }}
                  className={`inline-block ${accent ? "text-green" : ""}`}
                >
                  {word}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const driftRaw = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const drift = useSpring(driftRaw, { stiffness: 80, damping: 26 });

  return (
    <section ref={ref} id="top" className="relative overflow-hidden pb-8 pt-32 md:pt-36">
      {/* depth, not one flat blob: a lattice, a warm glow, a cool one, a horizon */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(15,20,17,0.09) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            maskImage: "radial-gradient(70% 55% at 50% 30%, black, transparent 82%)",
            WebkitMaskImage: "radial-gradient(70% 55% at 50% 30%, black, transparent 82%)",
          }}
        />
        <motion.div
          className="absolute -top-44 left-[38%] h-[540px] w-[820px] -translate-x-1/2 rounded-full blur-[130px]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(186,255,41,0.55), rgba(0,177,64,0.08), transparent)",
          }}
          animate={reduce ? {} : { scale: [1, 1.09, 1], opacity: [0.6, 0.85, 0.6] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <div
          className="absolute -right-32 top-[26%] size-[560px] rounded-full blur-[150px]"
          style={{ background: "radial-gradient(closest-side, rgba(0,177,64,0.13), transparent)" }}
        />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-5 lg:grid-cols-[1.04fr_0.96fr]">
        <div>
          {/* privacy, said as what stays yours */}
          <motion.a
            href="#privacy"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="hairline group mb-8 inline-flex items-center gap-2 rounded-full bg-paper py-1.5 pl-2 pr-3.5 transition-colors hover:bg-tint"
          >
            <span className="grid size-6 place-items-center rounded-full bg-tint text-green">
              <LockKey weight="fill" size={13} />
            </span>
            <span className="text-[12.5px] text-ink/70">
              It answers for you. It reports only to you.
            </span>
            <ArrowRight size={12} className="text-ink/35 transition-transform group-hover:translate-x-0.5" />
          </motion.a>

          <Headline />

          {/* one sentence. seventeen words. the badge already carries privacy. */}
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.62 }}
            className="mt-7 max-w-[42ch] text-pretty text-[18px] leading-relaxed text-ink/60"
          >
            It picks up, works out who is calling and why, and rings you only for
            what matters.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.74 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Magnetic href="#waitlist" variant="primary">
              Request an invite
              <ArrowRight weight="bold" size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Magnetic>
            <Magnetic href="#try" variant="ghost" strength={0.18}>
              <Play weight="fill" size={12} className="text-green" />
              Say something to it
            </Magnetic>
          </motion.div>
        </div>

        {/* drift and entrance sit on separate elements so they never fight
            over the same transform */}
        <motion.div style={{ y: reduce ? 0 : drift }}>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.45 }}
          >
            <CallConsole />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
