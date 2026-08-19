import Container from "@/components/ui/Container";
import MagneticButton from "@/components/ui/MagneticButton";
import Reveal from "@/components/ui/Reveal";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0 bg-radial-fade opacity-70"
        aria-hidden="true"
      />
      <Container className="relative flex flex-col items-center text-center">
        <Reveal>
          <h2 className="text-balance font-display text-display-lg font-semibold text-ink">
            Ready to stop losing business to busywork?
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-balance text-lg text-ink-muted">
            Tell us where time is getting lost. We'll tell you honestly whether
            AI is the right fix, and what it would take.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="mt-10">
          <MagneticButton href="/contact">Book a free discovery call</MagneticButton>
        </Reveal>
      </Container>
    </section>
  );
}
