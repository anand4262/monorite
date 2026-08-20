/** Common words filtered out of both indexing (build-knowledge-base.ts)
 * and querying (retriever.ts) so retrieval scoring is driven by meaningful
 * terms. Without this, a query like "what's your tech stack" scores every
 * FAQ chunk that happens to start with "What ..." just as highly as the
 * chunk that's actually about tech stack, diluting the top-K with noise. */
const STOPWORDS = new Set([
  "the", "and", "for", "are", "you", "your", "what", "with", "that",
  "this", "have", "has", "had", "does", "do", "did", "can", "could",
  "would", "should", "will", "how", "who", "when", "where", "why",
  "about", "any", "our", "out", "get", "got", "not", "but", "was",
  "were", "been", "being", "from", "into", "onto", "off", "over",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}
