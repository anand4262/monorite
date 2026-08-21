import { z } from "zod";

/**
 * Server-side contact form schema. Mirrors client-side validation but is the
 * source of truth — never trust the client. Lengths are capped defensively
 * to avoid abuse via oversized payloads.
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(100),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  company: z.string().trim().max(150).optional().or(z.literal("")),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[0-9+\-().\s]*$/, "Please enter a valid phone number.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more — at least 10 characters.")
    .max(3000),
  // Honeypot field — must stay empty. Bots that auto-fill every field will
  // trip this and get silently rejected.
  website: z.string().max(0, "Spam detected.").optional().or(z.literal("")),
  // Timestamp (ms) the form was rendered, used for a minimal time-to-submit
  // check to slow down scripted submissions.
  renderedAt: z.number().optional(),
});
