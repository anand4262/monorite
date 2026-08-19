import Link from "next/link";
import { AlertTriangle, PhoneCall, ShieldCheck, Ear, Phone, ArrowLeft } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import CTASection from "@/components/sections/CTASection";

export const metadata = buildMetadata({
  title: "AI Phone Receptionist",
  description:
    "Monorite's AI phone receptionist for trades, currently in pilot. Answers after-hours calls, tells real emergencies from routine bookings, and never leaves a caller with silence.",
  path: "/ai-receptionist",
});

const tiers = [
  {
    icon: AlertTriangle,
    label: "Life-safety",
    example: "Gas leak, smoke, electric shock, injury",
    response:
      "The agent's first response is always \"if anyone is in danger, hang up and call 000 now,\" before anything else. It still captures details and notifies the tradie.",
  },
  {
    icon: PhoneCall,
    label: "Urgent trade job",
    example: "Burst pipe, no water, no power",
    response:
      "Triggers a live transfer to the tradie's mobile. If unanswered within 20 seconds, the agent takes a detailed message, sends an urgent SMS, and tells the caller when to expect a callback. Never silence.",
  },
  {
    icon: Ear,
    label: "Standard",
    example: "Routine booking, general enquiry",
    response:
      "Normal capture flow: name, job type, address, and preferred time, confirmed with the caller and sent straight to the tradie.",
  },
];

export default function AIReceptionistPage() {
  return (
    <>
      <section className="relative pb-20 pt-40 md:pb-28 md:pt-48">
        <Container>
          <Link
            href="/services/ai-assistants"
            className="flex w-fit items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-ink-faint transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3 w-3" />
            AI Assistants
          </Link>
          <Badge className="mt-5">Currently piloting</Badge>
          <Reveal onMount delay={0.08}>
            <h1 className="mt-6 max-w-3xl text-balance font-display text-display-lg font-semibold text-ink">
              An AI phone receptionist that knows the difference between an
              emergency and an inconvenience
            </h1>
          </Reveal>
          <Reveal onMount delay={0.16}>
            <p className="mt-8 max-w-2xl text-balance text-lg leading-relaxed text-ink-muted">
              Built by Monorite for trades businesses. It answers
              after-hours calls, a burst pipe at 2am, a gas smell, a routine
              booking, and handles each one differently, because they aren't
              the same thing. Currently in pilot with our first trial
              businesses.
            </p>
          </Reveal>
          <Reveal onMount delay={0.24} className="mt-10">
            <Button href="/contact" size="md">
              Get early access
            </Button>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-canvas-border py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="A call, start to finish"
            title="Not a script: a live classification"
            description="The agent listens for what's actually happening on the call and routes it in real time. Here's what that looks like for an urgent job."
          />

          <div className="mt-14 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <Reveal blurIn className="order-2 lg:order-1">
              <div className="flex flex-col gap-3 rounded-2xl border border-canvas-border bg-canvas-surface/60 p-6">
                <div className="flex items-center gap-3 border-b border-canvas-border pb-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-canvas-border text-ink-muted">
                    <Phone className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">Incoming call</p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
                      After hours
                    </p>
                  </div>
                </div>

                <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-canvas-soft px-4 py-3 text-sm text-ink-muted">
                  Hi, is this the plumber? My kitchen's flooding, a pipe's
                  burst under the sink.
                </p>
                <p className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-ink px-4 py-3 text-sm text-canvas">
                  Sorry to hear that, you're through to our after-hours
                  line, this call may be recorded. Is anyone in danger, or
                  is it just the water?
                </p>
                <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-canvas-soft px-4 py-3 text-sm text-ink-muted">
                  Just water, but it's a lot of it.
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full border border-canvas-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
                    Name ✓
                  </span>
                  <span className="rounded-full border border-canvas-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
                    Address ✓
                  </span>
                  <span className="rounded-full border border-canvas-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-muted">
                    Issue ✓
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between rounded-xl border border-canvas-border bg-canvas-soft px-4 py-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-faint">
                    Classification
                  </span>
                  <span className="rounded-full border border-canvas-border px-3 py-1 text-xs font-medium text-ink">
                    Urgent trade job: transferring now
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal blurIn delay={0.1} className="order-1 lg:order-2">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-soft">
                Tier 02
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-ink">
                Urgent trade job
              </h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-muted">
                Costly and inconvenient, but not dangerous. The agent
                confirms there's no immediate danger, captures the details,
                and moves straight to a live transfer. No extra questions,
                no delay.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3 text-sm text-ink">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-soft" />
                  Checks for danger before anything else
                </li>
                <li className="flex items-start gap-3 text-sm text-ink">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-soft" />
                  Live-transfers to the tradie's mobile
                </li>
                <li className="flex items-start gap-3 text-sm text-ink">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-soft" />
                  Unanswered after 20s → urgent SMS + callback window
                </li>
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-t border-canvas-border py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="Three tiers, not one generic response"
            title="Every call gets classified, not just answered"
            description="Most AI receptionists treat every after-hours call the same. This one responds differently depending on what's actually happening."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {tiers.map((tier, i) => {
              const Icon = tier.icon;
              return (
                <Reveal key={tier.label} blurIn delay={i * 0.08}>
                  <Card className="h-full">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-canvas-border bg-canvas-surface text-accent-soft">
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <h3 className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
                      {tier.example}
                    </h3>
                    <p className="mt-2 font-display text-xl font-semibold text-ink">
                      {tier.label}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                      {tier.response}
                    </p>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-t border-canvas-border py-20 md:py-28">
        <Container>
          <SectionHeading
            eyebrow="Built on transparency"
            title="It tells every caller it's an AI"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Reveal blurIn delay={0}>
              <Card className="h-full">
                <ShieldCheck className="h-6 w-6 text-accent-soft" strokeWidth={1.5} />
                <h3 className="mt-5 font-display text-lg font-semibold text-ink">
                  Upfront disclosure
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  Every call opens with a clear statement that the caller is
                  speaking with an AI assistant and that the call may be
                  recorded. No pretending to be human.
                </p>
              </Card>
            </Reveal>
            <Reveal blurIn delay={0.08}>
              <Card className="h-full">
                <PhoneCall className="h-6 w-6 text-accent-soft" strokeWidth={1.5} />
                <h3 className="mt-5 font-display text-lg font-semibold text-ink">
                  Real fallbacks, not silence
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  If a transfer goes unanswered or the system has an issue,
                  the caller is never left hanging. A message, an SMS, or a
                  clear next step every time.
                </p>
              </Card>
            </Reveal>
            <Reveal blurIn delay={0.16}>
              <Card className="h-full">
                <Ear className="h-6 w-6 text-accent-soft" strokeWidth={1.5} />
                <h3 className="mt-5 font-display text-lg font-semibold text-ink">
                  Personally reviewed, not a black box
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  Every call is reviewed personally during the pilot, not a
                  support ticket queue, not a faceless SaaS dashboard.
                </p>
              </Card>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-t border-canvas-border py-20 md:py-28">
        <Container className="max-w-2xl text-center">
          <SectionHeading
            align="center"
            eyebrow="Where this stands today"
            title="Still in pilot, not a finished product yet"
            description="This is being built and tested with a small number of trial businesses before wider rollout. We're not claiming proven results yet. We're looking for the first few trades businesses willing to try it and tell us honestly whether it works."
            className="mx-auto"
          />
        </Container>
      </section>

      <CTASection />
    </>
  );
}
