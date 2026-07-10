"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { Logo } from "./Logo";
import { EASE, SPRING } from "../lib/motion";

const LINKS = [
  { label: "Privacy", id: "privacy" },
  { label: "Product", id: "product" },
  { label: "Languages", id: "languages" },
  { label: "Pricing", id: "pricing" },
];

export function Nav() {
  const { scrollY } = useScroll();
  const [lifted, setLifted] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useMotionValueEvent(scrollY, "change", (v) => setLifted(v > 40));

  // scroll-spy
  useEffect(() => {
    const els = LINKS.map((l) => document.getElementById(l.id)).filter(
      (e): e is HTMLElement => Boolean(e),
    );
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (best) setActive(best.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.3, 0.6] },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

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
        <a href="#top" className="flex items-center pl-1 text-green" aria-label="Equal, home">
          <Logo className="h-[19px] w-auto" />
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const on = active === l.id;
            return (
              <a
                key={l.id}
                href={`#${l.id}`}
                aria-current={on ? "true" : undefined}
                className={`relative rounded-full px-3.5 py-2 text-[14px] transition-colors duration-300 ${
                  on ? "text-ink" : "text-ink/55 hover:text-ink"
                }`}
              >
                {l.label}
                {on && (
                  <motion.span
                    layoutId="nav-dot"
                    transition={SPRING}
                    className="absolute inset-x-4 -bottom-0.5 h-[2px] rounded-full bg-green"
                  />
                )}
              </a>
            );
          })}
        </div>

        <a
          href="#waitlist"
          className="hidden rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-canvas transition-colors duration-300 hover:bg-green md:block"
        >
          Request an invite
        </a>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
          className="grid size-9 place-items-center rounded-full text-ink md:hidden"
        >
          {open ? <X size={20} /> : <List size={20} />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="frost hairline lift absolute inset-x-4 top-[68px] flex flex-col gap-1 rounded-3xl p-3 md:hidden"
        >
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-ink/70 hover:bg-tint hover:text-ink"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#waitlist"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-2xl bg-ink px-4 py-3 text-center font-medium text-canvas"
          >
            Request an invite
          </a>
        </motion.div>
      )}
    </motion.header>
  );
}
