"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { Reveal, Eyebrow } from "./primitives";
import { EASE } from "../lib/motion";

/*
  One call, in whichever language the caller speaks. Every string is tagged with
  a `lang` attribute so the Noto Sans script fonts load - DM Sans carries no
  Devanagari, Tamil, Telugu or Bengali glyphs at all.

  NOTE: Hindi and English are verified. Tamil, Telugu and Bengali are best-effort
  and should be read by a native speaker before this ships.
*/

type Turn = { who: "caller" | "equal"; text: string };
type Lang = { code: string; name: string; native: string; turns: Turn[] };

const LANGS: Lang[] = [
  {
    code: "en", name: "English", native: "English",
    turns: [
      { who: "caller", text: "Sir, I'm at your gate with a parcel. It's locked." },
      { who: "equal", text: "No problem. Leave it at reception, I'll let them know." },
      { who: "caller", text: "Okay. Share the OTP to confirm delivery?" },
      { who: "equal", text: "I won't share an OTP. Reception will confirm it for you." },
    ],
  },
  {
    code: "hi", name: "Hindi", native: "हिन्दी",
    turns: [
      { who: "caller", text: "सर, पार्सल लेकर गेट पर खड़ा हूँ। गेट बंद है।" },
      { who: "equal", text: "कोई बात नहीं। रिसेप्शन पर छोड़ दीजिए, मैं बता देता हूँ।" },
      { who: "caller", text: "ठीक है। डिलीवरी कन्फर्म करने के लिए OTP बता दीजिए?" },
      { who: "equal", text: "OTP शेयर नहीं करूँगा। रिसेप्शन से कन्फर्म हो जाएगा।" },
    ],
  },
  {
    code: "ta", name: "Tamil", native: "தமிழ்",
    turns: [
      { who: "caller", text: "சார், பார்சல் கொண்டு கேட்டில் நிற்கிறேன். கேட் பூட்டியிருக்கு." },
      { who: "equal", text: "பரவாயில்லை. ரிசெப்ஷனில் விட்டுவிடுங்கள், நான் சொல்லிடுகிறேன்." },
      { who: "caller", text: "சரி. டெலிவரி உறுதிசெய்ய OTP சொல்வீர்களா?" },
      { who: "equal", text: "OTP பகிர மாட்டேன். ரிசெப்ஷனில் உறுதிசெய்வார்கள்." },
    ],
  },
  {
    code: "te", name: "Telugu", native: "తెలుగు",
    turns: [
      { who: "caller", text: "సార్, పార్శిల్‌తో గేటు దగ్గర ఉన్నాను. గేటు మూసి ఉంది." },
      { who: "equal", text: "పర్వాలేదు. రిసెప్షన్‌లో ఇవ్వండి, నేను చెబుతాను." },
      { who: "caller", text: "సరే. డెలివరీ కన్ఫర్మ్ చేయడానికి OTP చెప్తారా?" },
      { who: "equal", text: "OTP షేర్ చేయను. రిసెప్షన్‌లో కన్ఫర్మ్ అవుతుంది." },
    ],
  },
  {
    code: "bn", name: "Bengali", native: "বাংলা",
    turns: [
      { who: "caller", text: "স্যার, পার্সেল নিয়ে গেটে দাঁড়িয়ে আছি। গেট বন্ধ।" },
      { who: "equal", text: "সমস্যা নেই। রিসেপশনে রেখে দিন, আমি জানিয়ে দিচ্ছি।" },
      { who: "caller", text: "ঠিক আছে। ডেলিভারি কনফার্ম করতে OTP বলবেন?" },
      { who: "equal", text: "OTP শেয়ার করব না। রিসেপশন থেকে কনফার্ম হবে।" },
    ],
  },
];

const MORE = ["Marathi", "Kannada", "Gujarati", "Punjabi", "Malayalam", "Odia"];

export function LanguagePlayground() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(1); // open on Hindi
  const [locked, setLocked] = useState(false);
  const lang = LANGS[i];

  useEffect(() => {
    if (reduce || locked) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % LANGS.length), 3600);
    return () => window.clearInterval(id);
  }, [reduce, locked]);

  return (
    <section id="languages" className="relative overflow-hidden bg-sand/50 py-16 md:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-2">
        <Reveal>
          <Eyebrow>Speaks India, natively</Eyebrow>
          <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.02]">
            Tap a language.
            <br />
            The whole call switches.
          </h2>
          <p className="mt-6 max-w-[44ch] text-[16px] leading-relaxed text-ink/60">
            No press-one-for-English. Equal answers in the language the caller
            speaks, and switches mid-sentence if they do.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {LANGS.map((l, idx) => {
              const on = idx === i;
              return (
                <button
                  key={l.code}
                  lang={l.code}
                  onClick={() => {
                    setI(idx);
                    setLocked(true);
                  }}
                  aria-pressed={on}
                  className={`rounded-full px-4 py-2 text-[13.5px] transition-all duration-300 ${
                    on
                      ? "bg-ink font-medium text-canvas"
                      : "hairline bg-paper text-ink/60 hover:border-green/40 hover:text-ink"
                  }`}
                >
                  {l.native}
                </button>
              );
            })}
          </div>

          <p className="mt-5 text-[13px] text-ink/40">
            and {MORE.length} more, including {MORE.slice(0, 3).join(", ")}.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-8 -z-10 rounded-[40px] blur-3xl"
              style={{ background: "radial-gradient(55% 55% at 50% 25%, rgba(0,177,64,0.16), transparent 70%)" }}
            />
            <div className="lift hairline rounded-[22px] bg-paper p-5">
              <div className="mb-4 flex items-center justify-between border-b border-ink/10 pb-3.5">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink/40">
                  Live transcript
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={lang.code}
                    lang={lang.code}
                    initial={reduce ? false : { opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -5 }}
                    transition={{ duration: 0.28, ease: EASE }}
                    className="rounded-full bg-tint px-3 py-1 text-[12px] font-medium text-green-deep"
                  >
                    {lang.native}
                  </motion.span>
                </AnimatePresence>
              </div>

              <div className="min-h-[264px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={lang.code}
                    initial={reduce ? false : { opacity: 0, filter: "blur(5px)", y: 8 }}
                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(5px)", y: -8 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="space-y-2.5"
                  >
                    {lang.turns.map((t, k) => (
                      <div key={k} className={`flex ${t.who === "equal" ? "justify-end" : "justify-start"}`}>
                        <div
                          lang={lang.code}
                          className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
                            t.who === "equal"
                              ? "rounded-br-md bg-green text-white"
                              : "hairline rounded-bl-md bg-sand text-ink/75"
                          }`}
                        >
                          {t.text}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
