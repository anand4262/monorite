"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";
import Logo from "./Logo";

// useLayoutEffect does nothing during SSR (and warns if called there) —
// this falls back to useEffect on the server and only becomes the real,
// synchronous-before-paint version once running in a browser.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * A brief branded preloader shown on first paint, in the spirit of the
 * "wordmark reveal" intros common on creative-agency sites. It is skipped
 * entirely for prefers-reduced-motion, and for repeat visits within the
 * same tab session (sessionStorage) so it never nags returning navigators.
 */
export default function Preloader() {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  // Runs synchronously before the browser paints the first client-rendered
  // frame — unlike useEffect (async, after paint), this closes the window
  // where the real page (navbar, chat icon, everything) is briefly visible
  // on screen before the preloader overlay mounts on top of it.
  useIsomorphicLayoutEffect(() => {
    const alreadySeen = sessionStorage.getItem("monorite-preloader-seen");
    if (alreadySeen || reducedMotion) {
      return;
    }

    setVisible(true);

    // The sessionStorage flag is only written once the dismiss timer
    // actually fires, not when it's scheduled. React 18 Strict Mode
    // double-invokes effects in development (mount → cleanup → mount): if
    // the flag were set eagerly here, the first invocation's timer would
    // be cancelled by the Strict Mode cleanup, the second invocation would
    // see "already seen" and skip scheduling a new one, and the preloader
    // would stay visible forever with no timer left to dismiss it.
    const timer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("monorite-preloader-seen", "1");
    }, 1100);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-5 bg-canvas"
          aria-hidden="true"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 -z-10 rounded-2xl bg-accent/40 blur-2xl"
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <Logo size={56} />
          </motion.div>

          <div className="overflow-hidden">
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="block font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl"
            >
              {site.name}
            </motion.span>
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="h-px w-24 origin-left bg-accent md:w-32"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
