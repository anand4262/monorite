"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowUpRight, Mic, Paperclip, X } from "lucide-react";
import { useChat, type ChatOrigin } from "./ChatProvider";
import { useSpeechToText } from "./useSpeechToText";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { chatSuggestions } from "@/data/chat";

const MAX_PDF_BYTES = 8 * 1024 * 1024;
// Mirrors the server's messageSchema cap in app/api/chat/route.ts — capped
// here too so a visitor gets an immediate stop rather than typing a long
// message only to have it rejected after hitting send.
const MAX_MESSAGE_LENGTH = 2000;

export default function ChatThread({ compact = false, source }: { compact?: boolean; source: ChatOrigin }) {
  const { messages, isLoading, error, sendMessage, showCta } = useChat();
  const [draft, setDraft] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Appends rather than replaces, so a visitor can speak a sentence, pause
  // to think, and speak again into the same message.
  const {
    isSupported: speechSupported,
    isListening,
    toggleListening,
    error: speechError,
  } = useSpeechToText((transcript) => {
    setDraft((prev) => (prev ? `${prev} ${transcript}` : transcript));
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  function submit() {
    if ((!draft.trim() && !file) || isLoading) return;
    sendMessage(draft.trim() || "Here's a PDF about my business — can you take a look?", source, file ?? undefined);
    setDraft("");
    setFile(null);
  }

  function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    e.target.value = "";
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      setFileError("Only PDF files are supported right now.");
      return;
    }
    if (selected.size > MAX_PDF_BYTES) {
      setFileError("That file is too large (max 8MB).");
      return;
    }
    setFileError(null);
    setFile(selected);
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className={cn("flex-1 space-y-4 overflow-y-auto px-5 py-5", compact ? "" : "px-6 py-6")}>
        {messages.map((message) => (
          <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
            <p
              className={cn(
                "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                message.role === "user"
                  ? "rounded-tr-sm bg-ink text-canvas"
                  : "rounded-tl-sm bg-canvas-surface text-ink-muted",
              )}
            >
              {message.content}
            </p>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-canvas-surface px-4 py-3">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-faint [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-faint [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-faint" />
            </div>
          </div>
        )}

        {error && (
          <p className="rounded-xl border border-canvas-border bg-canvas-surface/60 px-4 py-3 text-xs text-ink-faint">
            {error} You can also reach us directly at{" "}
            <a href="/contact" className="underline decoration-canvas-border underline-offset-2 hover:text-ink">
              /contact
            </a>
            .
          </p>
        )}

        {messages.length === 1 && !isLoading && (
          <div className="flex flex-wrap gap-2 pt-1">
            {chatSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => sendMessage(s, source)}
                className="rounded-full border border-canvas-border px-3 py-1.5 text-left text-xs text-ink-muted transition-colors duration-300 hover:border-accent/40 hover:text-ink"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-canvas-border p-3">
        {showCta && (
          <a
            href="/contact"
            onClick={() => trackEvent("chat_cta_clicked", { cta: "book_a_project", location: source })}
            className="mb-2 flex items-center justify-between gap-2 rounded-xl border border-canvas-border bg-canvas-surface/60 px-4 py-2.5 text-sm text-ink-muted transition-colors duration-300 hover:border-accent/40 hover:text-ink"
          >
            <span>Ready to build this?</span>
            <span className="flex shrink-0 items-center gap-1 font-medium text-ink">
              Book a project
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </a>
        )}
        <p className="mb-2 px-1 text-[10.5px] leading-relaxed text-ink-faint">
          By chatting, you agree to our{" "}
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline decoration-canvas-border underline-offset-2 hover:text-ink-muted">
            Privacy Policy
          </a>
          .
        </p>
        {(file || fileError) && (
          <div className="mb-2 flex items-center justify-between rounded-full border border-canvas-border px-3 py-1.5">
            <span className="truncate text-xs text-ink-muted">
              {fileError ?? `📎 ${file?.name}`}
            </span>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setFileError(null);
              }}
              aria-label="Remove attachment"
              className="text-ink-faint hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        {speechError && (
          <p className="mb-2 px-1 text-xs text-red-400">{speechError}</p>
        )}

        <div className="flex items-center gap-2">
          <input ref={fileInputRef} type="file" accept="application/pdf" onChange={onFileSelect} className="hidden" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach a PDF"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-faint transition-colors hover:text-ink"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder={isListening ? "Listening..." : "Ask anything..."}
            maxLength={MAX_MESSAGE_LENGTH}
            className="flex-1 rounded-full border border-canvas-border bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent/40 focus:outline-none"
          />
          {speechSupported && (
            <button
              type="button"
              onClick={toggleListening}
              aria-label={isListening ? "Stop voice input" : "Use voice input"}
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                isListening ? "bg-red-500/15 text-red-400" : "text-ink-faint hover:text-ink",
              )}
            >
              <Mic className={cn("h-4 w-4", isListening && "animate-pulse")} />
            </button>
          )}
          <button
            type="button"
            onClick={submit}
            disabled={(!draft.trim() && !file) || isLoading}
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-canvas transition-opacity duration-300 disabled:opacity-30"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
