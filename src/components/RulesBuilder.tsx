"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { LockSimple, Megaphone, Package, Question, ShieldWarning, UserCircle } from "@phosphor-icons/react";
import { Reveal } from "./primitives";
import { EASE } from "../lib/motion";

/*
  Try it, do not read it. Flip a rule and every caller's outcome recomputes.
  The scam rule is welded on, which is itself a product statement.
*/

type Rules = {
  screenUnknown: boolean;
  silenceSpam: boolean;
  contactsThrough: boolean;
  focusHours: boolean;
};

const TOGGLES: { key: keyof Rules; label: string; desc: string }[] = [
  { key: "screenUnknown", label: "Screen unknown numbers", desc: "Equal answers anyone not in your contacts." },
  { key: "silenceSpam", label: "Silence telemarketers", desc: "Known spam patterns never reach your phone." },
  { key: "contactsThrough", label: "Contacts ring straight through", desc: "People you know skip screening entirely." },
  { key: "focusHours", label: "Focus hours, 10am to 7pm", desc: "Hold everything but emergencies while you work." },
];

type Tone = "ring" | "screen" | "block" | "hold";
const CALLERS: { name: string; type: string; icon: React.ReactNode }[] = [
  { name: "Unknown number", type: "unknown", icon: <Question weight="bold" size={15} /> },
  { name: "Insurance telecaller", type: "spam", icon: <Megaphone weight="fill" size={15} /> },
  { name: "Mom", type: "contact", icon: <UserCircle weight="fill" size={15} /> },
  { name: "Courier at the gate", type: "useful", icon: <Package weight="fill" size={15} /> },
  { name: "Fake KYC scam", type: "fraud", icon: <ShieldWarning weight="fill" size={15} /> },
];

function verdict(type: string, r: Rules): { label: string; tone: Tone } {
  if (type === "fraud") return { label: "Blocked, reported", tone: "block" };
  if (r.focusHours && type !== "contact") return { label: "Held till 7pm", tone: "hold" };
  switch (type) {
    case "unknown":
      return r.screenUnknown ? { label: "Screened", tone: "screen" } : { label: "Rings you", tone: "ring" };
    case "spam":
      return r.silenceSpam ? { label: "Silenced", tone: "block" } : { label: "Rings you", tone: "ring" };
    case "contact":
      return r.contactsThrough ? { label: "Rings you", tone: "ring" } : { label: "Screened", tone: "screen" };
    default:
      return r.screenUnknown ? { label: "Handled, briefed", tone: "screen" } : { label: "Rings you", tone: "ring" };
  }
}

const TONE: Record<Tone, string> = {
  ring: "text-green-deep",
  screen: "text-ink/55",
  block: "text-alert",
  hold: "text-ink/35",
};

function Switch({ on, onClick, locked = false }: { on: boolean; onClick?: () => void; locked?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={locked}
      role="switch"
      aria-checked={on}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
        on ? "bg-green" : "bg-ink/15"
      } ${locked ? "cursor-not-allowed" : ""}`}
    >
      <span
        className="absolute top-0.5 grid size-5 place-items-center rounded-full bg-paper text-green shadow-sm transition-[left] duration-300"
        style={{ left: on ? "22px" : "2px" }}
      >
        {locked && <LockSimple weight="fill" size={9} />}
      </span>
    </button>
  );
}

export function RulesBuilder() {
  const reduce = useReducedMotion();
  const [rules, setRules] = useState<Rules>({
    screenUnknown: true,
    silenceSpam: true,
    contactsThrough: true,
    focusHours: false,
  });

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <Reveal>
        <h2 className="max-w-[19ch] text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.02]">
          Set the rules once. Equal runs them every time.
        </h2>
        <p className="mt-6 max-w-[46ch] text-[16px] leading-relaxed text-ink/60">
          Flip a switch and watch your day change. Everything here is real, except
          the scam guard, which never turns off.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <Reveal>
          <div className="hairline divide-y divide-ink/10 overflow-hidden rounded-card bg-paper">
            {TOGGLES.map((t) => (
              <div key={t.key} className="flex items-center justify-between gap-5 p-5">
                <div>
                  <p className="text-[15px] font-medium">{t.label}</p>
                  <p className="mt-0.5 text-[13px] text-ink/45">{t.desc}</p>
                </div>
                <Switch on={rules[t.key]} onClick={() => setRules((r) => ({ ...r, [t.key]: !r[t.key] }))} />
              </div>
            ))}
            <div className="flex items-center justify-between gap-5 bg-tint p-5">
              <div>
                <p className="text-[15px] font-medium">Block and report OTP scams</p>
                <p className="mt-0.5 text-[13px] text-ink/45">Always on. This one is not up for debate.</p>
              </div>
              <Switch on locked />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="hairline rounded-card bg-paper p-5">
            <p className="mb-4 px-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink/40">
              Your day, right now
            </p>
            <div className="space-y-2.5">
              {CALLERS.map((c) => {
                const v = verdict(c.type, rules);
                return (
                  <div key={c.name} className="hairline flex items-center justify-between rounded-xl bg-canvas px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`grid size-8 shrink-0 place-items-center rounded-lg bg-paper ${
                          c.type === "fraud" ? "text-alert" : c.type === "contact" || c.type === "useful" ? "text-green" : "text-ink/35"
                        }`}
                      >
                        {c.icon}
                      </span>
                      <span className="truncate text-[13.5px] text-ink/70">{c.name}</span>
                    </div>
                    <div className="relative ml-3 h-5 min-w-[104px] shrink-0 text-right">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={v.label}
                          initial={reduce ? false : { opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -5 }}
                          transition={{ duration: 0.26, ease: EASE }}
                          className={`absolute right-0 font-mono text-[11px] font-medium uppercase tracking-wider ${TONE[v.tone]}`}
                        >
                          {v.label}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
