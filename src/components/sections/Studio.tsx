import { Target, HeartHandshake, ShieldCheck } from "lucide-react";
import { site } from "@/data/site";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const values = [
  {
    icon: Target,
    title: "Process before technology",
    description:
      "We diagnose before we prescribe. If the honest answer is 'you don't need AI for this,' we'll say so.",
  },
  {
    icon: HeartHandshake,
    title: "Built around your business",
    description:
      "No generic templates. Every system is designed around how your team actually operates today.",
  },
  {
    icon: ShieldCheck,
    title: "Direct access, always",
    description:
      "You work with the people who build your system, during launch and long after, no support ticket queue.",
  },
];

/** Condensed version of the former standalone /about page — the founding
 * story in a couple of sentences plus the same three values, folded into
 * the single-page homepage as its "Studio" anchor section. */
export default function Studio() {
  return (
    <section id="studio" className="border-t border-canvas-border py-24 md:py-32">
      <Container>
        <Badge>Studio</Badge>
        <Reveal delay={0.08}>
          <h2 className="mt-6 max-w-2xl text-balance font-display text-display-md font-semibold text-ink">
            We build the systems that let service businesses stop chasing
            their own tail.
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-ink-muted">
            {site.name} was founded on a simple observation: most service
            businesses aren't losing to competitors. They're losing to
            missed calls, dropped follow-ups, and processes held together
            with sticky notes. We started closing those gaps, one business
            at a time, since {site.founded}.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {values.map((value, i) => {
            const Icon = value.icon;
            const index = String(i + 1).padStart(2, "0");
            return (
              <Reveal key={value.title} blurIn delay={i * 0.08}>
                <Card className="h-full">
                  <div className="flex items-start justify-between">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-canvas-border bg-canvas-surface text-accent-soft">
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <span className="font-mono text-[11px] text-ink-faint">{index}</span>
                  </div>
                  <h3 className="mt-6 font-display text-lg font-semibold text-ink">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    {value.description}
                  </p>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
