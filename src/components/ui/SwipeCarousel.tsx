"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

/**
 * A fixed, one-at-a-time swipeable carousel for mobile — built on Embla
 * rather than a hand-rolled touch handler, so drag physics, snapping, and
 * accessibility come from a maintained package instead of custom gesture
 * code. Each slide takes the full width (no peeking neighbor), with dots
 * below showing position.
 *
 * autoplayDelay is opt-in (existing callers pass nothing and stay purely
 * manual). stopOnInteraction is deliberately false: a visitor dragging a
 * slide should still get autoplay back afterward rather than silently
 * killing it forever the moment they touch the carousel once.
 */
export default function SwipeCarousel<T>({
  items,
  keyFor,
  renderItem,
  autoplayDelay,
  slideClassName = "px-6",
}: {
  items: T[];
  keyFor: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  autoplayDelay?: number;
  /** Gutter around each slide. Defaults to the existing px-6 (a visible
   * card floating with side margins) — pass "" for a full-bleed slide that
   * touches the edges of whatever wraps this carousel instead. */
  slideClassName?: string;
}) {
  const autoplay = useRef(
    autoplayDelay ? Autoplay({ delay: autoplayDelay, stopOnInteraction: false }) : undefined,
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: Boolean(autoplayDelay), align: "start" },
    autoplay.current ? [autoplay.current] : [],
  );
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Autoplay is a motion effect — stop it outright for visitors who've
  // asked the OS for reduced motion, rather than just running it slower.
  // Manual swipe still works either way, this only kills the automatic part.
  useEffect(() => {
    if (!autoplay.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      autoplay.current.stop();
    }
  }, []);

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {items.map((item) => (
            <div key={keyFor(item)} className={cn("min-w-0 flex-[0_0_100%]", slideClassName)}>
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {items.map((item, i) => (
          <span
            key={keyFor(item)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === selected ? "w-6 bg-ink" : "w-1.5 bg-canvas-surface"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
