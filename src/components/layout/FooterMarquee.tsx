import Link from "next/link";

const phrase = "Let's build something →";
const items = Array.from({ length: 8 }, () => phrase);

/**
 * A second oversized-typography moment (the first is BigStatement on the
 * homepage) — an auto-scrolling band of giant display type sitting directly
 * above the footer, reusing the `marquee-slow` keyframe defined in
 * tailwind.config.ts.
 */
export default function FooterMarquee() {
  return (
    <div className="overflow-hidden border-b border-canvas-border py-8 md:py-10">
      <div className="flex w-max items-center gap-10 animate-marquee-slow">
        {[...items, ...items].map((item, i) => (
          <Link
            key={i}
            href="/contact"
            className="whitespace-nowrap font-display text-4xl font-semibold uppercase tracking-tight text-ink-faint transition-colors duration-300 hover:text-ink md:text-6xl"
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
}
