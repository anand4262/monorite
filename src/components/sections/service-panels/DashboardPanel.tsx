import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";

/**
 * A real-looking KPI-dashboard mockup instead of another "staff portals,
 * customer portals..." paragraph — client-portal research consistently
 * points to a simple, shallow nav (five or six items max) and real-time
 * numbers as what actually earns trust, so the mockup leads with both.
 */
export default function DashboardPanel({
  navItems,
  kpis,
  note,
}: {
  navItems: string[];
  kpis: { label: string; value: string }[];
  note: string;
}) {
  return (
    <section className="border-t border-canvas-border py-20 md:py-28">
      <Container>
        <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-accent-soft">
          What you actually get
        </h2>
        <Reveal blurIn delay={0.1}>
          <div className="mt-8 overflow-hidden rounded-2xl border border-canvas-border">
            <div className="flex flex-wrap gap-1 border-b border-canvas-border bg-canvas px-4 py-3">
              {navItems.map((item, i) => (
                <span
                  key={item}
                  className={`rounded-md px-3 py-1.5 text-xs ${
                    i === 0
                      ? "bg-canvas-surface text-ink"
                      : "text-ink-faint"
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-3">
              {kpis.map((kpi) => (
                <div key={kpi.label} className="rounded-xl bg-canvas p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                    {kpi.label}
                  </p>
                  <p className="mt-1.5 font-display text-2xl font-semibold text-ink">
                    {kpi.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink-muted">
          {note}
        </p>
      </Container>
    </section>
  );
}
