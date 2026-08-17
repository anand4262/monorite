import { Search, Hammer, Rocket } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/data/site";

const grain =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

const panels = [
  {
    label: "Discovery",
    gradient:
      "bg-[radial-gradient(circle_at_25%_20%,rgba(124,92,255,0.55),transparent_55%),radial-gradient(circle_at_80%_85%,rgba(63,232,184,0.3),transparent_50%),linear-gradient(140deg,rgba(20,21,24,1),rgba(8,9,10,1))]",
    wrap: "md:absolute md:left-0 md:top-0 md:w-[58%] md:rotate-[-4deg]",
    aspect: "aspect-[4/5]",
    z: "md:z-10",
  },
  {
    label: "Build",
    gradient:
      "bg-[linear-gradient(155deg,rgba(63,232,184,0.45),rgba(8,9,10,1)_60%),radial-gradient(circle_at_20%_20%,rgba(124,92,255,0.35),transparent_45%)]",
    wrap: "md:absolute md:bottom-0 md:right-0 md:w-[48%] md:rotate-[3deg]",
    aspect: "aspect-square",
    z: "md:z-0",
  },
  {
    label: "Launch",
    gradient:
      "bg-[conic-gradient(from_140deg_at_50%_50%,rgba(169,150,255,0.5),rgba(63,232,184,0.35),rgba(20,21,24,1))]",
    wrap: "md:absolute md:right-[2%] md:top-[10%] md:w-[30%] md:rotate-[6deg]",
    aspect: "aspect-[3/4]",
    z: "md:z-20",
  },
];

const phases = [
  {
    icon: Search,
    label: "Discovery",
    description: "We map how work actually moves through your business before touching any tooling.",
  },
  {
    icon: Hammer,
    label: "Build",
    description: "Systems get built around that map — call flows, integrations, and follow-ups included.",
  },
  {
    icon: Rocket,
    label: "Launch",
    description: "You go live with direct access to the people who built it, not a ticket queue.",
  },
];

/**
 * A split layout pairing the rotated abstract-gradient panel collage (still
 * standing in for team/office photography we don't have) with an adjacent
 * narrative column — a short paragraph plus a labeled Discovery/Build/Launch
 * phase list that mirrors the panel labels. Previously the collage sat alone
 * with no supporting copy, which reads as pure decoration; tying it to text
 * on the same visual line gives it a reason to be there.
 */
export default function AboutCollage() {
  return (
    <section className="border-t border-canvas-border py-24 md:py-32">
      <Container>
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div>
            <Reveal>
              <span className="mb-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                How we build
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="text-balance font-display text-display-md font-semibold text-ink">
                Three phases. One system that actually fits.
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 max-w-md text-balance text-base leading-relaxed text-ink-muted md:text-lg">
                Every engagement moves through the same three phases, in the
                same order, no matter the size of the business.
              </p>
            </Reveal>

            <div className="mt-10 space-y-6">
              {phases.map((phase, i) => {
                const Icon = phase.icon;
                return (
                  <Reveal key={phase.label} delay={0.2 + i * 0.08}>
                    <div className="flex gap-4 border-t border-canvas-border pt-6">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-canvas-border bg-canvas-surface text-accent-soft">
                        <Icon className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
                          {phase.label}
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                          {phase.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>

          <Reveal blurIn delay={0.1}>
            <div className="relative flex flex-col gap-4 md:block md:h-[440px]">
              {panels.map((panel) => (
                <div
                  key={panel.label}
                  className={`relative overflow-hidden rounded-2xl border border-canvas-border shadow-[0_24px_48px_-28px_rgba(0,0,0,0.55)] ${panel.wrap} ${panel.z} ${panel.aspect}`}
                >
                  <div className={`absolute inset-0 ${panel.gradient}`} />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
                    style={{ backgroundImage: grain }}
                  />
                  <span className="absolute left-4 top-4 rounded-full border border-ink/15 bg-canvas/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/80 backdrop-blur-sm">
                    {panel.label}
                  </span>
                </div>
              ))}

              <div className="relative rounded-2xl border border-canvas-border bg-canvas-surface p-6 shadow-[0_18px_36px_-24px_rgba(0,0,0,0.5)] md:absolute md:bottom-4 md:left-[4%] md:z-30 md:w-48 md:rotate-[-2deg]">
                <p className="font-display text-3xl font-semibold text-ink">{site.founded}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
                  Building automation since
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
