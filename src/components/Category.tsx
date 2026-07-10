"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "../lib/motion";

/*
  The category, defined by negation.

  Granola's sharpest line is not what it does, it is what it removes: "without a
  meeting bot." Nobody had to explain the category after reading it.

  Equal has an incumbent that owns the words "unknown call" in India, and that
  incumbent reads as spam-adjacent. We never name it — premium brands assert,
  they do not comparison-table. We simply strike out what Equal is not, and let
  the last line stand.

  Eleven words. The strike-throughs draw themselves as you arrive.
*/

const NOT = ["Not a caller ID.", "Not a block list."];

export function Category() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-28 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9 }}
          className="mb-12 font-mono text-[11px] uppercase tracking-[0.24em] text-ink/30"
        >
          The category
        </motion.p>

        <div className="text-[clamp(1.9rem,5vw,4.2rem)] font-medium leading-[1.12] tracking-[-0.03em]">
          {NOT.map((line, i) => (
            <motion.p
              key={line}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.12 }}
              className="relative block w-fit text-ink/25"
            >
              {line}
              {/* the line is struck as you read it */}
              <motion.span
                aria-hidden
                initial={reduce ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.45 + i * 0.12 }}
                style={{ originX: 0 }}
                className="absolute inset-x-0 top-1/2 block h-[2px] bg-ink/25"
              />
            </motion.p>
          ))}

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.85 }}
            className="mt-3"
          >
            An assistant that <span className="text-green">answers</span>.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
