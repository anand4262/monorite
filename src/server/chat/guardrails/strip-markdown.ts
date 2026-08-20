/**
 * Strips markdown formatting from the LLM's raw output before it reaches
 * the client. The persona prompt already instructs the model to write
 * plain conversational text, not markdown — this is the guarantee for
 * when it does it anyway (GPT-family models default to markdown fairly
 * readily, especially for lists and comparisons), since a chat bubble
 * showing literal "**bold**" asterisks is the fastest way to make a
 * custom assistant read as an unfiltered, generic LLM wrapper instead of
 * Monorite's own product.
 *
 * Order matters: tables and rules are handled before inline emphasis so
 * their dash/pipe characters aren't half-mangled by later passes; italic
 * runs before bold so a nested "**bold *italic* inside**" collapses
 * correctly instead of leaving stray asterisks (bold's [^*]+ can't cross
 * an inner single asterisk if bold runs first). Emphasis patterns require
 * non-whitespace immediately inside the markers (CommonMark's own rule)
 * specifically so "2 * 3 * 4" and "5 ** 2" — real content, not
 * formatting — are left alone instead of being corrupted.
 */
export function stripMarkdown(text: string): string {
  let result = text;

  // Fenced code blocks: ```lang\ncode\n``` -> code (drop the fence itself)
  result = result.replace(/```[a-z]*\n?([\s\S]*?)```/gi, "$1");

  // Inline code: `code` -> code
  result = result.replace(/`([^`]+)`/g, "$1");

  // Em dash / en dash / double hyphen used as a clause separator (" — ",
  // " – ", " -- ") -> a comma. The persona instructs the model not to use
  // these at all, but this is the guarantee for when it does anyway.
  // Requires whitespace on both sides so a real compound word like
  // "SEO-ready" or "well-known" (a tight single hyphen, no spaces) is
  // never touched.
  result = result.replace(/ ?[—–] ?| -- /g, ", ");

  // Table separator rows: "|---|---|" or ":-- | --:" -> removed entirely.
  result = result.replace(/^\s*\|?[\s:|-]*-[\s:|-]*\|?\s*$/gm, "");
  // Remaining table rows: "| A | B |" -> "A, B"
  result = result.replace(/^\s*\|(.+)\|\s*$/gm, (_match, inner: string) =>
    inner
      .split("|")
      .map((cell) => cell.trim())
      .filter(Boolean)
      .join(", "),
  );

  // Horizontal rules and setext-header underlines: a line made up of 3+
  // repeats of the same -, *, _, or = character (optionally spaced).
  result = result.replace(/^[ \t]*([-*_=])(?:[ \t]*\1){2,}[ \t]*$/gm, "");

  // ATX headers: "## Heading" -> "Heading"
  result = result.replace(/^#{1,6}\s+/gm, "");

  // Blockquotes: "> quoted" -> "quoted" (repeated ">" for nested quotes too)
  result = result.replace(/^>+\s?/gm, "");

  // Strikethrough: ~~text~~ -> text
  result = result.replace(/~~([^~\s](?:[^~\n]*[^~\s])?)~~/g, "$1");

  // Italic before bold (see file comment for why): *text*/_text_ -> text.
  // Content must start and end with a non-asterisk, non-whitespace
  // character — this is what stops a stray "*" inside "**word**" from
  // being mistaken for italic content, and what protects "2 * 3 * 4".
  result = result.replace(/(?<![*\w])\*([^*\s](?:[^*\n]*[^*\s])?)\*(?!\w)/g, "$1");
  result = result.replace(/(?<![_\w])_([^_\s](?:[^_\n]*[^_\s])?)_(?!\w)/g, "$1");

  // Bold: **text**/__text__ -> text, same non-whitespace-boundary rule.
  result = result.replace(/\*\*([^*\s](?:[^*\n]*[^*\s])?)\*\*/g, "$1");
  result = result.replace(/__([^_\s](?:[^_\n]*[^_\s])?)__/g, "$1");

  // Markdown links: [text](url) -> text (url)
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)");

  // Bullet markers "- " / "* " at line start -> keep as a plain dash,
  // just without leftover markdown emphasis around it.
  result = result.replace(/^[*+]\s+/gm, "- ");

  // Markdown's "two trailing spaces = line break" convention leaves
  // invisible-but-real whitespace at the end of each line otherwise.
  result = result.replace(/[ \t]+$/gm, "");

  // The rule/table stripping above can leave stretches of blank lines —
  // collapse to a single blank line between paragraphs.
  result = result.replace(/\n{3,}/g, "\n\n");

  return result.trim();
}
