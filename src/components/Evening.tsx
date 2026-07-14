"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

/*
  One evening. Eight words.

  ── FOUR FAILURES, AND THE PATTERN ───────────────────────────────────────────

  "Now the privilege is yours."                    — a slogan.
  "The powerful never answered their own phones."  — a history lesson.
  2,84,193 rendered as a dot matrix.               — clever, and cold.
  A four-row timeline of an evening.               — still a list. Sixty words.

  Every one of them was something to READ. The brief says LESS TEXT, MORE
  ANIMATION, and I kept answering it with prose.

  And underneath that, the harder problem: THIS PRODUCT'S SUCCESS STATE IS
  NOTHING HAPPENING. A phone that does not ring. You cannot screenshot an
  absence, so I kept reaching for words to describe the silence — and words are
  the one thing the brief forbids.

  ── SO: STAGE THE SILENCE, DO NOT DESCRIBE IT ────────────────────────────────

  A phone, face down on a table, in a dark room. Your scroll is the evening
  passing — the light moves across the room and dies, 7pm to 11pm, and the clock
  in the corner counts it out.

  Calls arrive. You see them as faint rings spreading toward the phone out of the
  dark. Every one of them reaches it, and is absorbed, and the screen stays dark.
  Nothing happens. Nothing happens for a long time, and the nothing is the point:
  it is the longest, emptiest, most expensive stretch of the page.

  And then, at 10:14, the phone glows.

  ── THE CRAFT ────────────────────────────────────────────────────────────────

  · THE PHONE IS FACE DOWN. It is the whole idea in one staging decision. A
    face-up phone is a screen you watch; a face-down phone is a decision you made.

  · THE ONLY LIGHT IS THE ONE THING THAT HAPPENS. There is no glow behind the
    type, no gradient orb, nothing decorative. The room is lit by the window
    while the evening lasts, and then by her call. Light is the narrative.

  · SILENCE IS RENDERED AS SCROLL DISTANCE. Between the last absorbed call and
    her call there is a long stretch where the page does nothing at all. That
    emptiness is not a gap in the design; it IS the design.

  · IT IS SCROLL-DRIVEN, NOT A LOOP. The visitor spends the evening. You cannot
    make someone feel a long night by playing them a four-second animation.
*/

/* the calls that arrive and are absorbed. positions are fractions of the scroll. */
const CALLS = [0.16, 0.25, 0.33, 0.44, 0.52, 0.58, 0.66];

/** she arrives late, and alone, in the empty stretch after the last of them */
const HER = 0.86;

export function Evening() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 30, restDelta: 0.001 });

  /* the evening. the window light crosses the room and dies. */
  const windowX = useTransform(p, [0, 1], ["18%", "78%"]);
  const windowGlow = useTransform(p, [0, 0.35, 0.75, 1], [0.5, 0.28, 0.04, 0]);

  /* the clock. 7:00 to 11:00, in real minutes. */
  const minutes = useTransform(p, [0, 1], [420, 660]);
  const clock = useTransform(minutes, (m) => {
    const h = Math.floor(m / 60);
    const mm = Math.floor(m % 60);
    return `${h}:${String(mm).padStart(2, "0")}`;
  });

  /* her call. the only light left in the room. */
  const her = useTransform(p, [HER - 0.05, HER, 1], [0, 1, 1]);
  const herRing = useTransform(p, [HER - 0.02, HER + 0.06], [0, 1]);

  /*
    Hoisted, all of them.

    These were being called inside JSX — one of them inside a ternary on
    `reduce`, which makes the hook CONDITIONAL, and three more inside a .map().
    That is a rules-of-hooks violation, and it is the kind that does not fail
    loudly: it silently desynchronises React's hook order the moment `reduce`
    flips, and the component quietly starts reading some other hook's state.

    Hooks live at the top of the component. Always.
  */
  const ringOpacity = useTransform(herRing, [0, 1], [0, 1]);
  const ring0 = useTransform(herRing, [0, 1], [0.6, 2.4]);
  const ring1 = useTransform(herRing, [0, 1], [0.6, 2.9]);
  const ring2 = useTransform(herRing, [0, 1], [0.6, 3.4]);
  const rings = [ring0, ring1, ring2];
  const neverRangOpacity = useTransform(her, [0, 1], [0.28, 0]);

  return (
    <section
      ref={ref}
      className="relative bg-ink text-canvas"
      /* four viewports. the evening has to be long, or it is not an evening. */
      style={{ height: reduce ? "auto" : "420vh" }}
    >
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        {/* the window. the only light, until it isn't. */}
        {!reduce && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-[46%]"
            style={{
              left: windowX,
              x: "-50%",
              opacity: windowGlow,
              background:
                "linear-gradient(180deg, rgba(255,244,214,0.10), rgba(255,224,170,0.04) 55%, transparent)",
              filter: "blur(60px)",
            }}
          />
        )}

        {/* the clock, in the corner, the way a clock is */}
        <div className="relative z-10 flex items-start justify-between px-6 pt-10 md:px-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-canvas/25">
            One evening
          </p>
          <motion.p className="tnum font-mono text-[11px] tracking-[0.2em] text-canvas/30">
            {reduce ? "10:14" : clock}
          </motion.p>
        </div>

        {/* THE ROOM */}
        <div className="relative flex flex-1 items-center justify-center">
          {/* the calls, arriving out of the dark and being absorbed */}
          {!reduce &&
            CALLS.map((at, i) => (
              <Absorbed key={at} p={p} at={at} side={i % 2 === 0 ? -1 : 1} />
            ))}

          {/* HER CALL. the only light in the room by the end. */}
          {!reduce && (
            <>
              {rings.map((scale, r) => (
                <motion.span
                  key={r}
                  aria-hidden
                  className="pointer-events-none absolute size-[220px] rounded-full border border-green/40"
                  style={{ opacity: ringOpacity, scale }}
                />
              ))}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute size-[30rem] rounded-full blur-[90px]"
                style={{
                  opacity: her,
                  background: "radial-gradient(closest-side, rgba(0,177,64,0.55), transparent)",
                }}
              />
            </>
          )}

          {/* THE PHONE. face down. that is the entire idea, staged. */}
          <div className="relative">
            <motion.div
              className="relative h-[300px] w-[150px] rounded-[26px] md:h-[360px] md:w-[178px]"
              style={{
                background: "linear-gradient(160deg, #22282169 0%, #0c0f0b 60%)",
                boxShadow:
                  "0 0 0 1px rgba(250,249,246,0.09), inset 0 1px 0 rgba(255,255,255,0.06), 0 60px 90px -40px rgba(0,0,0,0.9)",
              }}
            >
              {/* the camera bump — the tell that it is face DOWN */}
              <div
                aria-hidden
                className="absolute left-4 top-4 size-11 rounded-2xl md:size-12"
                style={{
                  background: "linear-gradient(160deg, #2b322a, #0a0d09)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
              />

              {/* the light of HER call, leaking out from under the phone */}
              {!reduce && (
                <motion.div
                  aria-hidden
                  className="absolute -inset-3 -z-10 rounded-[34px] blur-xl"
                  style={{
                    opacity: her,
                    background: "rgba(0,177,64,0.75)",
                  }}
                />
              )}
            </motion.div>

            {/* the table it lies on */}
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-6 left-1/2 h-8 w-[150%] -translate-x-1/2 rounded-[50%] bg-black/60 blur-2xl"
            />
          </div>
        </div>

        {/* EIGHT WORDS. */}
        <div className="relative z-10 px-6 pb-14 text-center md:px-12">
          <motion.p
            style={reduce ? undefined : { opacity: neverRangOpacity }}
            className="text-[clamp(1.1rem,2vw,1.6rem)] font-medium tracking-tight text-canvas"
          >
            It never rang.
          </motion.p>

          <motion.p
            style={reduce ? { opacity: 0 } : { opacity: her }}
            className="absolute inset-x-0 bottom-14 text-[clamp(1.1rem,2vw,1.6rem)] font-medium tracking-tight text-green"
          >
            Until Amma called.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

/*
  A call, arriving out of the dark and being absorbed by the phone.

  It does not explode and it is not struck out. It simply reaches the object and
  ceases — which is what actually happens, and is a far colder thing to watch
  than a red X.
*/
function Absorbed({
  p,
  at,
  side,
}: {
  p: ReturnType<typeof useSpring>;
  at: number;
  side: number;
}) {
  const window_ = [at - 0.05, at, at + 0.05];
  const opacity = useTransform(p, window_, [0, 0.55, 0]);
  const scale = useTransform(p, window_, [1.6, 0.25, 0.15]);
  const x = useTransform(p, window_, [side * 320, 0, 0]);

  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute size-[260px] rounded-full border border-canvas/25"
      style={{ opacity, scale, x }}
    />
  );
}
