import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { services, getServiceBySlug } from "@/data/services";
import { buildMetadata } from "@/lib/seo";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import CTASection from "@/components/sections/CTASection";
import IntegrationDemoPanel from "@/components/sections/service-panels/IntegrationDemoPanel";
import DiscoveryProcessPanel from "@/components/sections/service-panels/DiscoveryProcessPanel";
import DashboardPanel from "@/components/sections/service-panels/DashboardPanel";

// One-off category-specific content, keyed by slug, for the four service
// pages where a generic bullet list undersells what's actually going on.
// Everything else still uses the shared template below.
const integrationDemos: Record<
  string,
  { painPoints: string[]; tabs: Parameters<typeof IntegrationDemoPanel>[0]["tabs"]; logoGroups?: { label: string; tools: string[] }[] }
> = {
  "systems-integration": {
    painPoints: [
      "Someone on your team retyping the same job into three different systems?",
      "A missed sync between your CRM and your accounting software cost you a client?",
      "No one can tell you if last night's sync actually ran?",
    ],
    tabs: [
      {
        label: "CRM sync",
        columns: ["Contact", "Source", "Synced to", "Status"],
        rows: [
          { cells: ["Marcus Reyes", "HubSpot", "Xero + Calendar", "Synced"], status: "ok" },
          { cells: ["Priya Nandakumar", "Google Form", "CRM + Xero", "Synced"], status: "ok" },
          { cells: ["Dana Whitfield", "Phone intake", "CRM", "Syncing"], status: "pending" },
        ],
      },
      {
        label: "Invoicing",
        columns: ["Invoice", "Customer", "Amount", "Status"],
        rows: [
          { cells: ["INV-1042", "Reyes Plumbing & Rooter", "$1,240.00", "Paid"], status: "ok" },
          { cells: ["INV-1043", "Whitfield Auto Care", "$860.00", "Sent"], status: "pending" },
          { cells: ["INV-1044", "Lindqvist Home Services", "$2,150.00", "Paid"], status: "ok" },
        ],
      },
      {
        label: "Calendar",
        columns: ["Job", "Customer", "Time", "Status"],
        rows: [
          { cells: ["Burst pipe repair", "Marcus Reyes", "Tomorrow 9:00am", "Booked"], status: "ok" },
          { cells: ["Battery check", "Dana Whitfield", "Today 2:30pm", "Booked"], status: "ok" },
          { cells: ["Site visit", "Priya Nandakumar", "Fri 11:00am", "Pending"], status: "pending" },
        ],
      },
    ],
    logoGroups: [
      { label: "Accounting", tools: ["Xero", "QuickBooks"] },
      { label: "CRM", tools: ["HubSpot", "Salesforce"] },
      { label: "Scheduling", tools: ["Calendly", "Google Calendar"] },
      { label: "Comms", tools: ["Slack", "Twilio"] },
    ],
  },
  "ai-business-solutions": {
    painPoints: [
      "Your team re-answers the same policy question five times a day?",
      "Contracts and invoices still get read line by line by a person?",
      "Nobody can find the one document that actually has the answer?",
    ],
    tabs: [
      {
        label: "Internal Q&A",
        columns: ["Question", "Source doc", "Status"],
        rows: [
          { cells: ["What's our warranty on labor?", "Service policy v3", "Answered"], status: "ok" },
          { cells: ["Do we service strata buildings?", "Ops handbook", "Answered"], status: "ok" },
          { cells: ["Refund window for cancellations?", "Terms doc", "Escalated"], status: "pending" },
        ],
      },
      {
        label: "Document intelligence",
        columns: ["Document", "Type", "Status"],
        rows: [
          { cells: ["Reyes Plumbing — invoice #4021", "Invoice", "Processed"], status: "ok" },
          { cells: ["Whitfield Auto — service contract", "Contract", "Processed"], status: "ok" },
          { cells: ["New vendor agreement", "Contract", "Reviewing"], status: "pending" },
        ],
      },
      {
        label: "Voice agent",
        columns: ["Caller", "Reason", "Status"],
        rows: [
          { cells: ["+1 555 010 2044", "Quote request", "Booked"], status: "ok" },
          { cells: ["+1 555 010 8871", "Reschedule", "Handled"], status: "ok" },
          { cells: ["+1 555 010 3390", "Complex claim", "Escalated"], status: "pending" },
        ],
      },
    ],
  },
};

const discoveryContent: Record<
  string,
  { problem: string; steps: { title: string; description: string }[]; quote: { text: string; author: string; company: string } }
> = {
  "business-process-discovery": {
    problem:
      "Most automation projects fail for the same reason: nobody mapped the process before buying the tool. You end up automating the wrong thing, faster.",
    steps: [
      { title: "Shadow & interview", description: "We sit with your team through a real week of work." },
      { title: "Map the process", description: "Every handoff, delay, and workaround, laid out visually." },
      { title: "Flag the bottlenecks", description: "Ranked by time lost and how fixable they actually are." },
      { title: "Hand you the roadmap", description: "Yours to keep, even if you never build a thing with us." },
    ],
    quote: {
      text: "Monorite mapped our entire intake process before writing a line of code. What we ended up with actually matches how we work, not the other way around.",
      author: "Priya Nandakumar",
      company: "Clearline Dental Group",
    },
  },
};

const dashboardContent: Record<
  string,
  { navItems: string[]; kpis: { label: string; value: string }[]; note: string }
> = {
  "custom-business-software": {
    navItems: ["Overview", "Jobs", "Customers", "Invoices", "Reports", "Settings"],
    kpis: [
      { label: "Jobs this week", value: "38" },
      { label: "Revenue MTD", value: "$41.2k" },
      { label: "Open tickets", value: "3" },
    ],
    note: "Six items in the nav, max. Every number updates in real time — no waiting on a weekly report call to know how the business is doing.",
  },
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);
  if (!service) return buildMetadata({ title: "Service not found", noIndex: true });
  return buildMetadata({
    title: service.name,
    description: service.shortDescription,
    path: `/services/${service.slug}`,
  });
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  const Icon = service.icon;
  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  // Assigned to locals (rather than indexing the Record inline in the JSX
  // below) so TypeScript can actually narrow away the `| undefined` from
  // the lookup — a computed member expression like `map[key]` doesn't
  // narrow across the `&&` check when it's repeated inline.
  const integrationDemo = integrationDemos[service.slug];
  const discovery = discoveryContent[service.slug];
  const dashboard = dashboardContent[service.slug];

  return (
    <>
      <section className="pb-20 pt-40 md:pb-28 md:pt-48">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <Badge>{service.category}</Badge>
            <Reveal onMount delay={0.08}>
              <div className="mt-6 flex items-center gap-4">
                <Icon className="h-10 w-10 text-accent-soft" strokeWidth={1.5} />
                <h1 className="text-balance font-display text-display-md font-semibold text-ink">
                  {service.name}
                </h1>
              </div>
            </Reveal>
            <Reveal onMount delay={0.16}>
              <p className="mt-8 max-w-xl text-balance text-lg leading-relaxed text-ink-muted">
                {service.description}
              </p>
            </Reveal>
            <Reveal onMount delay={0.24} className="mt-10">
              <MagneticButton href="/contact">Talk to us about this</MagneticButton>
            </Reveal>
          </div>

          <Reveal onMount delay={0.2}>
            <div className="rounded-2xl border border-canvas-border bg-canvas-surface/40 p-8">
              <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-accent-soft">
                What changes
              </h2>
              <ul className="mt-6 space-y-4">
                {service.outcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-3 text-ink">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-mint" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Container>
      </section>

      {integrationDemo && <IntegrationDemoPanel {...integrationDemo} />}
      {discovery && <DiscoveryProcessPanel {...discovery} />}
      {dashboard && <DashboardPanel {...dashboard} />}

      <section className="border-t border-canvas-border py-20 md:py-28">
        <Container>
          <h2 className="font-display text-display-md font-semibold text-ink">
            What's included
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {service.bullets.map((bullet, i) => (
              <Reveal
                key={bullet}
                delay={i * 0.06}
                className="flex items-start gap-3 rounded-xl border border-canvas-border bg-canvas-surface/30 p-6"
              >
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent-soft" />
                <span className="text-ink-muted">{bullet}</span>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-canvas-border py-20 md:py-28">
        <Container>
          <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-accent-soft">
            Often paired with
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {related.map((s) => {
              const RelIcon = s.icon;
              return (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group flex items-start gap-4 rounded-2xl border border-canvas-border bg-canvas-surface/30 p-6 transition-all duration-500 ease-premium hover:border-accent/40"
                >
                  <RelIcon className="mt-1 h-6 w-6 shrink-0 text-accent-soft" strokeWidth={1.5} />
                  <div>
                    <h3 className="font-medium text-ink">{s.name}</h3>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs text-ink-muted transition-colors group-hover:text-accent-soft">
                      Learn more <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
