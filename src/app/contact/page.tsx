import { Mail, Phone, MapPin } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/data/site";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/sections/ContactForm";

export const metadata = buildMetadata({
  title: "Contact",
  description: `Get in touch with ${site.name} to talk through your AI or automation project.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section className="pb-24 pt-40 md:pb-32 md:pt-48">
      <Container className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Badge>Contact</Badge>
          <Reveal onMount delay={0.08}>
            <h1 className="mt-6 text-balance font-display text-display-lg font-semibold text-ink">
              Let's find the friction in your business
            </h1>
          </Reveal>
          <Reveal onMount delay={0.16}>
            <p className="mt-6 max-w-md text-balance text-lg leading-relaxed text-ink-muted">
              Tell us a bit about what's slow, manual, or getting missed. We
              read every message and reply within one business day.
            </p>
          </Reveal>

          <Reveal onMount delay={0.24} className="mt-10 space-y-5">
            <a
              href={`mailto:${site.email}`}
              className="flex items-center gap-3 text-ink-muted transition-colors hover:text-ink"
            >
              <Mail className="h-5 w-5 text-accent-soft" />
              {site.email}
            </a>
            <a
              href={`tel:${site.phone.replace(/[^0-9+]/g, "")}`}
              className="flex items-center gap-3 text-ink-muted transition-colors hover:text-ink"
            >
              <Phone className="h-5 w-5 text-accent-soft" />
              {site.phone}
            </a>
            <div className="flex items-center gap-3 text-ink-muted">
              <MapPin className="h-5 w-5 text-accent-soft" />
              {site.location}
            </div>
          </Reveal>
        </div>

        <Reveal onMount delay={0.12} className="relative rounded-3xl border border-canvas-border bg-canvas-surface/40 p-8 md:p-10">
          <ContactForm />
        </Reveal>
      </Container>
    </section>
  );
}
