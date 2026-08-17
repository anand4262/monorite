"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";

/**
 * A brief branded preloader shown on first paint, in the spirit of the
 * "wordmark reveal" intros common on creative-agency sites. It is skipped
 * entirely for prefers-reduced-motion, and for repeat visits within the
 * same tab session (sessionStorage) so it never nags returning navigators.
 */
export default function Preloader() {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("vantage-preloader-seen");
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
      sessionStorage.setItem("vantage-preloader-seen", "1");
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
          className="fixed inset-0 z-[200] flex items-center justify-center bg-canvas"
          aria-hidden="true"
        >
          <div className="overflow-hidden">
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="block font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl"
            >
              {site.name}
            </motion.span>
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="absolute bottom-[38%] left-1/2 h-px w-24 -translate-x-1/2 origin-left bg-accent md:w-32"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
