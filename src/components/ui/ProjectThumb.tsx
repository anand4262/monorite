import { ArrowUpRight } from "lucide-react";

/**
 * Abstract gradient "thumbnails" standing in for case-study photography we
 * don't have. Cycled by index so a grid of cards reads as a deliberate
 * palette rather than a repeated pattern. Pair with a parent that has the
 * `group` class — the hover reveal below is driven by group-hover.
 */
const gradients = [
  "bg-[radial-gradient(circle_at_20%_20%,rgba(124,92,255,0.55),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(63,232,184,0.35),transparent_50%),linear-gradient(135deg,rgba(20,21,24,1),rgba(8,9,10,1))]",
  "bg-[conic-gradient(from_140deg_at_50%_50%,rgba(63,232,184,0.45),rgba(124,92,255,0.4),rgba(20,21,24,1))]",
  "bg-[linear-gradient(160deg,rgba(124,92,255,0.5),rgba(8,9,10,1)_60%),radial-gradient(circle_at_85%_15%,rgba(63,232,184,0.4),transparent_45%)]",
  "bg-[radial-gradient(circle_at_70%_30%,rgba(169,150,255,0.5),transparent_55%),radial-gradient(circle_at_25%_75%,rgba(63,232,184,0.3),transparent_50%),linear-gradient(180deg,rgba(14,15,17,1),rgba(8,9,10,1))]",
];

export default function ProjectThumb({
  index,
  label,
  className = "h-48",
  ctaLabel = "View project",
}: {
  index: number;
  label: string;
  className?: string;
  ctaLabel?: string;
}) {
  return (
    <div className={`relative w-full overflow-hidden ${className} ${gradients[index % gradients.length]}`}>
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />

      <span className="absolute left-4 top-4 rounded-full border border-ink/15 bg-canvas/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/80 backdrop-blur-sm">
        {label}
      </span>

      <div className="absolute inset-0 flex items-center justify-center bg-canvas/0 transition-colors duration-500 ease-premium group-hover:bg-canvas/55">
        <span className="inline-flex translate-y-3 items-center gap-2 rounded-full border border-ink/20 bg-canvas/80 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink opacity-0 backdrop-blur-sm transition-all duration-400 ease-premium group-hover:translate-y-0 group-hover:opacity-100">
          {ctaLabel}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}
