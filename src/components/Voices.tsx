"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, PhoneCall, Prohibit, Quotes, Translate } from "@phosphor-icons/react";
import { EASE } from "../lib/motion";

/*
  Three call records. Each one is a story: situation, decision, feeling.

  ── WHAT CHANGED, AND WHY ────────────────────────────────────────────────────

  A testimonial asks you to trust a stranger's opinion. A call record shows you
  what happened. So the quote is no longer the claim — it is the FOOTNOTE to a
  fact. Evidence first, feeling second. Reversed, it is marketing.

  Each card has a shape: the SITUATION it walked into, the DECISION Equal made,
  and the RELIEF that followed. And each one argues a different thing — one is
  about safety, one about language, one about time — because three cards making
  the same point is one card printed three times.

  ── HIERARCHY: THE QUOTE IS THE ONLY BIG THING ───────────────────────────────

  Everything used to be the same size, so the eye had nowhere to land. Now the
  quote is large and the rest recedes: an accent at the top, a small situation
  line, a verdict chip, a hairline of metadata, and a tiny uppercase name. Four
  levels, and only one of them is loud.

  ── THE DETAILS ARE THE AUTHENTICITY ─────────────────────────────────────────

  "Tuesday, 9:42 AM." "Refused in 4 seconds." "18 seconds, in Tamil." Nobody
  invents a timestamp that specific for a lie, and the eye knows it. The small
  facts are doing more work here than any adjective could.

  ── THE CARDS RESOLVE, THEY DO NOT ARRIVE ────────────────────────────────────

  Each enters as a live incoming call, pulsing and undecided, and only then lands
  its verdict. A card that appears with its answer already stamped on it is a
  screenshot. A card that decides in front of you is a machine.

  Two are refused. The third is put through, and it is the only green one on the
  page. The last quote only lands because you have watched two calls not make it.

  ────────────────────────────────────────────────────────────────────────────
  TODO(equal): THE NAMES, ROLES AND QUOTES BELOW ARE PLACEHOLDERS. They are not
  real people. Replace with real, consented, attributable quotes before launch,
  or ship the cards with the calls and no attribution at all.
  ────────────────────────────────────────────────────────────────────────────
*/

type Verdict = "blocked" | "answered" | "qualified";

type Story = {
  /** the benefit this card, and only this card, argues */
  theme: string;
  when: string;
  from: string;
  situation: string;
  verdict: Verdict;
  label: string;
  metaKey: string;
  metaValue: string;
  quote: string;
  name: string;
  role: string;
  initials: string;
};

const STORIES: Story[] = [
  {
    theme: "Safety",
    when: "Tuesday, 9:42 AM",
    from: "Caller claimed: HDFC Bank",
    situation: "Asked for an OTP sent to her father's phone.",
    verdict: "blocked",
    label: "Refused",
    metaKey: "Decided in",
    metaValue: "4 seconds",
    quote: "It refused an OTP meant for my father.",
    name: "Dr. Priya Nair",
    role: "Cardiologist, Delhi",
    initials: "PN",
  },
  {
    theme: "Language",
    when: "Thursday, 6:15 PM",
    from: "Unknown number",
    situation: "The caller spoke no English at all.",
    verdict: "answered",
    label: "Handled",
    metaKey: "Spoken in",
    metaValue: "Tamil, 18 seconds",
    quote: "My parents never even noticed.",
    name: "Rajesh Kumar",
    role: "Founder, Chennai",
    initials: "RK",
  },
  {
    theme: "Time",
    when: "All week",
    from: "41 calls",
    situation: "One of them asked for him by name.",
    verdict: "qualified",
    label: "Put through",
    metaKey: "Reached him",
    metaValue: "2 of 41",
    quote: "Only two calls reached me this week. Both mattered.",
    name: "Arjun Mehta",
    role: "Investor, Bengaluru",
    initials: "AM",
  },
];

const ICON = { blocked: Prohibit, answered: Check, qualified: PhoneCall } as const;

export function Voices() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [resolved, setResolved] = useState(-1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      setResolved(STORIES.length - 1);
      return;
    }
    let alive = true;
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        STORIES.forEach((_, i) => {
          timers.push(window.setTimeout(() => alive && setResolved(i), 950 + i * 800));
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
          className="max-w-[18ch] text-[clamp(1.9rem,3.6vw,3rem)] font-medium leading-[1.05] tracking-[-0.035em]"
        >
          Their phones stayed silent. Their lives didn&rsquo;t.
        </motion.h2>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STORIES.map((s, i) => {
            const done = i <= resolved;
            const Icon = ICON[s.verdict];
            const good = s.verdict === "qualified";

            return (
              <motion.figure
                key={s.quote}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: EASE, delay: i * 0.1 }}
                className="group edge lift-sm relative flex flex-col overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_0_0_1px_rgba(0,177,64,0.28),0_20px_44px_-18px_rgba(16,20,15,0.22)]"
              >
                {/* the accent line. it draws itself on hover. */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-green to-lime transition-transform duration-700 ease-out group-hover:scale-x-100"
                />

                {/* the quote mark, which only appears when you lean in */}
                <Quotes
                  weight="fill"
                  size={40}
                  aria-hidden
                  className="pointer-events-none absolute right-4 top-4 text-ink/0 transition-colors duration-500 group-hover:text-ink/[0.06]"
                />

                {/* 1. the theme. one benefit per card. */}
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-green">
                    {s.theme}
                  </span>
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink/25">
                    {s.when}
                  </span>
                </div>

                {/* 2. the situation it walked into */}
                <div className="mt-5 flex items-center gap-2">
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
                  <p className="truncate text-[12.5px] font-medium text-ink/70">{s.from}</p>
                </div>
                <p className="mt-1.5 text-[12.5px] leading-snug text-ink/40">{s.situation}</p>

                {/* 3. the decision. it lands; it is not already there. */}
                <div className="mt-5 min-h-[32px]">
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
                    {s.label}
                  </motion.span>
                </div>

                {/* the small fact nobody would invent */}
                <motion.p
                  animate={{ opacity: done ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
                  className="mt-4 flex items-center gap-1.5 border-t border-ink/[0.08] pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/30"
                >
                  {s.verdict === "answered" && (
                    <Translate weight="bold" size={12} className="text-green" />
                  )}
                  {s.metaKey}
                  <span className="text-ink/60">{s.metaValue}</span>
                </motion.p>

                {/* 4. THE FEELING. the only large thing on the card. */}
                <blockquote className="mt-6 flex-1 text-[clamp(1.05rem,1.5vw,1.25rem)] font-medium leading-snug tracking-tight text-ink">
                  {s.quote}
                </blockquote>

                {/* 5. who it happened to */}
                <figcaption className="mt-7 flex items-center gap-3 border-t border-ink/[0.08] pt-5">
                  <span
                    className="grid size-9 shrink-0 place-items-center rounded-full text-[11px] font-semibold text-ink/50"
                    style={{
                      background: "linear-gradient(180deg, #efeee9, #e2e0d9)",
                      boxShadow: "inset 0 1px 0 #ffffff",
                    }}
                  >
                    {s.initials}
                  </span>
                  <span className="min-w-0 leading-tight">
                    <span className="block truncate font-mono text-[10px] uppercase tracking-[0.16em] text-ink/55">
                      {s.name}
                    </span>
                    <span className="block truncate font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink/30">
                      {s.role}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            );
          })}
        </div>

        {/* the closing line. it earns its keep only because you just read three
            different arguments, not the same one three times. */}
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1, ease: EASE, delay: 0.3 }}
          className="mt-12 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink/30"
        >
          Trusted by founders, doctors, investors and business owners across India
        </motion.p>
      </div>
    </section>
  );
}
