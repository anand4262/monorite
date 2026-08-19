"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types";
import { getServiceBySlug } from "@/data/services";
import SwipeCarousel from "@/components/ui/SwipeCarousel";
import Reveal from "@/components/ui/Reveal";

function ProjectImage({ project }: { project: Project }) {
  return project.image && project.orientation === "portrait" ? (
    <>
      {/* Blurred cover backdrop fills the fixed 4:3 frame; the real
         screenshot sits on top at full aspect via object-contain so a
         portrait phone capture doesn't get cropped top/bottom to fit a
         landscape box. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={project.image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-125 object-cover opacity-30 blur-2xl"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={project.image}
        alt={`${project.client}: ${project.title}`}
        className="absolute inset-0 h-full w-full object-contain p-6"
      />
    </>
  ) : (
    project.image && (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={project.image}
        alt={`${project.client}: ${project.title}`}
        className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
      />
    )
  );
}

/** Client / Services metadata row — the same monospace label-value
 * vocabulary as the case-study "At a glance" panel, surfaced here on the
 * listing card itself rather than only after clicking in. */
function ProjectMeta({ project }: { project: Project }) {
  const serviceNames = project.services
    .map((slug) => getServiceBySlug(slug)?.name)
    .filter(Boolean)
    .join(", ");

  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-canvas-border pb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
      <span>{project.industry}</span>
      {serviceNames && <span className="text-right">{serviceNames}</span>}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-canvas-border bg-canvas-soft">
        <ProjectImage project={project} />
      </div>

      <div className="mt-5">
        <ProjectMeta project={project} />
        <h3 className="mt-4 font-display text-3xl font-semibold leading-[1.05] text-ink transition-colors duration-300 ease-premium group-hover:text-accent-soft">
          {project.client}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{project.summary}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-ink">
          View case study
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}

/**
 * Desktop: a scannable two-column grid rather than a pinned, scroll-jacked
 * one-at-a-time sequence — with four case studies total, a grid lets a
 * visitor see the whole body of work without scrolling through a fixed
 * viewport-height sequence to reach the last one.
 */
function DesktopGrid({ projects }: { projects: Project[] }) {
  return (
    <section className="hidden pb-24 pt-12 md:block md:pb-32">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-10 gap-y-16 px-6 md:px-10">
        {projects.map((project, i) => (
          <Reveal key={project.slug} blurIn delay={i * 0.08}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/**
 * Mobile: no scroll-jacking, no numbered tab-switcher. A fixed section
 * showing one project at a time, swiped via Embla, image first and text
 * underneath. Dots below show position instead of a peeking next card.
 */
function MobileCarousel({ projects }: { projects: Project[] }) {
  return (
    <section className="pb-16 pt-8 md:hidden">
      <SwipeCarousel
        items={projects}
        keyFor={(project) => project.slug}
        renderItem={(project) => <ProjectCard project={project} />}
      />
    </section>
  );
}

export default function WorkCarousel({ projects }: { projects: Project[] }) {
  return (
    <>
      <DesktopGrid projects={projects} />
      <MobileCarousel projects={projects} />
    </>
  );
}
