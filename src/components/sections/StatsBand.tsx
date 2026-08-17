import Container from "@/components/ui/Container";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import Reveal from "@/components/ui/Reveal";

const stats = [
  { value: 92, suffix: "%", label: "Average drop in missed calls" },
  { value: 30, suffix: "+", label: "Systems designed and shipped" },
  { value: 4, suffix: "wk", label: "Typical time to first launch" },
  { value: 100, suffix: "%", label: "Clients with direct build-team access" },
];

/**
 * A more editorial take on the stats band: hairline top dividers instead of
 * boxed cards, mono-styled numerals, and generous whitespace rather than a
 * tight bordered grid — closer to the spacious "number as headline" pattern
 * common on premium agency sites than our previous compact card treatment.
 */
export default function StatsBand() {
  return (
    <section className="border-t border-canvas-border py-24 md:py-32">
      <Container>
        <div className="grid gap-x-12 gap-y-16 sm:grid-cols-2">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08} blurIn>
              <div className="border-t border-canvas-border pt-6">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  className="block font-mono text-5xl font-medium text-ink md:text-6xl"
                />
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
