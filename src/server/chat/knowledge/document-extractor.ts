import { PDFParse } from "pdf-parse";

const MAX_PDF_BYTES = 8 * 1024 * 1024; // 8MB
const MAX_EXTRACTED_CHARS = 6000; // caps prompt/token cost for one attachment
// A small file can still be a "PDF bomb" — deeply nested objects or a huge
// page count that's cheap to upload but expensive to parse — so the size
// cap alone isn't a DoS guard. This bounds worst-case parse time
// regardless of what's inside the file.
const PARSE_TIMEOUT_MS = 10_000;

export interface ExtractedDocument {
  text: string;
  truncated: boolean;
  pageCount: number;
}

export class DocumentTooLargeError extends Error {}
export class DocumentParseError extends Error {}

/** Extracts plain text from an uploaded PDF so it can be folded into the
 * conversation context for that turn (see orchestrator.ts) — this is what
 * lets a visitor drop a PDF describing their business and have the
 * assistant actually read it instead of just acknowledging a file exists. */
export async function extractPdfText(buffer: Buffer): Promise<ExtractedDocument> {
  if (buffer.byteLength > MAX_PDF_BYTES) {
    throw new DocumentTooLargeError("PDF is larger than 8MB.");
  }

  let parser: PDFParse | undefined;
  try {
    parser = new PDFParse({ data: buffer });
    const result = await Promise.race([
      parser.getText(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("PDF parsing took too long.")), PARSE_TIMEOUT_MS),
      ),
    ]);
    const truncated = result.text.length > MAX_EXTRACTED_CHARS;
    return {
      text: truncated ? result.text.slice(0, MAX_EXTRACTED_CHARS) : result.text,
      truncated,
      pageCount: result.total ?? 0,
    };
  } catch (error) {
    throw new DocumentParseError(error instanceof Error ? error.message : "Failed to parse PDF.");
  } finally {
    await parser?.destroy?.().catch(() => {});
  }
}
