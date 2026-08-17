import Hero3D from "@/components/three/Hero3D";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/data/site";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-40 md:pb-32 md:pt-48">
      <div
        className="pointer-events-none absolute inset-0 bg-radial-fade"
        aria-hidden="true"
      />

      {/* Bracket-style mono labels flanking the hero — a small editorial
          touch (borrowed from the agency-template references) that most of
          the page didn't have before: a sense of the hero being a framed
          "scene" rather than just floating text on a background. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-8 hidden justify-between px-6 md:flex md:px-10"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
          [ AI Automation Agency ]
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
          [ Est. {site.founded} ]
        </span>
      </div>

      <Container className="relative grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Reveal onMount>
            <Badge>AI systems for service businesses</Badge>
          </Reveal>
          <Reveal onMount delay={0.08}>
            <h1 className="mt-6 text-balance font-display text-display-xl font-semibold text-ink">
              AI that runs your business{" "}
              <span className="text-accent-soft">while you run your day.</span>
            </h1>
          </Reveal>
          <Reveal onMount delay={0.16}>
            <p className="mt-8 max-w-xl text-balance text-lg leading-relaxed text-ink-muted">
              We design and build AI call assistants, automation, and custom
              software for service businesses — so no call, booking, or
              follow-up ever falls through the cracks.
            </p>
          </Reveal>
          <Reveal onMount delay={0.24}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button href="/contact" size="md">
                Start a project
              </Button>
              <Button href="/work" variant="secondary" size="md">
                See our work
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal onMount delay={0.2} className="relative aspect-square w-full">
          <div className="absolute inset-0 -z-10 rounded-full bg-accent/10 blur-3xl" />
          <Hero3D />
        </Reveal>
      </Container>
    </section>
  );
}
