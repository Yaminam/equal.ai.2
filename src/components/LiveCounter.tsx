"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Star } from "@phosphor-icons/react";
import { CountUp, Reveal } from "./primitives";
import { inNum } from "../lib/format";

const PRESS = ["YourStory", "Inc42", "The Economic Times", "Mint", "Moneycontrol"];

const SEED = 284193;

export function LiveCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [extra, setExtra] = useState(0);
  const [settled, setSettled] = useState(false);

  // after the count-up lands, keep ticking so it reads as live
  useEffect(() => {
    if (!inView || reduce) return;
    const t = window.setTimeout(() => setSettled(true), 2000);
    return () => window.clearTimeout(t);
  }, [inView, reduce]);

  useEffect(() => {
    if (!settled) return;
    const id = window.setInterval(() => setExtra((e) => e + 1), 2400);
    return () => window.clearInterval(id);
  }, [settled]);

  return (
    <section className="border-y border-ink/10 bg-paper/50">
      <div ref={ref} className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid items-center gap-10 md:grid-cols-[auto_1fr]">
          <Reveal>
            <div className="flex items-baseline gap-3">
              <span className="tnum text-[clamp(2.4rem,5vw,3.6rem)] font-medium leading-none tracking-tight">
                {settled ? inNum(SEED + extra) : <CountUp to={SEED} />}
              </span>
              <span className="relative flex size-2">
                {!reduce && (
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-green opacity-70" />
                )}
                <span className="relative inline-flex size-2 rounded-full bg-green" />
              </span>
            </div>
            <p className="mt-2 max-w-[30ch] text-[14px] leading-snug text-ink/50">
              calls screened for members this week. Roughly 2.8 lakh conversations
              you did not have to sit through.
            </p>
            <p className="mt-3 flex items-center gap-1.5 text-[13px] text-ink/45">
              <Star weight="fill" size={13} className="text-green" />
              <span className="tnum font-medium text-ink/70">4.8</span> on the App Store, from
              <span className="tnum font-medium text-ink/70">2.8 lakh</span> Indians
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col gap-5 md:items-end">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 md:justify-end">
                {PRESS.map((p) => (
                  <span
                    key={p}
                    className="text-[15px] font-medium tracking-tight text-ink/30 transition-colors duration-300 hover:text-ink/60"
                  >
                    {p}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 md:justify-end">
                {["Runs on device", "DPDP Act, 2023", "No data ever sold"].map((b) => (
                  <span
                    key={b}
                    className="hairline rounded-full bg-paper px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink/45"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
