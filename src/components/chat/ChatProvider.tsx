"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { chatGreeting } from "@/data/chat";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

/** Which shell the conversation started in — set once, from whichever
 * shell sends the first message, and fixed for the conversation's life
 * even if the visitor later uses the other shell too. Mirrors the
 * server's ChatOrigin type (@/server/chat) but kept local here since this
 * is a client component and can't import server-only code. */
export type ChatOrigin = "demo" | "widget";

const GREETING: ChatMessage = {
  id: "greeting",
  role: "assistant",
  content: chatGreeting,
};

const SESSION_STORAGE_KEY = "monorite-chat-session";
const ORIGIN_STORAGE_KEY = "monorite-chat-origin";
const PROMPT_RESOLVED_STORAGE_KEY = "monorite-chat-continue-prompt-resolved";
// How long a visitor can go quiet mid-conversation (widget closed, no new
// message) before the floating pill gives one gentle nudge to come back.
const IDLE_NUDGE_MS = 45_000;

interface ChatContextValue {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string, source: ChatOrigin, file?: File) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  /** True when there's a reply (or an abandoned conversation) the visitor
   * hasn't seen yet — drives the pulsing badge on the floating pill. */
  hasUnreadReply: boolean;
  /** True exactly once per session, the first time the widget opens after
   * real demo-panel activity — asks whether to continue that thread or
   * start over. See resolveContinuePrompt. */
  pendingContinuePrompt: boolean;
  resolveContinuePrompt: (choice: "continue" | "fresh") => void;
  /** Once the conversation is substantial enough that the server would
   * bother summarizing it into a lead, it's also substantial enough to
   * offer a real "book a project" CTA — sticky once earned, so it doesn't
   * flicker away if a later message happens not to cross the threshold. */
  showCta: boolean;
}

const ChatContext = createContext<ChatContextValue | null>(null);

/** One shared conversation, mounted once at the root, so the floating
 * widget and the homepage's embedded "live demo" panel show the exact
 * same thread — typing in either one updates both, since they're really
 * two different views onto one piece of state rather than two chats.
 * Which one it *started* in is still tracked (originRef) so the team can
 * tell a curious-browsing demo lead from an intent-driven widget lead. */
export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [hasUnreadReply, setHasUnreadReply] = useState(false);
  const [pendingContinuePrompt, setPendingContinuePrompt] = useState(false);
  const [showCta, setShowCta] = useState(false);
  // Set once resolved (either choice), so the prompt never asks twice in
  // the same browser session even across page reloads.
  const promptResolvedRef = useRef(false);
  // Mirrors `messages` so sendMessage can read the current list
  // synchronously without putting the fetch call inside a setState
  // updater — updaters can be invoked more than once per commit (React
  // does this deliberately in StrictMode dev to surface exactly this
  // class of bug), which was firing the API request twice per message.
  const messagesRef = useRef<ChatMessage[]>([GREETING]);
  const isOpenRef = useRef(false);
  const idleNudgeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const originRef = useRef<ChatOrigin | null>(null);

  // A stable per-browser session id, persisted so a page reload continues
  // the same conversation server-side (see ConversationStore) instead of
  // starting a fresh, disconnected record every navigation.
  useEffect(() => {
    const existing = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) {
      setSessionId(existing);
    } else {
      const fresh = crypto.randomUUID();
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, fresh);
      setSessionId(fresh);
    }

    const existingOrigin = window.sessionStorage.getItem(ORIGIN_STORAGE_KEY);
    if (existingOrigin === "demo" || existingOrigin === "widget") {
      originRef.current = existingOrigin;
    }

    promptResolvedRef.current = window.sessionStorage.getItem(PROMPT_RESOLVED_STORAGE_KEY) === "true";
  }, []);

  const clearIdleNudgeTimer = useCallback(() => {
    if (idleNudgeTimer.current) clearTimeout(idleNudgeTimer.current);
  }, []);

  // A real exchange has happened (past the canned greeting) and the
  // visitor has gone quiet with the widget closed — nudge once rather
  // than repeatedly, so it reads as "still here if you need me," not a
  // notification spam loop.
  const armIdleNudge = useCallback(() => {
    clearIdleNudgeTimer();
    idleNudgeTimer.current = setTimeout(() => {
      if (!isOpenRef.current) setHasUnreadReply(true);
    }, IDLE_NUDGE_MS);
  }, [clearIdleNudgeTimer]);

  useEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen) {
      setHasUnreadReply(false);
      clearIdleNudgeTimer();

      // The one case this asks about: real demo-panel activity happened,
      // and this is the first time the widget's being opened this
      // session. Widget-only visitors (origin === "widget") never see
      // this — there's nothing ambiguous about closing and reopening the
      // same shell.
      if (
        !promptResolvedRef.current &&
        originRef.current === "demo" &&
        messagesRef.current.length > 1
      ) {
        setPendingContinuePrompt(true);
      }
    } else if (messagesRef.current.length > 2) {
      // Visitor read the conversation and closed the widget without
      // replying further — "stops convo mid-way to look at other things
      // on the site" — arm the same slow, one-time nudge for that case.
      armIdleNudge();
    }
  }, [isOpen, armIdleNudge, clearIdleNudgeTimer]);

  const sendMessage = useCallback(
    (content: string, source: ChatOrigin, file?: File) => {
      const trimmed = content.trim();
      if (!trimmed || !sessionId) return;

      // First message of the conversation decides where it "started,"
      // regardless of which shell sends every message after.
      if (!originRef.current) {
        originRef.current = source;
        window.sessionStorage.setItem(ORIGIN_STORAGE_KEY, source);
      }

      clearIdleNudgeTimer();
      // messagesRef starts as [GREETING] — length 1 means this is the
      // first real user message of the conversation, not a repeat sender.
      const isFirstMessage = messagesRef.current.length === 1;
      const label = file ? `${trimmed}\n📎 ${file.name}` : trimmed;
      const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content: label };
      const next = [...messagesRef.current, userMessage];
      messagesRef.current = next;
      setMessages(next);

      if (isFirstMessage) trackEvent("chat_started", { location: source });
      trackEvent("chat_message_sent", {
        message_number: next.filter((m) => m.role === "user").length,
        location: source,
      });

      void requestReply(
        sessionId,
        originRef.current,
        next,
        trimmed,
        file,
        setMessages,
        setIsLoading,
        setError,
        messagesRef,
        isOpenRef,
        setHasUnreadReply,
        armIdleNudge,
        setShowCta,
      );
    },
    [sessionId, armIdleNudge, clearIdleNudgeTimer],
  );

  // "Continue" leaves everything as-is. "Fresh" resets the one shared
  // conversation — messages, sessionId, and origin all reset together
  // (confirmed deliberately: the alternative, forking the demo panel and
  // widget into two permanently-independent threads, was ruled out as
  // more complexity than the UX gain justifies). The old conversation
  // isn't deleted, it's just no longer the active one shown anywhere.
  const resolveContinuePrompt = useCallback((choice: "continue" | "fresh") => {
    promptResolvedRef.current = true;
    window.sessionStorage.setItem(PROMPT_RESOLVED_STORAGE_KEY, "true");
    setPendingContinuePrompt(false);

    if (choice === "fresh") {
      const fresh = crypto.randomUUID();
      window.sessionStorage.setItem(SESSION_STORAGE_KEY, fresh);
      setSessionId(fresh);

      originRef.current = "widget";
      window.sessionStorage.setItem(ORIGIN_STORAGE_KEY, "widget");

      messagesRef.current = [GREETING];
      setMessages([GREETING]);

      clearIdleNudgeTimer();
      setHasUnreadReply(false);
      setError(null);
      setShowCta(false);
    }
  }, [clearIdleNudgeTimer]);

  const value = useMemo(
    () => ({
      messages,
      isLoading,
      error,
      sendMessage,
      isOpen,
      setIsOpen,
      hasUnreadReply,
      pendingContinuePrompt,
      resolveContinuePrompt,
      showCta,
    }),
    [
      messages,
      isLoading,
      error,
      sendMessage,
      isOpen,
      hasUnreadReply,
      pendingContinuePrompt,
      resolveContinuePrompt,
      showCta,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

async function requestReply(
  sessionId: string,
  origin: ChatOrigin,
  history: ChatMessage[],
  latestUserContent: string,
  file: File | undefined,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  messagesRef: React.MutableRefObject<ChatMessage[]>,
  isOpenRef: React.MutableRefObject<boolean>,
  setHasUnreadReply: React.Dispatch<React.SetStateAction<boolean>>,
  armIdleNudge: () => void,
  setShowCta: React.Dispatch<React.SetStateAction<boolean>>,
) {
  setIsLoading(true);
  setError(null);
  const startedAt = Date.now();

  // The model only ever sees the plain message text — the "📎 filename"
  // suffix is a UI affordance, not part of the conversation sent upstream.
  const wireMessages = history.map((m, i) => ({
    role: m.role,
    content: i === history.length - 1 ? latestUserContent : m.content,
  }));

  try {
    let res: Response;
    if (file) {
      const form = new FormData();
      form.set("sessionId", sessionId);
      form.set("origin", origin);
      form.set("messages", JSON.stringify(wireMessages));
      form.set("file", file);
      res = await fetch("/api/chat", { method: "POST", body: form });
    } else {
      res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, origin, messages: wireMessages }),
      });
    }

    const data = await res.json();

    if (!res.ok) {
      // Categories map to the actual status codes /api/chat can return
      // (see route.ts) — not invented buckets, so this stays meaningful
      // if a new failure mode is added later without updating this list.
      const errorType =
        res.status === 429
          ? "rate_limit"
          : res.status === 403
            ? "origin_blocked"
            : res.status === 413
              ? "file_too_large"
              : res.status === 422
                ? "file_parse_error"
                : res.status === 400
                  ? "invalid_request"
                  : "api_error";
      trackEvent("chat_error", { error_type: errorType, location: origin });
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    trackEvent("chat_response_received", { response_time_ms: Date.now() - startedAt, location: origin });
    if (data.leadCaptured) trackEvent("generate_lead", { source: "chatbot" });
    if (data.showCta) setShowCta(true);

    const assistantMessage: ChatMessage = { id: crypto.randomUUID(), role: "assistant", content: data.reply };
    messagesRef.current = [...messagesRef.current, assistantMessage];
    setMessages(messagesRef.current);

    // The reply landed while the visitor had scrolled away or was
    // browsing elsewhere on the site (widget closed) — nudge immediately
    // rather than leaving them to notice on their own, and arm the
    // slower idle nudge in case they don't come back to check it either.
    if (!isOpenRef.current) {
      setHasUnreadReply(true);
      armIdleNudge();
    }
  } catch {
    trackEvent("chat_error", { error_type: "network_error", location: origin });
    setError("Couldn't reach the assistant. Check your connection and try again.");
  } finally {
    setIsLoading(false);
  }
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
