"use client";

import { DeviceMobile, EarSlash, FingerprintSimple, Prohibit, ShieldCheck, TrashSimple } from "@phosphor-icons/react";
import { Reveal, Eyebrow, SpotlightCard } from "./primitives";

/*
  The wedge.
  Of every consumer competitor, only Google answers "is an AI listening to my
  calls?" - and Google's answer is locked to Pixel. Truecaller's assistant is
  cloud-based and it carries privacy baggage in India. So we say it first,
  plainly, and above the fold.

  NOTE FOR THE TEAM: these are product claims. Every line below has to be true
  of the shipped app before this section goes live.
*/

const PROMISES = [
  {
    icon: <EarSlash weight="regular" size={20} />,
    title: "No human ever listens",
    body: "Not us, not a contractor, not a reviewer. There is no queue of recordings for someone to grade.",
  },
  {
    icon: <DeviceMobile weight="regular" size={20} />,
    title: "It runs on your phone",
    body: "Screening happens on the device in your hand. The audio of your call is not uploaded to a server.",
  },
  {
    icon: <Prohibit weight="regular" size={20} />,
    title: "Your contacts stay yours",
    body: "Equal never uploads your address book, and never sells or shares your data. That is the whole model.",
  },
];

const MECHANICS = [
  { icon: <FingerprintSimple weight="regular" size={16} />, label: "Biometric lock to open the app" },
  { icon: <TrashSimple weight="regular" size={16} />, label: "One tap wipes every transcript" },
  { icon: <ShieldCheck weight="regular" size={16} />, label: "Compliant with the DPDP Act, 2023" },
];

export function PrivacyWedge() {
  return (
    <section id="privacy" className="relative bg-tint">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <Eyebrow>The part nobody else will say</Eyebrow>
            <h2 className="mt-5 max-w-[15ch] text-[clamp(2rem,4.4vw,3.4rem)] font-medium leading-[1.02]">
              An AI answers your phone. Nothing leaves it.
            </h2>
            <p className="mt-6 max-w-[42ch] text-[16px] leading-relaxed text-ink/60">
              It is a fair thing to be suspicious about. So here is the answer
              before you have to ask for it.
            </p>

            <ul className="mt-9 space-y-3">
              {MECHANICS.map((m) => (
                <li key={m.label} className="flex items-center gap-3 text-[14px] text-ink/70">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-paper text-green">
                    {m.icon}
                  </span>
                  {m.label}
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="grid gap-4">
            {PROMISES.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <SpotlightCard className="hairline rounded-card bg-paper p-7">
                  <div className="flex items-start gap-5">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-tint text-green">
                      {p.icon}
                    </span>
                    <div>
                      <h3 className="text-[19px] font-medium tracking-tight">{p.title}</h3>
                      <p className="mt-2 max-w-[46ch] text-[14.5px] leading-relaxed text-ink/55">
                        {p.body}
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
