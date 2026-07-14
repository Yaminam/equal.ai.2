"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE } from "../lib/motion";

/*
  What your callers hear.

  ── WHY THE OLD VERSION FAILED ───────────────────────────────────────────────

  It said: "Never a script read by a robot. Never a copy of your voice."

  That is a CLAIM, and a robot would make the same claim. You cannot assert
  manners. Manners are a thing you either demonstrate or do not have.

  ── SO IT PERFORMS THEM, AND IT PERFORMS THEM UNDER PRESSURE ─────────────────

  Politeness is cheap when the caller is pleasant. The scam turn is where
  courtesy stops being a tone and becomes a character. So the caller pushes, and
  Equal declines, and then Equal thanks him anyway.

  "Thank you for calling." — said to a man attempting fraud — is the most
  persuasive sentence we can put on this page, and it needs no adjective around
  it.

  ── THE MECHANIC: SPEECH CADENCE ─────────────────────────────────────────────

  Equal's words do not stagger. They are SPOKEN.

  Every text-reveal library on the web ships a constant delay — 40ms, 200ms, the
  same gap between every word — and that is exactly why they all read as
  ANIMATION rather than as SPEECH. Real speech is uneven. It has debt.

      ~150 words per minute  ->  400ms a word
      a comma                ->  +600ms of silence
      a full stop            ->  +1100ms

  Long words take longer than short ones. Equal says "Hello." and then does
  nothing at all for a beat over a second, because that is what a person does.

  And the easing matters: an ease-IN word looks TYPED. An ease-OUT word looks
  SAID. That is the entire difference between a typewriter effect and a voice.

  ── THE CALLER IS NOT ANIMATED ───────────────────────────────────────────────

  His words are simply there, flat and grey, the way somebody else's speech is
  just a fact. Only Equal's side is alive. Nobody has to be told which one is
  doing the talking, and the asymmetry answers "which of these is the machine"
  without a disclaimer.

  ── AND THERE IS NO PLAY BUTTON ──────────────────────────────────────────────

  We have no audio file. The moment you draw a triangle in a circle you have
  promised sound, and a promise you cannot keep is worse than a promise you never
  made. This stays in the TRANSCRIPT register, never the PLAYER register.

  TODO(equal): Equal has a voice — it is speaking to callers in production today.
  One export of that voice saying this exact greeting turns this section from
  persuasive into unarguable. If the voice is not good enough to be the hero of
  this page, that is a product finding, and you need it before launch.
*/

type Turn = { who: "caller" | "equal"; text: string; note?: string };

const CALL: Turn[] = [
  { who: "caller", text: "Hello? Is this Rahul?" },
  { who: "equal", text: "You've reached Rahul's line. He isn't able to take this right now. May I ask who's calling?", note: "unhurried" },
  { who: "caller", text: "It's about his card. I just need the OTP he received." },
  { who: "equal", text: "I won't be sharing anything like that. Thank you for calling.", note: "firm, still polite" },
];

/*
  A speaking plan. ~150 wpm, with real pauses bought at the punctuation.
  This is a diagram of speech, not a recording of it — it is honest, and it is
  the whole reason a written sentence can feel spoken.
*/
const BASE = 400;
function speak(text: string) {
  let t = 0;
  return text.split(/\s+/).map((word) => {
    const at = t;
    const len = Math.min(1.6, Math.max(0.7, word.replace(/\W/g, "").length / 5));
    t += BASE * len;
    if (/[,;:]$/.test(word)) t += 600; // a comma is worth six hundred milliseconds
    if (/[.!?…]$/.test(word)) t += 1100; // a full stop is worth eleven hundred
    return { word, at };
  });
}
const duration = (text: string) => {
  const p = speak(text);
  return p[p.length - 1].at + BASE * 1.4;
};

export function Greeting() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [turn, setTurn] = useState(-1);
  const [breathing, setBreathing] = useState(false);

  const plans = useMemo(() => CALL.map((t) => speak(t.text)), []);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  useEffect(() => {
    if (reduce) {
      setTurn(CALL.length - 1);
      return;
    }
    if (!on) return;

    let alive = true;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((r) => {
        timers.push(window.setTimeout(r, ms));
      });

    (async () => {
      for (;;) {
        setTurn(-1);
        setBreathing(false);
        await wait(700);
        if (!alive) return;

        for (let i = 0; i < CALL.length; i++) {
          // it thinks before it speaks. a breath, not a spinner.
          if (CALL[i].who === "equal") {
            setBreathing(true);
            await wait(1100);
            if (!alive) return;
            setBreathing(false);
          }

          setTurn(i);
          await wait(CALL[i].who === "equal" ? duration(CALL[i].text) : 900);
          if (!alive) return;
        }

        await wait(3800);
        if (!alive) return;
      }
    })();

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, [on, reduce]);

  return (
    <section className="relative overflow-hidden bg-sand py-28 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{ background: "linear-gradient(#faf9f6, #faf9f600)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{ background: "linear-gradient(#faf9f600, #faf9f6)" }}
      />

      <div ref={ref} className="relative mx-auto max-w-4xl px-6">
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9 }}
          className="mb-14 font-mono text-[11px] uppercase tracking-[0.24em] text-ink/30"
        >
          What your callers hear
        </motion.p>

        <div className="flex flex-col gap-10">
          {CALL.map((t, i) => {
            const shown = i <= turn;
            const isEqual = t.who === "equal";

            if (!shown) {
              // the breath sits where the next line will be
              return isEqual && breathing && i === turn + 1 && !reduce ? (
                <div key={i}>
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-green">
                    Equal
                  </p>
                  <span className="breath flex items-center gap-1.5 py-2">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="block size-[7px] rounded-full bg-green/70" />
                    ))}
                  </span>
                </div>
              ) : null;
            }

            return (
              <div key={i}>
                <p
                  className={`mb-3 font-mono text-[10px] uppercase tracking-[0.2em] ${
                    isEqual ? "text-green" : "text-ink/30"
                  }`}
                >
                  {isEqual ? "Equal" : "Caller"}
                  {isEqual && t.note && (
                    <span className="ml-2 normal-case tracking-normal text-ink/25">
                      [{t.note}]
                    </span>
                  )}
                </p>

                <p
                  className={`text-pretty text-[clamp(1.15rem,2.1vw,1.7rem)] leading-snug tracking-tight ${
                    isEqual ? "text-ink" : "text-ink/40"
                  }`}
                >
                  {isEqual && !reduce ? (
                    // Equal SPEAKS. the caller's words are simply there.
                    plans[i].map(({ word, at }, k) => (
                      <motion.span
                        key={k}
                        initial={{ opacity: 0, filter: "blur(6px)", y: "0.1em" }}
                        animate={{
                          opacity: 1,
                          filter: "blur(0px)",
                          y: 0,
                          transitionEnd: { filter: "none" },
                        }}
                        transition={{
                          duration: 0.42,
                          delay: at / 1000,
                          // ease-OUT. an ease-in word looks typed; an ease-out word
                          // looks said. this curve is the whole trick.
                          ease: EASE,
                        }}
                        className="inline-block"
                      >
                        {word}
                        {k < plans[i].length - 1 ? " " : ""}
                      </motion.span>
                    ))
                  ) : (
                    <>&ldquo;{t.text}&rdquo;</>
                  )}
                </p>
              </div>
            );
          })}
        </div>

        {/* the unspoken line. a different register, so you can tell speech from
            narration without being told. */}
        <motion.p
          animate={{ opacity: turn >= CALL.length - 1 || reduce ? 1 : 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.6 }}
          className="mt-16 border-t border-ink/10 pt-8 text-[15px] text-ink/40"
        >
          Rahul&rsquo;s phone never rang. He found out afterwards, from Equal.
        </motion.p>

        {/* the whole call, once, for anyone who is not watching it play */}
        <p className="sr-only">
          {CALL.map((t) => `${t.who === "equal" ? "Equal" : "Caller"}: ${t.text}`).join(" ")}
        </p>
      </div>

      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(.72); opacity: .3 }
          45%      { transform: scale(1);   opacity: .9 }
        }
        .breath span { animation: breathe 2.6s cubic-bezier(.37,0,.63,1) infinite; }
        .breath span:nth-child(2) { animation-delay: .18s }
        .breath span:nth-child(3) { animation-delay: .36s }
      `}</style>
    </section>
  );
}
