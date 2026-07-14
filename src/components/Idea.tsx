"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Matter from "matter-js";
import { EASE } from "../lib/motion";

/*
  The idea, in one picture: THE MACHINE, AND WHAT IT LEAVES BEHIND.

  A call arrives, alone, at the top. Equal answers it — a beam sweeps the card
  while it listens — and a verdict lands. Then the card DROPS, tumbles, and
  lands in a heap at the bottom. It stays there. The next call is already
  coming, and they come faster, and the heap grows all the while.

  Then Amma calls. The beam turns green. Her card does not fall. It rises, and
  it rings, and the light in the room moves from the heap up to her.

  ── IT ANSWERS. IT DOES NOT JUST BLOCK. ──────────────────────────────────────
  The scenarios are deliberately NOT all fraud. A courier gets told to leave the
  parcel with the guard. A recruiter gets a message taken. A bank actually gets
  a question back. If every card said "BLOCKED" this would be a spam filter with
  better lighting — and a spam filter is precisely what Equal is not. The variety
  IS the product: it is a gatekeeper, and a gatekeeper deals with people.

  ── TWO BUGS THAT KILLED THE FIRST BUILD, WRITTEN DOWN ───────────────────────

  1. THE ENGINE WAS TIED TO THE EFFECT THAT WATCHED THE VIEWPORT. When that
     effect re-ran, its cleanup set `engine.current = null` — and `drop()` then
     silently returned early WHILE THE COUNTER STILL INCREMENTED. The result was
     a counter reading "03" above a completely empty bin. A function that can
     fail silently while its side-effect succeeds is a trap; the world is now
     built once, lazily, and torn down only on unmount.

  2. THE LOOP COULD DIE WITHOUT SAYING SO. An exception inside the async
     sequence just stops it, and the section freezes on whatever frame it was
     on. It is now wrapped so a failure is loud rather than invisible.

  ── THE ONE NUMBER THAT DECIDES EVERYTHING ───────────────────────────────────
  RESTITUTION. Default bounce is what makes every physics page look like an
  agency toy. Near-zero restitution, high friction: the cards land like PAPER,
  not rubber. Gravity is heavy so they fall FAST — a card that floats down
  gently reads as weightless, and the whole argument is that this has weight.
*/

type Call = { who: string; heard: string; verdict: string; short: string; lang?: string };

/*
  IT NEVER ENDS. That is the truest thing about it.

  There is no queue of ten and then a tidy finish, because your phone does not
  work like that. Calls keep arriving for as long as you are watching, and they
  will keep arriving after you leave. The heap fills from the top and quietly
  drains out of the bottom, forever.

  Only three of these are outright fraud. The rest are the ordinary tax of owning
  a phone number in India, and Equal deals with each of them differently — the
  courier is told where to leave the parcel, the recruiter has a message taken.
  If every card said BLOCKED this would be a spam filter with better lighting,
  and a spam filter is exactly what Equal is not.
*/
const NOISE: Call[] = [
  { who: "+91 90XX XX 4471", heard: "Sir, KYC update karna hai…", verdict: "Fraud · refused", short: "Refused" },
  { who: "Unknown number", heard: "Pre-approved loan at 10.5%…", verdict: "Loan offer · declined", short: "Declined" },
  { who: "Delivery · Blue Dart", heard: "Gate band hai, parcel kahan chhodun?", verdict: "Told him: leave it with the guard", short: "Handled" },
  { who: "+91 22XX XX 8807", heard: "Sir, ek OTP aaya hoga…", verdict: "OTP fraud · reported", short: "Reported" },
  { who: "Unknown number", heard: "Two minutes of your time, sir…", verdict: "Telemarketing · ended", short: "Ended" },
  { who: "Recruiter · unknown", heard: "Are you open to a new role?", verdict: "Message taken. Told you later.", short: "Noted" },
  { who: "Congratulations!", heard: "You have won a lucky draw…", verdict: "Prize scam · refused", short: "Refused" },
  { who: "+91 11XX XX 2264", heard: "Your Aadhaar will be blocked…", verdict: "Phishing · reported", short: "Reported" },
  { who: "Insurance renewal", heard: "Policy expiring this week…", verdict: "Not interested · ended", short: "Ended" },
  { who: "Unknown number", heard: "Am I speaking with the card holder?", verdict: "Refused to confirm · ended", short: "Refused" },
  { who: "+91 80XX XX 9032", heard: "Sir, ek minute, scheme ke baare mein…", verdict: "Telemarketing · ended", short: "Ended" },
  { who: "Credit card offer", heard: "Lifetime free card, sir, no charges…", verdict: "Declined · do not call", short: "Declined" },
  { who: "Survey call", heard: "Just five questions about your area…", verdict: "Declined · ended", short: "Declined" },
  { who: "+91 70XX XX 5528", heard: "Your electricity will be cut tonight…", verdict: "Fraud · reported", short: "Reported" },
  { who: "Property broker", heard: "2BHK in your budget, sir, ready to move…", verdict: "Not interested · ended", short: "Ended" },
  { who: "Unknown number", heard: "…", verdict: "Silent call · ended", short: "Ended" },
];

/*
  The ones it lets through. They are rare, and they are the only reason the
  product exists. This is why "rang you" is a counter and not a trophy: it keeps
  climbing too, just far more slowly, and that ratio IS the pitch.
*/
const REAL: Call[] = [
  { who: "Amma", heard: "बेटा, रविवार को घर आना।", verdict: "Passed to you", short: "Rang you", lang: "hi" },
  { who: "Dr. Rao · clinic", heard: "Your father's reports are ready.", verdict: "Passed to you", short: "Rang you" },
  { who: "Papa", heard: "Beta, ek minute baat karni thi.", verdict: "Passed to you", short: "Rang you" },
  { who: "Aarav's school", heard: "Could you come in at four?", verdict: "Passed to you", short: "Rang you" },
];

type Phase = "in" | "listen" | "verdict" | "drop";

const H = 480;
const SCAN_Y = 104;

/** how many dead calls the bin holds before the oldest start falling out of it */
const BIN_CAP = 11;

/** one real caller gets through roughly every seventh call */
const REAL_EVERY = 7;

/*
  It settles into a rhythm and stays there.

  The first few calls get a beat, so you can read what is happening. After that
  it locks into a machine cadence — fast, unhurried, relentless. The rhythm is
  the argument: THIS NEVER STOPS, and you never hear any of it.
*/
const pace = (i: number) => {
  const warm = Math.min(1, i / 4); // 0 → 1 over the first four calls
  return {
    in: 280 - warm * 90,
    listen: 660 - warm * 240,
    verdict: 420 - warm * 150,
  };
};

export function Idea() {
  const reduce = useReducedMotion();
  const host = useRef<HTMLDivElement>(null);
  const bin = useRef<HTMLDivElement>(null);

  const [on, setOn] = useState(false);
  const [call, setCall] = useState<Call | null>(null);
  const [phase, setPhase] = useState<Phase>("in");
  const [count, setCount] = useState(0);   // handled — climbs forever
  const [rang, setRang] = useState(0);     // rang you — climbs too, far more slowly
  const [mom, setMom] = useState(false);
  const [ringing, setRinging] = useState(false);
  const seq = useRef(0);                    // key: forces a fresh card each time

  /* The solver lives outside React entirely. It is a machine, not state — and
     critically, its lifetime is the COMPONENT's, not any effect's. */
  const world = useRef<{
    engine: Matter.Engine;
    pairs: { body: Matter.Body; node: HTMLDivElement }[];
    raf: number;
  } | null>(null);

  useEffect(() => {
    const el = host.current;
    if (!el || reduce) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: "-8% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  /* Build the world once, and only tear it down when the component goes away. */
  useEffect(() => {
    if (reduce) return;
    const el = host.current;
    if (!el || world.current) return;

    const W = el.clientWidth;
    const engine = Matter.Engine.create();
    engine.gravity.y = 1.5; // heavy. a card that floats down reads as weightless.

    const wall = (x: number, y: number, w: number, h: number) =>
      Matter.Bodies.rectangle(x, y, w, h, { isStatic: true, friction: 0.9 });

    const PAD = 24; // matches the visible bin (px-6)
    Matter.Composite.add(engine.world, [
      wall(W / 2, H + 26, W * 2, 52),           // floor
      wall(PAD - 26, H / 2, 52, H * 3),         // left wall, ON the drawn line
      wall(W - PAD + 26, H / 2, 52, H * 3),     // right wall, ON the drawn line
    ]);

    const finger = Matter.Bodies.circle(-900, -900, 30, { isStatic: true });
    Matter.Composite.add(engine.world, finger);
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      Matter.Body.setPosition(finger, { x: e.clientX - r.left, y: e.clientY - r.top });
    };
    const leave = () => Matter.Body.setPosition(finger, { x: -900, y: -900 });
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);

    const w = { engine, pairs: [] as { body: Matter.Body; node: HTMLDivElement }[], raf: 0 };
    world.current = w;

    let last = performance.now();
    const tick = (now: number) => {
      Matter.Engine.update(engine, Math.min(now - last, 32));
      last = now;
      for (const { body, node } of w.pairs) {
        node.style.transform = `translate(${body.position.x - node.offsetWidth / 2}px, ${
          body.position.y - node.offsetHeight / 2
        }px) rotate(${body.angle}rad)`;
      }
      w.raf = requestAnimationFrame(tick);
    };
    w.raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(w.raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      w.pairs.forEach(({ node }) => node.remove());
      Matter.Composite.clear(engine.world, false);
      Matter.Engine.clear(engine);
      world.current = null;
    };
  }, [reduce]);

  /* The sequence. */
  useEffect(() => {
    if (reduce) {
      setCall(REAL[0]);
      setMom(true);
      setRinging(true);
      setCount(46);
      setRang(3);
      return;
    }
    if (!on) return;

    let alive = true;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((r) => {
        timers.push(window.setTimeout(r, ms));
      });

    /** hand a finished card to the solver, at the spot it was answered */
    const drop = (c: Call) => {
      const w = world.current;
      const el = host.current;
      const b = bin.current;
      // NEVER count a call we failed to actually drop. That mismatch is what
      // produced a counter reading "03" over an empty bin.
      if (!w || !el || !b) return false;

      const node = document.createElement("div");
      node.style.cssText = `
        position:absolute;left:0;top:0;display:flex;align-items:center;gap:8px;
        white-space:nowrap;border-radius:12px;padding:7px 11px;will-change:transform;
        background:rgba(250,249,246,0.05);
        box-shadow:0 0 0 1px rgba(250,249,246,0.10), inset 0 1px 0 rgba(255,255,255,0.08), 0 12px 26px -14px rgba(0,0,0,0.9);
        backdrop-filter:blur(6px);`;
      node.innerHTML = `
        <span style="width:6px;height:6px;border-radius:9999px;background:rgba(250,249,246,0.2);flex:none"></span>
        <span style="font-size:11.5px;color:rgba(250,249,246,0.55)">${c.who}</span>
        <span style="font-family:'Geist Mono Variable',monospace;font-size:8.5px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(250,249,246,0.22)">${c.short}</span>`;
      b.appendChild(node);

      const body = Matter.Bodies.rectangle(
        el.clientWidth / 2 + (Math.random() - 0.5) * (el.clientWidth * 0.72), // WIDE: a heap lies on the floor, a tower stands on it
        SCAN_Y + 40,
        node.offsetWidth,
        node.offsetHeight,
        {
          restitution: 0.04, // ← no bounce. lands like paper.
          friction: 0.82,
          frictionAir: 0.012,
          angle: (Math.random() - 0.5) * 0.22,
          chamfer: { radius: 8 },
        },
      );
      Matter.Body.setVelocity(body, { x: (Math.random() - 0.5) * 1.6, y: 6 });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.09);
      Matter.Composite.add(w.engine.world, body);
      w.pairs.push({ body, node });
      return true;
    };

    /*
      THE BIN DRAINS FROM THE BOTTOM.

      An endless stream needs an endless bin, and there is no such thing. So once
      the heap reaches its cap, the oldest card at the bottom stops colliding with
      anything and simply falls through the floor, fading as it goes — and the
      pile above it settles down into the space.

      It reads as a bin being quietly emptied while it is being filled, which is
      exactly what is happening to your phone, forever. And it means the section
      can run for an hour without leaking a single body.
    */
    const drain = () => {
      const w = world.current;
      if (!w || w.pairs.length <= BIN_CAP) return;
      const oldest = w.pairs.shift();
      if (!oldest) return;
      // stop colliding: it drops out of the world through everything below it
      oldest.body.collisionFilter.mask = 0;
      oldest.node.style.transition = "opacity 520ms linear";
      oldest.node.style.opacity = "0";
      timers.push(
        window.setTimeout(() => {
          Matter.Composite.remove(w.engine.world, oldest.body);
          oldest.node.remove();
        }, 560),
      );
    };

    (async () => {
      try {
        let i = 0; // it never resets. that is the point.

        for (;;) {
          const isReal = i > 0 && i % REAL_EVERY === 0;
          const c = isReal
            ? REAL[Math.floor(i / REAL_EVERY - 1) % REAL.length]
            : NOISE[i % NOISE.length];

          const t = pace(i);
          seq.current += 1;
          setCall(c);
          setMom(isReal);
          setRinging(false);
          setPhase("in");
          await wait(t.in);
          if (!alive) return;

          setPhase("listen");
          await wait(isReal ? t.listen + 260 : t.listen);
          if (!alive) return;

          setPhase("verdict");
          await wait(t.verdict);
          if (!alive) return;

          if (isReal) {
            // she is not discarded. she rings, and you pick up.
            setRinging(true);
            setRang((r) => r + 1);
            await wait(2600);
            if (!alive) return;
            setPhase("drop"); // she leaves upward — handled in the animation
            await wait(420);
            if (!alive) return;
          } else {
            setPhase("drop");
            if (drop(c)) {
              setCount((n) => n + 1);
              drain();
            }
            await wait(150);
            if (!alive) return;
          }

          i += 1;
        }
      } catch (err) {
        // a silent death here freezes the section on one frame forever
        console.error("[Idea] sequence stopped:", err);
      }
    })();

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, [on, reduce]);

  const listening = phase === "listen";
  const verdict = phase === "verdict" || (mom && ringing);
  const dropping = phase === "drop" && !mom;
  const leaving = phase === "drop" && mom;

  return (
    <section className="relative overflow-hidden bg-ink py-24 text-canvas md:py-28">
      {/* the only light in the room. it sits over the bin — until she calls, and
          then it moves to her. that move IS the argument. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 size-[46rem] -translate-x-1/2 rounded-full blur-[150px]"
        animate={{
          top: ringing ? "5%" : "50%",
          background: ringing
            ? "radial-gradient(closest-side, rgba(0,177,64,0.34), transparent)"
            : "radial-gradient(closest-side, rgba(186,255,41,0.09), transparent)",
        }}
        transition={{ duration: 1.5, ease: EASE }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9 }}
          className="mb-8 font-mono text-[11px] uppercase tracking-[0.24em] text-canvas/30"
        >
          The idea
        </motion.p>

        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1, ease: EASE }}
            className="max-w-[15ch] text-[clamp(2.1rem,5vw,4.2rem)] font-medium leading-[1.02]"
          >
            Only one of these <span className="text-green">gets through</span>.
          </motion.h2>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
            className="max-w-[26ch] text-pretty text-[16.5px] leading-relaxed text-canvas/45 md:pb-2"
          >
            Equal picks up, listens, decides, and moves on. Push the heap. It has
            weight, because it did.
          </motion.p>
        </div>
      </div>

      {/* THE MACHINE */}
      <div
        ref={host}
        className="relative mx-auto mt-14 w-full max-w-[880px] px-6"
        style={{ height: H, perspective: 1200, perspectiveOrigin: "50% 20%" }}
      >
        {/* HUD */}
        <div className="pointer-events-none absolute left-6 top-0 z-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-canvas/30">handled</p>
          <p className="tnum mt-1 font-mono text-[32px] leading-none text-lime">
            {String(count).padStart(2, "0")}
          </p>
        </div>
        <div className="pointer-events-none absolute right-6 top-0 z-20 text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-canvas/30">rang you</p>
          <p
            className={`tnum mt-1 font-mono text-[32px] leading-none transition-colors duration-500 ${
              ringing ? "text-green" : rang > 0 ? "text-green/60" : "text-canvas/15"
            }`}
          >
            {String(rang).padStart(2, "0")}
          </p>
        </div>

        {/* the call being answered */}
        <div
          className="pointer-events-none absolute inset-x-6 z-10"
          style={{ top: SCAN_Y - 44, transformStyle: "preserve-3d" }}
        >
          <AnimatePresence mode="wait">
            {call && (
              <motion.div
                key={seq.current}
                initial={reduce ? false : { opacity: 0, y: -54, rotateX: -18, scale: 0.94, filter: "blur(6px)" }}
                animate={
                  leaving
                    ? // accepted: she rises out of the frame, she does not fall in
                      { opacity: 0, y: -80, rotateX: 0, scale: 1.02, filter: "blur(3px)" }
                    : dropping
                    ? { opacity: 0, y: 30, rotateX: 42, scale: 0.88, filter: "blur(2px)" }
                    : ringing
                      ? { opacity: 1, y: -28, rotateX: 0, scale: 1.05, filter: "blur(0px)" }
                      : { opacity: 1, y: 0, rotateX: 0, scale: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } }
                }
                exit={{ opacity: 0 }}
                transition={{ duration: dropping ? 0.13 : leaving ? 0.42 : 0.34, ease: EASE }}
                style={{ transformOrigin: "50% 100%" }}
                className="relative mx-auto w-full max-w-[520px]"
              >
                <div
                  className="relative overflow-hidden rounded-2xl px-5 py-4"
                  style={
                    mom
                      ? {
                          background: "linear-gradient(180deg, rgba(0,177,64,0.22), rgba(0,177,64,0.10))",
                          boxShadow:
                            "0 0 0 1px rgba(0,177,64,0.55), inset 0 1px 0 rgba(255,255,255,0.16), 0 30px 64px -20px rgba(0,177,64,0.65)",
                        }
                      : {
                          background: "rgba(250,249,246,0.055)",
                          boxShadow:
                            "0 0 0 1px rgba(250,249,246,0.13), inset 0 1px 0 rgba(255,255,255,0.10), 0 26px 54px -26px rgba(0,0,0,0.9)",
                          backdropFilter: "blur(8px)",
                        }
                  }
                >
                  {/* the beam. Equal is listening. */}
                  {listening && !reduce && (
                    <motion.div
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 w-28"
                      initial={{ x: "-40%" }}
                      animate={{ x: "540%" }}
                      transition={{ duration: 0.7, ease: "linear", repeat: Infinity }}
                      style={{
                        background: mom
                          ? "linear-gradient(90deg, transparent, rgba(0,177,64,0.4), transparent)"
                          : "linear-gradient(90deg, transparent, rgba(186,255,41,0.22), transparent)",
                      }}
                    />
                  )}

                  <div className="relative flex items-center gap-3.5">
                    <span
                      className="grid size-10 shrink-0 place-items-center rounded-full"
                      style={{
                        background: mom
                          ? "linear-gradient(180deg, #17c956, #00b140)"
                          : "rgba(250,249,246,0.08)",
                        boxShadow: mom
                          ? "inset 0 1px 0 rgba(255,255,255,0.45)"
                          : "inset 0 1px 0 rgba(255,255,255,0.08)",
                      }}
                    >
                      {mom ? (
                        <span className="text-[14px] font-bold text-white">A</span>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 44 44" aria-hidden className="translate-y-[1px]">
                          <circle cx="22" cy="15" r="7.4" fill="#faf9f6" fillOpacity="0.4" />
                          <path d="M6.5 40c0-8.2 6.9-14.2 15.5-14.2S37.5 31.8 37.5 40Z" fill="#faf9f6" fillOpacity="0.4" />
                        </svg>
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-semibold tracking-tight">{call.who}</p>

                      {/* what the caller actually said. this is the part nobody
                          else can show, because nobody else picks up. */}
                      <div className="mt-1.5 h-[17px]">
                        {(phase === "in" || listening) && (
                          <motion.p
                            initial={reduce ? false : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                            lang={mom ? "hi" : undefined}
                            className="truncate text-[12px] italic text-canvas/40"
                          >
                            &ldquo;{call.heard}&rdquo;
                          </motion.p>
                        )}
                        {verdict && (
                          <motion.p
                            initial={reduce ? false : { opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`truncate font-mono text-[10px] uppercase tracking-[0.18em] ${
                              mom ? "text-green" : "text-canvas/35"
                            }`}
                          >
                            {call.verdict}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    {listening && !reduce && (
                      <span className="flex shrink-0 items-end gap-[3px]">
                        {[0, 1, 2, 3].map((d) => (
                          <motion.span
                            key={d}
                            className="block w-[3px] rounded-full bg-lime"
                            animate={{ height: [5, 16, 7, 13, 5] }}
                            transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.11 }}
                          />
                        ))}
                      </span>
                    )}

                    {/* she rings. nothing else ever does. */}
                    {mom && ringing && !reduce && (
                      <span className="relative grid size-9 shrink-0 place-items-center">
                        {[0, 1].map((r) => (
                          <motion.span
                            key={r}
                            className="absolute inset-0 rounded-full border border-green"
                            animate={{ scale: [1, 1.9], opacity: [0.75, 0] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut", delay: r * 0.8 }}
                          />
                        ))}
                        <span className="block size-2 rounded-full bg-green" />
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* THE BIN. the solver writes straight into this node. */}
        <div ref={bin} className="pointer-events-none absolute inset-0" aria-hidden />

        <div aria-hidden className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-canvas/20" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 left-6 h-28 w-px bg-gradient-to-t from-canvas/20 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 right-6 h-28 w-px bg-gradient-to-t from-canvas/20 to-transparent" />
      </div>

      <div className="relative mx-auto mt-6 max-w-6xl px-6">
        <p className="text-center font-mono text-[9.5px] uppercase tracking-[0.26em] text-canvas/25">
          {ringing ? "this one, it put through to you" : "answered · decided · set down"}
        </p>
      </div>
    </section>
  );
}
