import { chatConfig } from "../config";
import type { KnowledgeChunk } from "../types";
import { tokenize } from "./stopwords";

/** Categories always handed to the LLM in full, every turn, rather than
 * selected by relevance guessing. The whole corpus here is small (a
 * company chunk, a technologies chunk, five services, four projects —
 * ~11 short chunks total), so there's no real cost to always including
 * all of it, and doing so removes the fabrication risk entirely for these
 * categories: the model can never lack grounding for a service or a
 * project because none is ever guessed out of context. This is what
 * closes the gap that let it invent a fake case study when a generic
 * query ("tell me about a project you've shipped") happened to score
 * zero against every chunk's keywords. */
const ALWAYS_GROUNDED_CATEGORIES = new Set<KnowledgeChunk["category"]>(["company", "service", "project"]);

/** FAQs are the one category still selected by keyword relevance — there
 * are ~20 of them (much larger than the other categories), most aren't
 * relevant to any given question, and getting the wrong FAQ answer wrong
 * is a much lower-stakes failure than inventing a fake client. Deliberately
 * not vector/embedding search: this corpus is small enough that a keyword-
 * overlap score is enough, without paying for embedding infra. */
export function retrieve(query: string, chunks: KnowledgeChunk[]): KnowledgeChunk[] {
  const grounded = chunks.filter((c) => ALWAYS_GROUNDED_CATEGORIES.has(c.category));
  const faqs = chunks.filter((c) => c.category === "faq");

  const queryWords = tokenize(query);
  const scoredFaqs = faqs
    .map((chunk) => ({
      chunk,
      score: queryWords.reduce((total, word) => total + (chunk.keywords.includes(word) ? 1 : 0), 0),
    }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, chatConfig.faqRetrievalTopK)
    .map((s) => s.chunk);

  return [...grounded, ...scoredFaqs];
}
