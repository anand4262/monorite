import type { IntegrationDemoTab } from "@/components/sections/service-panels/IntegrationDemoPanel";

/** Per-service "how it works" proof, keyed by slug, for services where a
 * live-data mockup says more than a paragraph. Services without an entry
 * here fall back to `howItWorksFallback` below. */
export const integrationDemos: Record<
  string,
  { tabs: IntegrationDemoTab[]; logoGroups?: { label: string; tools: string[] }[] }
> = {
  "workflow-systems-automation": {
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
  "ai-assistants": {
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
          { cells: ["Reyes Plumbing: invoice #4021", "Invoice", "Processed"], status: "ok" },
          { cells: ["Whitfield Auto: service contract", "Contract", "Processed"], status: "ok" },
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

export const dashboardContent: Record<
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
    note: "Six items in the nav, max. Every number updates in real time. No waiting on a weekly report call to know how the business is doing.",
  },
};

/** A short, honest statement of the cost of not having this service. No
 * project-specific claims — these describe a capability, not a case study;
 * real case studies live on /work. */
export const problemStatements: Record<string, string> = {
  "website-online-presence":
    "If people can't find you online, they find someone else. A slow, dated, or missing site is the easiest reason to lose a customer before you ever spoke to them.",
  "ai-assistants":
    "Every call that goes to voicemail is a customer deciding whether to wait for you or try the next name on the list. Most don't wait.",
  "custom-business-software":
    "Spreadsheets and off-the-shelf software eventually stop fitting how you actually work, so your team ends up working around the tool instead of with it.",
  "workflow-systems-automation":
    "The same information gets typed into three different systems by three different people, and nobody notices when one of those syncs quietly breaks.",
  "ongoing-support":
    "Most agencies disappear after launch. When something needs changing six months in, you're stuck re-explaining your business from scratch to someone new.",
};

/** For services without an interactive demo panel above, a numbered
 * mechanism breakdown instead of a second copy of the hero image. */
export const howItWorksFallback: Record<string, { title: string; description: string }[]> = {
  "website-online-presence": [
    {
      title: "Map what customers search",
      description: "We start with the actual searches people use to find a business like yours, not guesses.",
    },
    {
      title: "Build and launch fast",
      description: "Every page ships mobile-first, structured for SEO, typically live within two to three weeks.",
    },
    {
      title: "Wire it into your systems",
      description: "Enquiries route straight into your CRM, call assistant, and booking system, so nothing sits unseen.",
    },
  ],
  "ongoing-support": [
    {
      title: "Stay monitored",
      description: "Your system is watched after launch, not just handed off and forgotten.",
    },
    {
      title: "Talk to the people who built it",
      description: "Requests go directly to your original team, no re-explaining your business to someone new.",
    },
    {
      title: "Get a same-day read",
      description: "Most requests are scoped, fixed, or answered within a business day.",
    },
  ],
};

export const faqContent: Record<string, { q: string; a: string }[]> = {
  "website-online-presence": [
    {
      q: "How long does a website build take?",
      a: "Around two to three weeks for most service-business sites, depending on the number of pages and how much content is ready to go.",
    },
    {
      q: "Do I need to provide the content and photos?",
      a: "We can work with what you have, or draft placeholder-quality copy for you to review. Nothing goes live without your sign-off.",
    },
    {
      q: "Will it actually rank on Google?",
      a: "Every page is structured for local SEO from day one, but ranking also depends on your market and competition. We're upfront about what's realistic before starting.",
    },
    {
      q: "What happens after launch?",
      a: "You move into Ongoing Support, so changes go to a team that already knows your site.",
    },
  ],
  "ai-assistants": [
    {
      q: "Does the AI ever pretend to be human?",
      a: "No. Every call opens with a clear disclosure that the caller is speaking with an AI assistant.",
    },
    {
      q: "What happens with complex or sensitive calls?",
      a: "Anything outside your documented policies escalates straight to your team in real time.",
    },
    {
      q: "How long does setup take?",
      a: "We need your real hours, services, and policies before training starts, typically one to two weeks once we have that.",
    },
    {
      q: "Can it handle text and chat, not just calls?",
      a: "Yes, the same assistant runs across voice, SMS, and web chat from one system.",
    },
  ],
  "custom-business-software": [
    {
      q: "What if our workflow doesn't match a typical CRM?",
      a: "That's the point. We build around how you actually work rather than asking you to adapt to generic software.",
    },
    {
      q: "Who owns the software once it's built?",
      a: "You do. There's no platform lock-in or ongoing license fee to a third party.",
    },
    {
      q: "How long does a build take?",
      a: "It depends on scope. A focused internal tool can ship in a few weeks; a full customer-facing platform takes longer. We scope this honestly before quoting.",
    },
    {
      q: "What happens if we need changes later?",
      a: "That falls under Ongoing Support, direct access to the people who built it.",
    },
  ],
  "workflow-systems-automation": [
    {
      q: "Which tools can you connect?",
      a: "Most CRMs, accounting software, calendars, and job-management platforms with a documented API. We'll say upfront if something isn't feasible.",
    },
    {
      q: "What happens if a sync fails?",
      a: "You're alerted immediately instead of finding out days later when the numbers don't match.",
    },
    {
      q: "Do you replace our existing tools?",
      a: "Usually not. We connect what you already use rather than forcing a migration, unless replacing something is genuinely the better fix.",
    },
    {
      q: "How is this different from just using Zapier?",
      a: "We build and monitor it for you, with error handling and alerts, not a fragile chain you maintain yourself.",
    },
  ],
  "ongoing-support": [
    {
      q: "Is this a subscription?",
      a: "It's a flexible retainer. You pay for what you actually use, not a fixed monthly platform fee.",
    },
    {
      q: "Who do I actually talk to?",
      a: "The same people who built your system, not a rotating support queue.",
    },
    {
      q: "What counts as support versus a new project?",
      a: "Small adjustments and fixes are support; anything that's really a new build gets scoped and quoted separately. We'll tell you which is which.",
    },
    {
      q: "What if we want to stop?",
      a: "You keep everything we built. There's no lock-in tied to staying on support.",
    },
  ],
};
