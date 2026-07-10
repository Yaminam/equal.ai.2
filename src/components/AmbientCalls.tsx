"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle, PhoneCall, SpeakerSimpleX, X } from "@phosphor-icons/react";
import { EASE } from "../lib/motion";

/*
  The page answers the phone while you read it.

  As you scroll, real calls arrive in the corner. Equal picks up, deals with
  them, and dismisses itself. By the time you reach the pricing you have watched
  it work five times without clicking anything. Nobody else does this, and it is
  the only part of this page that IS the product rather than a picture of it.

  Rules it obeys: never blocks a click, never runs under reduced motion, can be
  muted forever in one tap, and never interrupts twice at once.
*/

type Verdict = "blocked" | "handled" | "rang";
type Call = {
  caller: string;
  meta: string;
  said: string;
  replied: string;
  verdict: Verdict;
  outcome: string;
};

const CALLS: Call[] = [
  {
    caller: "Unknown number",
    meta: "+91 90XX XX 4471",
    said: "Sir, share the OTP to complete your KYC.",
    replied: "I never share OTPs. Reporting this number.",
    verdict: "blocked",
    outcome: "Scam blocked",
  },
  {
    caller: "Insurance renewal",
    meta: "+91 22XX XX 8807",
    said: "Policy renewal offer, just two minutes of your time.",
    replied: "He is not interested. Please take this number off your list.",
    verdict: "handled",
    outcome: "Declined politely",
  },
  {
    caller: "Delivery",
    meta: "+91 80XX XX 9032",
    said: "Gate band hai sir, parcel kahan chhodun?",
    replied: "Reception par chhod dijiye. Main bata deta hoon.",
    verdict: "handled",
    outcome: "Parcel sorted",
  },
  {
    caller: "Mom",
    meta: "Saved contact",
    said: "Beta, Sunday ko ghar aana.",
    replied: "Aunty, main abhi unhe bata deta hoon. Ring kar raha hoon.",
    verdict: "rang",
    outcome: "This one rang you",
  },
  {
    caller: "Loan pre-approval",
    meta: "+91 11XX XX 2264",
    said: "You are pre-approved for five lakh, sir.",
    replied: "No thanks. Marking this as promotional.",
    verdict: "blocked",
    outcome: "Silenced",
  },
];

// where in the page each call arrives
const CUES = [0.14, 0.3, 0.46, 0.62, 0.78];

const VERDICT_STYLE: Record<Verdict, { cls: string; label: string }> = {
  blocked: { cls: "text-alert", label: "blocked" },
  handled: { cls: "text-ink/50", label: "handled" },
  rang: { cls: "text-green-deep", label: "rang you" },
};

type Stage = "ring" | "talk" | "reply" | "done";

export function AmbientCalls() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const [muted, setMuted] = useState(false);
  const [index, setIndex] = useState<number | null>(null);
  const [stage, setStage] = useState<Stage>("ring");
  const [handled, setHandled] = useState(0);

  const firedRef = useRef<Set<number>>(new Set());
  const busyRef = useRef(false);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  const dismiss = useCallback(() => {
    clearTimers();
    busyRef.current = false;
    setIndex(null);
  }, [clearTimers]);

  const run = useCallback(
    (i: number) => {
      busyRef.current = true;
      setIndex(i);
      setStage("ring");
      const push = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

      push(() => setStage("talk"), 1300);
      push(() => setStage("reply"), 3100);
      push(() => {
        setStage("done");
        setHandled((h) => h + 1);
      }, 5200);
      push(() => {
        busyRef.current = false;
        setIndex(null);
      }, 7600);
    },
    [],
  );

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (reduce || muted || busyRef.current) return;
    for (let i = 0; i < CUES.length; i++) {
      if (p >= CUES[i] && !firedRef.current.has(i)) {
        firedRef.current.add(i);
        run(i);
        break;
      }
    }
  });

  useEffect(() => () => clearTimers(), [clearTimers]);

  if (reduce || muted) return null;

  const call = index === null ? null : CALLS[index];

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-40 flex justify-center sm:inset-x-auto sm:bottom-6 sm:right-6 sm:justify-end">
      <AnimatePresence>
        {call && (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="lift-lg hairline pointer-events-auto w-full max-w-[340px] overflow-hidden rounded-[20px] bg-paper"
          >
            {/* header */}
            <div className="flex items-center justify-between gap-3 px-4 pt-3.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="relative grid size-8 shrink-0 place-items-center rounded-full bg-tint text-green">
                  <PhoneCall weight="fill" size={14} />
                  {stage === "ring" && (
                    <motion.span
                      className="absolute inset-0 rounded-full border border-green/50"
                      animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                </span>
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-[13px] font-medium">{call.caller}</p>
                  <p className="tnum truncate font-mono text-[10.5px] text-ink/40">{call.meta}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  onClick={() => setMuted(true)}
                  aria-label="Stop showing calls"
                  title="Stop showing calls"
                  className="grid size-6 place-items-center rounded-full text-ink/30 transition-colors hover:text-ink/70"
                >
                  <SpeakerSimpleX size={13} />
                </button>
                <button
                  onClick={dismiss}
                  aria-label="Dismiss"
                  className="grid size-6 place-items-center rounded-full text-ink/30 transition-colors hover:text-ink/70"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* body */}
            <div className="space-y-2 px-4 py-3.5">
              {stage === "ring" ? (
                <p className="py-1.5 text-[12.5px] text-ink/45">Equal is picking up...</p>
              ) : (
                <>
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="hairline w-fit max-w-[92%] rounded-xl rounded-bl-sm bg-sand px-3 py-2 text-[12.5px] leading-snug text-ink/70"
                  >
                    {call.said}
                  </motion.p>

                  {stage !== "talk" && (
                    <motion.p
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      className="ml-auto w-fit max-w-[92%] rounded-xl rounded-br-sm bg-green px-3 py-2 text-[12.5px] leading-snug text-white"
                    >
                      {call.replied}
                    </motion.p>
                  )}
                </>
              )}
            </div>

            {/* verdict */}
            <div className="flex items-center justify-between border-t border-ink/10 bg-canvas px-4 py-2.5">
              <AnimatePresence mode="wait">
                {stage === "done" ? (
                  <motion.span
                    key="done"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center gap-1.5 text-[11.5px] font-medium ${VERDICT_STYLE[call.verdict].cls}`}
                  >
                    <CheckCircle weight="fill" size={13} />
                    {call.outcome}
                  </motion.span>
                ) : (
                  <motion.span key="live" className="flex items-center gap-1.5 text-[11.5px] text-ink/40">
                    <span className="relative flex size-1.5">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-green opacity-70" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-green" />
                    </span>
                    Handling it
                  </motion.span>
                )}
              </AnimatePresence>

              <span className="tnum font-mono text-[10px] uppercase tracking-wider text-ink/30">
                {handled} handled while you read
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
