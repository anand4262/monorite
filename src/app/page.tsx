import { buildMetadata } from "@/lib/seo";
import { site } from "@/data/site";
import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import BigStatement from "@/components/sections/BigStatement";
import ServicesGrid from "@/components/sections/ServicesGrid";
import StatsBand from "@/components/sections/StatsBand";
import ProcessSteps from "@/components/sections/ProcessSteps";
import CaseStudiesPreview from "@/components/sections/CaseStudiesPreview";
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
      <BigStatement />
      <ServicesGrid limit={6} />
      <StatsBand />
      <ProcessSteps />
      <CaseStudiesPreview limit={3} />
      <Testimonials />
      <CTASection />
    </>
  );
}
