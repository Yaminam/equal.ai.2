"use client";

import { motion, useReducedMotion } from "motion/react";
import { Check, Minus, X } from "@phosphor-icons/react";
import { CountUp, Reveal } from "./primitives";
import { EASE } from "../lib/motion";

/*
  Bland and Retell both put a "how we differ" chart directly under the hero.
  Three cards, not a hairline table. The Equal column is elevated; the other two
  are recessed. We describe the categories rather than naming rivals.
*/

type Mark = "yes" | "no" | "part";

const ROWS = [
  "Answers the call for you",
  "Works out why they are calling",
  "Refuses OTP and KYC scams",
  "Replies in Hindi and regional languages",
  "Handles couriers and appointments",
  "Keeps the audio on your phone",
];

const COLUMNS: { name: string; note: string; marks: Mark[]; hero?: boolean }[] = [
  {
    name: "Voicemail",
    note: "The default your carrier gave you",
    marks: ["yes", "no", "no", "no", "no", "no"],
  },
  {
    name: "Caller ID apps",
    note: "Identify and block, nothing more",
    marks: ["no", "no", "part", "no", "no", "no"],
  },
  {
    name: "Equal",
    note: "An assistant that actually answers",
    marks: ["yes", "yes", "yes", "yes", "yes", "yes"],
    hero: true,
  },
];

function Mark({ v, hero }: { v: Mark; hero?: boolean }) {
  if (v === "yes")
    return (
      <span className={`grid size-5 place-items-center rounded-full ${hero ? "bg-green text-white" : "bg-ink/8 text-ink/55"}`}>
        <Check weight="bold" size={11} />
      </span>
    );
  if (v === "part")
    return (
      <span className="grid size-5 place-items-center rounded-full bg-ink/8 text-ink/40">
        <Minus weight="bold" size={11} />
      </span>
    );
  return (
    <span className="grid size-5 place-items-center rounded-full bg-ink/5 text-ink/25">
      <X weight="bold" size={10} />
    </span>
  );
}

/* Bland's two-bar chart: your product leads, the old way trails, both count up
   on scroll. No named competitor, just the category. */
function Bars() {
  const reduce = useReducedMotion();
  const rows = [
    { label: "Equal, deciding whether to ring you", value: 0.8, width: "13%", lead: true },
    { label: "You, working it out after you pick up", value: 45, width: "100%", lead: false },
  ];

  return (
    <div className="hairline mt-10 rounded-card bg-paper p-7 md:p-9">
      <p className="max-w-[38ch] text-[17px] font-medium leading-snug tracking-tight">
        And it decides so fast you never feel the pause.
      </p>

      <div className="mt-9 space-y-7">
        {rows.map((r, i) => (
          <div key={r.label}>
            <div className="mb-2.5 flex items-baseline justify-between gap-4">
              <span className={`text-[14px] ${r.lead ? "text-ink" : "text-ink/45"}`}>{r.label}</span>
              <span
                className={`tnum shrink-0 text-[15px] font-medium ${
                  r.lead ? "text-green-deep" : "text-ink/40"
                }`}
              >
                <CountUp to={r.value} decimals={r.lead ? 1 : 0} duration={1.4} />s
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink/6">
              <motion.div
                initial={reduce ? { width: r.width } : { width: 0 }}
                whileInView={{ width: r.width }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.15 + i * 0.15 }}
                className={`h-full rounded-full ${r.lead ? "bg-green" : "bg-ink/20"}`}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 border-t border-ink/10 pt-5 text-[13.5px] text-ink/45">
        Roughly <span className="tnum font-medium text-ink/70">56 times</span> quicker than
        answering, saying hello, and realising it was a loan pitch.
      </p>
    </div>
  );
}

export function Comparison() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <Reveal>
        <h2 className="max-w-[18ch] text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.02]">
          A blocklist hangs up. An assistant handles it.
        </h2>
        <p className="mt-6 max-w-[48ch] text-[16px] leading-relaxed text-ink/60">
          Blocking a number is easy. Knowing that the courier at your gate is
          worth interrupting you for, and the loan pitch is not, is the whole job.
        </p>
      </Reveal>

      <Reveal delay={0.06}>
        <Bars />
      </Reveal>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {COLUMNS.map((c, ci) => (
          <Reveal key={c.name} delay={ci * 0.08}>
            <div
              className={`h-full rounded-card p-7 ${
                c.hero ? "lift hairline border-green/30 bg-paper" : "hairline bg-sand/70"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h3 className={`text-[19px] font-medium tracking-tight ${c.hero ? "" : "text-ink/60"}`}>
                  {c.name}
                </h3>
                {c.hero && (
                  <span className="rounded-full bg-lime px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink">
                    this
                  </span>
                )}
              </div>
              <p className={`mt-1 text-[13px] ${c.hero ? "text-ink/50" : "text-ink/35"}`}>{c.note}</p>

              <ul className="mt-7 space-y-4">
                {ROWS.map((r, ri) => (
                  <li key={r} className="flex items-start gap-3">
                    <Mark v={c.marks[ri]} hero={c.hero} />
                    <span
                      className={`text-[13.5px] leading-snug ${
                        c.marks[ri] === "yes" && c.hero ? "text-ink/80" : "text-ink/45"
                      }`}
                    >
                      {r}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
