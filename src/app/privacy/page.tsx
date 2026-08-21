import { buildMetadata } from "@/lib/seo";
import { site } from "@/data/site";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Reveal from "@/components/ui/Reveal";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses, and protects information from this website and its chat assistant.`,
  path: "/privacy",
});

const LAST_UPDATED = "21 August 2026";

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "What this covers",
    body: (
      <p>
        This policy covers {site.name}&rsquo;s website ({site.url}) and its chat assistant, including the embedded
        &ldquo;live demo&rdquo; panel and the floating chat widget — they are the same assistant and the same
        conversation record, described together below. It does not cover third-party sites we link to.
      </p>
    ),
  },
  {
    title: "What we collect",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong className="text-ink">Contact form submissions</strong> — name, email, company, phone (if given),
          and your message, submitted through /contact.
        </li>
        <li>
          <strong className="text-ink">Chat conversations</strong> — the messages you send the chat assistant, and
          its replies, tied to a session identifier stored in your browser (not to a user account — we don&rsquo;t
          have accounts).
        </li>
        <li>
          <strong className="text-ink">Contact details shared in chat</strong> — if you tell the assistant your
          name, email, or phone number so the team can follow up, that information is captured. See
          &ldquo;How chat contact details are handled&rdquo; below for exactly how — this is deliberately not the
          same path as the rest of the conversation.
        </li>
        <li>
          <strong className="text-ink">Uploaded documents</strong> — if you attach a PDF in chat, its text content
          is extracted and used to inform that conversation. Files are capped at 8MB and are not published or
          shared outside of generating a reply and, if relevant, a lead summary for our team.
        </li>
        <li>
          <strong className="text-ink">Technical data</strong> — IP address (used only for spam/abuse rate
          limiting, not stored against your identity beyond that), browser type, and basic usage data standard to
          any web request.
        </li>
        <li>
          <strong className="text-ink">Analytics</strong> — general usage data (pages visited, how you got here,
          device/browser type) collected through Google Analytics, via cookies. See &ldquo;Analytics&rdquo; below
          for details.
        </li>
      </ul>
    ),
  },
  {
    title: "Analytics",
    body: (
      <>
        <p>
          We use Google Analytics to understand how visitors use this site, in aggregate — which pages get visited,
          roughly how people find us, and general device/browser trends. It works through cookies set in your
          browser and is separate from the chat assistant and contact form described elsewhere in this policy: it
          doesn&rsquo;t know who you are, and we don&rsquo;t connect it to your name, email, or chat conversations.
        </p>
        <p className="mt-3">
          Google processes this data under its own terms as an independent data controller — see{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-canvas-border underline-offset-2 hover:text-ink"
          >
            Google&rsquo;s Privacy Policy
          </a>
          . You can opt out of Google Analytics tracking across all sites using the{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-canvas-border underline-offset-2 hover:text-ink"
          >
            Google Analytics Opt-out Browser Add-on
          </a>
          , or block analytics cookies directly in your browser&rsquo;s privacy settings.
        </p>
      </>
    ),
  },
  {
    title: "How chat contact details are handled",
    body: (
      <>
        <p>
          If you share a name, email address, or phone number in a chat message, that specific information is
          extracted locally, on our own server, using pattern matching — it is not sent to any third-party AI
          provider for the purpose of extracting it. The AI model that generates the assistant&rsquo;s replies is
          separately instructed never to repeat contact details back in its own output.
        </p>
        <p className="mt-3">
          The rest of your message content (what you&rsquo;re asking about, your business context) is processed by
          our AI provider to generate a reply, as described below — the distinction is that we don&rsquo;t rely on
          that provider to identify or extract your personal contact details.
        </p>
      </>
    ),
  },
  {
    title: "AI providers we use",
    body: (
      <>
        <p>
          The chat assistant&rsquo;s replies are generated using OpenAI&rsquo;s API. Messages you send in chat, and
          a small amount of relevant context about {site.name}&rsquo;s own services and projects, are sent to
          OpenAI to generate each reply. We also run an automated moderation check on chat input (also via OpenAI)
          to catch abusive or harmful content before it&rsquo;s processed further.
        </p>
        <p className="mt-3">
          OpenAI processes this data under its own API data-usage terms; we don&rsquo;t control their retention
          separately from what they publish. We do not send contact-form submissions to any AI provider.
        </p>
      </>
    ),
  },
  {
    title: "How we use this information",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>To respond to enquiries and follow up on chat conversations where you&rsquo;ve shown interest in a service.</li>
        <li>To generate relevant, grounded replies in the chat assistant.</li>
        <li>To improve the site and the assistant&rsquo;s accuracy over time.</li>
        <li>To prevent abuse — rate limiting, spam filtering, and content moderation.</li>
      </ul>
    ),
  },
  {
    title: "What we don't do",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>We don&rsquo;t sell your data to anyone.</li>
        <li>We don&rsquo;t use your conversation content for advertising or ad targeting.</li>
        <li>We don&rsquo;t share chat transcripts or contact-form submissions outside {site.name}&rsquo;s own team, except where required by law.</li>
      </ul>
    ),
  },
  {
    title: "Data retention",
    body: (
      <p>
        Contact-form submissions and chat conversation records are kept for as long as reasonably needed to follow
        up and to improve the service, and are deleted on request (see &ldquo;Your rights&rdquo; below). The
        session identifier in your browser is stored for the duration of your browser session and is not a
        persistent tracking cookie.
      </p>
    ),
  },
  {
    title: "Your rights",
    body: (
      <p>
        You can ask what information we hold about you, request a copy of it, ask us to correct or delete it, or
        withdraw consent for future contact, at any time — email{" "}
        <a href={`mailto:${site.email}`} className="underline decoration-canvas-border underline-offset-2 hover:text-ink">
          {site.email}
        </a>{" "}
        and we&rsquo;ll action it directly, not through a support queue.
      </p>
    ),
  },
  {
    title: "Changes to this policy",
    body: <p>If this policy changes materially, we&rsquo;ll update the date below. Continued use of the site or chat assistant after a change means you accept the update.</p>,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <section className="pb-16 pt-40 md:pb-20 md:pt-48">
        <Container className="max-w-3xl">
          <Badge>Privacy</Badge>
          <Reveal onMount delay={0.08}>
            <h1 className="mt-6 text-balance font-display text-display-lg font-semibold text-ink">
              Privacy Policy
            </h1>
          </Reveal>
          <Reveal onMount delay={0.16}>
            <p className="mt-5 text-sm text-ink-faint">Last updated {LAST_UPDATED}</p>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-canvas-border pb-24 pt-4 md:pb-32">
        <Container className="max-w-3xl">
          <div className="divide-y divide-canvas-border">
            {sections.map((section, i) => (
              <Reveal key={section.title} delay={i * 0.04}>
                <div className="py-8 first:pt-0">
                  <h2 className="font-display text-xl font-semibold text-ink">{section.title}</h2>
                  <div className="mt-4 space-y-3 leading-relaxed text-ink-muted">{section.body}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
