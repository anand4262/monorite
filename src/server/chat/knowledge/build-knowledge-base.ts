import { services } from "@/data/services";
import { projects } from "@/data/projects";
import { faqContent } from "@/data/service-content";
import { site } from "@/data/site";
import { team } from "@/data/team";
import type { KnowledgeChunk } from "../types";
import { tokenize } from "./stopwords";

function keywordsFrom(...text: string[]): string[] {
  return Array.from(new Set(tokenize(text.join(" "))));
}

/** Builds the knowledge base directly from the site's own data files
 * (services, projects, FAQs, company info) each time it's called, so it
 * can never drift out of sync with what's actually published — there is
 * no separately-maintained copy of this content anywhere. Small enough
 * corpus (a few dozen short chunks) that rebuilding per request is
 * negligible; cache it if the data files ever grow large enough to matter. */
export function buildKnowledgeBase(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];

  chunks.push({
    id: "company",
    category: "company",
    text: `${site.name}: ${site.description} Contact: ${site.email} / ${site.phone}. Based at ${site.location}.`,
    keywords: keywordsFrom(site.name, site.description, "contact", "email", "phone", "location", "address"),
  });

  chunks.push({
    id: "technologies",
    category: "company",
    text: `${site.name}'s technical capabilities span: ${site.technologies.join(", ")}.`,
    keywords: keywordsFrom(site.technologies.join(" "), "technology", "tech", "stack", "language", "framework", "build with"),
  });

  chunks.push({
    id: "founders",
    category: "company",
    text: `${site.name} was founded by ${team.map((m) => `${m.name} (${m.role}${m.focus ? ` — ${m.focus}` : ""})`).join(" and ")}. No account managers or separate delivery team — the founders build every system directly.`,
    keywords: keywordsFrom(
      team.map((m) => `${m.name} ${m.role} ${m.focus}`).join(" "),
      "founder",
      "founders",
      "who founded",
      "who owns",
      "who runs",
      "team",
      "who is behind",
      "ceo",
    ),
  });

  for (const service of services) {
    chunks.push({
      id: `service:${service.slug}`,
      category: "service",
      text: `Service — ${service.name} (${service.category}): ${service.description} Includes: ${service.bullets.join("; ")}.`,
      keywords: keywordsFrom(service.name, service.category, service.shortDescription, service.bullets.join(" ")),
    });
  }

  for (const project of projects) {
    const stackLine = project.stack?.length ? ` Built with: ${project.stack.join(", ")}.` : "";
    chunks.push({
      id: `project:${project.slug}`,
      category: "project",
      text: `Project — ${project.client} (${project.industry}): ${project.summary}${stackLine}`,
      keywords: keywordsFrom(
        project.client,
        project.industry,
        project.summary,
        project.title,
        project.stack?.join(" ") ?? "",
      ),
    });
  }

  for (const [slug, faqs] of Object.entries(faqContent)) {
    for (const faq of faqs) {
      chunks.push({
        id: `faq:${slug}:${faq.q}`,
        category: "faq",
        text: `Q: ${faq.q} A: ${faq.a}`,
        keywords: keywordsFrom(faq.q, faq.a),
      });
    }
  }

  return chunks;
}
