"use client";

import { useEffect, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";

/**
 * A fixed, one-at-a-time swipeable carousel for mobile — built on Embla
 * rather than a hand-rolled touch handler, so drag physics, snapping, and
 * accessibility come from a maintained package instead of custom gesture
 * code. Each slide takes the full width (no peeking neighbor), with dots
 * below showing position.
 */
export default function SwipeCarousel<T>({
  items,
  keyFor,
  renderItem,
}: {
  items: T[];
  keyFor: (item: T) => string;
  renderItem: (item: T) => ReactNode;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" });
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

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {items.map((item) => (
            <div key={keyFor(item)} className="min-w-0 flex-[0_0_100%] px-6">
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
