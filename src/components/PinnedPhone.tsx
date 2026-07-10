"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import { CheckCircle, Phone } from "@phosphor-icons/react";
import { Reveal, Eyebrow } from "./primitives";
import { EASE } from "../lib/motion";

/*
  A phone that stays put while the story scrolls past it (family.co's move),
  wired to a signal rail that fills as you go and a call timer that runs inside
  the frame. The section sits on its own dot-grid workbench so it never reads as
  just another block of canvas.
*/

const STEPS = [
  { title: "It rings", body: "An unknown number comes in. Equal picks up so you never have to decide whether to.", clock: "00:00" },
  { title: "It listens", body: "Speech becomes text on the device, live, in whatever language the caller speaks.", clock: "00:03" },
  { title: "It understands", body: "A sales pitch, a scam, your mother, a courier at the gate. It knows the difference.", clock: "00:06" },
  { title: "It decides", body: "Ring you, take a message, or decline politely. The call is handled either way.", clock: "00:08" },
  { title: "It reports back", body: "One line, waiting when you look. No voicemail to sit through.", clock: "00:12" },
];

/* the running decision cost, revealed as the story lands */
const COST = ["0.0", "0.2", "0.5", "0.8", "0.8"];

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -inset-y-8 -z-10 rounded-[48px] blur-3xl"
        style={{ background: "radial-gradient(55% 50% at 50% 25%, rgba(186,255,41,0.5), transparent 70%)" }}
      />
      <div className="lift-lg hairline rounded-[38px] bg-paper p-2.5">
        <div className="h-[500px] overflow-hidden rounded-[30px] bg-sand">{children}</div>
      </div>
    </div>
  );
}

function Bar({ clock, live }: { clock: string; live: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex items-center justify-between px-5 pt-4">
      <span className="tnum font-mono text-[11px] font-medium text-ink/45">9:41</span>
      <div className="flex items-center gap-1.5 rounded-full bg-ink/5 px-2 py-0.5">
        <span className="relative flex size-1.5">
          {live && !reduce && (
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-green opacity-70" />
          )}
          <span className={`relative inline-flex size-1.5 rounded-full ${live ? "bg-green" : "bg-ink/25"}`} />
        </span>
        <span className="tnum font-mono text-[10.5px] font-medium text-ink/55">{clock}</span>
      </div>
    </div>
  );
}

function Screen({ index }: { index: number }) {
  const reduce = useReducedMotion();
  const bars = [0.4, 0.9, 0.55, 1, 0.6, 0.85, 0.45];

  const screens: ReactNode[] = [
    <div key="0" className="flex h-full flex-col items-center justify-center gap-5 px-6 text-center">
      <div className="relative grid size-24 place-items-center">
        {!reduce && (
          <motion.span
            className="absolute inset-0 rounded-full border border-green/40"
            animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
        <span className="grid size-20 place-items-center rounded-full bg-paper text-2xl font-medium text-green">?</span>
      </div>
      <div>
        <p className="text-[17px] font-medium">Unknown number</p>
        <p className="tnum mt-1 font-mono text-[12px] text-ink/40">+91 90XX XX 4471</p>
      </div>
      <span className="rounded-full bg-green px-3.5 py-1.5 text-[12px] font-medium text-white">
        Equal is answering
      </span>
    </div>,

    <div key="1" className="flex h-full flex-col justify-center gap-6 px-6">
      <div className="flex h-10 items-center justify-center gap-1">
        {bars.map((h, i) => (
          <motion.span
            key={i}
            className="w-1 rounded-full bg-green"
            animate={reduce ? { scaleY: 0.35 } : { scaleY: [0.3, h, 0.35, h * 0.7, 0.3] }}
            transition={{ duration: 1 + i * 0.07, repeat: Infinity, ease: "easeInOut", delay: i * 0.06 }}
            style={{ height: 34, transformOrigin: "center" }}
          />
        ))}
      </div>
      <div className="space-y-2">
        <div className="hairline rounded-2xl rounded-bl-md bg-paper px-3.5 py-2.5 text-[12.5px] text-ink/70">
          Sir, pending KYC ke liye OTP bata dijiye.
        </div>
        <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-green px-3.5 py-2.5 text-[12.5px] text-white">
          I never share OTPs.
        </div>
      </div>
      <p className="text-center font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink/35">
        transcribing on device
      </p>
    </div>,

    <div key="2" className="flex h-full flex-col justify-center gap-3.5 px-6">
      <p className="text-center font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink/35">
        why are they calling
      </p>
      {[
        { label: "Likely OTP scam", on: true },
        { label: "Sales pitch", on: false },
        { label: "Someone you know", on: false },
        { label: "Delivery at the gate", on: false },
      ].map((r, i) => (
        <motion.div
          key={r.label}
          initial={reduce ? false : { opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: 0.1 + i * 0.07, ease: EASE }}
          className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-[13px] ${
            r.on ? "bg-green text-white" : "hairline bg-paper text-ink/45"
          }`}
        >
          {r.label}
          {r.on && <CheckCircle weight="fill" size={16} />}
        </motion.div>
      ))}
    </div>,

    <div key="3" className="flex h-full flex-col justify-center gap-3 px-6">
      <p className="mb-1 text-center font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink/35">
        what happens next
      </p>
      {[
        { label: "Ring you", on: false },
        { label: "Take a message", on: false },
        { label: "Refuse and report", on: true },
      ].map((r) => (
        <div
          key={r.label}
          className={`rounded-xl px-4 py-3.5 text-center text-[14px] font-medium ${
            r.on ? "bg-ink text-canvas" : "hairline bg-paper text-ink/40"
          }`}
        >
          {r.label}
        </div>
      ))}
      <p className="tnum mt-1 text-center text-[11.5px] text-ink/40">Decided in 0.8 seconds</p>
    </div>,

    <div key="4" className="flex h-full flex-col items-center justify-center gap-5 px-6 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-tint text-green">
        <CheckCircle weight="fill" size={28} />
      </span>
      <div>
        <p className="text-[17px] font-medium">Scam blocked</p>
        <p className="mt-2 text-[13px] leading-snug text-ink/55">
          Fake KYC call. Refused, ended, and reported to the cybercrime helpline.
        </p>
      </div>
      <div className="hairline w-full rounded-xl bg-paper px-4 py-3">
        <p className="flex items-center justify-center gap-2 text-[12px] text-ink/50">
          <Phone weight="fill" size={12} className="text-green" />
          Your phone never rang
        </p>
      </div>
    </div>,
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        initial={reduce ? false : { opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -20, scale: 0.97 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="h-full"
      >
        {screens[index]}
      </motion.div>
    </AnimatePresence>
  );
}

export function PinnedPhone() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  // the rail fills with the story
  const { scrollYProgress: railProgress } = useScroll({
    target: stepsRef,
    offset: ["start 65%", "end 70%"],
  });
  const railScale = useSpring(railProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });

  // the frame leans as the section passes
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const tiltRaw = useTransform(sectionProgress, [0, 0.5, 1], [7, 0, -7]);
  const tilt = useSpring(tiltRaw, { stiffness: 60, damping: 22 });

  // hoisted: hooks must never sit inside conditional JSX
  const pulseTop = useTransform(railScale, (v) => `${v * 100}%`);

  return (
    <section
      ref={sectionRef}
      id="product"
      className="relative bg-paper/60 py-16 md:py-20"
    >
      {/* workbench ground: a dot grid, faded at the edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(15,20,17,0.10) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(75% 55% at 50% 45%, black, transparent 85%)",
          WebkitMaskImage: "radial-gradient(75% 55% at 50% 45%, black, transparent 85%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal>
          <Eyebrow>One call, start to finish</Eyebrow>
          <h2 className="mt-5 max-w-[18ch] text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.02]">
            A whole conversation, decided before you feel a buzz.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          {/* steps, threaded on a signal rail */}
          <div ref={stepsRef} className="relative order-2 pl-9 lg:order-1">
            {/* the rail */}
            <div className="absolute bottom-10 left-[7px] top-6 w-px bg-ink/12">
              <motion.div
                style={{ scaleY: reduce ? 1 : railScale }}
                className="h-full w-px origin-top bg-green"
              />
              {!reduce && (
                <motion.span
                  style={{ top: pulseTop }}
                  className="absolute -left-[3.5px] size-2 rounded-full bg-green shadow-[0_0_0_4px_rgba(0,177,64,0.15)]"
                />
              )}
            </div>

            {STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                onViewportEnter={() => setActive(i)}
                viewport={{ amount: 0.6, margin: "-25% 0px -25% 0px" }}
                className="relative flex flex-col justify-center py-9 lg:min-h-[46vh] lg:py-10"
              >
                {/* node */}
                <span
                  className={`absolute -left-9 top-[3.1rem] grid size-3.5 place-items-center rounded-full transition-all duration-500 lg:top-1/2 ${
                    active === i
                      ? "bg-green ring-4 ring-green/15"
                      : "bg-paper ring-1 ring-ink/15"
                  }`}
                />

                <div
                  className={`transition-opacity duration-500 ${
                    active === i ? "opacity-100" : "lg:opacity-35"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="tnum font-mono text-[12px] text-green">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="tnum font-mono text-[11px] text-ink/30">{s.clock}</span>
                  </div>
                  <h3 className="mt-2 text-[clamp(1.5rem,2.6vw,2.1rem)] font-medium leading-tight">
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-[40ch] text-[15.5px] leading-relaxed text-ink/55">
                    {s.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* the phone that stays */}
          <div className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-28">
              <div style={{ perspective: "1400px" }}>
                <motion.div style={{ rotateX: reduce ? 0 : tilt }} className="[transform-style:preserve-3d]">
                  <Frame>
                    <Bar clock={STEPS[active].clock} live={active < 4} />
                    <div className="h-[calc(100%-2.5rem)]">
                      <Screen index={active} />
                    </div>
                  </Frame>
                </motion.div>
              </div>

              {/* the running cost of the decision */}
              <div className="mx-auto mt-7 flex w-fit items-center gap-3 rounded-full bg-ink px-4 py-2">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-canvas/50">
                  Decision time
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={COST[active]}
                    initial={reduce ? false : { y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={reduce ? { opacity: 0 } : { y: -8, opacity: 0 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="tnum text-[13px] font-medium text-lime"
                  >
                    {COST[active]}s
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
