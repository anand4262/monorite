import { cn } from "@/lib/utils";

export default function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-canvas-border bg-canvas-surface/60 p-8 transition-all duration-500 ease-premium hover:border-accent/40 hover:bg-canvas-surface",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/0 blur-3xl transition-all duration-500 ease-premium group-hover:bg-accent/10" />
      <div className="relative">{children}</div>
    </div>
  );
}
