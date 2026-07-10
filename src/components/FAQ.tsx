"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { Reveal } from "./primitives";
import { EASE } from "../lib/motion";

/*
  The objections, answered in the order people actually think them.
  Gnani and Retell both close with an FAQ; the useful part is choosing the
  uncomfortable questions rather than the flattering ones.
*/

const QA = [
  {
    q: "What is Equal AI?",
    a: "An assistant that answers your phone. When a call comes in, Equal picks up, asks who is calling and why, and decides what to do with them. Important calls ring through. Sales pitches get a polite no. Scams get refused and reported. You read a one-line summary later.",
  },
  {
    q: "Does it work on my number, on Jio, Airtel or Vi?",
    a: "Yes. You keep your number and your operator. There is no new SIM, no call-forwarding code to memorise, and nothing your family needs to install on their side.",
  },
  {
    q: "Does Equal record my calls?",
    a: "Screened calls are turned into text on your device so you can read what was said. The audio is not uploaded, and there is no recording sitting on a server for anyone to open. One tap wipes every transcript.",
  },
  {
    q: "Does a person at Equal ever listen?",
    a: "No. There is no review queue, no contractor grading conversations, no human on the other end. If that ever needed to change, we would ask you first, in the app, and you could say no.",
  },
  {
    q: "What if someone important calls?",
    a: "Saved contacts ring straight through by default. For unknown numbers, Equal asks who is calling and why. If it sounds urgent, your phone rings while they are still on the line.",
  },
  {
    q: "Will callers know they are talking to an AI?",
    a: "Equal introduces itself as an assistant. It does not pretend to be you. In practice most callers simply carry on, because that is how talking to a receptionist has always worked.",
  },
  {
    q: "How good is it in Hindi and regional languages?",
    a: "It answers in the language the caller speaks and switches mid-sentence when they do. Hindi, English, Tamil, Telugu, Bengali, Marathi, Kannada, Gujarati, Punjabi, Malayalam and Odia.",
  },
  {
    q: "What does it cost, really?",
    a: "₹⁠249 a month, GST included. No ad-supported free tier, because the free tier is usually where your data gets sold. Cancel from the app whenever you like.",
  },
];

function Row({ q, a, open, onClick }: { q: string; a: string; open: boolean; onClick: () => void }) {
  const reduce = useReducedMotion();
  return (
    <div className="border-b border-ink/10">
      <button
        onClick={onClick}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 py-6 text-left"
      >
        <span className={`text-[17px] font-medium tracking-tight transition-colors ${open ? "text-ink" : "text-ink/70"}`}>
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className={`grid size-8 shrink-0 place-items-center rounded-full transition-colors ${
            open ? "bg-green text-white" : "hairline bg-paper text-ink/50"
          }`}
        >
          <Plus weight="bold" size={13} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-[62ch] pb-7 pr-12 text-[15.5px] leading-relaxed text-ink/55">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr]">
        <Reveal>
          <h2 className="max-w-[12ch] text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.02]">
            The awkward questions.
          </h2>
          <p className="mt-6 max-w-[34ch] text-[16px] leading-relaxed text-ink/60">
            An AI is answering your phone. You should have a few of these.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="border-t border-ink/10">
            {QA.map((item, i) => (
              <Row
                key={item.q}
                q={item.q}
                a={item.a}
                open={open === i}
                onClick={() => setOpen(open === i ? null : i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
