"use client";

import { useState } from "react";
import Image from "next/image";
import { team } from "@/data/team";
import { site } from "@/data/site";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import SwipeCarousel from "@/components/ui/SwipeCarousel";

/** The site never uses color as a signal anywhere else, so attention here
 * is earned with contrast instead: portraits sit desaturated and dim by
 * default, and only sharpen to full tone on hover/focus. No accent hue is
 * introduced, keeping this consistent with the rest of the monochrome
 * system rather than importing a generic "team grid" pattern. */
export default function Founders() {
  return (
    <section id="founders" className="border-t border-canvas-border py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Founders"
          title="The two of us, actually building it."
          description="No studio, no bench of juniors handed the work. Every system that ships from Monorite has both our names on it."
        />

        <Reveal delay={0.16} blurIn>
          <div className="mt-14 overflow-hidden rounded-3xl border border-canvas-border bg-canvas-surface/60 md:grid md:grid-cols-[1.1fr_0.9fr]">
            {/* Side by side on desktop, where both photos are on screen at
             * once and grayscale-by-default is what tells you which one has
             * attention. On mobile only one slide is ever visible at a time,
             * so that same contrast trick has nothing to contrast against —
             * a full-bleed autoplaying, swipeable carousel with the caption
             * always on suits a phone better than two cramped narrow
             * columns. */}
            <div className="hidden md:grid md:grid-cols-2">
              {team.map((member, i) => (
                <FounderPortrait key={member.name} member={member} index={i} />
              ))}
            </div>
            <div className="pt-8 md:hidden">
              <SwipeCarousel
                items={team}
                keyFor={(member) => member.name}
                autoplayDelay={4500}
                renderItem={(member) => (
                  <FounderPortrait
                    member={member}
                    index={team.indexOf(member)}
                    forceActive
                    className="rounded-2xl border border-canvas-border"
                  />
                )}
              />
            </div>
            <div className="flex flex-col justify-center px-8 py-10 md:px-10">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                Who&apos;s actually behind this
              </span>
              <p className="mt-4 text-balance font-display text-xl font-semibold text-ink">
                Two people who read your business before writing a line of code.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                Mahesh came up freelance, full stack, working straight with founders and small business
                owners instead of behind an account manager. Rahul&apos;s background sits at the other end
                of the stack: backend systems built to hold up under real production load, not a demo.
                Monorite is both of those instincts working the same problem at once, not split across
                departments.
              </p>

              <p className="mt-6 border-t border-canvas-border pt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
                Building it this way since {site.founded}
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function FounderPortrait({
  member,
  index,
  forceActive = false,
  className,
}: {
  member: (typeof team)[number];
  index: number;
  /** Skips the hover/tap gating entirely and renders permanently "focused"
   * — for the mobile carousel, where each slide already only shows one
   * founder at a time, so there's nothing left to reveal on interaction. */
  forceActive?: boolean;
  className?: string;
}) {
  const label = String(index + 1).padStart(2, "0");
  // Driven by state rather than CSS :hover alone: a phone has no hover, so
  // relying on group-hover meant touch visitors could never see a name,
  // role, or focus line at all. Mouse enter/leave covers desktop, click
  // covers tap, focus/blur covers keyboard nav — same visual result from
  // any input.
  const [hoverActive, setHoverActive] = useState(false);
  const active = forceActive || hoverActive;

  return (
    <div
      role={forceActive ? undefined : "button"}
      tabIndex={forceActive ? undefined : 0}
      aria-pressed={forceActive ? undefined : hoverActive}
      aria-label={`${member.name}, ${member.role}`}
      onMouseEnter={forceActive ? undefined : () => setHoverActive(true)}
      onMouseLeave={forceActive ? undefined : () => setHoverActive(false)}
      onFocus={forceActive ? undefined : () => setHoverActive(true)}
      onBlur={forceActive ? undefined : () => setHoverActive(false)}
      onClick={forceActive ? undefined : () => setHoverActive((v) => !v)}
      onKeyDown={
        forceActive
          ? undefined
          : (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setHoverActive((v) => !v);
              }
            }
      }
      className={cn(
        "relative aspect-[3/4] overflow-hidden border-canvas-border [&+&]:border-l",
        !forceActive && "cursor-pointer",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 grayscale contrast-[0.92] brightness-[0.82] transition-[filter] duration-700 ease-premium",
          active && "grayscale-0 contrast-100 brightness-100",
        )}
      >
        {member.imageSrc ? (
          <Image
            src={member.imageSrc}
            alt={member.imageAlt}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(200deg,#1c1c1f,#101012)]">
            <span
              aria-hidden
              className="bg-[radial-gradient(circle_at_50%_32%,rgba(244,243,238,0.13),transparent_60%)] font-display text-6xl font-bold text-ink/[0.18]"
            >
              {member.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      <span className="absolute left-3.5 top-3.5 font-mono text-[10px] tracking-[0.08em] text-ink-faint">
        {label}
      </span>

      {/* Scrim: the caption sits on top of whatever's in the photo at that
       * point (could be a light shirt, sky, anything), so it needs its own
       * guaranteed-dark backdrop rather than relying on the photo being
       * dark there. Fades in with the caption rather than sitting on the
       * card permanently, keeping the default (inactive) state clean. */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 transition-opacity duration-400 ease-premium",
          active && "opacity-100",
        )}
      />

      <div
        className={cn(
          "absolute inset-x-4 bottom-4 translate-y-1.5 opacity-0 transition-all duration-400 ease-premium",
          active && "translate-y-0 opacity-100",
        )}
      >
        <p className="font-display text-base font-semibold text-ink">{member.name}</p>
        <p className="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-muted">
          {member.role}
          {member.credentials ? ` · ${member.credentials}` : ""}
        </p>
        <p className="mt-2 text-[12px] leading-snug text-ink-muted">{member.focus}</p>
      </div>
    </div>
  );
}
