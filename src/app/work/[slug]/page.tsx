import { notFound } from "next/navigation";
import Link from "next/link";
import { projects, getProjectBySlug } from "@/data/projects";
import { getServiceBySlug } from "@/data/services";
import { buildMetadata } from "@/lib/seo";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Reveal from "@/components/ui/Reveal";
import CTASection from "@/components/sections/CTASection";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) return buildMetadata({ title: "Case study not found", noIndex: true });
  return buildMetadata({
    title: `${project.client} — ${project.title}`,
    description: project.summary,
    path: `/work/${project.slug}`,
  });
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <>
      <section className="pb-16 pt-40 md:pb-20 md:pt-48">
        <Container>
          <Badge>{project.industry}</Badge>
          <Reveal onMount delay={0.08}>
            <h1 className="mt-6 max-w-3xl text-balance font-display text-display-lg font-semibold text-ink">
              {project.title}
            </h1>
          </Reveal>
          <Reveal onMount delay={0.16}>
            <p className="mt-6 text-lg text-ink-muted">{project.client}</p>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-canvas-border py-16">
        <Container>
          <div className="grid gap-6 sm:grid-cols-3">
            {project.results.map((r) => (
              <div
                key={r.label}
                className="rounded-2xl border border-canvas-border bg-canvas-surface/40 p-8 text-center"
              >
                <p className="font-display text-4xl font-semibold text-ink">{r.value}</p>
                <p className="mt-2 text-sm text-ink-muted">{r.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-canvas-border py-20 md:py-28">
        <Container className="grid gap-12 md:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold text-ink">The challenge</h2>
            <p className="mt-4 leading-relaxed text-ink-muted">{project.challenge}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display text-2xl font-semibold text-ink">The solution</h2>
            <p className="mt-4 leading-relaxed text-ink-muted">{project.solution}</p>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-canvas-border py-16">
        <Container>
          <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-accent-soft">
            Services used
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {project.services.map((slug) => {
              const service = getServiceBySlug(slug);
              if (!service) return null;
              return (
                <Link
                  key={slug}
                  href={`/services/${slug}`}
                  className="rounded-full border border-canvas-border px-4 py-2 text-sm text-ink-muted transition-colors hover:border-accent/40 hover:text-ink"
                >
                  {service.name}
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
