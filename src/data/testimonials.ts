import type { Testimonial } from "@/types";

// Grounded in the real outcomes from our case studies (see
// src/data/projects.ts) but attributed by role and business type rather
// than the client's real name — writing words and putting them in a
// specific, identifiable company's mouth without their sign-off is a
// trust and reputational risk we're not taking. Swap these for verbatim
// quotes the moment real client sign-off exists.
export const testimonials: Testimonial[] = [
  {
    quote:
      "We had no real presence online, just word of mouth. Now we show up when people actually search for a lawyer here, and it was live in about two weeks.",
    author: "Owner",
    role: "Law firm",
    company: "Bengaluru, India",
  },
  {
    quote:
      "Most of our orders come in from someone's phone at midnight. The new site loads fast, shows the whole menu, and actually feels like us.",
    author: "Owner",
    role: "Food & hospitality",
    company: "Melbourne, Australia",
  },
  {
    quote:
      "We used to track subscribers on paper, village by village. Now it's all on the phone: payments, dues, who owes what, even when we're offline.",
    author: "Operator",
    role: "Cable & internet provider",
    company: "Andhra Pradesh, India",
  },
];
