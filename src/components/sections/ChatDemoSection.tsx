import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import ChatThread from "@/components/chat/ChatThread";

/** The embedded, always-on chat panel on the homepage — this is the exact
 * same assistant as the floating widget (same shared conversation via
 * ChatProvider), just given a permanent, prominent home so it doubles as a
 * live product demo: the thing visitors are looking at IS the thing
 * Monorite builds for clients. */
export default function ChatDemoSection() {
  return (
    <section className="border-t border-canvas-border py-20 md:py-28">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent-soft">This is the actual product</p>
          <Reveal delay={0.08}>
            <h2 className="mt-6 max-w-md text-balance font-display text-3xl font-semibold leading-tight text-ink md:text-4xl">
              Talk to it. It's the same assistant we'd build for you.
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-md text-balance leading-relaxed text-ink-muted">
              Trained on this site's own services and projects, answering in real time. Ask it anything you'd ask us,
              from pricing approach to what a build actually looks like.
            </p>
          </Reveal>
        </div>

        <Reveal blurIn delay={0.1}>
          <div className="h-[480px] overflow-hidden rounded-2xl border border-canvas-border bg-canvas-soft">
            <ChatThread source="demo" />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
