"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { PhoneCall, Prohibit, ShieldSlash } from "@phosphor-icons/react";
import { Reveal } from "./primitives";
import { EASE } from "../lib/motion";

/*
  Equal at work, right now. Calls arrive at the top, spam is struck out and
  dismissed, the ones that matter ring through. An abstract activity stream,
  not a screenshot of anyone's app.
*/

type Kind = "spam" | "handled" | "ring";
type Item = { id: number; label: string; kind: Kind };

const POOL: { label: string; kind: Kind }[] = [
  { label: "Fake KYC, asked for an OTP", kind: "spam" },
  { label: "Loan pre-approval robocall", kind: "spam" },
  { label: "Aanya's school", kind: "ring" },
  { label: "Insurance renewal telecaller", kind: "handled" },
  { label: "Lottery win, obvious scam", kind: "spam" },
  { label: "Courier, parcel at the gate", kind: "ring" },
  { label: "Credit card upgrade pitch", kind: "handled" },
  { label: "Recovery agent, wrong number", kind: "spam" },
  { label: "Mom", kind: "ring" },
  { label: "Electricity disconnection scam", kind: "spam" },
  { label: "Real estate broker", kind: "handled" },
  { label: "Client, wants to reschedule", kind: "ring" },
];

const META: Record<Kind, { tag: string; text: string; icon: React.ReactNode }> = {
  spam: {
    tag: "blocked",
    text: "text-ink/35 line-through decoration-alert/40",
    icon: <Prohibit weight="bold" size={15} className="text-alert/70" />,
  },
  handled: {
    tag: "handled",
    text: "text-ink/55",
    icon: <ShieldSlash weight="regular" size={15} className="text-ink/30" />,
  },
  ring: {
    tag: "rang you",
    text: "text-ink",
    icon: <PhoneCall weight="fill" size={15} className="text-green" />,
  },
};

export function LiveFeed() {
  const reduce = useReducedMotion();
  const [items, setItems] = useState<Item[]>(() => POOL.slice(0, 5).map((p, i) => ({ ...p, id: i })));
  const idRef = useRef(POOL.length);
  const posRef = useRef(5);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      const next = POOL[posRef.current % POOL.length];
      posRef.current += 1;
      idRef.current += 1;
      setItems((prev) => [{ ...next, id: idRef.current }, ...prev].slice(0, 5));
    }, 2000);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <section className="bg-sand/60 py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <Reveal>
          <div className="mb-5 inline-flex items-center gap-2">
            <span className="relative flex size-2">
              {!reduce && (
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-green opacity-70" />
              )}
              <span className="relative inline-flex size-2 rounded-full bg-green" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-green-deep">
              Live, right now
            </span>
          </div>

          <h2 className="mx-auto max-w-[17ch] text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.02]">
            Somewhere in India, Equal is taking a call you didn't want.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="lift hairline mt-10 rounded-card bg-paper p-3 text-left">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/35">
                Incoming
              </span>
              <span className="font-mono text-[10px] text-ink/35">auto-handled</span>
            </div>

            <div className="relative h-[296px] overflow-hidden [-webkit-mask-image:linear-gradient(to_bottom,black_80%,transparent)] [mask-image:linear-gradient(to_bottom,black_80%,transparent)]">
              <AnimatePresence initial={false}>
                {items.map((it) => {
                  const m = META[it.kind];
                  return (
                    <motion.div
                      key={it.id}
                      layout={!reduce}
                      initial={reduce ? false : { opacity: 0, y: -14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.44, ease: EASE }}
                      className={`mb-2 flex items-center justify-between rounded-xl px-4 py-3.5 ${
                        it.kind === "ring" ? "border border-green/25 bg-tint" : "hairline bg-canvas"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {m.icon}
                        <span className={`text-[13.5px] ${m.text}`}>{it.label}</span>
                      </div>
                      <span
                        className={`font-mono text-[10px] uppercase tracking-wider ${
                          it.kind === "ring" ? "text-green-deep" : "text-ink/30"
                        }`}
                      >
                        {m.tag}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
