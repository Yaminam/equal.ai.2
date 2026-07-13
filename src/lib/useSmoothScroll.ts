import { useEffect } from "react";
import Lenis from "lenis";

/*
  Smooth scroll.

  This is the highest-leverage change on the page and the least visible one.
  Native scroll on a minimal page feels like a document; inertial scroll feels
  like an object with mass. Same pixels, different price bracket.

  Lenis runs ON TOP of native scroll rather than hijacking it with a transform,
  so anchors, find-in-page, keyboard paging and screen readers all still work.
  That is why it is the one worth taking a dependency for.

  Two things it must not break:

  - `prefers-reduced-motion`. Inertia is motion. If the visitor asked for none,
    we never construct it and the browser scrolls natively.
  - `position: sticky`. Lenis does not touch it, but `scroll-behavior: smooth`
    in CSS fights Lenis's own rAF loop, so it is disabled while Lenis owns the
    scroll and restored on teardown.
*/
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    let frame = 0;
    const raf = (t: number) => {
      lenis.raf(t);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      root.style.scrollBehavior = previous;
    };
  }, []);
}
