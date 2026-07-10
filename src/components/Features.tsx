"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  CalendarCheck,
  ChatCircleText,
  FunnelSimple,
  ShieldWarning,
  Translate,
} from "@phosphor-icons/react";
import { Reveal, SpotlightCard } from "./primitives";
import { EASE } from "../lib/motion";

/*
  Bento with rhythm, not five identical cards.
  Surfaces vary (paper, sand, tint, and exactly one lime cell) so a light grid
  never reads as a spreadsheet. The lime cell is the page's single loud moment.
*/

function Icon({ children, on = false }: { children: React.ReactNode; on?: boolean }) {
  return (
    <span
      className={`mb-5 grid size-11 place-items-center rounded-xl ${
        on ? "bg-ink/10 text-ink" : "hairline bg-paper text-green"
      }`}
    >
      {children}
    </span>
  );
}

/* The hero cell's own visual: a queue of calls resolving to the two that matter. */
function ScreeningVisual() {
  const reduce = useReducedMotion();
  const rows = [
    { label: "Insurance telesales", keep: false },
    { label: "Loan pre-approval bot", keep: false },
    { label: "Aanya's school", keep: true },
    { label: "Unknown, flagged scam", keep: false },
    { label: "Courier, at the gate", keep: true },
  ];
  return (
    <div className="mt-7 space-y-2">
      {rows.map((r, i) => (
        <motion.div
          key={r.label}
          initial={reduce ? false : { opacity: 0, x: -10 }}
          whileInView={{ opacity: r.keep ? 1 : 0.45, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
          className={`flex items-center justify-between rounded-lg px-3.5 py-2.5 text-[13px] ${
            r.keep
              ? "border border-green/30 bg-tint text-ink"
              : "hairline bg-paper text-ink/40 line-through decoration-ink/20"
          }`}
        >
          <span>{r.label}</span>
          <span
            className={`font-mono text-[10px] uppercase tracking-wider ${
              r.keep ? "text-green-deep" : "text-ink/30"
            }`}
          >
            {r.keep ? "rings you" : "handled"}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <Reveal>
        <h2 className="max-w-[19ch] text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.02]">
          A gatekeeper for your phone, not another voicemail.
        </h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-6">
        {/* hero cell, on a painterly ground */}
        <Reveal className="lg:col-span-4">
          <SpotlightCard className="hairline relative h-full overflow-hidden rounded-card bg-paper p-7">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full opacity-70 blur-3xl"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(186,255,41,0.55), rgba(0,177,64,0.10), transparent)",
              }}
            />
            <div className="relative">
              <Icon>
                <FunnelSimple size={21} />
              </Icon>
              <h3 className="text-[22px] font-medium tracking-tight">
                It decides who is worth your ring.
              </h3>
              <p className="mt-3 max-w-[44ch] text-[15px] leading-relaxed text-ink/55">
                Equal picks up, works out why someone is calling, and forwards
                only the ones that matter. The rest are handled and summarised.
              </p>
              <ScreeningVisual />
            </div>
          </SpotlightCard>
        </Reveal>

        {/* right stack, two half-height cells */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Reveal delay={0.08} className="flex-1">
            <SpotlightCard className="hairline h-full rounded-card bg-sand p-7">
              <Icon>
                <ShieldWarning size={21} />
              </Icon>
              <h3 className="text-[19px] font-medium tracking-tight">Never gives up an OTP</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink/55">
                Refuses OTP and payment requests, spots KYC and refund scams, and
                reports the number to cybercrime.
              </p>
            </SpotlightCard>
          </Reveal>

          <Reveal delay={0.14} className="flex-1">
            <SpotlightCard className="hairline h-full rounded-card bg-tint p-7">
              <Icon>
                <Translate size={21} />
              </Icon>
              <h3 className="text-[19px] font-medium tracking-tight">Speaks their language</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink/60">
                Hindi, English and nine more, switching mid-call the way a real
                assistant would.
              </p>
            </SpotlightCard>
          </Reveal>
        </div>

        {/* two wide cells, one of them the single lime moment */}
        <Reveal delay={0.1} className="lg:col-span-3">
          <SpotlightCard className="hairline h-full rounded-card bg-paper p-7">
            <Icon>
              <ChatCircleText size={21} />
            </Icon>
            <h3 className="text-[19px] font-medium tracking-tight">Takes a real message</h3>
            <p className="mt-2.5 max-w-[42ch] text-[14.5px] leading-relaxed text-ink/55">
              Who called, what they wanted, how urgent. A clean summary waiting for
              you, not forty seconds of voicemail to sit through.
            </p>
          </SpotlightCard>
        </Reveal>

        <Reveal delay={0.16} className="lg:col-span-3">
          <div className="h-full rounded-card bg-lime p-7">
            <Icon on>
              <CalendarCheck size={21} />
            </Icon>
            <h3 className="text-[19px] font-medium tracking-tight text-ink">
              Handles the small stuff
            </h3>
            <p className="mt-2.5 max-w-[42ch] text-[14.5px] leading-relaxed text-ink/70">
              Reschedules a delivery, confirms an appointment, coordinates a
              pickup, then tells you it is done.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
