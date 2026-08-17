import type { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    slug: "signs-your-business-is-ready-for-ai-automation",
    title: "5 signs your business is ready for AI automation",
    excerpt:
      "Not every business needs AI on day one. Here's how to tell when manual processes have actually become the bottleneck.",
    date: "2026-06-12",
    readingTime: "6 min read",
    category: "Strategy",
    content: [
      "AI automation works best when it removes real friction — not when it's added for its own sake. Before recommending any technology, we look for a handful of consistent signals.",
      "The first is missed opportunity at the front door: calls going to voicemail, messages sitting unanswered overnight, leads going cold because no one followed up in time.",
      "The second is repetition — the same information being typed into three different systems by three different people, every single day.",
      "The third is inconsistency: results depending heavily on which staff member happens to handle a task, rather than a repeatable process.",
      "If two or more of these sound familiar, it's usually worth a process discovery conversation before buying any software at all.",
    ],
  },
  {
    slug: "why-we-map-your-process-before-writing-code",
    title: "Why we map your process before writing a line of code",
    excerpt:
      "The most expensive mistake in automation isn't a bug — it's automating the wrong process perfectly.",
    date: "2026-05-02",
    readingTime: "5 min read",
    category: "Process",
    content: [
      "It's tempting to jump straight to tools: 'we need a chatbot' or 'we need an app.' But software built on top of a broken process just makes the broken process faster.",
      "Business Process Discovery means spending time — sometimes just days, sometimes weeks for larger operations — actually watching how work gets done today.",
      "That usually surfaces things nobody mentioned in the first conversation: a step that exists only because of a system limitation from years ago, or a handoff that quietly depends on one person's memory.",
      "Only once that's mapped do we recommend specific technology — and sometimes the honest recommendation is a smaller fix than anyone expected.",
    ],
  },
  {
    slug: "ai-call-assistants-what-they-can-and-cant-do",
    title: "AI call assistants: what they can (and can't) do in 2026",
    excerpt:
      "A practical, non-hype breakdown of where AI voice agents genuinely help service businesses today.",
    date: "2026-03-18",
    readingTime: "7 min read",
    category: "AI & Automation",
    content: [
      "AI call assistants have gotten good enough to handle the bulk of routine inbound calls for service businesses: answering questions about hours and pricing, checking availability, and booking appointments.",
      "Where they still hand off to a human: highly custom quotes, emotionally sensitive conversations, and anything outside the business's documented policies.",
      "The businesses that get the most value treat the assistant as a well-trained front-desk hire, not a replacement for judgment — it knows exactly what it knows, and escalates the rest instantly.",
      "The result isn't 'no humans' — it's zero missed calls and a team that only handles the calls that actually need them.",
    ],
  },
];

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
