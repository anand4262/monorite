"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";

type Row = { cells: string[]; status: "ok" | "pending" };
type Tab = { label: string; columns: string[]; rows: Row[] };
type LogoGroup = { label: string; tools: string[] };

/**
 * Pain-points list + an interactive tabbed "see it live" data panel +
 * (optionally) a grid of connected tools, grouped by category. Modeled on
 * apideck.com's homepage — lead with the problem in the customer's own
 * words, then show a realistic-looking data view instead of a paragraph
 * describing the feature.
 */
export default function IntegrationDemoPanel({
  painPoints,
  tabs,
  logoGroups,
}: {
  painPoints: string[];
  tabs: Tab[];
  logoGroups?: LogoGroup[];
}) {
  const [active, setActive] = useState(0);
  const tab = tabs[active];

  return (
    <section className="border-t border-canvas-border py-20 md:py-28">
      <Container>
        <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-accent-soft">
          The problem, stated plainly
        </h2>
        <div className="mt-8 divide-y divide-canvas-border border-t border-canvas-border">
          {painPoints.map((point, i) => (
            <Reveal key={point} delay={i * 0.06}>
              <p className="py-4 text-balance text-lg text-ink md:text-xl">
                {point}
              </p>
            </Reveal>
          ))}
        </div>

        <div className="mt-14">
          <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-accent-soft">
            See it live
          </h2>

          <div className="mt-6 flex flex-wrap gap-2">
            {tabs.map((t, i) => (
              <button
                key={t.label}
                type="button"
                onClick={() => setActive(i)}
                className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 ease-premium ${
                  i === active
                    ? "border-mint/40 bg-mint/10 text-mint"
                    : "border-canvas-border text-ink-faint hover:text-ink-muted"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-canvas-border">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr>
                  {tab.columns.map((col) => (
                    <th
                      key={col}
                      className="border-b border-canvas-border px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-faint"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tab.rows.map((row, i) => (
                  <tr key={i}>
                    {row.cells.map((cell, j) => (
                      <td
                        key={j}
                        className="border-b border-canvas-border px-4 py-3 text-ink-muted last:text-right"
                      >
                        {j === row.cells.length - 1 ? (
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] ${
                              row.status === "ok"
                                ? "bg-mint/10 text-mint"
                                : "bg-accent/10 text-accent-soft"
                            }`}
                          >
                            {cell}
                          </span>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {logoGroups && (
          <div className="mt-14">
            <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-accent-soft">
              Tools we connect
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {logoGroups.map((group) => (
                <div
                  key={group.label}
                  className="rounded-xl border border-canvas-border p-4"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-faint">
                    {group.label}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {group.tools.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-md border border-canvas-border bg-canvas-surface px-2 py-1 text-xs text-ink"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
