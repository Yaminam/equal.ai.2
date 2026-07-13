"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode } from "react";
import { Check, PhoneCall, PhoneDisconnect, Prohibit } from "@phosphor-icons/react";
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

      {/*
        The body is a machined object, not a rectangle.

        A subtle top-left-to-bottom-right gradient across the shell gives it a
        single light source. The inset white hairline along the top edge is the
        specular catch on the chamfer; the inset dark line at the bottom is where
        the light does not reach. Those two lines are what stop it reading flat.
      */}
      <div
        className="relative rounded-[2.9rem] p-[9px] transition-shadow duration-700"
        style={{
          background: "linear-gradient(160deg, #2a312a 0%, #10140f 42%, #080b08 100%)",
          boxShadow: dark
            ? "0 0 0 1px #faf9f61f, inset 0 1px 0 #ffffff2e, inset 0 -1px 0 #0000004d, 0 40px 80px -40px #00000099"
            : "0 0 0 1px #10140f, 0 2px 6px -2px #10140f2e, 0 24px 48px -20px #10140f52, 0 48px 90px -40px #10140f3d, inset 0 1px 0 #ffffff33, inset 0 -1px 0 #00000059",
        }}
      >
        {/* the island. it sits ON the glass, so it gets the glass's own faint
            highlight along its top edge rather than reading as a black sticker. */}
        <div
          className="absolute left-1/2 top-[17px] z-20 h-[24px] w-[88px] -translate-x-1/2 rounded-full"
          style={{
            background: "#05070500",
            backgroundColor: "#050705",
            boxShadow: "inset 0 1px 0 #ffffff1a, 0 1px 2px #0000001a",
          }}
        >
          {/* the lens */}
          <span
            className="absolute right-[9px] top-1/2 block size-[9px] -translate-y-1/2 rounded-full"
            style={{
              background: "radial-gradient(circle at 35% 30%, #2c3a44, #0b0f12 70%)",
              boxShadow: "inset 0 0 0 0.5px #ffffff14",
            }}
          />
        </div>

        {/*
          `text-ink` is load-bearing, not decoration.

          The Stage animates `color` on its sticky container to invert the page
          at dawn, and everything inside inherits it — including the phone's
          display. During the two dark beats that made the screen's own labels
          near-white ON a near-white screen, so "Unknown number" was invisible
          and only the labels with an explicit colour survived.

          The display is its own device. It never inherits the page's ink.
        */}
        <div
          className="relative aspect-[9/19.2] overflow-hidden rounded-[2.35rem] bg-canvas text-ink"
          style={{
            // the glass is recessed into the body, so the body casts a hairline
            // shadow onto the top of the display
            boxShadow: "inset 0 0 0 1px #00000047, inset 0 2px 5px -2px #0000002e",
          }}
        >
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

/*
  A real status bar.

  It used to be three grey dots. Three grey dots is the single clearest tell
  that a "phone" is a drawing of a phone — every real handset shows signal,
  wifi and battery, and the eye knows their silhouettes without reading them.
  Drawn as SVG so they stay crisp at any density.
*/
function Bar({ live }: { live?: boolean }) {
  return (
    <div className="relative z-10 flex items-start justify-between px-6 pt-3">
      <span className="tnum text-[11px] font-semibold tracking-tight text-ink/70">9:41</span>

      <span className="flex items-center gap-[5px] text-ink/70">
        {/* signal: four rising bars */}
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={i * 4.2}
              y={8 - i * 2.4}
              width="2.6"
              height={3 + i * 2.4}
              rx="0.8"
              fill="currentColor"
              opacity={i === 3 ? 0.28 : 1}
            />
          ))}
        </svg>

        {/* wifi */}
        <svg width="14" height="11" viewBox="0 0 14 11" fill="none" aria-hidden>
          <path
            d="M7 9.4 5.2 7.3a2.8 2.8 0 0 1 3.6 0L7 9.4Z"
            fill="currentColor"
          />
          <path
            d="M3.5 5.4a5.4 5.4 0 0 1 7 0M1.2 3.1a8.8 8.8 0 0 1 11.6 0"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>

        {/* battery. the nub on the right is what sells it. */}
        <svg width="24" height="11" viewBox="0 0 24 11" fill="none" aria-hidden>
          <rect
            x="0.6"
            y="0.6"
            width="20"
            height="9.8"
            rx="2.6"
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="1.1"
          />
          <rect
            x="2.2"
            y="2.2"
            width="14.4"
            height="6.6"
            rx="1.4"
            fill={live ? "#00b140" : "currentColor"}
          />
          <path
            d="M22.4 3.9v3.2a1.7 1.7 0 0 0 0-3.2Z"
            fill="currentColor"
            fillOpacity="0.35"
          />
        </svg>
      </span>
    </div>
  );
}

/* The home indicator. Every modern phone has one, and its absence is felt
   even when it is not noticed. */
function HomeBar() {
  return (
    <div className="flex justify-center pb-2 pt-1">
      <span className="block h-[4px] w-[104px] rounded-full bg-ink/25" />
    </div>
  );
}

/*
  The caller.

  This was a mint circle with a "?" in it, which is why the phone read as a
  toy. A real unknown caller is a neutral silhouette on a grey field — the
  absence of a photo IS the information, and it should look like a contact
  card, not a cartoon.
*/
function Avatar({ pulse, label }: { pulse?: boolean; label?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative grid size-[92px] place-items-center">
      {pulse && !reduce && (
        <>
          <motion.span
            className="absolute inset-0 rounded-full border border-ink/15"
            animate={{ scale: [1, 1.55], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.span
            className="absolute inset-0 rounded-full border border-ink/15"
            animate={{ scale: [1, 1.55], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }}
          />
        </>
      )}

      <span
        className="grid size-[76px] place-items-center overflow-hidden rounded-full"
        style={{
          background: "linear-gradient(180deg, #e8e6e0, #d9d7d0)",
          boxShadow: "inset 0 1px 0 #ffffffcc, inset 0 -1px 2px #10140f1a",
        }}
      >
        {label ? (
          <span className="text-[26px] font-medium text-ink/55">{label}</span>
        ) : (
          /* the anonymous contact silhouette */
          <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden className="translate-y-[3px]">
            <circle cx="22" cy="15" r="7.4" fill="#10140f" fillOpacity="0.3" />
            <path
              d="M6.5 40c0-8.2 6.9-14.2 15.5-14.2S37.5 31.8 37.5 40Z"
              fill="#10140f"
              fillOpacity="0.3"
            />
          </svg>
        )}
      </span>
    </div>
  );
}

/* The two buttons every incoming call has. Their absence was most of why the
   screen read as a picture rather than a phone. */
function CallActions({ ringing }: { ringing?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex items-center justify-center gap-[52px] pb-3">
      <div className="flex flex-col items-center gap-1.5">
        <span
          className="grid size-[46px] place-items-center rounded-full text-white"
          style={{
            background: "linear-gradient(180deg, #e35745, #c8402f)",
            boxShadow: "0 4px 10px -3px #c8402f80, inset 0 1px 0 #ffffff59",
          }}
        >
          <PhoneDisconnect weight="fill" size={20} />
        </span>
        <span className="text-[8.5px] font-medium text-ink/35">Decline</span>
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <motion.span
          className="grid size-[46px] place-items-center rounded-full text-white"
          style={{
            background: "linear-gradient(180deg, #14c452, #00b140)",
            boxShadow: "0 4px 10px -3px #00b14080, inset 0 1px 0 #ffffff66",
          }}
          animate={reduce || !ringing ? undefined : { scale: [1, 1.07, 1] }}
          transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
        >
          <PhoneCall weight="fill" size={20} />
        </motion.span>
        <span className="text-[8.5px] font-medium text-ink/35">Accept</span>
      </div>
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

/* --------------------------------------------------------------- 00 ringing
   A real incoming call: caller high in the frame, actions at the thumb. The
   old version floated everything in the vertical centre of a white void, which
   is what made it read as an illustration of a phone. */
export function ScreenRinging() {
  return (
    <Frame>
      <Bar />

      <div className="flex flex-1 flex-col items-center px-6 pt-[13%] text-center">
        <Avatar pulse />
        <p className="mt-5 text-[19px] font-semibold tracking-tight">Unknown number</p>
        <p className="tnum mt-1 text-[12px] text-ink/40">+91 90XX XX 4471</p>
        <p className="mt-4 text-[11.5px] text-ink/35">Incoming call · mobile</p>
      </div>

      <p className="tnum pb-4 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-ink/25">
        the fourth today
      </p>
      <CallActions ringing />
      <HomeBar />
    </Frame>
  );
}

/* -------------------------------------------------------------- 01 answering
   The in-call screen. Live timer, the assistant's own bar, and the single red
   end-call button a real call has once it is connected. */
export function ScreenAnswering() {
  return (
    <Frame>
      <Bar live />

      <div className="flex flex-1 flex-col items-center px-6 pt-[13%] text-center">
        <Avatar />
        <p className="mt-5 text-[19px] font-semibold tracking-tight">Unknown number</p>

        <span className="mt-2 flex items-center gap-1.5">
          <span className="block size-1.5 rounded-full bg-green" />
          <span className="tnum text-[12px] text-ink/45">00:04</span>
        </span>

        <div className="mt-8 w-full">
          <Wave />
        </div>

        <span className="mt-7 rounded-full bg-green px-3.5 py-1.5 text-[10.5px] font-medium text-white">
          Equal is answering
        </span>
      </div>

      <div className="flex justify-center pb-3">
        <span
          className="grid size-[46px] place-items-center rounded-full text-white"
          style={{
            background: "linear-gradient(180deg, #e35745, #c8402f)",
            boxShadow: "0 4px 10px -3px #c8402f80, inset 0 1px 0 #ffffff59",
          }}
        >
          <PhoneDisconnect weight="fill" size={20} />
        </span>
      </div>
      <HomeBar />
    </Frame>
  );
}

/* A live-call header. Puts the transcript screens inside an actual call rather
   than floating them in a white rectangle. */
function CallHeader({ name, meta, initial }: { name: string; meta: string; initial?: string }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-ink/[0.07] px-4 pb-3 pt-3">
      <span
        className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-full"
        style={{
          background: "linear-gradient(180deg, #e8e6e0, #d9d7d0)",
          boxShadow: "inset 0 1px 0 #ffffffcc",
        }}
      >
        {initial ? (
          <span className="text-[13px] font-medium text-ink/55">{initial}</span>
        ) : (
          <svg width="20" height="20" viewBox="0 0 44 44" aria-hidden className="translate-y-[1px]">
            <circle cx="22" cy="15" r="7.4" fill="#10140f" fillOpacity="0.3" />
            <path d="M6.5 40c0-8.2 6.9-14.2 15.5-14.2S37.5 31.8 37.5 40Z" fill="#10140f" fillOpacity="0.3" />
          </svg>
        )}
      </span>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-[12.5px] font-semibold tracking-tight">{name}</p>
        <p className="flex items-center gap-1 text-[10px] text-ink/40">
          <span className="block size-1 rounded-full bg-green" />
          {meta}
        </p>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- 02 the scam */
export function ScreenScam() {
  return (
    <Frame>
      <Bar live />
      <CallHeader name="Unknown number" meta="Equal is on the call" />

      <div className="flex flex-1 flex-col justify-end gap-2 px-4 pb-3">
        <Bubble who="them">Sir, share the OTP to complete your KYC.</Bubble>
        <Bubble who="equal">I never share OTPs.</Bubble>
        <Bubble who="them">It is official. Just the six digits.</Bubble>
        <Bubble who="equal">Declined. Reporting this number.</Bubble>
      </div>

      <div className="px-4 pb-3">
        <Wave />
      </div>
      <HomeBar />
    </Frame>
  );
}

/* ---------------------------------------------------------------- 03 blocked */
export function ScreenBlocked() {
  const reduce = useReducedMotion();
  return (
    <Frame>
      <Bar />

      {/* the call is over — so this is a call-ended card, the way a phone
          actually reports one, not a floating badge on a blank screen */}
      <div className="flex flex-1 flex-col items-center px-6 pt-[15%] text-center">
        <motion.span
          initial={reduce ? false : { scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="grid size-[76px] place-items-center rounded-full text-alert"
          style={{
            background: "linear-gradient(180deg, #f7e4e1, #f0d5d1)",
            boxShadow: "inset 0 1px 0 #ffffffcc, inset 0 -1px 2px #c8402f1a",
          }}
        >
          <Prohibit weight="bold" size={30} />
        </motion.span>

        <p className="mt-5 text-[19px] font-semibold tracking-tight">Scam blocked</p>
        <p className="tnum mt-1 text-[12px] text-ink/40">+91 90XX XX 4471</p>

        <p className="mt-5 max-w-[24ch] text-[11.5px] leading-relaxed text-ink/45">
          Fake KYC call. Refused, ended, and reported to the cybercrime helpline.
        </p>

        <span className="mt-6 flex items-center gap-1.5 rounded-full bg-ink/[0.05] px-3 py-1.5 text-[10.5px] text-ink/50">
          <Check weight="bold" size={12} className="text-green" />
          Your phone never rang
        </span>
      </div>

      <HomeBar />
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
      <CallHeader name="Mom" meta="Saved contact" initial="M" />

      {/* She is HIS mother, not the assistant's. "आंटी" is how you address a
          stranger's mother — it is the one word that would make a gatekeeper
          sound like an outsider, in the one moment the page needs warmth. It
          says "जी" and hands her straight over. */}
      <div className="flex flex-1 flex-col justify-end gap-2 px-4 pb-3">
        <Bubble who="them" lang="hi">बेटा, रविवार को घर आना।</Bubble>
        <Bubble who="equal" lang="hi">जी, मैं उन्हें अभी बुला रहा हूँ।</Bubble>
      </div>

      <div className="px-4 pb-3">
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
      <HomeBar />
    </Frame>
  );
}
