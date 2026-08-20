export { generateReply } from "./orchestrator";
// extractPdfText/DocumentTooLargeError/DocumentParseError are deliberately
// NOT re-exported here: pdf-parse pulls in the large, historically fragile
// pdfjs-dist dependency, and re-exporting it from this barrel would make
// every consumer of generateReply/chatConfig eagerly load it too (ESM
// evaluates a whole module's exports, not just the ones actually used) —
// exactly the crash-blast-radius problem this file was set up to avoid.
// Import directly from "./knowledge/document-extractor" (ideally
// dynamically) instead.
export { chatConfig } from "./config";
export type { ChatMessage, ChatOrigin, GenerateReplyInput, GenerateReplyResult } from "./types";
