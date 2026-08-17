import { cn } from "@/lib/utils";

export default function Marquee({
  items,
  className,
  gap = "gap-16",
  renderItem,
}: {
  items: string[];
  className?: string;
  gap?: string;
  /** Overrides the default big-uppercase-word rendering — used for e.g. a
   * row of tool chips instead of plain text. */
  renderItem?: (item: string, index: number) => React.ReactNode;
}) {
  const doubled = [...items, ...items];

  return (
    <div className={cn("relative overflow-hidden mask-fade-bottom", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-canvas to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-canvas to-transparent" />
      <div className={cn("flex w-max animate-marquee items-center py-2", gap)}>
        {doubled.map((item, i) =>
          renderItem ? (
            <div key={`${item}-${i}`} className="shrink-0">
              {renderItem(item, i)}
            </div>
          ) : (
            <span
              key={`${item}-${i}`}
              className="whitespace-nowrap text-xl font-semibold uppercase tracking-wide text-ink-faint md:text-2xl"
            >
              {item}
            </span>
          ),
        )}
      </div>
    </div>
  );
}
