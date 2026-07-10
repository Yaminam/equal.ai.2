"use client";

import { CountUp, Reveal } from "./primitives";

/*
  Gnani's device: a giant metric, then a sentence built on "not X; Y" that
  reframes what the number means. The grid itself uses Attio's trick - a
  1px-gap grid over an ink-tinted parent, so the dividers are hairlines rather
  than borders drawn on every cell.
*/

const METRICS = [
  {
    value: 0.8,
    decimals: 1,
    unit: "s",
    title: "To decide",
    body: "Not a block after you have already picked up. A decision before your phone can buzz.",
  },
  {
    value: 11,
    unit: "",
    title: "Languages",
    body: "Not a menu you press one for. A reply in whatever language the caller opened with.",
  },
  {
    value: 0,
    unit: "",
    title: "OTPs shared",
    body: "Not a warning after the money is gone. A refusal while the scammer is still talking.",
  },
  {
    value: 2.8,
    decimals: 1,
    unit: " lakh",
    title: "Calls this week",
    body: "Not calls blocked and forgotten. Conversations handled, summarised, and waiting for you.",
  },
];

export function Metrics() {
  return (
    <section className="bg-canvas">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <Reveal>
          <h2 className="max-w-[20ch] text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.02]">
            The difference is not what it blocks. It is what it understands.
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-card bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((m, i) => (
            <Reveal key={m.title} delay={i * 0.07}>
              <div className="h-full bg-canvas p-7">
                <div className="flex items-baseline">
                  <span className="tnum text-[clamp(2.6rem,4.4vw,3.4rem)] font-medium leading-none tracking-tight">
                    <CountUp to={m.value} decimals={m.decimals ?? 0} />
                  </span>
                  <span className="text-[clamp(1.4rem,2.2vw,1.8rem)] font-medium leading-none tracking-tight text-green">
                    {m.unit}
                  </span>
                </div>
                <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink/40">
                  {m.title}
                </p>
                <p className="mt-3 max-w-[30ch] text-[14px] leading-relaxed text-ink/55">{m.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
