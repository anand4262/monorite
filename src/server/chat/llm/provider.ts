import OpenAI from "openai";
import { chatConfig } from "../config";
import type { ChatMessage } from "../types";

let client: OpenAI | null = null;

export function isConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

function getClient(): OpenAI {
  // The SDK's defaults (10-minute timeout, 2 automatic retries with
  // backoff) have no practical ceiling — a degraded API response could
  // legitimately stack into a minute-plus wait with zero cap, which is
  // exactly what happened. 12s per attempt, 1 retry: worst case ~24s
  // instead of unbounded. Paired with the hard overall timeout in
  // orchestrator.ts as a second, SDK-independent guarantee.
  client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 12_000, maxRetries: 1 });
  return client;
}

/** The only file in the service that knows it's talking to OpenAI
 * specifically — swapping providers means changing this function's body,
 * not anything upstream (guardrails, retriever, orchestrator). */
export async function complete(systemPrompt: string, messages: ChatMessage[]): Promise<string | null> {
  const completion = await getClient().chat.completions.create({
    model: chatConfig.model,
    temperature: chatConfig.temperature,
    max_tokens: chatConfig.maxOutputTokens,
    messages: [{ role: "system", content: systemPrompt }, ...messages],
  });

  return completion.choices[0]?.message?.content?.trim() ?? null;
}
