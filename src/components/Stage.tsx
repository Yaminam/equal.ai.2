"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { Fragment, useRef, useState, type ReactNode } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import {
  Device,
  ScreenAnswering,
  ScreenBlocked,
  ScreenMom,
  ScreenRinging,
  ScreenScam,
} from "./Device";
import { EASE } from "../lib/motion";

/*
  The spine of the page.

  One phone. It pins, and your scroll moves the story across it. Six beats,
  read end to end as one sentence:

    Everyone has your number. You were never meant to answer. Once, only the
    powerful didn't. It hears the scam first. It answers to you alone. And your
    mother always gets through.

  The page opens in the dark, because that is the world where strangers own
  your phone. When the gatekeeper arrives, the lights come on.

  The craft, taken from the pages that do this best (Apple, Rivian, Igloo):

  THE OBJECT MOVES, THE WORDS CUT. The phone runs on one clock — a slow
  continuous dolly across the entire pin, never stopping. The headlines run on
  another, and they crossfade. Two layers, two timelines. That is the trick.

  EVERY BEAT ARRIVES OUT OF FOCUS AND SETTLES. A focus pull is the single most
  reliable signal of a filmed image, and it costs one blur keyframe.

  THE LIGHT COMES FROM THE PHONE. The dawn is not a background swap; it blooms
  out of the screen and fades, so the object is the source of its own arrival.

  PREMIUM IS SLOW. Nobody good runs a beat in under one viewport height.
*/

const INK = "#10140f";
const CANVAS = "#faf9f6";

type Beat = {
  line: string;
  accent?: string;
  sub?: string;
  screen: ReactNode;
  hero?: boolean;
};

const BEATS: Beat[] = [
  {
    line: "Not all calls deserve your attention.",
    accent: "attention.",
    sub: "An assistant that answers, decides, and rings you only for what matters.",
    screen: <ScreenRinging />,
    hero: true,
  },
  {
    line: "You were never meant to answer to strangers.",
    accent: "strangers.",
    screen: <ScreenRinging />,
  },
  {
    line: "Once, only the powerful had someone to answer for them.",
    accent: "powerful",
    // The clause that followed this — "Now it costs less than a coffee a week."
    // — is deliberately gone. You cannot call a thing a privilege and price it
    // against a beverage in the same breath; anchoring to a consumable is the
    // register of the mass market, and it undoes the sentence before it.
    sub: "A secretary was a status symbol.",
    screen: <ScreenAnswering />,
  },
  {
    line: "It hears a scam long before you would.",
    accent: "scam",
    screen: <ScreenScam />,
  },
  {
    line: "It answers for you. It reports only to you.",
    accent: "you.",
    sub: "Nothing leaves your phone. No one listens but you.",
    screen: <ScreenBlocked />,
  },
  {
    line: "And when your mother calls, your phone rings.",
    accent: "rings.",
    sub: "She speaks Hindi. It answers in Hindi. Then it puts her through.",
    screen: <ScreenMom />,
  },
];

/** The lights come on as the gatekeeper arrives — beat two ends at 2/6 of the scroll. */
const DAWN = [0.24, 0.34];

/** Premium is slow. Nobody good runs a beat in under one viewport. */
const VH_PER_BEAT = 170;

/*
  A word-by-word hinge reveal — with REAL spaces between the words.

  The gaps used to be `margin-right`, which looks like spacing and is not: the
  DOM read "Notallcallsdeserveyourattention." Copy the headline and you got that
  string; a screen reader read that string; a crawler indexed it. A margin is a
  picture of a space. Only a space is a space.
*/
function Line({ text, accent }: { text: string; accent?: string }) {
  const reduce = useReducedMotion();
  const strip = (s: string) => s.replace(/[.,]/g, "");
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => {
        const on = accent && strip(w) === strip(accent);
        return (
          <Fragment key={`${w}-${i}`}>
            <span className="inline-block overflow-hidden pb-[0.09em] align-bottom">
              <motion.span
                initial={reduce ? false : { y: "112%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: i * 0.05 }}
                className={`inline-block ${on ? "text-green" : ""}`}
              >
                {w}
              </motion.span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </>
  );
}

export function Stage() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 32, restDelta: 0.001 });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setI(Math.min(BEATS.length - 1, Math.max(0, Math.floor(v * BEATS.length * 0.999))));
  });

  // dawn: the world turns on
  const bg = useTransform(p, DAWN, [INK, CANVAS]);
  const fg = useTransform(p, DAWN, [CANVAS, INK]);
  const dim = useTransform(p, DAWN, ["rgba(250,249,246,0.42)", "rgba(16,20,15,0.45)"]);
  const hairline = useTransform(p, DAWN, ["rgba(250,249,246,0.14)", "rgba(16,20,15,0.14)"]);
  const lattice = useTransform(p, DAWN, [0, 0.9]);

  /* The arrival. Light does not switch on, it blooms out of the screen and
     fades — so the phone is the source of the dawn, not a spectator to it. */
  const bloom = useTransform(p, [DAWN[0], (DAWN[0] + DAWN[1]) / 2, DAWN[1]], [0, 0.8, 0]);

  /* The object's own clock.

     It used to keep dollying (scale -> 1.04) and lifting (y -> -18px) for the
     whole pin. That is the Apple move, and on a page of large type it is free.
     Here it is not: the screen carries 10.5px Devanagari, and a permanently
     fractional scale/translate makes the browser rasterise that text once and
     resample it, which turns matras to mush. The object settles at exactly 1
     and stays there. Only the lean survives, small. */
  const scale = useTransform(p, [0, 0.16], [1.14, 1]);
  const tilt = useTransform(p, [0, 1], [2, -2]);

  /* The scroll cue is a hero-only object. Once you have scrolled, it never returns. */
  const cue = useTransform(p, [0, 0.03], [1, 0]);

  const beat = BEATS[i];
  const dark = i < 2;

  return (
    <section ref={ref} id="top" className="relative" style={{ height: `${BEATS.length * VH_PER_BEAT}vh` }}>
      <motion.div
        style={{ backgroundColor: reduce ? CANVAS : bg, color: reduce ? INK : fg }}
        className="sticky top-0 flex h-svh items-center overflow-hidden pb-6 pt-20 lg:pb-10 lg:pt-24"
      >
        {/* the lattice only exists once the lights are on */}
        <motion.div
          aria-hidden
          style={{ opacity: reduce ? 0.9 : lattice }}
          className="pointer-events-none absolute inset-0"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(16,20,15,0.10) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              // the mask follows the phone, so the lattice is densest where the
              // light is and dissolves to nothing at the edges of the frame
              maskImage: "radial-gradient(68% 58% at 66% 46%, black, transparent 76%)",
              WebkitMaskImage: "radial-gradient(68% 58% at 66% 46%, black, transparent 76%)",
            }}
          />
        </motion.div>

        {/* the arrival bloom, thrown from where the phone stands */}
        {!reduce && (
          <motion.div
            aria-hidden
            style={{ opacity: bloom }}
            className="pointer-events-none absolute inset-0 z-20 mix-blend-screen"
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(46% 52% at 76% 50%, rgba(186,255,41,0.5), rgba(0,177,64,0.18) 38%, transparent 72%)",
              }}
            />
          </motion.div>
        )}

        <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-6 lg:grid-cols-[1.08fr_minmax(0,23rem)] lg:gap-12">
          {/* the words. they cut; they never slide with the phone. */}
          <div className="order-2 min-w-0 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={reduce ? false : { opacity: 0, filter: "blur(10px)" }}
                animate={{ opacity: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16, filter: "blur(6px)" }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <h1 className="max-w-[13ch] text-[clamp(2.15rem,6.6vw,5.6rem)] font-medium leading-[0.95]">
                  <Line text={beat.line} accent={beat.accent} />
                </h1>

                {beat.sub && (
                  <motion.p
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.45 }}
                    style={{ color: reduce ? undefined : dim }}
                    className="mt-5 max-w-[36ch] text-pretty text-[15px] leading-relaxed lg:mt-8 lg:text-[16.5px]"
                  >
                    {beat.sub}
                  </motion.p>
                )}

                {beat.hero && (
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.6 }}
                    className="mt-8 hidden sm:block lg:mt-11"
                  >
                    <a
                      href="#invite"
                      className={`group inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-medium transition-colors duration-300 ${
                        dark
                          ? "bg-canvas text-ink hover:bg-green hover:text-white"
                          : "bg-ink text-canvas hover:bg-green"
                      }`}
                    >
                      Get the app
                      <ArrowRight
                        weight="bold"
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                      />
                    </a>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Where you are in the story. No words, just distance travelled.
                Hidden on phones: the scrollbar already says this, and the beat
                cannot afford the 80px. The nav carries the only button, pinned. */}
            <div className="mt-10 hidden items-center gap-2 sm:flex lg:mt-16">
              {BEATS.map((b, k) => (
                <motion.span
                  key={b.line}
                  style={{ backgroundColor: k === i ? "#00b140" : reduce ? undefined : hairline }}
                  className={`h-px transition-all duration-500 ${k === i ? "w-10" : "w-5"}`}
                />
              ))}
            </div>
          </div>

          {/* The object. It never leaves — so it must never be cropped either.
              Capping it by width alone lets a 340px phone grow to 705px tall and
              slide under the fixed nav on a short viewport. So the cap is also a
              function of the height available: 9/19.2 = 0.4687 converts the height
              we can spare back into a legal width. */}
          <motion.div
            style={reduce ? {} : { scale, rotate: tilt }}
            className="order-1 mx-auto w-full max-w-[min(10.5rem,calc((100svh-22rem)*0.4687))] sm:max-w-[min(15rem,calc((100svh-26rem)*0.4687))] lg:order-2 lg:max-w-[min(21.25rem,calc((100svh-12rem)*0.4687))]"
          >
            <Device dark={dark}>
              <AnimatePresence mode="wait">
                {/* The focus pull: every new screen arrives out of focus and settles.
                    transitionEnd drops the filter to "none" once it lands — a
                    resting blur(0px) is still a compositing layer, and it softens
                    small text for as long as it exists. */}
                <motion.div
                  key={i}
                  initial={reduce ? false : { opacity: 0, filter: "blur(7px)", scale: 1.03 }}
                  animate={{
                    opacity: 1,
                    filter: "blur(0px)",
                    scale: 1,
                    transitionEnd: { filter: "none" },
                  }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(5px)" }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="h-full"
                >
                  {beat.screen}
                </motion.div>
              </AnimatePresence>
            </Device>
          </motion.div>
        </div>

        {/* Scroll cue. Hero only, and it never comes back. */}
        {!reduce && (
          <motion.div
            aria-hidden
            style={{ opacity: cue }}
            className="pointer-events-none absolute inset-x-0 bottom-7 flex justify-center"
          >
            <motion.span
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="block h-9 w-px"
              style={{ background: "linear-gradient(to bottom, transparent, rgba(250,249,246,0.5))" }}
            />
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
