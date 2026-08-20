"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MessageCircle, X } from "lucide-react";
import { useChat } from "./ChatProvider";
import ChatThread from "./ChatThread";

/** Site-wide floating chat, mounted once in the root layout. Shares its
 * conversation with the homepage's embedded demo panel via ChatProvider —
 * this is the actual support surface a visitor reaches from any page, not
 * a separate toy chat. */
export default function ChatWidget() {
  const { isOpen, setIsOpen, hasUnreadReply, pendingContinuePrompt, resolveContinuePrompt } = useChat();

  return (
    // items-end: without this, the container shrink-wraps to whichever
    // child is widest (the panel, when open) and the button, now much
    // narrower with just an icon, defaults to that box's LEFT edge —
    // visually "jumping" left on open and back right on close. Right-
    // aligning both children keeps the button's right edge fixed no
    // matter how its own width changes.
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end md:bottom-6 md:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 flex h-[520px] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-canvas-border bg-canvas shadow-[0_24px_64px_-16px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between border-b border-canvas-border px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-mint" />
                <p className="text-sm font-medium text-ink">Monorite Assistant</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="text-ink-faint transition-colors hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {pendingContinuePrompt ? (
              <div className="flex flex-1 flex-col items-start justify-center gap-4 px-6 py-8">
                <p className="text-sm leading-relaxed text-ink-muted">
                  You were just chatting on the page above — want to pick up where you left off, or start a new
                  conversation?
                </p>
                <div className="flex w-full flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => resolveContinuePrompt("continue")}
                    className="w-full rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-canvas transition-colors duration-300 hover:bg-accent-soft"
                  >
                    Continue that conversation
                  </button>
                  <button
                    type="button"
                    onClick={() => resolveContinuePrompt("fresh")}
                    className="w-full rounded-full border border-canvas-border px-4 py-2.5 text-sm text-ink-muted transition-colors duration-300 hover:text-ink"
                  >
                    Start fresh instead
                  </button>
                </div>
              </div>
            ) : (
              <div className="min-h-0 flex-1">
                <ChatThread compact source="widget" />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.94 }}
        animate={!isOpen && hasUnreadReply ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={!isOpen && hasUnreadReply ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : undefined}
        aria-label={isOpen ? "Minimize chat" : "Ask a question"}
        className="relative flex items-center gap-2 rounded-full bg-ink px-5 py-3.5 text-sm font-medium text-canvas shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)] transition-colors duration-300 hover:bg-accent-soft"
      >
        {!isOpen && hasUnreadReply && (
          <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-mint" />
          </span>
        )}
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <MessageCircle className="h-4 w-4" />}
        {!isOpen && <span>{hasUnreadReply ? "Still here if you need me" : "Ask a question"}</span>}
      </motion.button>
    </div>
  );
}
