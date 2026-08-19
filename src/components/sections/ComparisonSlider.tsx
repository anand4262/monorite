"use client";

import { useCallback, useRef, useState } from "react";
import { ArrowLeftRight, Loader2, MapPin, Phone, Search } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/data/site";

/**
 * A drag-to-compare panel illustrating the shift every client goes
 * through, not one client's specific case. Both sides are abstract,
 * generic mockups (a bare listing vs. a wireframed site) rather than a
 * real screenshot, since this section speaks about businesses before and
 * after Monorite in general, not a single named company.
 */
export default function ComparisonSlider() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState(50);
  const dragging = useRef(false);

  const updateSplit = useCallback((clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSplit(Math.min(96, Math.max(4, pct)));
  }, []);

  // At and right of center the "after" side still reads as loading;
  // dragging the divider left widens that revealed region, and once it's
  // open past this point it resolves into the built site, so the reveal
  // itself mirrors a page finishing its load.
  const siteLoaded = split < 35;

  return (
    <section className="border-t border-canvas-border py-24 md:py-32">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="The shift"
          title={`Before ${site.name}. After ${site.name}.`}
          description="What most businesses look like before we start, and what they look like once the system is live. Drag the divider."
          className="mx-auto"
        />

        <Reveal blurIn delay={0.1}>
          <div
            ref={wrapRef}
            className="relative mx-auto mt-14 aspect-[16/10] max-w-3xl select-none overflow-hidden rounded-2xl border border-canvas-border shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]"
            onMouseMove={(e) => {
              if (dragging.current) updateSplit(e.clientX);
            }}
            onMouseUp={() => (dragging.current = false)}
            onMouseLeave={() => (dragging.current = false)}
            onTouchMove={(e) => {
              if (dragging.current && e.touches[0]) updateSplit(e.touches[0].clientX);
            }}
            onTouchEnd={() => (dragging.current = false)}
          >
            {/* Before: no site, just a directory listing. */}
            <div className="absolute inset-0 flex flex-col bg-canvas-soft">
              <div className="flex items-center gap-2 border-b border-canvas-border px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full border border-ink-faint" />
                <span className="h-2.5 w-2.5 rounded-full border border-ink-faint" />
                <span className="h-2.5 w-2.5 rounded-full border border-ink-faint" />
                <div className="ml-3 flex flex-1 items-center gap-2 rounded-full border border-canvas-border bg-canvas px-3 py-1.5">
                  <Search className="h-3 w-3 shrink-0 text-ink-faint" />
                  <span className="truncate text-xs text-ink-faint">your business, your city</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
                  Before {site.name}
                </p>
                <div className="w-full max-w-xs rounded-xl border border-dashed border-canvas-border bg-canvas/60 px-5 py-4 text-left">
                  <p className="text-sm font-medium text-ink-muted">Your business</p>
                  <div className="mt-2.5 flex items-center gap-2 text-xs text-ink-faint">
                    <Phone className="h-3 w-3 shrink-0" />
                    <span>Phone only, no online booking</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-ink-faint">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span>Directory listing, no website</span>
                  </div>
                </div>
                <p className="max-w-xs text-sm text-ink-faint">
                  Nothing for a prospective customer to find, and no system
                  behind the scenes to run on.
                </p>
              </div>
            </div>

            {/* After: a real, built site. */}
            <div
              className="absolute inset-0 flex flex-col bg-canvas-surface"
              style={{ clipPath: `inset(0 0 0 ${split}%)` }}
            >
              <div className="flex items-center gap-2 border-b border-canvas-border px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full border border-ink-faint" />
                <span className="h-2.5 w-2.5 rounded-full border border-ink-faint" />
                <span className="h-2.5 w-2.5 rounded-full border border-ink-faint" />
                <div className="ml-3 flex-1 truncate rounded-full border border-canvas-border bg-canvas px-3 py-1.5 text-xs text-ink-muted">
                  yourbusiness.com
                </div>
              </div>
              <div className="relative flex-1">
                {/* Still loading: shown until the divider is dragged open. */}
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center transition-opacity duration-500 ${
                    siteLoaded ? "pointer-events-none opacity-0" : "opacity-100"
                  }`}
                >
                  <Loader2 className="h-6 w-6 animate-spin text-ink-faint" strokeWidth={1.5} />
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
                    Building your site
                  </p>
                  <div className="w-full max-w-[10rem] space-y-2">
                    <span className="block h-2 w-full animate-pulse rounded-full bg-canvas-border" />
                    <span className="block h-2 w-2/3 animate-pulse rounded-full bg-canvas-border" />
                  </div>
                </div>

                {/* Loaded: the skeleton of a real, built site. */}
                <div
                  className={`absolute inset-0 flex flex-col gap-5 px-8 py-7 transition-opacity duration-500 ${
                    siteLoaded ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-soft">
                    After {site.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-md bg-ink/70" />
                    <span className="ml-4 h-2 w-8 rounded-full bg-ink/25" />
                    <span className="h-2 w-8 rounded-full bg-ink/25" />
                    <span className="h-2 w-8 rounded-full bg-ink/25" />
                    <span className="ml-auto h-6 w-16 rounded-full bg-accent" />
                  </div>
                  <div className="space-y-2.5">
                    <span className="block h-3.5 w-4/5 rounded-full bg-ink/85" />
                    <span className="block h-3.5 w-3/5 rounded-full bg-ink/85" />
                    <span className="block h-2 w-2/5 rounded-full bg-ink-muted/60" />
                  </div>
                  <span className="block h-16 w-full rounded-lg border border-canvas-border bg-gradient-to-br from-canvas-border/40 to-transparent" />
                  <div className="flex gap-3">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="flex-1 space-y-2 rounded-lg border border-canvas-border bg-canvas/60 p-3"
                      >
                        <span className="block h-4 w-4 rounded-full bg-ink/40" />
                        <span className="block h-1.5 w-full rounded-full bg-ink-muted/40" />
                        <span className="block h-1.5 w-2/3 rounded-full bg-ink-muted/40" />
                      </div>
                    ))}
                  </div>
                  <p className="mt-auto font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
                    Website, booking, and AI call handling, live in one system
                  </p>
                </div>
              </div>
            </div>

            <div
              role="slider"
              aria-label={`Drag to compare before and after ${site.name}`}
              aria-valuenow={Math.round(split)}
              aria-valuemin={4}
              aria-valuemax={96}
              tabIndex={0}
              className="absolute inset-y-0 z-10 flex w-0.5 -translate-x-1/2 cursor-ew-resize items-center justify-center bg-ink"
              style={{ left: `${split}%` }}
              onMouseDown={() => (dragging.current = true)}
              onTouchStart={() => (dragging.current = true)}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") setSplit((s) => Math.max(4, s - 4));
                if (e.key === "ArrowRight") setSplit((s) => Math.min(96, s + 4));
              }}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-canvas shadow-[0_8px_20px_-6px_rgba(0,0,0,0.5)]">
                <ArrowLeftRight className="h-4 w-4" strokeWidth={2} />
              </span>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
