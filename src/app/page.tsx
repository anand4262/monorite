import { buildMetadata } from "@/lib/seo";
import { site } from "@/data/site";
import { services } from "@/data/services";
import { projects } from "@/data/projects";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Reveal from "@/components/ui/Reveal";
import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import ComparisonSlider from "@/components/sections/ComparisonSlider";
import BigStatement from "@/components/sections/BigStatement";
import ServicesCarousel from "@/components/sections/ServicesCarousel";
import StatsBand from "@/components/sections/StatsBand";
import ProcessSteps from "@/components/sections/ProcessSteps";
import WorkCarousel from "@/components/sections/WorkCarousel";
import Studio from "@/components/sections/Studio";
import Testimonials from "@/components/sections/Testimonials";
import CTASection from "@/components/sections/CTASection";

export const metadata = buildMetadata({
  title: site.name,
  description: site.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ComparisonSlider />
      <BigStatement />

      <section id="services" className="pt-24 md:pt-32">
        <Container>
          <Badge>Services</Badge>
          <Reveal delay={0.08}>
            <h2 className="mt-6 max-w-3xl text-balance font-display text-display-lg font-semibold text-ink">
              Every piece your business needs to run itself
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-8 max-w-2xl text-balance text-lg leading-relaxed text-ink-muted">
              We work service by service or as a full system, starting
              wherever the friction is worst.
            </p>
          </Reveal>
        </Container>
      </section>
      <ServicesCarousel
        services={services.map(({ icon: _icon, ...service }) => service)}
      />

      <StatsBand />
      <ProcessSteps />

      <section id="work" className="pt-24 md:pt-32">
        <Container>
          <Badge>Our work</Badge>
          <Reveal delay={0.08}>
            <h2 className="mt-6 max-w-3xl text-balance font-display text-display-lg font-semibold text-ink">
              Real businesses, measurable outcomes
            </h2>
          </Reveal>
        </Container>
      </section>
      <WorkCarousel projects={projects} />

      <Studio />
      <Testimonials />
      <CTASection />
    </>
  );
}
