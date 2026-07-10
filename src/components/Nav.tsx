"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { Logo } from "./Logo";
import { EASE } from "../lib/motion";

/*
  A mark and one button. Nav links are a table of contents, and a story does
  not need one.
*/
export function Nav() {
  const { scrollY } = useScroll();
  const [lifted, setLifted] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setLifted(v > 40));

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3"
    >
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 ${
          lifted ? "frost hairline lift" : "border border-transparent"
        }`}
      >
        <a
          href="#top"
          className="flex min-h-[44px] items-center pl-1 pr-3 text-green"
          aria-label="Equal, home"
        >
          <Logo className="h-[19px] w-auto" />
        </a>

        <a
          href="#invite"
          className="inline-flex min-h-[44px] items-center rounded-full bg-ink px-5 text-[14px] font-medium text-canvas transition-colors duration-300 hover:bg-green"
        >
          Get the app
        </a>
      </nav>
    </motion.header>
  );
}
