import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { services } from "@/data/services";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";

/**
 * A bento-style grid: the first service is treated as the flagship and gets
 * a large tile with abstract gradient art (tying it to the same visual
 * language as the work-card thumbnails and the About collage), while the
 * rest stay compact. Breaks up what was previously a flat, uniform card
 * grid with no texture anywhere in the section.
 */
export default function ServicesGrid({ limit }: { limit?: number }) {
  const list = limit ? services.slice(0, limit) : services;

  return (
    <section className="py-24 md:py-32">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="What we build"
            title="Every piece your business needs to run itself"
            description="From the first ring of the phone to the invoice that follows, each service is designed to remove a specific point of friction."
          />
          {limit && (
            <Link
              href="/services"
              className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            >
              View all services
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((service, i) => {
            const Icon = service.icon;
            const isFeature = i === 0;
            const index = String(i + 1).padStart(2, "0");

            return (
              <Reveal
                key={service.slug}
                delay={Math.min(i * 0.06, 0.3)}
                className={isFeature ? "md:col-span-2 lg:col-span-2 lg:row-span-2" : undefined}
              >
                <Link href={`/services/${service.slug}`} className="block h-full">
                  <Card className={`h-full ${isFeature ? "p-8 md:p-10 lg:p-12" : ""}`}>
                    {isFeature && (
                      <>
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.35),transparent_65%)] blur-2xl"
                        />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(63,232,184,0.22),transparent_65%)] blur-2xl"
                        />
                      </>
                    )}

                    <div className="flex items-start justify-between">
                      <span
                        className={`inline-flex items-center justify-center rounded-xl border border-canvas-border bg-canvas-surface text-accent-soft ${
                          isFeature ? "h-14 w-14" : "h-12 w-12"
                        }`}
                      >
                        <Icon className={isFeature ? "h-6 w-6" : "h-5 w-5"} strokeWidth={1.5} />
                      </span>
                      <span className="font-mono text-[11px] text-ink-faint">{index}</span>
                    </div>

                    <span className="mt-6 block font-mono text-[10px] uppercase tracking-[0.2em] text-accent-soft">
                      {service.category}
                    </span>

                    <h3
                      className={`mt-2 font-display font-semibold text-ink ${
                        isFeature ? "text-2xl md:text-3xl" : "text-lg"
                      }`}
                    >
                      {service.name}
                    </h3>

                    <p
                      className={`mt-3 leading-relaxed text-ink-muted ${
                        isFeature ? "max-w-md text-base" : "text-sm"
                      }`}
                    >
                      {isFeature ? service.description : service.shortDescription}
                    </p>

                    <span
                      className={`mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent-soft transition-opacity duration-300 ${
                        isFeature ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      Learn more
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Card>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
