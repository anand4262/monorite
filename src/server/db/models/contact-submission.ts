import { getSupabase } from "../client";

export interface ContactSubmissionFields {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
}

/** Durably persists a contact form submission. Best-effort: a failure here
 * must never fail the visitor's form submission, so it only logs, never
 * throws. No-ops silently when Supabase isn't configured. */
export async function saveContactSubmission(fields: ContactSubmissionFields): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  const { error } = await supabase.from("contact_submissions").insert({
    name: fields.name,
    email: fields.email,
    company: fields.company || null,
    phone: fields.phone || null,
    message: fields.message,
  });

  if (error) {
    console.error("Failed to save contact submission to Supabase:", error.message);
  }
}
