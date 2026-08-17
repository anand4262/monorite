import Container from "@/components/ui/Container";
import Marquee from "@/components/ui/Marquee";

// Not official logo marks — lettermark chips in each tool's brand color,
// styled to read as an integration row without implying formal partnership.
const tools = [
  { name: "Twilio", letter: "T", color: "#F22F46" },
  { name: "Google Calendar", letter: "G", color: "#4285F4" },
  { name: "HubSpot", letter: "H", color: "#FF7A59" },
  { name: "Zapier", letter: "Z", color: "#FF4A00" },
  { name: "Calendly", letter: "C", color: "#006BFF" },
  { name: "Slack", letter: "S", color: "#4A154B" },
  { name: "Stripe", letter: "S", color: "#635BFF" },
  { name: "QuickBooks", letter: "Q", color: "#2CA01C" },
];

/**
 * Swapped from a scrolling row of plain industry names to an actual
 * compatibility signal — the tools Monorite connects a client's systems to.
 * More directly relevant to a systems-integration-focused agency than a
 * list of verticals, and matches the "plugs into what you already run"
 * pattern seen on competitor product sites.
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
        items={tools.map((t) => t.name)}
        gap="gap-4"
        renderItem={(name) => {
          const tool = tools.find((t) => t.name === name)!;
          return (
            <span className="flex items-center gap-2.5 rounded-xl border border-canvas-border bg-canvas-surface px-4 py-2.5 text-sm font-medium text-ink">
              <span
                aria-hidden="true"
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white"
                style={{ backgroundColor: tool.color }}
              >
                {tool.letter}
              </span>
              {name}
            </span>
          );
        }}
      />
    </section>
  );
}
