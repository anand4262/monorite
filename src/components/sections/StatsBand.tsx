import Container from "@/components/ui/Container";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import Reveal from "@/components/ui/Reveal";
import { projects } from "@/data/projects";
import { services } from "@/data/services";

// Every number here is derived directly from the real project/service data
// (not hand-typed), so it can never drift out of sync with what's actually
// true — no invented percentages, no "typical"/"average" claims we can't
// back up.
const industriesServed = new Set(projects.map((p) => p.industry)).size;
const googlePlayApps = projects.filter((p) => p.visitUrl?.includes("play.google.com")).length;

const stats = [
  { value: projects.length, suffix: "", label: "Real systems shipped" },
  { value: googlePlayApps, suffix: "", label: "Apps live on Google Play" },
  { value: industriesServed, suffix: "", label: "Industries served" },
  { value: services.length, suffix: "", label: "Services offered end-to-end" },
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
