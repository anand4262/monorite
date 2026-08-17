"use client";

import { useRef } from "react";
import { motion, useScroll, useMotionTemplate, useSpring, useTransform } from "framer-motion";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";

const lines = (
  <>
    Answer.
    <br />
    <span className="[-webkit-text-stroke:1.5px_currentColor] md:[-webkit-text-stroke:2px_currentColor]">
      Automate.
    </span>
    <br />
    Never sleep.
  </>
);

/**
 * An oversized "wordmark as graphic" statement — the giant display
 * typography treatment common across creative-agency sites, used here to
 * break up the page rhythm between the hero and the services grid.
 *
 * The words fill in with a white-to-purple-to-mint gradient as the section
 * scrolls through view: a dim base layer sits underneath a gradient-clipped
 * copy that's revealed left-to-right via clip-path, driven by scroll
 * progress rather than a fixed timer. The white leading edge gives the
 * sweep a bright "comet trail" flash before it settles into color.
 * "Automate." keeps its permanent outline treatment either way, since the
 * gradient layer only paints where the base layer is solid.
 */
export default function BigStatement() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.35"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.5 });
  // Maps scroll progress (0 -> 1) to the right-side clip-path inset: 100%
  // (fully hidden) shrinking to 0% (fully revealed) as the section scrolls
  // through view, producing a left-to-right fill.
  const revealRight = useTransform(progress, [0, 1], [100, 0]);
  const clipPath = useMotionTemplate`inset(0 ${revealRight}% 0 0)`;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-y border-canvas-border py-20 md:py-28"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/2 h-[32rem] w-[32rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.2),transparent_65%)] blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(63,232,184,0.16),transparent_65%)] blur-3xl"
        animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <Container className="relative">
        <Reveal>
          <div className="relative">
            <p className="text-balance font-display text-display-2xl font-semibold uppercase leading-[0.92] text-ink/15">
              {lines}
            </p>
            <motion.p
              aria-hidden="true"
              style={{ clipPath }}
              className="absolute inset-0 text-balance bg-gradient-to-r from-ink via-accent-soft to-mint bg-clip-text font-display text-display-2xl font-semibold uppercase leading-[0.92] text-transparent"
            >
              {lines}
            </motion.p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-10 max-w-md font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
            Call assistants — process automation — custom software —
            systems integration — AI business solutions
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
