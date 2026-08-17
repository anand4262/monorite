import { buildMetadata } from "@/lib/seo";
import { site } from "@/data/site";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import AboutCollage from "@/components/sections/AboutCollage";
import CTASection from "@/components/sections/CTASection";
import { Target, HeartHandshake, ShieldCheck } from "lucide-react";

export const metadata = buildMetadata({
  title: "About",
  description: `The story, principles, and people behind ${site.name}.`,
  path: "/about",
});

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
      "You work with the people who build your system — during launch and long after, no support ticket queue.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative pb-20 pt-40 md:pb-28 md:pt-48">
        <Container>
          <Badge>About {site.name}</Badge>
          <Reveal onMount delay={0.08}>
            <h1 className="mt-6 max-w-3xl text-balance font-display text-display-lg font-semibold text-ink">
              We build the AI systems that let service businesses stop
              chasing their own tail.
            </h1>
          </Reveal>
          <Reveal onMount delay={0.16}>
            <p className="mt-8 max-w-2xl text-balance text-lg leading-relaxed text-ink-muted">
              {site.name} was founded on a simple observation: most service
              businesses aren't losing to competitors — they're losing to
              missed calls, dropped follow-ups, and processes held together
              with sticky notes. We started building AI systems to close
              those gaps, one business at a time, since {site.founded}.
            </p>
          </Reveal>
        </Container>
        <div className="pointer-events-none absolute inset-x-0 bottom-8 hidden justify-between px-6 md:flex md:px-10">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
            [ Our Story ]
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
            [ Est. {site.founded} ]
          </span>
        </div>
      </section>

      <AboutCollage />

      <section className="border-t border-canvas-border py-24 md:py-32">
        <Container>
          <SectionHeading
            eyebrow="How we think"
            title="Principles that shape every engagement"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {values.map((value, i) => {
              const Icon = value.icon;
              const index = String(i + 1).padStart(2, "0");
              return (
                <Reveal key={value.title} blurIn delay={i * 0.08}>
                  <Card className="h-full">
                    <div className="flex items-start justify-between">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-canvas-border bg-canvas-surface text-accent-soft transition-colors duration-500 ease-premium group-hover:border-accent/40">
                        <Icon className="h-5 w-5" strokeWidth={1.5} />
                      </span>
                      <span className="font-mono text-[11px] text-ink-faint">{index}</span>
                    </div>
                    <h3 className="mt-6 font-display text-lg font-semibold text-ink transition-colors duration-500 ease-premium group-hover:text-accent-soft">
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

      <CTASection />
    </>
  );
}
