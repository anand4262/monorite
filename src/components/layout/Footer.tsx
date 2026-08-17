import Link from "next/link";
import { Linkedin, Twitter, Instagram } from "lucide-react";
import { site } from "@/data/site";
import { footerNav } from "@/data/nav";
import Container from "../ui/Container";
import Logo from "../ui/Logo";
import FooterMarquee from "./FooterMarquee";

export default function Footer() {
  return (
    <footer className="border-t border-canvas-border bg-canvas-soft">
      <FooterMarquee />
      <Container className="py-20">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5 font-display text-xl font-semibold text-ink">
              <Logo size={34} />
              {site.name}
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
              {site.tagline}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn"
                className="text-ink-muted transition-colors hover:text-ink"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href={site.social.twitter}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="X (Twitter)"
                className="text-ink-muted transition-colors hover:text-ink"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Instagram"
                className="text-ink-muted transition-colors hover:text-ink"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {footerNav.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-ink">{group.title}</h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-canvas-border pt-8 text-xs text-ink-faint md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <p>{site.location}</p>
        </div>
      </Container>
    </footer>
  );
}
