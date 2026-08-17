"use client";

import { useCallback, useRef, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/data/site";

/**
 * A drag-to-compare "before / after" panel — a concrete,
 * tactile way to show the outcome the homepage promises, rather than
 * another paragraph of copy. Pointer position drives a clip-path on the
 * "after" layer so the transition is a hard, obvious wipe rather than a
 * fade, matching the drag-compare pattern used on competitor product
 * sites for exactly this kind of before/after claim.
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

  return (
    <section className="border-t border-canvas-border py-24 md:py-32">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="See the difference"
          title={`Before ${site.name}. After ${site.name}.`}
          description="Same business, same week. Drag the divider."
          className="mx-auto"
        />

        <Reveal blurIn delay={0.1}>
          <div
            ref={wrapRef}
            className="relative mx-auto mt-14 aspect-[16/8] max-w-3xl select-none overflow-hidden rounded-2xl border border-canvas-border"
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
            <div className="absolute inset-0 flex flex-col justify-center bg-canvas-soft px-8 py-8 md:px-12">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
                Before {site.name}
              </p>
              <p className="mt-3 font-display text-3xl font-semibold text-ink-muted md:text-4xl">
                14 missed
              </p>
              <p className="mt-2 text-sm text-ink-faint">
                calls last week, 3 unanswered texts, gaps in the calendar
              </p>
            </div>

            <div
              className="absolute inset-0 flex flex-col justify-center bg-canvas-surface px-8 py-8 md:px-12"
              style={{
                clipPath: `inset(0 0 0 ${split}%)`,
                background:
                  "linear-gradient(135deg, rgba(124,92,255,0.14), rgba(63,232,184,0.1)), rgb(var(--color-canvas-surface))",
              }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mint">
                After {site.name}
              </p>
              <p className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
                0 missed
              </p>
              <p className="mt-2 text-sm text-ink-faint">
                calendar full, next job booked for 9am tomorrow
              </p>
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
