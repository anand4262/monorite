import { cn } from "@/lib/utils";

export default function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-canvas-border bg-white/[0.03] px-3 py-1 font-mono text-xs uppercase tracking-wide text-ink-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
