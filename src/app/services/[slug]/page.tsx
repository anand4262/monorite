import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { services, getServiceBySlug } from "@/data/services";
import {
  integrationDemos,
  dashboardContent,
  problemStatements,
  howItWorksFallback,
  faqContent,
} from "@/data/service-content";
import { buildMetadata, buildFaqJsonLd, buildServiceJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import CTASection from "@/components/sections/CTASection";
import IntegrationDemoPanel from "@/components/sections/service-panels/IntegrationDemoPanel";
import DashboardPanel from "@/components/sections/service-panels/DashboardPanel";
import { ServiceArtPanel } from "@/components/ui/ServiceVisual";
import FaqAccordion from "@/components/ui/FaqAccordion";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);
  if (!service) return buildMetadata({ title: "Service not found", noIndex: true });
  return buildMetadata({
    title: service.seoTitle,
    description: service.seoDescription,
    path: `/services/${service.slug}`,
  });
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  const integrationDemo = integrationDemos[service.slug];
  const dashboard = dashboardContent[service.slug];
  const fallbackSteps = howItWorksFallback[service.slug];
  const faqs = faqContent[service.slug] ?? [];

  return (
    <>
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          // Internally-defined, non-user-supplied data — safe to serialize directly.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(faqs)) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildServiceJsonLd({ name: service.name, description: service.description, slug: service.slug }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbJsonLd([{ name: service.name, path: `/services/${service.slug}` }]),
          ),
        }}
      />
      <section className="pb-20 pt-40 md:pb-28 md:pt-48">
        <Container className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <Badge>{service.category}</Badge>
            <Reveal onMount delay={0.08}>
              <h1 className="mt-6 text-balance font-display text-display-xl font-semibold leading-[1.02] text-ink">
                {service.name}
              </h1>
            </Reveal>
            <Reveal onMount delay={0.16}>
              <p className="mt-8 max-w-xl text-balance text-lg leading-relaxed text-ink-muted">
                {service.description}
              </p>
            </Reveal>
            <Reveal onMount delay={0.24} className="mt-10 flex flex-wrap items-center gap-4">
              <MagneticButton href="/contact">Talk to us about this</MagneticButton>
              {service.slug === "ai-assistants" && (
                <Link
                  href="/ai-receptionist"
                  className="text-sm font-medium text-ink-muted underline decoration-canvas-border underline-offset-4 transition-colors hover:text-ink"
                >
                  See our AI phone receptionist pilot →
                </Link>
              )}
            </Reveal>
          </div>

          <Reveal onMount delay={0.2}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-canvas-border">
              <ServiceArtPanel image={service.image} category={service.category} />
            </div>
          </Reveal>
        </Container>
      </section>

      {problemStatements[service.slug] && (
        <section className="border-t border-canvas-border py-20 md:py-28">
          <Container>
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent-soft">
              The problem
            </p>
            <Reveal delay={0.08}>
              <p className="mt-6 max-w-3xl text-balance font-display text-2xl font-semibold leading-snug text-ink md:text-3xl">
                {problemStatements[service.slug]}
              </p>
            </Reveal>
          </Container>
        </section>
      )}

      {integrationDemo && <IntegrationDemoPanel {...integrationDemo} />}
      {dashboard && <DashboardPanel {...dashboard} />}
      {fallbackSteps && (
        <section className="border-t border-canvas-border py-20 md:py-28">
          <Container>
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent-soft">
              How it works
            </p>
            <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-3">
              {fallbackSteps.map((step, i) => (
                <Reveal key={step.title} delay={i * 0.08}>
                  <p className="font-mono text-sm text-ink-faint">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 font-display text-xl font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 text-balance leading-relaxed text-ink-muted">{step.description}</p>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="border-t border-canvas-border py-20 md:py-28">
        <Container>
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent-soft">
            What's included
          </p>
          <div className="mt-8 divide-y divide-canvas-border border-t border-canvas-border">
            {service.bullets.map((bullet, i) => (
              <Reveal key={bullet} delay={i * 0.05}>
                <div className="flex items-start gap-6 py-6">
                  <span className="font-mono text-sm text-ink-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-balance text-base text-ink-muted md:text-lg">{bullet}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-14">
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent-soft">
              What changes
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {service.outcomes.map((outcome) => (
                <span
                  key={outcome}
                  className="inline-flex items-center gap-2 rounded-full border border-canvas-border px-4 py-2 text-sm text-ink"
                >
                  <Check className="h-4 w-4 shrink-0 text-accent-soft" />
                  {outcome}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {faqs.length > 0 && (
        <section className="border-t border-canvas-border py-20 md:py-28">
          <Container>
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent-soft">FAQ</p>
            <FaqAccordion items={faqs} />
          </Container>
        </section>
      )}

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
