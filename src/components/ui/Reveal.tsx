"use client";

import { motion } from "framer-motion";

export default function Reveal({
  children,
  delay = 0,
  y = 20,
  className,
  once = true,
  onMount = false,
  blurIn = false,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
  /**
   * Use for above-the-fold content (e.g. the hero) that should animate in
   * immediately on page load. `whileInView` is built for scroll-triggered
   * reveals lower on the page — relying on it for content that's already
   * on screen at load time depends on the IntersectionObserver firing
   * correctly the instant it's attached, which is unnecessary risk for
   * something that should just always play once on mount.
   */
  onMount?: boolean;
  /**
   * Adds a filter: blur() transition alongside the opacity/y move — a
   * slightly heavier, more editorial reveal for large single-item moments
   * (an editorial services row, a stat) rather than the plain fade used for
   * dense repeating grids. filter is its own CSS property, independent of
   * transform, so it composes safely with any transform-based classes on
   * this or a parent element.
   */
  blurIn?: boolean;
}) {
  const initial = blurIn ? { opacity: 0, y, filter: "blur(8px)" } : { opacity: 0, y };
  const animate = blurIn ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 1, y: 0 };

  if (onMount) {
    return (
      <motion.div
        initial={initial}
        animate={animate}
        transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
