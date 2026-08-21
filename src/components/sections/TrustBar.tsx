import Container from "@/components/ui/Container";
import Marquee from "@/components/ui/Marquee";
import { trustBarTools } from "@/data/service-content";

/**
 * The tools Monorite connects a client's systems to — a compatibility
 * signal, not a partnership claim. Monochrome lettermark chips (no
 * per-tool brand colors) to stay consistent with the site's restrained
 * cream/near-black palette instead of scattering bright brand hues
 * through an otherwise single-accent design system.
 */
export default function TrustBar() {
  return (
    <section className="border-y border-canvas-border py-10">
      <Container>
        <p className="mb-6 text-center font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
          Plugs into the tools you already run
        </p>
      </Container>
      <Marquee
        items={trustBarTools}
        gap="gap-4"
        renderItem={(name) => (
          <span className="flex items-center gap-2.5 rounded-xl border border-canvas-border bg-canvas-surface px-4 py-2.5 text-sm font-medium text-ink">
            <span
              aria-hidden="true"
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-ink/20 text-[10px] font-bold text-ink-muted"
            >
              {name.charAt(0)}
            </span>
            {name}
          </span>
        )}
      />
    </section>
  );
}
