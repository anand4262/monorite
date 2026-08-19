"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { process } from "@/data/process";
import type { ProcessStep } from "@/types";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

/**
 * One row of the timeline. Hooks that depend on the shared scroll-progress
 * motion value live here (its own component, called once per step from a
 * map in the parent) rather than inside the parent's .map() callback
 * directly — calling useTransform inside a loop body breaks the Rules of
 * Hooks, even though the array length here happens to be fixed.
 */
function TimelineStep({
  step,
  index,
  total,
  isLast,
  progress,
}: {
  step: ProcessStep;
  index: number;
  total: number;
  isLast: boolean;
  progress: MotionValue<number>;
}) {
  // Where along the overall scroll progress (0-1) this step's node sits on
  // the line, so its activation animation is pinned to the moment the
  // drawing line/marker physically reaches it.
  const threshold = index / Math.max(total - 1, 1);
  const activation = useTransform(progress, [Math.max(threshold - 0.14, 0), threshold], [0, 1]);
  const nodeScale = useTransform(
    progress,
    [Math.max(threshold - 0.14, 0), threshold, Math.min(threshold + 0.08, 1)],
    [0.8, 1.25, 1],
  );
  const titleOpacity = useTransform(progress, [Math.max(threshold - 0.18, 0), threshold], [0.4, 1]);

  return (
    <div className={isLast ? "" : "border-b border-canvas-border"}>
      <Reveal blurIn delay={index * 0.08}>
        <div className="group flex gap-4 rounded-2xl py-10 transition-colors duration-500 ease-premium md:grid md:grid-cols-[3.5rem_1fr_1fr] md:items-center md:gap-10 md:py-14 md:hover:-mx-6 md:hover:bg-canvas-surface/40 md:hover:px-6">
          <span className="relative z-10 h-14 w-14 shrink-0">
            <span className="absolute inset-0 flex items-center justify-center rounded-full border border-canvas-border bg-canvas font-mono text-xs text-ink-faint transition-colors duration-500 ease-premium group-hover:border-accent/50 group-hover:text-accent-soft">
              {step.step}
            </span>
            <motion.span
              aria-hidden="true"
              style={{ opacity: activation, scale: nodeScale }}
              className="absolute inset-0 flex items-center justify-center rounded-full border border-accent bg-accent/15 font-mono text-xs text-accent-soft shadow-[0_0_22px_6px_rgba(244,243,238,0.4)]"
            >
              {step.step}
            </motion.span>
          </span>

          <div className="min-w-0 flex-1 space-y-2 md:contents md:space-y-0">
            <motion.h3
              style={{ opacity: titleOpacity }}
              className="font-display text-2xl font-semibold text-ink transition-colors duration-500 ease-premium md:text-3xl md:group-hover:text-accent-soft"
            >
              {step.title}
            </motion.h3>

            <p className="text-sm leading-relaxed text-ink-muted md:max-w-md md:justify-self-end md:text-right">
              {step.description}
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/**
 * A vertical timeline instead of the boxed 4-up card grid: numbered nodes
 * threaded on a connecting hairline, large display titles, and
 * right-aligned descriptions on desktop for the same asymmetric editorial
 * rhythm used on the /services rows and stats band.
 *
 * The hairline draws in as the section scrolls through view (scaleY tied to
 * scroll progress), and each node "activates" — glowing, popping to scale,
 * its title brightening from muted to full color — at the exact moment the
 * drawing line reaches it, rather than everything just fading in together.
 * It reads as a spotlight moving down the sequence as you scroll, not a
 * decorative line with static content sitting next to it.
 */
export default function ProcessSteps() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.8", "end 0.6"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const markerTop = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <section className="border-t border-canvas-border py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="How we work"
          title="A process built around your business, not our template"
          description="Every engagement starts with understanding how you actually operate. Technology comes second."
        />

        <div ref={trackRef} className="relative mt-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-7 top-0 h-full w-px bg-canvas-border"
          />
          <motion.div
            aria-hidden="true"
            style={{ scaleY: progress }}
            className="pointer-events-none absolute left-7 top-0 h-full w-px origin-top bg-accent"
          />
          <motion.div
            aria-hidden="true"
            style={{ top: markerTop }}
            className="pointer-events-none absolute left-7 z-20 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-soft shadow-[0_0_16px_4px_rgba(244,243,238,0.6)]"
          />

          {process.map((step, i) => (
            <TimelineStep
              key={step.step}
              step={step}
              index={i}
              total={process.length}
              isLast={i === process.length - 1}
              progress={progress}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
