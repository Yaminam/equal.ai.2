"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  ArrowCounterClockwise,
  CheckCircle,
  Pause,
  Phone,
  PhoneX,
  Play,
} from "@phosphor-icons/react";
import { Reveal, Eyebrow } from "./primitives";
import { EASE } from "../lib/motion";

/*
  "See how Equal handles calls" - the original site's scenario player, rebuilt
  in the light system. Pick a caller, watch the call play out in real time on a
  phone, read the transcript beside it, and get the brief at the end.
*/

type Turn = { who: "caller" | "equal"; text: string; at: number };
type Scenario = {
  id: string;
  tab: string;
  caller: string;
  meta: string;
  initial: string;
  heading: string;
  sub: string;
  turns: Turn[];
  end: number;
  brief: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: "family",
    tab: "A family member",
    caller: "Mom",
    meta: "Saved contact",
    initial: "M",
    heading: "Some calls deserve your full warmth.",
    sub: "Watch Equal answer in Hindi, check your calendar, and plan Sunday lunch. The call plays as it would in real life.",
    turns: [
      { who: "caller", text: "Hello beta, Keshav hai?", at: 1 },
      { who: "equal", text: "Aunty namaste. Keshav abhi meeting mein hai. Aap kaisi hain?", at: 3.2 },
      { who: "caller", text: "Theek hoon. Bolna usse Sunday ko ghar aana hai. Khaana banaungi.", at: 6 },
      { who: "equal", text: "Zaroor aunty. Sunday shaam unke calendar mein free hai.", at: 9 },
      { who: "caller", text: "Uski pasand ka rajma chawal banaungi.", at: 12.2 },
      { who: "equal", text: "Main confirm bhej deta hoon. Dopahar theek rahega?", at: 14.6 },
      { who: "caller", text: "Haan bilkul theek hai beta.", at: 17.8 },
      { who: "equal", text: "Ho gaya. Sunday lunch calendar mein add kar diya. Apna khayaal rakhna.", at: 19.8 },
    ],
    end: 23.4,
    brief: "Mom called. Sunday lunch is on your calendar. She is making rajma chawal.",
  },
  {
    id: "pitcher",
    tab: "A pitcher",
    caller: "HDFC Card Sales",
    meta: "+91 22XX XX 1180",
    initial: "H",
    heading: "Some calls deserve a polite no.",
    sub: "Watch Equal hear the pitch, push back on the fee, and brief you with the verdict. The call plays as it would in real life.",
    turns: [
      { who: "caller", text: "Good afternoon, am I speaking with Keshav? This is Ritika from HDFC Card Sales.", at: 1 },
      { who: "equal", text: "You are speaking with his assistant. He is busy, but go ahead.", at: 3.6 },
      { who: "caller", text: "He is pre-approved for the Regalia card. Five percent cashback, lounge access.", at: 6.2 },
      { who: "equal", text: "Sounds good on paper. What is the annual fee, and is it waived?", at: 9.2 },
      { who: "caller", text: "It is 2,500 a year, but the rewards more than justify it.", at: 11.8 },
      { who: "equal", text: "He already holds a no-fee card with lounge access. Unless it is waived for life, this is not an upgrade.", at: 14.2 },
      { who: "caller", text: "I can only request a first year waiver.", at: 17.6 },
      { who: "equal", text: "Then it is a polite no. Send the lifetime offer by SMS and I will put it in front of him.", at: 19.6 },
    ],
    end: 23,
    brief: "HDFC pitched the Regalia card. 2,500 fee, first year waiver only. Declined, asked for an SMS offer.",
  },
  {
    id: "stranger",
    tab: "A stranger",
    caller: "Unknown number",
    meta: "+91 90XX XX 4471",
    initial: "?",
    heading: "Some calls deserve a hard stop.",
    sub: "Watch Equal refuse an OTP, shut the scam down, and report the number. The call plays as it would in real life.",
    turns: [
      { who: "caller", text: "Hello, this is regarding your pending KYC. Please share the OTP to verify.", at: 1 },
      { who: "equal", text: "I handle this number. I never share OTPs, and I am flagging this as a likely scam.", at: 3.4 },
      { who: "caller", text: "No no, it is official. Just read out the six digits.", at: 6.4 },
      { who: "equal", text: "Declined. Reporting this number to the cybercrime helpline. Goodbye.", at: 8.8 },
    ],
    end: 12.2,
    brief: "A fake KYC scam. Refused, ended, and reported. Nothing was needed from you.",
  },
  {
    id: "client",
    tab: "A client",
    caller: "Ananya Rao",
    meta: "Saved contact",
    initial: "A",
    heading: "Some calls deserve a quick yes.",
    sub: "Watch Equal take the request, check the calendar, and lock the slot. The call plays as it would in real life.",
    turns: [
      { who: "caller", text: "Hi, is Keshav free to move our review to tomorrow morning?", at: 1 },
      { who: "equal", text: "Hi Ananya, I look after his calendar. Tomorrow 11 to 11:30 is open. Shall I lock it?", at: 3.4 },
      { who: "caller", text: "Perfect, 11 works for me.", at: 6.6 },
      { who: "equal", text: "Done. I have moved the review to 11am and sent you both an invite.", at: 8.6 },
      { who: "caller", text: "Great, thank you.", at: 11.4 },
      { who: "equal", text: "Anytime. I will remind him an hour before.", at: 13 },
    ],
    end: 16.4,
    brief: "Ananya moved the review to 11am tomorrow. Invite sent, reminder set.",
  },
  {
    id: "courier",
    tab: "A courier",
    caller: "Delivery",
    meta: "+91 80XX XX 9032",
    initial: "D",
    heading: "Some calls just need sorting out.",
    sub: "Watch Equal handle a delivery in Hindi without giving up a thing. The call plays as it would in real life.",
    turns: [
      { who: "caller", text: "Sir, main aapka parcel lekar aaya hoon, lekin gate band hai.", at: 1 },
      { who: "equal", text: "Koi baat nahi. Ise reception par chhod dijiye, main unhe bata deta hoon.", at: 3.4 },
      { who: "caller", text: "Theek hai sir, aur OTP bata dijiye delivery confirm karne ke liye.", at: 6.4 },
      { who: "equal", text: "OTP share nahi karunga. Reception par chhodiye, wahin se confirm ho jayega.", at: 8.8 },
      { who: "caller", text: "Theek hai sir.", at: 11.8 },
      { who: "equal", text: "Dhanyavaad. Reception ko bol diya hai, wo receive kar lenge.", at: 13.2 },
    ],
    end: 16.6,
    brief: "Parcel left at reception. No OTP given. Nothing needed from you.",
  },
];

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function Wave({ on }: { on: boolean }) {
  const reduce = useReducedMotion();
  const bars = [0.4, 0.85, 1, 0.55, 0.9, 0.5, 0.75];
  return (
    <div className="flex h-5 items-center gap-[3px]" aria-hidden>
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-green"
          animate={reduce || !on ? { scaleY: 0.3 } : { scaleY: [0.3, h, 0.4, h * 0.7, 0.3] }}
          transition={{ duration: 1 + i * 0.06, repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }}
          style={{ height: 20, transformOrigin: "center" }}
        />
      ))}
    </div>
  );
}

export function CallStudio() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.3 });
  const scrollRef = useRef<HTMLDivElement>(null);

  const [activeId, setActiveId] = useState(SCENARIOS[0].id);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const elapsedRef = useRef(0);
  const raf = useRef(0);
  const started = useRef(false);

  const s = SCENARIOS.find((x) => x.id === activeId)!;
  const shown = s.turns.filter((t) => t.at <= elapsed);
  const done = elapsed >= s.end;

  useEffect(() => {
    if (inView && !started.current) {
      started.current = true;
      setPlaying(true);
    }
  }, [inView]);

  useEffect(() => {
    if (!playing) {
      cancelAnimationFrame(raf.current);
      return;
    }
    if (reduce) {
      elapsedRef.current = s.end;
      setElapsed(s.end);
      setPlaying(false);
      return;
    }
    const t0 = performance.now() - elapsedRef.current * 1000;
    const loop = (now: number) => {
      const e = (now - t0) / 1000;
      elapsedRef.current = e;
      setElapsed(e);
      if (e >= s.end) {
        setPlaying(false);
        return;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, activeId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [shown.length, done]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  function pick(id: string) {
    if (id === activeId) return;
    cancelAnimationFrame(raf.current);
    elapsedRef.current = 0;
    setElapsed(0);
    setActiveId(id);
    setPlaying(true);
  }
  function toggle() {
    if (done) {
      elapsedRef.current = 0;
      setElapsed(0);
    }
    setPlaying((p) => !p);
  }
  function reset() {
    cancelAnimationFrame(raf.current);
    elapsedRef.current = 0;
    setElapsed(0);
    setPlaying(false);
  }

  return (
    <section ref={sectionRef} id="demo" className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <Reveal className="text-center">
        <Eyebrow>See how Equal handles calls</Eyebrow>
      </Reveal>

      {/* who is calling */}
      <Reveal delay={0.05}>
        <div className="mt-8 flex justify-start gap-1.5 overflow-x-auto border-b border-ink/10 pb-0 [scrollbar-width:none] md:justify-center [&::-webkit-scrollbar]:hidden">
          {SCENARIOS.map((x) => {
            const on = x.id === activeId;
            return (
              <button
                key={x.id}
                onClick={() => pick(x.id)}
                className={`relative shrink-0 px-4 py-3 text-[13px] font-medium tracking-tight transition-colors duration-300 ${
                  on ? "text-ink" : "text-ink/40 hover:text-ink/70"
                }`}
              >
                <span
                  className={`mr-2 inline-block size-1.5 rounded-full align-middle ${
                    on ? "bg-green" : "bg-ink/15"
                  }`}
                />
                {x.tab}
                {on && (
                  <motion.span
                    layoutId="studio-tab"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-x-0 -bottom-px h-[2px] bg-green"
                  />
                )}
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* the scenario's own headline */}
      <div className="mt-12 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={s.id}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <h2 className="text-[clamp(1.9rem,4.2vw,3.1rem)] font-medium leading-[1.03]">
              {s.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-[52ch] text-[15.5px] leading-relaxed text-ink/55">
              {s.sub}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* phone + transcript */}
      <div className="mt-10 grid items-start gap-5 lg:grid-cols-[minmax(0,300px)_1fr]">
        <div className="relative mx-auto w-full max-w-[300px]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -inset-y-8 -z-10 rounded-[48px] blur-3xl"
            style={{ background: "radial-gradient(55% 50% at 50% 25%, rgba(186,255,41,0.4), transparent 70%)" }}
          />
          <div className="lift-lg hairline flex flex-col rounded-[36px] bg-paper p-2.5">
            <div className="flex flex-col rounded-[28px] bg-sand px-6 pb-6 pt-4">
              <div className="flex items-center justify-between text-[11px] font-medium text-ink/40">
                <span className="tnum font-mono">9:41</span>
                <span className="flex gap-1">
                  <span className="block size-1 rounded-full bg-ink/20" />
                  <span className="block size-1 rounded-full bg-ink/20" />
                  <span className={`block size-1 rounded-full ${playing ? "bg-green" : "bg-ink/20"}`} />
                </span>
              </div>

              <div className="mt-7 flex flex-col items-center text-center">
                <span className="tnum font-mono text-[11.5px] text-ink/40">
                  {playing ? `In progress ${fmt(elapsed)}` : done ? "Call ended" : "Ready"}
                </span>
                <p className="mt-1 text-[18px] font-medium">{s.caller}</p>
                <p className="tnum mt-0.5 font-mono text-[11px] text-ink/35">{s.meta}</p>

                <div className="relative mt-7 grid size-24 place-items-center">
                  {playing && !reduce && (
                    <motion.span
                      className="absolute inset-0 rounded-full border border-green/40"
                      animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                  <span className="grid size-20 place-items-center rounded-full bg-paper text-2xl font-medium text-green ring-1 ring-green/20">
                    {s.initial}
                  </span>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center gap-7">
                <button
                  onClick={reset}
                  aria-label="End call"
                  className="grid size-13 place-items-center rounded-full bg-alert/90 p-3.5 text-white transition-transform duration-300 hover:scale-105 active:scale-95"
                >
                  <PhoneX weight="fill" size={20} />
                </button>
                <button
                  onClick={toggle}
                  aria-label={playing ? "Pause" : "Play"}
                  className="grid size-13 place-items-center rounded-full bg-green p-3.5 text-white transition-transform duration-300 hover:scale-105 active:scale-95"
                >
                  {playing ? <Pause weight="fill" size={19} /> : <Phone weight="fill" size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* live transcript */}
        <div className="hairline flex min-h-[380px] flex-col overflow-hidden rounded-card bg-paper lg:min-h-[430px]">
          <div className="flex items-center justify-between border-b border-ink/10 px-5 py-3.5">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink/40">
              Live transcript
            </span>
            <div className="flex items-center gap-3">
              {playing && <Wave on />}
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-ink/50">
                <span className="relative flex size-1.5">
                  {playing && !reduce && (
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-green opacity-70" />
                  )}
                  <span className={`relative inline-flex size-1.5 rounded-full ${playing ? "bg-green" : "bg-ink/25"}`} />
                </span>
                {playing ? "Live" : done ? "Ended" : "Idle"}
              </span>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-sand/40 px-5 py-5">
            {shown.length === 0 && (
              <div className="flex h-full min-h-[280px] items-center justify-center text-[13px] text-ink/35">
                Press the green button to start the call.
              </div>
            )}

            {shown.map((t, i) => (
              <motion.div
                key={`${s.id}-${i}`}
                initial={reduce ? false : { opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: EASE }}
                className={`flex ${t.who === "equal" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-[14px] leading-snug ${
                    t.who === "equal"
                      ? "rounded-br-md bg-green text-white"
                      : "hairline rounded-bl-md bg-paper text-ink/80"
                  }`}
                >
                  {t.text}
                </div>
              </motion.div>
            ))}

            <AnimatePresence>
              {done && (
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="!mt-4 rounded-xl border border-green/25 bg-tint p-4"
                >
                  <div className="mb-1.5 flex items-center gap-2 text-green-deep">
                    <CheckCircle weight="fill" size={15} />
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]">
                      Your brief
                    </span>
                  </div>
                  <p className="text-[13.5px] leading-snug text-ink/70">{s.brief}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          onClick={toggle}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[15px] font-medium text-canvas transition-colors duration-300 hover:bg-green active:scale-[0.98]"
        >
          {playing ? <Pause weight="fill" size={14} /> : <Play weight="fill" size={14} />}
          {playing ? "Stop" : done ? "Play again" : "Play the call"}
        </button>
        <button
          onClick={reset}
          className="hairline inline-flex items-center gap-2 rounded-full bg-paper px-5 py-3 text-[15px] text-ink/60 transition-colors duration-300 hover:text-ink"
        >
          <ArrowCounterClockwise size={14} />
          Reset
        </button>
      </div>
    </section>
  );
}
