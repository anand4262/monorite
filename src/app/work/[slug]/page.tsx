import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
    title: `${project.client}: ${project.title}`,
    description: project.summary,
    path: `/work/${project.slug}`,
  });
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const isPlayStore = project.visitUrl?.includes("play.google.com");
  const currentIndex = projects.findIndex((p) => p.slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];
  const isPortrait = project.orientation === "portrait";

  // A spec-sheet style dossier — every "at a glance" fact about the
  // project (industry, services, stack, results, the live link) collapsed
  // into one dotted-leader readout instead of three separate page
  // sections a reader has to piece together themselves.
  const specRows: { label: string; value: React.ReactNode }[] = [
    { label: "Industry", value: project.industry },
    {
      label: "Services",
      value: (
        <span className="flex flex-wrap justify-end gap-x-2 gap-y-1">
          {project.services.map((slug, i) => {
            const service = getServiceBySlug(slug);
            if (!service) return null;
            return (
              <span key={slug}>
                <Link href={`/services/${slug}`} className="underline decoration-canvas-border underline-offset-4 transition-colors hover:text-accent-soft">
                  {service.name}
                </Link>
                {i < project.services.length - 1 && ","}
              </span>
            );
          })}
        </span>
      ),
    },
    ...(project.stack?.length ? [{ label: "Built with", value: project.stack.join(", ") }] : []),
    ...project.results.map((r) => ({ label: r.label, value: r.value })),
    ...(project.visitUrl
      ? [
          {
            label: "Live",
            value: (
              <a
                href={project.visitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-accent-soft underline decoration-canvas-border underline-offset-4 transition-colors hover:text-ink"
              >
                {isPlayStore ? "Google Play" : "Visit site"}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <section className="pb-12 pt-40 md:pb-16 md:pt-48">
        <Container>
          <div className="flex items-center gap-4">
            {project.icon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.icon}
                alt={`${project.client} icon`}
                className="h-12 w-12 rounded-2xl object-cover shadow-lg shadow-black/30 ring-1 ring-canvas-border"
              />
            )}
            <Badge>{project.industry}</Badge>
            {project.visitUrl && (
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-mint">
                <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                Live
              </span>
            )}
          </div>
          <Reveal onMount delay={0.08}>
            <h1 className="mt-6 text-balance font-display text-6xl font-semibold leading-[1.02] text-ink md:text-8xl">
              {project.client}
            </h1>
          </Reveal>
          <Reveal onMount delay={0.16}>
            <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-ink-muted">
              {project.title}
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="pb-20 md:pb-28">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr] lg:items-stretch">
            {project.image && (
              <Reveal onMount delay={0.24} blurIn>
                <div
                  className={`relative flex items-center justify-center overflow-hidden rounded-3xl border border-canvas-border bg-canvas-soft ${
                    isPortrait ? "h-[420px] p-6 md:h-[560px]" : "h-[300px] p-6 md:h-[560px] md:p-10"
                  }`}
                >
                  {/* Blurred backdrop keeps the frame filled even when the
                     real screenshot is a tall phone capture rather than a
                     landscape banner. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full scale-125 object-cover opacity-25 blur-3xl"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={`${project.client}: ${project.title}`}
                    className="relative h-auto max-h-full w-auto max-w-full rounded-xl object-contain shadow-2xl shadow-black/40"
                  />
                </div>
              </Reveal>
            )}

            <Reveal delay={0.1}>
              <div className="flex h-full flex-col rounded-3xl border border-canvas-border p-8">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-soft">
                  At a glance
                </p>
                <div className="mt-6 flex-1 divide-y divide-canvas-border/60">
                  {specRows.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-baseline justify-between gap-4 py-3.5 font-mono text-sm first:pt-0"
                    >
                      <span className="shrink-0 uppercase tracking-[0.1em] text-ink-faint">
                        {row.label}
                      </span>
                      <span className="text-right text-ink">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-t border-canvas-border py-20 md:py-28">
        <Container>
          <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-accent-soft">
            The journey
          </h2>
          <p className="mt-3 max-w-xl text-ink-muted">
            From first conversation to a live product: how {project.client} came together.
          </p>

          {project.journey?.length ? (
            <div className="mt-14">
              {project.journey.map((step, i) => (
                <div
                  key={step.step}
                  className={i === project.journey!.length - 1 ? "" : "border-b border-canvas-border"}
                >
                  <Reveal blurIn delay={i * 0.06}>
                    <div className="grid gap-4 py-8 md:grid-cols-[3.5rem_1fr_1.4fr] md:items-start md:gap-10 md:py-10">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-canvas-border font-mono text-xs text-ink-faint">
                        {step.step}
                      </span>
                      <h3 className="font-display text-xl font-semibold text-ink md:text-2xl">
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-ink-muted md:max-w-md">
                        {step.description}
                      </p>
                    </div>
                  </Reveal>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12 grid gap-12 md:grid-cols-2">
              <Reveal>
                <h3 className="font-display text-2xl font-semibold text-ink">The challenge</h3>
                <p className="mt-4 leading-relaxed text-ink-muted">{project.challenge}</p>
              </Reveal>
              <Reveal delay={0.08}>
                <h3 className="font-display text-2xl font-semibold text-ink">The solution</h3>
                <p className="mt-4 leading-relaxed text-ink-muted">{project.solution}</p>
              </Reveal>
            </div>
          )}
        </Container>
      </section>

      {project.screenshots && project.screenshots.length > 1 && (
        <section className="border-t border-canvas-border py-16 md:py-20">
          <Container>
            <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-accent-soft">
              A closer look
            </h2>
            <p className="mt-3 max-w-xl text-ink-muted">
              {isPortrait
                ? `Every screen, straight from ${project.client}.`
                : `A few real shots from the finished ${project.client} site.`}
            </p>

            {isPortrait ? (
              // Portrait app screens read best as a horizontal filmstrip at
              // a consistent, bounded height — a wide grid either shrinks
              // them to nothing or stretches the row absurdly tall.
              <div className="mt-8 flex gap-4 overflow-x-auto pb-4">
                {project.screenshots.slice(1).map((shot, i) => (
                  <Reveal key={shot} delay={i * 0.05}>
                    <div className="h-[360px] w-[180px] shrink-0 overflow-hidden rounded-2xl border border-canvas-border bg-canvas-soft">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={shot}
                        alt={`${project.client} screenshot ${i + 1}`}
                        className="h-full w-full object-cover transition-transform duration-500 ease-premium hover:scale-105"
                      />
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {project.screenshots.slice(1).map((shot, i) => (
                  <Reveal key={shot} delay={i * 0.05}>
                    <div className="h-56 overflow-hidden rounded-2xl border border-canvas-border bg-canvas-soft">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={shot}
                        alt={`${project.client} screenshot ${i + 1}`}
                        className="h-full w-full object-cover transition-transform duration-500 ease-premium hover:scale-105"
                      />
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </Container>
        </section>
      )}

      {nextProject && nextProject.slug !== project.slug && (
        <section className="border-t border-canvas-border">
          <Link href={`/work/${nextProject.slug}`} className="group block">
            <Container className="flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center md:py-20">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
                  Next up
                </span>
                <h2 className="mt-3 font-display text-3xl font-semibold text-ink transition-colors duration-300 group-hover:text-accent-soft md:text-4xl">
                  {nextProject.client}
                </h2>
                <p className="mt-2 max-w-lg text-ink-muted">{nextProject.summary}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-canvas-border px-5 py-2.5 text-sm text-ink-muted transition-all duration-300 group-hover:border-accent/40 group-hover:text-ink">
                View project
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Container>
          </Link>
        </section>
      )}

      <CTASection />
    </>
  );
}
