import { Quote } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";

/**
 * Consulting-page structure — problem statement, then a short numbered
 * process, then a proof point — rather than a generic bullet list. Modeled
 * on the Hero -> Problem -> Process -> Social proof pattern that performs
 * best on consulting/discovery-style sites.
 */
export default function DiscoveryProcessPanel({
  problem,
  steps,
  quote,
}: {
  problem: string;
  steps: { title: string; description: string }[];
  quote: { text: string; author: string; company: string };
}) {
  return (
    <section className="border-t border-canvas-border py-20 md:py-28">
      <Container>
        <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-accent-soft">
          The problem
        </h2>
        <Reveal>
          <p className="mt-5 max-w-2xl text-balance font-display text-2xl font-semibold leading-snug text-ink md:text-3xl">
            {problem}
          </p>
        </Reveal>

        <h2 className="mt-16 font-mono text-sm uppercase tracking-[0.2em] text-accent-soft">
          Our process
        </h2>
        <div className="mt-6 divide-y divide-canvas-border border-t border-canvas-border">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.06}>
              <div className="flex gap-5 py-6">
                <span className="font-mono text-sm text-accent-soft">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-display text-lg font-semibold text-ink">
                    {step.title}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                    {step.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <figure className="mt-14 max-w-xl border-l-2 border-mint pl-6">
            <Quote className="h-5 w-5 text-mint" aria-hidden="true" />
            <blockquote className="mt-3 text-balance text-lg italic leading-relaxed text-ink">
              &ldquo;{quote.text}&rdquo;
            </blockquote>
            <figcaption className="mt-4 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
              {quote.author} — {quote.company}
            </figcaption>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
