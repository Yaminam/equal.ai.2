"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "../lib/motion";

/*
  The category, decided in one slot.

  Granola's sharpest line is not what it does, it is what it REMOVES: "without a
  meeting bot." Nobody needed the category explained after reading it.

  ── WHY THE PREVIOUS TWO VERSIONS FAILED ─────────────────────────────────────

  v1 was two struck-out lines and a punchline. Static negation is a slogan, and
  a slogan is something you skim.

  v2 put the eliminations in a left column and the answer in a right column. It
  animated, and it still did not work, for a reason worth writing down: THE
  ANSWER DID NOT LAND WHERE THE WRONG ANSWERS DIED. For most of the sequence
  half the section was simply empty, and the negation and the affirmation never
  touched. The rhetorical shape here is "all of that is wrong → THIS is right",
  and that only detonates if "this" arrives in the same slot the others were
  killed in.

  ── SO: ONE SENTENCE, ONE SLOT ───────────────────────────────────────────────

      Equal is ▮▮▮▮▮▮▮▮▮▮

  The wrong nouns take the slot one at a time. Each is REDACTED — a bar of ink
  wipes across it, left to right, at the speed of a pen — and then it is dragged
  down and out, where it settles into a small graveyard of everything Equal is
  not. The counter climbs. The slot empties.

  And then, in the same slot, at rest, in green: an assistant that ANSWERS.

  Two rules held throughout:

  · WE NEVER NAME THE INCUMBENT. Everything struck out is a CATEGORY, never a
    company. Premium brands assert; they do not comparison-table. It reads as
    confidence rather than as a fight.

  · THE REDACTION IS DRAWN, NOT PRINTED. The bar scales from zero along its own
    axis. A strike that simply appears is a text-decoration. One that is drawn is
    a decision being taken in front of you.
*/

const WRONG = [
  "a caller ID",
  "a block list",
  "a spam filter",
  "a voicemail box",
  "a do-not-disturb switch",
  "a robot that hangs up",
];

const RIGHT = "an assistant that answers";

/** how long each wrong noun holds the slot before the pen comes down */
const HOLD = 780;
const REDACT = 380;
const CLEAR = 300;

export function Category() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const [i, setI] = useState(-1); // which wrong noun is in the slot
  const [struck, setStruck] = useState(false); // the bar is down
  const [dead, setDead] = useState<string[]>([]); // the graveyard
  const [answered, setAnswered] = useState(false);

  /*
    THE SLOT MORPHS. IT DOES NOT SNAP.

    "a caller ID" and "a do-not-disturb switch" are wildly different widths. Swap
    text inside a fixed inline box and the sentence JUMPS on every elimination —
    which is the single most common way a rotating-word hero looks cheap.

    Notion solves it by animating the CONTAINER: a hidden span measures the
    incoming word, a ResizeObserver reads its width, and the slot animates its
    inline-size in pixels. The sentence breathes instead of stuttering. Same
    trick here — measured off a real, invisible copy of the word, in the real
    font, so it survives the webfont landing and every breakpoint of `clamp()`.
  */
  const measure = useRef<HTMLSpanElement>(null);
  const [slotW, setSlotW] = useState<number | null>(null);
  const shown = answered ? RIGHT : i >= 0 ? WRONG[i] : "";

  useEffect(() => {
    const el = measure.current;
    if (!el) return;
    const read = () => setSlotW(el.getBoundingClientRect().width);
    read();
    document.fonts?.ready.then(read).catch(() => {});
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [shown]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduce) {
      setDead(WRONG);
      setAnswered(true);
      return;
    }

    let alive = true;
    let timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((r) => {
        timers.push(window.setTimeout(r, ms));
      });

    const run = async () => {
      setI(-1);
      setStruck(false);
      setDead([]);
      setAnswered(false);
      await wait(500);
      if (!alive) return;

      for (let k = 0; k < WRONG.length; k++) {
        setI(k);
        setStruck(false);
        await wait(HOLD);
        if (!alive) return;

        setStruck(true); // the pen comes down
        await wait(REDACT);
        if (!alive) return;

        setDead((d) => [...d, WRONG[k]]); // it falls into the graveyard
        await wait(CLEAR);
        if (!alive) return;
      }

      setI(-1);
      await wait(420); // the slot is empty. hold it. the silence is the point.
      if (!alive) return;
      setAnswered(true);
    };

    /* It replays every time it comes back into view. A section that animates
       once is dead on the second visit, and people scroll back. */
    const io = new IntersectionObserver(
      ([e]) => {
        timers.forEach(clearTimeout);
        timers = [];
        if (e.isIntersecting) void run();
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
      io.disconnect();
    };
  }, [reduce]);

  const word = i >= 0 ? WRONG[i] : null;

  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      {/* one light, off-canvas, and it only really arrives with the answer */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px]"
        animate={{ opacity: answered ? 1 : 0.25 }}
        transition={{ duration: 1.4, ease: EASE }}
        style={{ background: "radial-gradient(closest-side, rgba(0,177,64,0.14), transparent)" }}
      />

      <div ref={ref} className="relative mx-auto max-w-5xl px-6">
        <div className="flex items-center justify-between">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9 }}
            className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink/30"
          >
            The category
          </motion.p>

          {/* the elimination counter. it is the only chrome here. */}
          <p className="tnum font-mono text-[11px] tracking-[0.2em] text-ink/25">
            <span className={answered ? "text-green" : "text-ink/45"}>
              {String(dead.length).padStart(2, "0")}
            </span>
            <span className="mx-1">/</span>
            {String(WRONG.length).padStart(2, "0")} ruled out
          </p>
        </div>

        {/* THE SENTENCE. one slot. everything happens inside it. */}
        <div
          aria-hidden
          className="mt-16 text-[clamp(1.9rem,5vw,3.9rem)] font-medium leading-[1.12] tracking-[-0.035em]"
        >
          <span className="text-ink/35">Equal is</span>{" "}

          {/* the invisible twin. it is the only thing that knows how wide the
              slot should be, and it measures in the real font at the real size. */}
          <span
            ref={measure}
            aria-hidden
            className="pointer-events-none absolute -z-10 whitespace-nowrap opacity-0"
          >
            {shown}
          </span>

          <motion.span
            className="relative inline-block align-baseline"
            animate={{ width: reduce || slotW === null ? "auto" : slotW }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <AnimatePresence mode="wait">
              {word && (
                <motion.span
                  key={word}
                  initial={reduce ? false : { opacity: 0, y: "0.5em", filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
                  exit={
                    reduce
                      ? { opacity: 0 }
                      : // it does not fade. it is DRAGGED DOWN, out of the sentence,
                        // toward the graveyard it is about to join.
                        { opacity: 0, y: "0.6em", filter: "blur(5px)", transition: { duration: 0.26 } }
                  }
                  transition={{ duration: 0.42, ease: EASE }}
                  className="relative inline-block whitespace-nowrap"
                >
                  {word}

                  {/* the pen. a bar of ink, drawn left to right. */}
                  <motion.span
                    aria-hidden
                    className="absolute left-0 top-1/2 block h-[0.09em] w-full origin-left -translate-y-1/2 rounded-full bg-ink"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: struck ? 1 : 0 }}
                    transition={{ duration: 0.34, ease: [0.65, 0, 0.35, 1] }}
                  />
                </motion.span>
              )}

              {answered && (
                <motion.span
                  key="answer"
                  initial={reduce ? false : { opacity: 0, y: "0.4em", filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
                  transition={{ duration: 0.9, ease: EASE }}
                  className="relative inline-block whitespace-nowrap text-green"
                >
                  {RIGHT}
                  {/* it is not struck. it is UNDERLINED — the only line on this
                      page that affirms instead of cancels. */}
                  <motion.span
                    aria-hidden
                    className="absolute -bottom-[0.06em] left-0 block h-[0.05em] w-full origin-left rounded-full bg-green"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
                  />
                </motion.span>
              )}

              {/* the empty slot. a cursor, waiting. the silence before the answer. */}
              {!word && !answered && (
                <motion.span
                  key="caret"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="inline-block"
                >
                  <motion.span
                    className="inline-block h-[0.9em] w-[0.5em] translate-y-[0.08em] rounded-[2px] bg-ink/15"
                    animate={reduce ? undefined : { opacity: [0.25, 1, 0.25] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.span>
          <span className="text-ink/35">.</span>
        </div>

        {/*
          The whole claim, intact, for anyone who is not watching it happen.

          The visible sentence is a MOTION — a slot being filled and emptied six
          times — and motion is not readable by a screen reader, which would
          otherwise hear "Equal is" followed by a stream of half-struck nouns.
          Vercel's rotating hero does exactly this: the fragments animate, and a
          visually-hidden sibling carries the finished sentence. The animation is
          the reading; this is the artifact.
        */}
        <p className="sr-only">
          Equal is not {WRONG.join(", not ")}. Equal is {RIGHT}.
        </p>

        {/* THE GRAVEYARD. everything it is not, settling below the sentence that
            rejected it. This is the record, and it costs one line. */}
        <div className="mt-14 flex min-h-[64px] flex-wrap items-start gap-x-3 gap-y-2.5">
          <AnimatePresence>
            {dead.map((d) => (
              <motion.span
                key={d}
                initial={reduce ? false : { opacity: 0, y: -14, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="hairline relative inline-flex items-center rounded-full bg-paper px-3.5 py-1.5 text-[12.5px] text-ink/30"
              >
                {d}
                <span
                  aria-hidden
                  className="absolute left-3 right-3 top-1/2 block h-px -translate-y-1/2 bg-ink/25"
                />
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        <motion.p
          animate={{ opacity: answered || reduce ? 1 : 0, y: answered || reduce ? 0 : 10 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}
          className="mt-10 max-w-[44ch] text-[16.5px] leading-relaxed text-ink/45"
        >
          Every one of those tells you a call happened. Equal is the only one that
          takes it.
        </motion.p>
      </div>
    </section>
  );
}
