import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Reveal from "@/components/ui/Reveal";
import ProjectThumb from "@/components/ui/ProjectThumb";
import CTASection from "@/components/sections/CTASection";

export const metadata = buildMetadata({
  title: "Work",
  description: `Case studies from businesses ${site.name} has built AI systems for.`,
  path: "/work",
});

export default function WorkPage() {
  return (
    <>
      <section className="pb-16 pt-40 md:pb-20 md:pt-48">
        <Container>
          <Badge>Our work</Badge>
          <Reveal onMount delay={0.08}>
            <h1 className="mt-6 max-w-3xl text-balance font-display text-display-lg font-semibold text-ink">
              Real businesses, measurable outcomes
            </h1>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-canvas-border py-16 md:py-20">
        <Container className="grid gap-6 lg:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.06}>
              <Link
                href={`/work/${project.slug}`}
                className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-canvas-border bg-canvas-surface/40 transition-all duration-500 ease-premium hover:border-accent/40 hover:bg-canvas-surface"
              >
                <ProjectThumb index={i} label={`${project.industry} — ${project.client}`} />
                <div className="p-8">
                  <h2 className="font-display text-2xl font-semibold text-ink">
                    {project.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    {project.summary}
                  </p>
                </div>
                <div className="mt-auto flex flex-wrap gap-6 border-t border-canvas-border px-8 py-6">
                  {project.results.map((r) => (
                    <div key={r.label}>
                      <p className="font-display text-2xl font-semibold text-ink">{r.value}</p>
                      <p className="text-xs text-ink-faint">{r.label}</p>
                    </div>
                  ))}
                  <ArrowRight className="ml-auto h-5 w-5 self-center text-ink-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ink" />
                </div>
              </Link>
            </Reveal>
          ))}
        </Container>
      </section>

      <CTASection />
    </>
  );
}
