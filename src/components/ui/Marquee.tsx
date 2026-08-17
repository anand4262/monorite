import { cn } from "@/lib/utils";

export default function Marquee({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  const doubled = [...items, ...items];

  return (
    <div className={cn("relative overflow-hidden mask-fade-bottom", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-canvas to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-canvas to-transparent" />
      <div className="flex w-max animate-marquee gap-16 py-2">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="whitespace-nowrap text-xl font-semibold uppercase tracking-wide text-ink-faint md:text-2xl"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
