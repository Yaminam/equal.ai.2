"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode } from "react";
import { Check, Prohibit } from "@phosphor-icons/react";
import { EASE } from "../lib/motion";

/*
  The object.

  A phone, built in DOM: crisp at any density, re-themeable, no assets. It is
  the protagonist of the whole page, so it never leaves the screen. Only what is
  on it changes.
*/

/* ---------------------------------------------------------------- the shell */
export function Device({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className="relative mx-auto w-full">
      {/* one light. in the dark it is the only light there is. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-28 -top-32 bottom-6 -z-10 blur-3xl transition-opacity duration-1000"
        style={{
          opacity: dark ? 1 : 0.75,
          background: dark
            ? "radial-gradient(54% 46% at 50% 34%, rgba(0,177,64,0.42), rgba(186,255,41,0.10), transparent 70%)"
            : "radial-gradient(52% 44% at 50% 32%, rgba(186,255,41,0.5), rgba(0,177,64,0.08), transparent 70%)",
        }}
      />

      <div
        className={`relative rounded-[2.9rem] bg-ink p-[9px] transition-shadow duration-700 ${
          dark ? "ring-1 ring-canvas/10" : "lift ring-1 ring-ink/10"
        }`}
      >
        <div className="absolute left-1/2 top-[19px] z-20 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-ink" />
        <div className="relative aspect-[9/19.2] overflow-hidden rounded-[2.35rem] bg-canvas">
          {children}
        </div>
      </div>

      {/* the floor it stands on. in the dark there is no floor, only light. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-8 left-1/2 h-10 w-[76%] -translate-x-1/2 rounded-[50%] blur-2xl transition-opacity duration-1000"
        style={{ opacity: dark ? 0 : 1, background: "rgba(16,20,15,0.2)" }}
      />
    </div>
  );
}

/* ------------------------------------------------------------- shared parts */
function Bar({ live }: { live?: boolean }) {
  return (
    <div className="flex items-center justify-between px-6 pt-3.5 text-[10.5px] font-medium text-ink/40">
      <span className="tnum font-mono">9:41</span>
      <span className="flex items-center gap-1">
        <span className="block size-1 rounded-full bg-ink/20" />
        <span className="block size-1 rounded-full bg-ink/20" />
        <span className={`block size-1 rounded-full ${live ? "bg-green" : "bg-ink/20"}`} />
      </span>
    </div>
  );
}

function Avatar({ pulse }: { pulse?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative grid size-[74px] place-items-center">
      {pulse && !reduce && (
        <>
          <motion.span
            className="absolute inset-0 rounded-full border border-green/40"
            animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.span
            className="absolute inset-0 rounded-full border border-green/40"
            animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
          />
        </>
      )}
      <span className="grid size-[58px] place-items-center rounded-full bg-tint text-[20px] font-medium text-green">
        ?
      </span>
    </div>
  );
}

function Wave({ on = true }: { on?: boolean }) {
  const reduce = useReducedMotion();
  const bars = [0.35, 0.8, 1, 0.5, 0.92, 0.4, 0.72, 0.6, 0.85, 0.45];
  return (
    <div className="flex h-7 items-end justify-center gap-[3px]" aria-hidden>
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-green"
          animate={reduce || !on ? { scaleY: 0.22 } : { scaleY: [0.22, h, 0.32, h * 0.7, 0.22] }}
          transition={{ duration: 1 + i * 0.05, repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }}
          style={{ height: 28, transformOrigin: "bottom" }}
        />
      ))}
    </div>
  );
}

/* Devanagari carries its matras above and below the line, so it needs more
   height and a little more size than Latin to stay legible at this scale. */
function Bubble({ who, children, lang }: { who: "them" | "equal"; children: ReactNode; lang?: string }) {
  const indic = lang === "hi" || lang === "ta";
  return (
    <div className={`flex ${who === "equal" ? "justify-end" : "justify-start"}`}>
      <span
        lang={lang}
        className={`max-w-[86%] rounded-2xl px-3 py-1.5 ${
          indic ? "text-[11.5px] leading-relaxed" : "text-[10.5px] leading-snug"
        } ${
          who === "equal"
            ? "rounded-br-sm bg-green text-white"
            : "hairline rounded-bl-sm bg-paper text-ink/70"
        }`}
      >
        {children}
      </span>
    </div>
  );
}

const Frame = ({ children }: { children: ReactNode }) => (
  <div className="flex h-full flex-col">{children}</div>
);

/* --------------------------------------------------------------- 00 ringing */
export function ScreenRinging() {
  return (
    <Frame>
      <Bar />
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
        <Avatar pulse />
        <div>
          <p className="text-[15px] font-medium">Unknown number</p>
          <p className="tnum mt-1 font-mono text-[10.5px] text-ink/35">+91 90XX XX 4471</p>
        </div>
        <span className="rounded-full bg-ink/[0.06] px-3 py-1.5 text-[10.5px] font-medium text-ink/45">
          Incoming call
        </span>
      </div>
      <div className="pb-8 text-center">
        <p className="tnum font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink/25">
          the fourth today
        </p>
      </div>
    </Frame>
  );
}

/* -------------------------------------------------------------- 01 answering */
export function ScreenAnswering() {
  return (
    <Frame>
      <Bar live />
      <div className="flex flex-1 flex-col items-center justify-center gap-7 px-6 text-center">
        <Avatar />
        <Wave />
        <span className="rounded-full bg-green px-3 py-1.5 text-[10.5px] font-medium text-white">
          Equal is answering
        </span>
      </div>
    </Frame>
  );
}

/* --------------------------------------------------------------- 02 the scam */
export function ScreenScam() {
  return (
    <Frame>
      <Bar live />
      <div className="flex flex-1 flex-col justify-center gap-2 px-4">
        <Bubble who="them">Sir, share the OTP to complete your KYC.</Bubble>
        <Bubble who="equal">I never share OTPs.</Bubble>
        <Bubble who="them">It is official. Just the six digits.</Bubble>
        <Bubble who="equal">Declined. Reporting this number.</Bubble>
      </div>
      <div className="pb-7 text-center">
        <Wave />
      </div>
    </Frame>
  );
}

/* ---------------------------------------------------------------- 03 blocked */
export function ScreenBlocked() {
  const reduce = useReducedMotion();
  return (
    <Frame>
      <Bar />
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
        <motion.span
          initial={reduce ? false : { scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="grid size-16 place-items-center rounded-full bg-alert/10 text-alert"
        >
          <Prohibit weight="bold" size={26} />
        </motion.span>
        <div>
          <p className="text-[15px] font-medium">Scam blocked</p>
          <p className="mt-2 text-[11px] leading-snug text-ink/45">
            Fake KYC call. Refused, ended, and reported to the cybercrime helpline.
          </p>
        </div>
        <span className="hairline flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 text-[10px] text-ink/45">
          <Check weight="bold" size={11} className="text-green" />
          Your phone never rang
        </span>
      </div>
    </Frame>
  );
}

/* ------------------------------------------------- 04 the one that gets through
   The emotional turn of the whole page. She speaks Hindi. It answers in Hindi.
   And then, for her, it does the one thing it never does: it rings you. */
export function ScreenMom() {
  const reduce = useReducedMotion();
  return (
    <Frame>
      <Bar live />

      <div className="flex items-center gap-2.5 px-5 pt-4">
        <span className="grid size-8 place-items-center rounded-full bg-tint text-[13px] font-medium text-green">
          M
        </span>
        <div className="leading-tight">
          <p className="text-[12px] font-medium">Mom</p>
          <p className="font-mono text-[9.5px] text-ink/35">Saved contact</p>
        </div>
      </div>

      {/* She is HIS mother, not the assistant's. "आंटी" is how you address a
          stranger's mother — it is the one word that would make a gatekeeper
          sound like an outsider, in the one moment the page needs warmth. It
          says "जी" and hands her straight over. */}
      <div className="flex flex-1 flex-col justify-center gap-2 px-4">
        <Bubble who="them" lang="hi">बेटा, रविवार को घर आना।</Bubble>
        <Bubble who="equal" lang="hi">जी, मैं उन्हें अभी बुला रहा हूँ।</Bubble>
      </div>

      <div className="px-4 pb-5">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.4 }}
          className="flex items-center justify-center gap-2 rounded-xl bg-green px-3 py-2.5 text-white"
        >
          <span className="relative flex size-1.5">
            {!reduce && (
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-70" />
            )}
            <span className="relative inline-flex size-1.5 rounded-full bg-white" />
          </span>
          <span className="text-[10.5px] font-medium">Ringing you now</span>
        </motion.div>
      </div>
    </Frame>
  );
}
