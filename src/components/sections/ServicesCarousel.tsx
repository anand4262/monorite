"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/types";
import SwipeCarousel from "@/components/ui/SwipeCarousel";
import { ServiceArtPanel } from "@/components/ui/ServiceVisual";

/** Icon components can't cross the server/client boundary as props, so the
 * page passes services with the `icon` field stripped. */
type ServiceForCarousel = Omit<Service, "icon">;

/**
 * Desktop: pinned, scroll-driven. The active service stays mounted in a
 * sticky viewport-height panel while the wrapper's extra scroll height
 * (N * 100vh) advances a numbered index as the user scrolls, crossfading
 * text and artwork on each change.
 */
function DesktopCarousel({ services }: { services: ServiceForCarousel[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const index = Math.min(services.length - 1, Math.floor(v * services.length));
    setActive(index);
  });

  const service = services[active]!;

  return (
    <section
      ref={wrapRef}
      style={{ height: `${services.length * 100}vh` }}
      className="relative hidden md:block"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-12 px-6 md:grid-cols-2 md:px-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
              Services
            </p>
            <p className="mt-3 font-mono text-sm text-ink-faint">
              {String(active + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <h2 className="mt-6 text-balance font-display text-5xl font-semibold leading-[1.05] text-ink md:text-7xl">
                  {service.name}
                </h2>
                <p className="mt-4 max-w-md text-balance text-base leading-relaxed text-ink-muted">
                  {service.shortDescription}
                </p>

                <Link
                  href={`/services/${service.slug}`}
                  className="group mt-8 inline-flex items-center gap-2 text-base font-medium text-ink"
                >
                  Learn more
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex flex-wrap gap-2">
              {services.map((s, i) => (
                <span
                  key={s.slug}
                  className={`h-0.5 w-10 rounded-full transition-colors duration-500 ${
                    i === active ? "bg-ink" : "bg-canvas-surface"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-canvas-border bg-canvas-soft">
            <AnimatePresence mode="wait">
              <motion.div
                key={service.slug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <ServiceArtPanel image={service.image} category={service.category} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Mobile: no scroll-jacking, no numbered tab-switcher. A fixed section
 * showing one service at a time, swiped via Embla, image first and text
 * underneath. Dots below show position instead of a peeking next card.
 */
function MobileCarousel({ services }: { services: ServiceForCarousel[] }) {
  return (
    <section className="pb-16 pt-8 md:hidden">
      <SwipeCarousel
        items={services}
        keyFor={(service) => service.slug}
        renderItem={(service) => (
          <div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-canvas-border bg-canvas-soft">
              <ServiceArtPanel image={service.image} category={service.category} />
            </div>
            <div className="mt-5">
              <h3 className="font-display text-2xl font-semibold text-ink">{service.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {service.shortDescription}
              </p>
              <Link
                href={`/services/${service.slug}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-ink"
              >
                Learn more
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      />
    </section>
  );
}

export default function ServicesCarousel({ services }: { services: ServiceForCarousel[] }) {
  return (
    <>
      <DesktopCarousel services={services} />
      <MobileCarousel services={services} />
    </>
  );
}
