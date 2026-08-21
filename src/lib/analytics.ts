declare global {
  interface Window {
    gtag?: (command: string, eventName: string, parameters?: Record<string, unknown>) => void;
  }
}

/**
 * Fires a GA4 custom event. Never pass message content, names, emails,
 * phone numbers, or anything else identifying — this is a behavioral
 * funnel (did someone open the chat, send a message, hit an error), not a
 * copy of the conversation. That split mirrors the chat system's own
 * local-extraction design: GA4 sees what happened, never what was said.
 *
 * No-ops outside the browser and when gtag isn't loaded (dev, or GA
 * blocked/ad-blocked) rather than throwing — an analytics call failing
 * should never be able to break the actual feature around it.
 */
export function trackEvent(eventName: string, parameters?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, parameters);
}
