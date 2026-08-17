import { cn } from "@/lib/utils";

/**
 * The base pulsing block every loading skeleton is built from. Kept to a
 * single shared primitive so every skeleton across the site pulses in
 * sync and uses the same surface color, rather than each route inventing
 * its own placeholder styling.
 */
export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-canvas-surface", className)}
      aria-hidden="true"
    />
  );
}
