import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/data/site";

/** Small decorative labels scattered around the hero headline, echoing the
 * services Monorite builds — a soft blurred glow card per label, no real
 * imagery needed. Positions are percentage-based so they scale with the
 * viewport; hidden on mobile where there isn't room for them without
 * crowding the headline. */
const floatingCards: {
  label: string;
  className: string;
}[] = [
  { label: "WEBSITE BUILD", className: "left-[6%] top-[14%] -rotate-6" },
  { label: "AI CALL AGENT", className: "left-[26%] top-[4%] rotate-3" },
  { label: "CRM SYSTEM", className: "right-[8%] top-[10%] rotate-6" },
  { label: "REVIEW AUTOMATION", className: "left-[4%] top-[60%] rotate-3" },
  { label: "PROCESS DISCOVERY", className: "right-[5%] top-[58%] -rotate-3" },
  { label: "LAUNCH SUPPORT", className: "right-[22%] top-[78%] rotate-6" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-40 md:pb-32 md:pt-48">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden md:block"
      >
        {floatingCards.map((card) => (
          <div
            key={card.label}
            className={`absolute h-24 w-36 rounded-2xl border border-canvas-border bg-white/[0.02] p-3 ${card.className}`}
          >
            <div className="absolute inset-2 rounded-xl bg-[radial-gradient(circle_at_50%_40%,rgba(244,243,238,0.12),transparent_65%)]" />
            <span className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.15em] text-ink-faint">
              {card.label}
            </span>
          </div>
        ))}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-8 hidden justify-between px-6 md:flex md:px-10"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
          [ Web · Automation · AI ]
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
          [ Est. {site.founded} ]
        </span>
      </div>

      <Container className="relative flex flex-col items-center text-center">
        <Reveal onMount>
          <Badge>For businesses making their first real move online</Badge>
        </Reveal>
        <Reveal onMount delay={0.08}>
          <h1 className="mt-6 max-w-4xl text-balance font-display text-display-xl font-semibold text-ink">
            We study how your business runs.{" "}
            <span className="text-ink-muted">Then we build the systems that run it.</span>
          </h1>
        </Reveal>
        <Reveal onMount delay={0.16}>
          <p className="mt-8 max-w-xl text-balance text-lg leading-relaxed text-ink-muted">
            For trades, clinics, and local businesses still running on phone
            calls and spreadsheets, {site.name} designs your first real
            website, sets up AI voice and chat agents, and automates the
            busywork behind it, all wired into one system.
          </p>
        </Reveal>
        <Reveal onMount delay={0.24}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/contact" size="md">
              Start a project
            </Button>
            <Button href="/#work" variant="secondary" size="md">
              See our work
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
