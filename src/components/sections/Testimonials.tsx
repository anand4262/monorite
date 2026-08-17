import { Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

// Alternating tilt, vertical offset, and "tape" angle so the grid reads as a
// pinned notice-board of notes rather than a uniform card grid. Cycled by
// index; hover straightens the card back to rotate-0 for a tactile feel.
const noteStyle = [
  { rotate: "-rotate-2", shift: "lg:translate-y-0", tape: "-rotate-6" },
  { rotate: "rotate-1", shift: "lg:translate-y-5", tape: "rotate-3" },
  { rotate: "-rotate-1", shift: "lg:-translate-y-3", tape: "-rotate-3" },
  { rotate: "rotate-2", shift: "lg:translate-y-3", tape: "rotate-6" },
];

export default function Testimonials() {
  return (
    <section className="overflow-hidden border-t border-canvas-border py-24 md:py-32">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Client voices"
          title="What it's like to work with us"
          className="mx-auto"
        />

        <div className="mt-20 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:items-start">
          {testimonials.map((t, i) => {
            const style = noteStyle[i % noteStyle.length]!;
            return (
              <div key={t.author} className={style.shift}>
                <Reveal delay={i * 0.07}>
                  <figure
                    className={`group/note relative h-full rounded-sm border border-canvas-border bg-canvas-surface p-7 shadow-[0_18px_36px_-24px_rgba(0,0,0,0.5)] transition-all duration-500 ease-premium ${style.rotate} hover:rotate-0 hover:shadow-[0_24px_44px_-20px_rgba(0,0,0,0.6)]`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 rounded-[2px] border border-ink/10 bg-ink/10 backdrop-blur-sm transition-transform duration-500 ease-premium ${style.tape} group-hover/note:rotate-0`}
                    />

                    <Quote className="h-5 w-5 text-accent-soft" aria-hidden="true" />
                    <blockquote className="mt-5 text-balance text-sm leading-relaxed text-ink">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-6 border-t border-canvas-border pt-4 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
                      <span className="text-ink">{t.author}</span>
                      <br />
                      {t.role}, {t.company}
                    </figcaption>
                  </figure>
                </Reveal>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
