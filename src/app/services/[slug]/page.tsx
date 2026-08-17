import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { services, getServiceBySlug } from "@/data/services";
import { buildMetadata } from "@/lib/seo";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import CTASection from "@/components/sections/CTASection";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);
  if (!service) return buildMetadata({ title: "Service not found", noIndex: true });
  return buildMetadata({
    title: service.name,
    description: service.shortDescription,
    path: `/services/${service.slug}`,
  });
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  const Icon = service.icon;
  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <section className="pb-20 pt-40 md:pb-28 md:pt-48">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <Badge>{service.category}</Badge>
            <Reveal onMount delay={0.08}>
              <div className="mt-6 flex items-center gap-4">
                <Icon className="h-10 w-10 text-accent-soft" strokeWidth={1.5} />
                <h1 className="text-balance font-display text-display-md font-semibold text-ink">
                  {service.name}
                </h1>
              </div>
            </Reveal>
            <Reveal onMount delay={0.16}>
              <p className="mt-8 max-w-xl text-balance text-lg leading-relaxed text-ink-muted">
                {service.description}
              </p>
            </Reveal>
            <Reveal onMount delay={0.24} className="mt-10">
              <MagneticButton href="/contact">Talk to us about this</MagneticButton>
            </Reveal>
          </div>

          <Reveal onMount delay={0.2}>
            <div className="rounded-2xl border border-canvas-border bg-canvas-surface/40 p-8">
              <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-accent-soft">
                What changes
              </h2>
              <ul className="mt-6 space-y-4">
                {service.outcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-3 text-ink">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-mint" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-canvas-border py-20 md:py-28">
        <Container>
          <h2 className="font-display text-display-md font-semibold text-ink">
            What's included
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {service.bullets.map((bullet, i) => (
              <Reveal
                key={bullet}
                delay={i * 0.06}
                className="flex items-start gap-3 rounded-xl border border-canvas-border bg-canvas-surface/30 p-6"
              >
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent-soft" />
                <span className="text-ink-muted">{bullet}</span>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-canvas-border py-20 md:py-28">
        <Container>
          <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-accent-soft">
            Often paired with
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {related.map((s) => {
              const RelIcon = s.icon;
              return (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group flex items-start gap-4 rounded-2xl border border-canvas-border bg-canvas-surface/30 p-6 transition-all duration-500 ease-premium hover:border-accent/40"
                >
                  <RelIcon className="mt-1 h-6 w-6 shrink-0 text-accent-soft" strokeWidth={1.5} />
                  <div>
                    <h3 className="font-medium text-ink">{s.name}</h3>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs text-ink-muted transition-colors group-hover:text-accent-soft">
                      Learn more <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
