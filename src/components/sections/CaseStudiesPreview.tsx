import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { projects } from "@/data/projects";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ProjectThumb from "@/components/ui/ProjectThumb";

export default function CaseStudiesPreview({ limit = 3 }: { limit?: number }) {
  const list = projects.slice(0, limit);

  return (
    <section className="border-t border-canvas-border py-24 md:py-32">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Results"
            title="Real businesses, measurable outcomes"
            description="A few of the systems we've designed, built, and kept running."
          />
          <Link
            href="/work"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            View all work
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {list.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.08}>
              <Link
                href={`/work/${project.slug}`}
                className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-canvas-border bg-canvas-surface/40 transition-all duration-500 ease-premium hover:border-accent/40 hover:bg-canvas-surface"
              >
                <ProjectThumb index={i} label={project.industry} />
                <div className="p-8">
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    {project.summary}
                  </p>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-canvas-border px-8 py-6">
                  <div>
                    <p className="font-display text-2xl font-semibold text-ink">
                      {project.results[0]?.value}
                    </p>
                    <p className="text-xs text-ink-faint">{project.results[0]?.label}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-ink-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ink" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
