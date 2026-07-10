"use client";

import { Check } from "@phosphor-icons/react";
import { Magnetic, Reveal } from "./primitives";
import { inr } from "../lib/format";

const INCLUDED = [
  "Unlimited screening, day and night",
  "Hindi, English and nine more languages",
  "Scam and OTP protection, with auto-reporting",
  "One-line summaries instead of voicemail",
  "Deliveries, appointments and pickups handled",
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <h2 className="text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.02]">
            One plan. Less than a coffee a week.
          </h2>
          <p className="mt-6 max-w-[42ch] text-[16px] leading-relaxed text-ink/60">
            No tiers, no per-minute charges, and no ad-supported free version
            quietly paying for itself with your data. Cancel any time from the app.
          </p>
          <p className="mt-8 text-[13.5px] text-ink/40">
            Billed in rupees. GST included.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="lift hairline relative overflow-hidden rounded-card bg-paper p-8">
            <span className="absolute right-6 top-6 rounded-full bg-lime px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink">
              Founding price
            </span>

            <div className="flex items-baseline gap-2">
              <span className="tnum text-[3.4rem] font-medium leading-none tracking-tight [white-space:nowrap]">
                {inr(249)}
              </span>
              <span className="text-[15px] text-ink/45">/ month</span>
            </div>
            <p className="mt-2 text-[13.5px] text-ink/45">
              Locked for life, for early members.
            </p>

            <div className="my-7 h-px bg-ink/10" />

            <ul className="space-y-3.5">
              {INCLUDED.map((f) => (
                <li key={f} className="flex items-start gap-3 text-[14.5px] text-ink/70">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-tint text-green">
                    <Check weight="bold" size={11} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <Magnetic href="#waitlist" variant="primary" className="mt-8 w-full">
              Request an invite
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
