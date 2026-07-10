"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle, CircleNotch } from "@phosphor-icons/react";
import { Reveal } from "./primitives";

type State = "idle" | "loading" | "success" | "error";

/*
  Retell's insight: asking for a phone number converts far better than an email,
  because the product IS the phone. We ask for the number, and we do not pretend
  to ring it. Front end only for now - wire `submit` to a real endpoint.
*/
export function Waitlist() {
  const reduce = useReducedMotion();
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      setState("error");
      setError("That should be a 10 digit Indian mobile number.");
      return;
    }
    setError("");
    setState("loading");
    window.setTimeout(() => setState("success"), 1100);
  }

  return (
    <section id="waitlist" className="relative overflow-hidden px-5 py-16 md:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-1/2 h-[380px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
          style={{ background: "radial-gradient(closest-side, rgba(186,255,41,0.45), transparent)" }}
        />
      </div>

      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <h2 className="text-[clamp(2.2rem,5vw,3.8rem)] font-medium leading-[1.02]">
            Get your evenings back.
          </h2>
          <p className="mx-auto mt-6 max-w-[44ch] text-[17px] leading-relaxed text-ink/60">
            Equal arrives on iOS this June. Leave your number and we will ring you
            when it is your turn, at the founding price.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 max-w-md">
            {state === "success" ? (
              <motion.div
                initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lift hairline flex items-center justify-center gap-3 rounded-full bg-paper px-6 py-4"
              >
                <CheckCircle weight="fill" size={20} className="text-green" />
                <span className="text-[15px] font-medium">
                  You are on the list. We will be in touch before launch.
                </span>
              </motion.div>
            ) : (
              <form onSubmit={submit} noValidate className="text-left">
                <label htmlFor="phone" className="mb-2 block pl-1 text-[13px] text-ink/45">
                  Mobile number
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div
                    className={`lift flex flex-1 items-center rounded-full bg-paper pl-5 transition-colors ${
                      state === "error" ? "ring-1 ring-alert/50" : "hairline"
                    }`}
                  >
                    <span className="tnum shrink-0 font-mono text-[15px] text-ink/40">+91</span>
                    <input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      placeholder="98XXX XXXXX"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (state === "error") setState("idle");
                      }}
                      aria-invalid={state === "error"}
                      className="tnum w-full bg-transparent px-3 py-3.5 text-[15px] outline-none placeholder:text-ink/30"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={state === "loading"}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[15px] font-medium text-canvas transition-all duration-300 hover:bg-green active:scale-[0.98] disabled:opacity-70"
                  >
                    {state === "loading" ? (
                      <>
                        <CircleNotch size={17} className="animate-spin" />
                        Joining
                      </>
                    ) : (
                      <>
                        Request an invite
                        <ArrowRight weight="bold" size={15} />
                      </>
                    )}
                  </button>
                </div>
                <p className={`mt-2.5 pl-1 text-[13px] ${error ? "text-alert" : "text-ink/40"}`}>
                  {error || "One message when it is your turn. Your number is never sold."}
                </p>
              </form>
            )}
          </div>
        </Reveal>

        {/* two paths, because the person who needs this most is often not you */}
        <Reveal delay={0.16}>
          <div className="mt-12 grid gap-4 text-left sm:grid-cols-2">
            <div className="hairline rounded-card bg-paper p-6">
              <h3 className="text-[17px] font-medium tracking-tight">For you</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink/55">
                Keep your number and your operator. Screening starts the moment you
                install it.
              </p>
              <a href="#product" className="mt-4 inline-block text-[14px] font-medium text-green hover:underline">
                See how it works
              </a>
            </div>

            <div className="rounded-card bg-lime p-6">
              <h3 className="text-[17px] font-medium tracking-tight text-ink">For your parents</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink/70">
                The people scammers call first. Equal refuses the OTP before they
                have a chance to be talked into it.
              </p>
              <a href="#privacy" className="mt-4 inline-block text-[14px] font-medium text-ink hover:underline">
                Read the privacy promise
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
