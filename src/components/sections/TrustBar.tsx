import Container from "@/components/ui/Container";
import Marquee from "@/components/ui/Marquee";

const industries = [
  "Home Services",
  "Healthcare",
  "Automotive",
  "Field Service",
  "Real Estate",
  "Legal",
  "Hospitality",
  "Professional Services",
];

export default function TrustBar() {
  return (
    <section className="border-y border-canvas-border py-10">
      <Container>
        <p className="mb-6 text-center font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
          Built for teams across
        </p>
      </Container>
      <Marquee items={industries} />
    </section>
  );
}
