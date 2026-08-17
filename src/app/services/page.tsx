import { buildMetadata } from "@/lib/seo";
import { site } from "@/data/site";
import { services } from "@/data/services";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Reveal from "@/components/ui/Reveal";
import ProjectThumb from "@/components/ui/ProjectThumb";
import CTASection from "@/components/sections/CTASection";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = buildMetadata({
  title: "Services",
  description: `Every AI and automation service offered by ${site.name}, from call assistants to full systems integration.`,
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <section className="pb-16 pt-40 md:pb-20 md:pt-48">
        <Container>
          <Badge>Services</Badge>
          <Reveal onMount delay={0.08}>
            <h1 className="mt-6 max-w-3xl text-balance font-display text-display-lg font-semibold text-ink">
              Every piece your business needs to run itself
            </h1>
          </Reveal>
          <Reveal onMount delay={0.16}>
            <p className="mt-8 max-w-2xl text-balance text-lg leading-relaxed text-ink-muted">
              We work service by service or as a full system — starting
              wherever the friction is worst.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* One service per full-width row rather than a flat card grid: a
          bracket index, a large display headline, an abstract visual (the
          same gradient-panel language used on the work cards), and the
          service's outcomes as a short mono tag list. Much more editorial
          rhythm than a uniform grid, and it gives each service room to
          breathe. */}
      <div className="border-t border-canvas-border">
        {services.map((service, i) => {
          const Icon = service.icon;
          const index = String(i + 1).padStart(2, "0");

          return (
            <section key={service.slug} className="border-b border-canvas-border">
              <Container>
                <Reveal blurIn delay={Math.min(i * 0.04, 0.2)}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group grid gap-8 py-14 md:py-16 lg:grid-cols-[1.1fr_1fr_0.7fr] lg:items-center lg:gap-12"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-ink-faint">[ {index} ]</span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-soft">
                          {service.category}
                        </span>
                      </div>

                      <h2 className="mt-4 font-display text-2xl font-semibold text-ink transition-colors duration-300 group-hover:text-accent-soft md:text-3xl">
                        {service.name}
                      </h2>
                      <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
                        {service.shortDescription}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors group-hover:text-accent-soft">
                        Learn more
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>

                    <ProjectThumb
                      index={i}
                      label={service.category}
                      className="aspect-[4/3] rounded-2xl border border-canvas-border"
                      ctaLabel="View service"
                    />

                    <div className="flex flex-col gap-3 lg:items-end">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-canvas-border bg-canvas-surface text-accent-soft">
                        <Icon className="h-5 w-5" strokeWidth={1.5} />
                      </span>
                      {service.outcomes.map((outcome) => (
                        <span
                          key={outcome}
                          className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint lg:text-right"
                        >
                          {outcome}
                        </span>
                      ))}
                    </div>
                  </Link>
                </Reveal>
              </Container>
            </section>
          );
        })}
      </div>

      <CTASection />
    </>
  );
}
