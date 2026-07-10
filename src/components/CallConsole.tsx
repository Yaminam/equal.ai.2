"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle, Phone } from "@phosphor-icons/react";
import { EASE } from "../lib/motion";

/*
  The hero's proof device: one call, answered in front of you.
  Deliberately a single scenario, not a picker. The five-caller studio lives
  further down the page, so the hero stays one clear moment.
*/

type Turn = { who: "caller" | "equal"; text: string; at: number };

const CALL: Turn[] = [
  { who: "caller", text: "Hello, this is about your pending KYC. Share the OTP to verify.", at: 0.8 },
  { who: "equal", text: "I handle this number. I never share OTPs, and I'm flagging this as a scam.", at: 3.2 },
  { who: "caller", text: "No no, it is official. Just read the six digits.", at: 6.2 },
  { who: "equal", text: "Declined. Reporting this number to the cybercrime helpline. Goodbye.", at: 8.4 },
];
const RING = 1.7; // it rings before Equal picks up
const END = 11.6;
const VERDICT = "Scam blocked, number reported. You were never disturbed.";

function Wave({ live }: { live: boolean }) {
  const reduce = useReducedMotion();
  const bars = [0.4, 0.85, 1, 0.55, 0.95, 0.45, 0.75, 0.6, 0.9, 0.35];
  return (
    <div className="flex h-6 items-center gap-[3px]" aria-hidden>
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-green"
          animate={reduce || !live ? { scaleY: 0.28 } : { scaleY: [0.28, h, 0.4, h * 0.65, 0.28] }}
          transition={{ duration: 1 + i * 0.05, repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }}
          style={{ height: 22, transformOrigin: "center" }}
        />
      ))}
    </div>
  );
}

export function CallConsole() {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { once: true, amount: 0.4 });
  const scrollRef = useRef<HTMLDivElement>(null);

  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const raf = useRef(0);
  const started = useRef(false);

  // a call arrives before it is answered
  const talk = elapsed - RING;
  const ringing = elapsed < RING;
  const shown = CALL.filter((t) => t.at <= talk);
  const done = talk >= END;
  const speaking = playing && !ringing && !done;

  useEffect(() => {
    if (inView && !started.current) {
      started.current = true;
      setPlaying(true);
    }
  }, [inView]);

  useEffect(() => {
    if (!playing) return;
    if (reduce) {
      setElapsed(RING + END);
      setPlaying(false);
      return;
    }
    const t0 = performance.now();
    const loop = (now: number) => {
      const e = (now - t0) / 1000;
      setElapsed(e);
      if (e >= RING + END) {
        setPlaying(false);
        return;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [playing, reduce]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [shown.length, done]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <div ref={wrap} className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 -z-10 rounded-[40px] blur-3xl"
        style={{ background: "radial-gradient(60% 55% at 60% 15%, rgba(186,255,41,0.4), transparent 70%)" }}
      />

      <div className="lift-lg hairline overflow-hidden rounded-[22px] bg-paper">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-tint text-[15px] font-semibold text-green">
              ?
            </span>
            <div className="leading-tight">
              <p className="text-[14px] font-medium">Unknown number</p>
              <p className="tnum font-mono text-[11.5px] text-ink/45">+91 90XX XX 4471</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {speaking && <Wave live />}
            <span className="flex items-center gap-1.5 rounded-full bg-tint px-2.5 py-1 text-[11px] font-medium text-green-deep">
              <span className="relative flex size-1.5">
                {speaking && (
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-green opacity-70" />
                )}
                <span className="relative inline-flex size-1.5 rounded-full bg-green" />
              </span>
              {ringing ? "Incoming call" : speaking ? "Equal is answering" : "Handled"}
            </span>
          </div>
        </div>

        <div ref={scrollRef} className="h-[268px] space-y-2.5 overflow-y-auto bg-sand/60 px-5 py-4">
          {ringing && (
            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full flex-col items-center justify-center gap-4"
            >
              <div className="relative grid size-20 place-items-center">
                {!reduce && (
                  <>
                    <motion.span
                      className="absolute inset-0 rounded-full border border-green/50"
                      animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
                      transition={{ duration: 1.3, repeat: Infinity, ease: "easeOut" }}
                    />
                    <motion.span
                      className="absolute inset-0 rounded-full border border-green/50"
                      animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
                      transition={{ duration: 1.3, repeat: Infinity, ease: "easeOut", delay: 0.65 }}
                    />
                  </>
                )}
                <span className="grid size-16 place-items-center rounded-full bg-paper text-xl font-medium text-green">
                  ?
                </span>
              </div>
              <p className="text-[13px] text-ink/45">Your phone would be ringing.</p>
            </motion.div>
          )}

          {shown.map((t, i) => (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.42, ease: EASE }}
              className={`flex ${t.who === "equal" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[84%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-snug ${
                  t.who === "equal"
                    ? "rounded-br-md bg-green text-white"
                    : "hairline rounded-bl-md bg-paper text-ink/80"
                }`}
              >
                {t.who === "equal" && (
                  <span className="mb-0.5 block text-[9.5px] font-semibold uppercase tracking-[0.14em] text-white/70">
                    Equal
                  </span>
                )}
                {t.text}
              </div>
            </motion.div>
          ))}

          <AnimatePresence>
            {done && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="!mt-3.5 flex items-start gap-2.5 rounded-xl border border-green/25 bg-tint px-3.5 py-3"
              >
                <CheckCircle weight="fill" size={17} className="mt-0.5 shrink-0 text-green" />
                <p className="text-[12.5px] leading-snug text-ink/75">{VERDICT}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between border-t border-ink/10 px-5 py-3">
          <span className="tnum font-mono text-[11px] text-ink/40">
            {ringing ? "ringing" : done ? "call ended" : `${talk.toFixed(1)}s`}
          </span>
          <a
            href="#demo"
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium text-ink/55 transition-colors hover:text-green"
          >
            <Phone weight="fill" size={11} />
            See four more calls
            <ArrowRight size={11} />
          </a>
        </div>
      </div>
    </div>
  );
}
