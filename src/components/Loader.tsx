"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { LogoMark } from "./Logo";
import { EASE } from "../lib/motion";

/*
  The first moment. Runs on every load and every refresh.

  The counter is not theatre: it tracks real progress. It climbs on elapsed
  time but is capped at 92% until the browser actually fires `load`, so it can
  never claim to be finished before the page is. When load lands we read the
  true duration off the Navigation Timing API and show it.
*/

const MIN_MS = 1100; // never flash; give the mark a moment to breathe
const CAP = 0.92; // the counter waits here for the real `load` event

function navigationDuration(): number {
  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  if (nav && nav.loadEventEnd > 0) return nav.loadEventEnd;
  return performance.now();
}

export function Loader() {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);
  const [seconds, setSeconds] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const loadedRef = useRef(false);
  const rafRef = useRef(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const markLoaded = () => {
      if (loadedRef.current) return;
      loadedRef.current = true;
      setSeconds(navigationDuration() / 1000);
    };

    if (document.readyState === "complete") markLoaded();
    else window.addEventListener("load", markLoaded);

    const release = () => {
      document.body.style.overflow = "";
      setDone(true);
    };

    if (reduce) {
      markLoaded();
      setCount(100);
      const t = window.setTimeout(release, 260);
      return () => {
        window.clearTimeout(t);
        window.removeEventListener("load", markLoaded);
        document.body.style.overflow = "";
      };
    }

    const start = performance.now();
    let holdTimer = 0;

    const tick = (now: number) => {
      const elapsed = (now - start) / MIN_MS;
      const eased = 1 - Math.pow(1 - Math.min(elapsed, 1), 3);
      // never overtake reality: hold at CAP until `load` has fired
      const p = loadedRef.current ? eased : Math.min(eased, CAP);
      setCount(Math.round(p * 100));

      if (p >= 1) {
        holdTimer = window.setTimeout(release, 620); // let the time be read
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.clearTimeout(holdTimer);
      window.removeEventListener("load", markLoaded);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const settled = count >= 100 && seconds !== null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-canvas"
          exit={reduce ? { opacity: 0 } : { y: "-100%", transition: { duration: 0.9, ease: EASE } }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(45% 40% at 50% 50%, rgba(186,255,41,0.35), transparent 70%)" }}
          />

          <motion.div
            initial={reduce ? false : { scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative text-green"
          >
            <LogoMark className="h-11 w-auto" />
          </motion.div>

          {/* the bar only moves as fast as the page actually loads */}
          <div className="relative mt-9 h-px w-52 overflow-hidden bg-ink/10">
            <motion.div
              className="absolute inset-y-0 left-0 bg-green"
              animate={{ width: `${count}%` }}
              transition={{ duration: 0.2, ease: "linear" }}
            />
          </div>

          <div className="relative mt-4 flex w-52 items-baseline justify-between font-mono text-[11.5px]">
            <AnimatePresence mode="wait">
              {settled ? (
                <motion.span
                  key="ready"
                  initial={reduce ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="text-green-deep"
                >
                  ready
                </motion.span>
              ) : (
                <motion.span key="loading" exit={{ opacity: 0 }} className="text-ink/40">
                  loading
                </motion.span>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {settled ? (
                <motion.span
                  key="secs"
                  initial={reduce ? false : { opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="tnum text-ink/70"
                >
                  {seconds.toFixed(2)}s
                </motion.span>
              ) : (
                <motion.span key="pct" exit={{ opacity: 0 }} className="tnum text-ink/70">
                  {String(count).padStart(3, "0")}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
