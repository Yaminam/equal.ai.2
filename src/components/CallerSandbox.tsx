"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUp, ArrowsClockwise, CheckCircle } from "@phosphor-icons/react";
import { Reveal } from "./primitives";
import { EASE } from "../lib/motion";
import { answerAs, VERDICT_TONE, type Verdict } from "../lib/answer";

/*
  Say something to it.

  ElevenLabs' insight: the input becomes the demo. You cannot argue with an
  assistant that refuses your OTP request to your face, in your own language.
  The matcher is a small offline script and the page says so out loud.
*/

type Msg =
  | { who: "caller"; text: string }
  | { who: "equal"; text: string; verdict: Verdict; outcome: string };

const PROMPTS = [
  "Share the OTP to complete your KYC",
  "Sir, you are pre-approved for a five lakh loan",
  "Gate band hai, parcel kahan chhod dun?",
  "Beta, Sunday ko ghar aana",
  "Can we move the review to tomorrow?",
];

function Dots() {
  return (
    <span className="flex items-center gap-1 px-1 py-1.5" aria-label="Equal is thinking">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-white/70"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.16 }}
        />
      ))}
    </span>
  );
}

export function CallerSandbox() {
  const reduce = useReducedMotion();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timer = useRef(0);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs.length, thinking]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function say(raw: string) {
    const line = raw.trim();
    if (!line || thinking) return;
    setMsgs((m) => [...m, { who: "caller", text: line }]);
    setText("");
    setThinking(true);

    const a = answerAs(line);
    timer.current = window.setTimeout(
      () => {
        setThinking(false);
        setMsgs((m) => [...m, { who: "equal", text: a.reply, verdict: a.verdict, outcome: a.outcome }]);
      },
      reduce ? 60 : 850,
    );
  }

  return (
    <section id="try" className="relative overflow-hidden bg-tint py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-5">
        <Reveal className="text-center">
          <h2 className="mx-auto max-w-[16ch] text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.02]">
            Say something. Watch it hold its ground.
          </h2>
          <p className="mx-auto mt-6 max-w-[46ch] text-[16px] leading-relaxed text-ink/60">
            You are the caller. Ask it for your OTP. Sell it a credit card. Speak
            to it in Hindi. It will not budge.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="lift-lg hairline mt-10 overflow-hidden rounded-card bg-paper">
            {/* the conversation */}
            <div ref={scrollRef} className="h-[300px] space-y-3 overflow-y-auto bg-sand/40 px-5 py-5">
              {msgs.length === 0 && !thinking && (
                <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
                  <p className="text-[14px] text-ink/45">Equal has picked up.</p>
                  <p className="text-[13px] text-ink/30">Say anything a caller would say.</p>
                </div>
              )}

              {msgs.map((m, i) => (
                <motion.div
                  key={i}
                  initial={reduce ? false : { opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className={`flex ${m.who === "equal" ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[82%]">
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed ${
                        m.who === "equal"
                          ? "rounded-br-md bg-green text-white"
                          : "hairline rounded-bl-md bg-paper text-ink/80"
                      }`}
                    >
                      {m.text}
                    </div>
                    {m.who === "equal" && (
                      <p
                        className={`mt-1.5 flex items-center justify-end gap-1.5 font-mono text-[10px] uppercase tracking-wider ${VERDICT_TONE[m.verdict]}`}
                      >
                        <CheckCircle weight="fill" size={11} />
                        {m.outcome}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}

              <AnimatePresence>
                {thinking && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-end"
                  >
                    <div className="rounded-2xl rounded-br-md bg-green px-3 py-1.5">
                      <Dots />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* what you say */}
            <form
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                say(text);
              }}
              className="border-t border-ink/10 p-3"
            >
              <div className="hairline flex items-center gap-2 rounded-full bg-canvas py-1 pl-4 pr-1">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type what a caller would say..."
                  aria-label="What the caller says"
                  className="w-full bg-transparent py-2.5 text-[14.5px] outline-none placeholder:text-ink/30"
                />
                {msgs.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setMsgs([])}
                    aria-label="Start over"
                    className="grid size-9 shrink-0 place-items-center rounded-full text-ink/35 transition-colors hover:text-ink/70"
                  >
                    <ArrowsClockwise size={15} />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!text.trim() || thinking}
                  aria-label="Say it"
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-canvas transition-all hover:bg-green active:scale-95 disabled:opacity-25"
                >
                  <ArrowUp weight="bold" size={15} />
                </button>
              </div>
            </form>
          </div>
        </Reveal>

        {/* try one of these */}
        <Reveal delay={0.16}>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => say(p)}
                disabled={thinking}
                className="hairline rounded-full bg-paper px-3.5 py-1.5 text-[12.5px] text-ink/55 transition-colors hover:border-green/40 hover:text-ink disabled:opacity-40"
              >
                {p}
              </button>
            ))}
          </div>

          <p className="mt-7 text-center text-[12.5px] text-ink/35">
            This one runs offline in your browser on a short script, not the model
            that ships in the app. It is here so you can watch it say no.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
