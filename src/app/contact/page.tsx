import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
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

// Free, no-API-key embed — the alternative (a genuinely dark-themed map)
// needs the Google Maps JavaScript API with a billing-enabled Cloud
// project and its own key, which isn't something to set up without you.
// The CSS filter below is a common workaround: it inverts the map's light
// tiles into a dark, roughly on-theme look, and lifts back to true color
// on hover so street names/labels are still legible when actually read.
const mapQuery = encodeURIComponent(site.location);
const mapEmbedSrc = `https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`;
const mapLinkHref = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

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

          <Reveal onMount delay={0.32} className="group relative mt-6 overflow-hidden rounded-2xl border border-canvas-border">
            <iframe
              src={mapEmbedSrc}
              title={`Map showing ${site.name}'s location`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0 }}
              className="h-52 w-full invert-[0.92] hue-rotate-180 transition-[filter] duration-500 group-hover:invert-0 group-hover:hue-rotate-0"
            />
            <a
              href={mapLinkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-canvas-border bg-canvas/90 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted backdrop-blur-sm transition-colors hover:text-ink"
            >
              Open in Maps
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </Reveal>
        </div>

        <Reveal onMount delay={0.12} className="relative rounded-3xl border border-canvas-border bg-canvas-surface/40 p-8 md:p-10">
          <ContactForm />
        </Reveal>
      </Container>
    </section>
  );
}
