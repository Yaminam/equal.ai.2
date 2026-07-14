"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, PhoneCall, Prohibit, Translate } from "@phosphor-icons/react";
import { EASE } from "../lib/motion";

/*
  Not testimonials. Call records.

  A testimonial asks you to trust a stranger's opinion. A call record shows you
  what happened. Same three people, same three quotes — but the quote is now the
  FOOTNOTE to a fact, instead of the whole claim.

  Each card is a call that came in and was dealt with. The verdict is the
  headline; the human line underneath is what it felt like afterwards. That order
  matters: evidence first, feeling second. Reversed, it is marketing.

  ── THE CARDS RESOLVE, THEY DO NOT ARRIVE ────────────────────────────────────

  Each one enters as an INCOMING call — live, pulsing, unresolved — and only then
  lands its verdict. You watch the decision get made. A card that appears with
  its answer already stamped on it is a screenshot; a card that decides in front
  of you is a machine.

  ── ONE OF THEM IS DIFFERENT ─────────────────────────────────────────────────

  Two are refused. The third is QUALIFIED and put through, and it is the only
  green one. The whole product is in that asymmetry, and the closing line only
  works because you have just watched two calls not make it.

  ────────────────────────────────────────────────────────────────────────────
  TODO(equal): THE THREE NAMES AND QUOTES BELOW ARE PLACEHOLDERS. They are not
  real people. Replace with real, consented, attributable quotes before this page
  is public, or ship the cards without attribution.
  ────────────────────────────────────────────────────────────────────────────
*/

type Verdict = "blocked" | "answered" | "qualified";

type Record = {
  from: string;
  about: string;
  verdict: Verdict;
  label: string;
  detailKey: string;
  detailValue: string;
  quote: string;
  who?: string;
};

const CALLS: Record[] = [
  {
    from: "Bank",
    about: "OTP verification",
    verdict: "blocked",
    label: "Blocked",
    detailKey: "Reason",
    detailValue: "Suspicious request",
    quote: "It refused an OTP meant for my father.",
    who: "Dr. Priya Nair",
  },
  {
    from: "Unknown number",
    about: "Spoke only Tamil",
    verdict: "answered",
    label: "Answered",
    detailKey: "Conversation language",
    detailValue: "Tamil",
    quote: "My parents never even noticed.",
    who: "Rajesh Kumar",
  },
  {
    from: "Unknown number",
    about: "Asked for you by name",
    verdict: "qualified",
    label: "Qualified",
    detailKey: "Outcome",
    detailValue: "Forwarded to you",
    quote: "Only two calls reached me this week. Both mattered.",
    who: "Arjun Mehta",
  },
];

const ICON = {
  blocked: Prohibit,
  answered: Check,
  qualified: PhoneCall,
} as const;

export function Voices() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = useState(-1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      setResolved(CALLS.length - 1);
      return;
    }
    let alive = true;
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        CALLS.forEach((_, i) => {
          // each call rings for a moment before it is decided. the ringing is
          // the point: you watch the decision get made.
          timers.push(window.setTimeout(() => alive && setResolved(i), 900 + i * 750));
        });
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      alive = false;
      timers.forEach(clearTimeout);
      io.disconnect();
    };
  }, [reduce]);

  return (
    <section className="relative overflow-hidden py-24 md:py-28">
      <div ref={ref} className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9 }}
          className="mb-8 font-mono text-[11px] uppercase tracking-[0.24em] text-ink/30"
        >
          Last week
        </motion.p>

        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="max-w-[16ch] text-[clamp(1.8rem,3.4vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.035em]"
        >
          Three calls they never had to take.
        </motion.h2>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {CALLS.map((c, i) => {
            const done = i <= resolved;
            const Icon = ICON[c.verdict];
            const good = c.verdict === "qualified";

            return (
              <motion.figure
                key={c.quote}
                initial={reduce ? false : { opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.8, ease: EASE, delay: i * 0.1 }}
                className="edge lift-sm flex flex-col rounded-2xl p-6 transition-transform duration-500 hover:-translate-y-1"
              >
                {/* the call, still ringing */}
                <div className="flex items-center gap-2">
                  <span className="relative flex size-1.5">
                    {!reduce && !done && (
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-ink/40" />
                    )}
                    <span
                      className={`relative inline-flex size-1.5 rounded-full transition-colors duration-500 ${
                        done ? (good ? "bg-green" : "bg-ink/25") : "bg-ink/40"
                      }`}
                    />
                  </span>
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-ink/35">
                    Incoming call
                  </p>
                </div>

                <p className="mt-4 text-[17px] font-semibold tracking-tight">{c.from}</p>
                <p className="mt-0.5 text-[13px] text-ink/40">{c.about}</p>

                {/* THE VERDICT. it lands; it is not already there. */}
                <div className="mt-5 min-h-[34px]">
                  <motion.span
                    initial={reduce ? false : { opacity: 0, scale: 0.94 }}
                    animate={done ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium"
                    style={
                      good
                        ? {
                            background: "linear-gradient(180deg, #14c452, #00b140)",
                            color: "#fff",
                            boxShadow:
                              "0 6px 16px -6px rgba(0,177,64,0.6), inset 0 1px 0 rgba(255,255,255,0.45)",
                          }
                        : { background: "rgba(16,20,15,0.05)", color: "rgba(16,20,15,0.55)" }
                    }
                  >
                    <Icon weight="bold" size={12} />
                    {c.label}
                  </motion.span>
                </div>

                {/* the detail, in the register of a log entry */}
                <motion.dl
                  animate={{ opacity: done ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
                  className="mt-5 border-t border-ink/[0.08] pt-4"
                >
                  <dt className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink/30">
                    {c.detailKey}
                  </dt>
                  <dd className="mt-1.5 flex items-center gap-1.5 text-[13.5px] text-ink/70">
                    {c.verdict === "answered" && (
                      <Translate weight="bold" size={13} className="text-green" />
                    )}
                    {c.detailValue}
                  </dd>
                </motion.dl>

                {/* the human line. it is the FOOTNOTE to the fact, not the claim. */}
                <blockquote className="mt-6 flex-1 text-[15px] leading-relaxed tracking-tight text-ink/75">
                  {c.quote}
                </blockquote>

                {c.who && (
                  <figcaption className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/30">
                    {c.who}
                  </figcaption>
                )}
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
