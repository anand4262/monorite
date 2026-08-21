const grain =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

/** A real photo, treated with a monochrome duotone wash so it sits inside
 * the site's cream-on-near-black palette instead of looking like a
 * dropped-in stock photo. Shared between the homepage services carousel
 * and the individual service detail pages so both use the same image per
 * service, rather than each page inventing its own. */
export function ServiceArtPanel({ image, category }: { image: string; category: string }) {
  return (
    <div className="absolute inset-0 bg-canvas-soft">
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          style={{ filter: "grayscale(1) contrast(1.08) brightness(0.72)" }}
        />
      )}
      <div className="absolute inset-0 bg-accent mix-blend-color opacity-[0.14]" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/10 to-transparent"
        aria-hidden="true"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.1] mix-blend-overlay"
        style={{ backgroundImage: grain }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink/90">{category}</p>
      </div>
    </div>
  );
}
