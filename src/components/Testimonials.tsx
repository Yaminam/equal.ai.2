"use client";

import { Reveal } from "./primitives";

/*
  Editorial, not a marquee. Three voices, given room to be read.
  Avatars are placeholder portraits - swap for real member photos before launch.
*/

const QUOTES = [
  {
    quote:
      "It refused an OTP scam meant for my father and reported the number. I put it on both our phones the same evening.",
    name: "Dr. Priya Nair",
    role: "Physician",
    city: "Delhi",
    seed: "priya-nair-44",
  },
  {
    quote:
      "Callers speak Tamil, it answers in Tamil. My parents have never once realised they were talking to an assistant.",
    name: "Rajesh Kumar",
    role: "Product manager",
    city: "Chennai",
    seed: "rajesh-kumar-22",
  },
  {
    quote:
      "A dozen spam calls a day went to almost none. The two that got through this week both actually mattered.",
    name: "Arjun Mehta",
    role: "Founder",
    city: "Bengaluru",
    seed: "arjun-mehta-91",
  },
];

export function Testimonials() {
  return (
    <section id="voices" className="bg-tint py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <h2 className="max-w-[20ch] text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.02]">
            The busiest people in India, calling back less.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {QUOTES.map((q, i) => (
            <Reveal key={q.seed} delay={i * 0.08}>
              <figure className="hairline flex h-full flex-col justify-between rounded-card bg-paper p-7">
                <blockquote className="text-[17px] leading-relaxed tracking-tight text-ink/85">
                  “{q.quote}”
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3 border-t border-ink/10 pt-5">
                  <img
                    src={`https://i.pravatar.cc/96?u=${q.seed}`}
                    alt={q.name}
                    loading="lazy"
                    width={40}
                    height={40}
                    className="size-10 rounded-full object-cover"
                  />
                  <div className="leading-tight">
                    <p className="text-[14px] font-medium">{q.name}</p>
                    <p className="text-[12.5px] text-ink/45">
                      {q.role}, {q.city}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
