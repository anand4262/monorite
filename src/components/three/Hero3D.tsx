"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import CanvasErrorBoundary from "./CanvasErrorBoundary";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

function SceneFallback() {
  return (
    <div
      className="h-full w-full animate-pulse rounded-full bg-gradient-to-br from-accent/30 via-accent/10 to-transparent blur-2xl"
      aria-hidden="true"
    />
  );
}

/**
 * Wraps the React Three Fiber scene so it:
 *  - never renders on the server (WebGL requires a browser context)
 *  - is excluded from the client bundle used for the initial route JS via
 *    next/dynamic code-splitting
 *  - is skipped entirely for users with prefers-reduced-motion, replaced by
 *    a calm static gradient instead of a spinning 3D object
 */
export default function Hero3D() {
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }, []);

  if (reducedMotion === null) {
    return <SceneFallback />;
  }

  if (reducedMotion) {
    return (
      <div
        className="h-full w-full rounded-full bg-gradient-to-br from-accent/40 via-accent/10 to-transparent blur-xl"
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="h-full w-full cursor-pointer" aria-hidden="true">
      <CanvasErrorBoundary fallback={<SceneFallback />}>
        <HeroScene />
      </CanvasErrorBoundary>
    </div>
  );
}
