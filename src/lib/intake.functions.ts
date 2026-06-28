import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

function getServerClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        storage: undefined,
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}

async function notify(subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!apiKey || !to) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BenGordon.com <noreply@bengordon.com>",
        to,
        subject,
        html,
      }),
    });
  } catch (err) {
    console.error("[notify] failed", err);
  }
}

/* ---------------- LEADS ---------------- */

const leadSchema = z.object({
  email: z.string().trim().email().max(255),
  source: z.string().trim().max(120).optional(),
  utm_source: z.string().trim().max(120).optional(),
  utm_medium: z.string().trim().max(120).optional(),
  utm_campaign: z.string().trim().max(120).optional(),
  utm_term: z.string().trim().max(120).optional(),
  utm_content: z.string().trim().max(120).optional(),
});

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => leadSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = getServerClient();
    const { error } = await supabase.from("leads").insert(data);
    if (error) {
      console.error("[submitLead]", error);
      throw new Error("Could not save your email. Please try again.");
    }
    await notify(
      `New lead — ${data.email}`,
      `<p>New email signup: <strong>${data.email}</strong></p>
       <p><strong>Source:</strong> ${data.source ?? "website"}</p>`,
    );
    return { ok: true };
  });

/* ---------------- BOOKING REQUESTS ---------------- */

const bookingSchema = z.object({
  type: z.enum(["training", "wellness", "fst", "coaching"]),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional(),
  goals: z.string().trim().max(2000).optional(),
  preferred_time: z.string().trim().max(200).optional(),
  notes: z.string().trim().max(2000).optional(),
});

export const submitBooking = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => bookingSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = getServerClient();
    const { error } = await supabase.from("booking_requests").insert(data);
    if (error) {
      console.error("[submitBooking]", error);
      throw new Error("Could not submit your booking. Please try again.");
    }
    await notify(
      `New ${data.type} booking — ${data.name}`,
      `<p><strong>${data.name}</strong> (${data.email}) requested a ${data.type} session.</p>
       <p><strong>Phone:</strong> ${data.phone ?? "—"}</p>
       <p><strong>Preferred time:</strong> ${data.preferred_time ?? "—"}</p>
       <p><strong>Goals:</strong><br>${data.goals ?? "—"}</p>
       <p><strong>Notes:</strong><br>${data.notes ?? "—"}</p>`,
    );
    return { ok: true };
  });

/* ---------------- INQUIRIES ---------------- */

const inquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  reason: z.enum(["general", "press", "partnership", "support", "other"]),
  message: z.string().trim().min(1).max(4000),
});

export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inquirySchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = getServerClient();
    const { error } = await supabase.from("inquiries").insert(data);
    if (error) {
      console.error("[submitInquiry]", error);
      throw new Error("Could not send your message. Please try again.");
    }
    await notify(
      `New inquiry (${data.reason}) — ${data.name}`,
      `<p><strong>${data.name}</strong> (${data.email}) — ${data.reason}</p>
       <p>${data.message.replace(/\n/g, "<br>")}</p>`,
    );
    return { ok: true };
  });

/* ---------------- SPEAKING INQUIRIES ---------------- */

const speakingSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  organization: z.string().trim().max(200).optional(),
  engagement_type: z.string().trim().max(80).optional(),
  event_date: z.string().trim().max(120).optional(),
  audience_size: z.string().trim().max(80).optional(),
  budget_range: z.string().trim().max(80).optional(),
  message: z.string().trim().max(4000).optional(),
});

export const submitSpeakingInquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => speakingSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = getServerClient();
    const { error } = await supabase.from("speaking_inquiries").insert(data);
    if (error) {
      console.error("[submitSpeakingInquiry]", error);
      throw new Error("Could not send your inquiry. Please try again.");
    }
    await notify(
      `New speaking inquiry — ${data.name}`,
      `<p><strong>${data.name}</strong> (${data.email}) — ${data.organization ?? "—"}</p>
       <p><strong>Engagement:</strong> ${data.engagement_type ?? "—"}</p>
       <p><strong>Event date:</strong> ${data.event_date ?? "—"}</p>
       <p><strong>Audience size:</strong> ${data.audience_size ?? "—"}</p>
       <p><strong>Budget:</strong> ${data.budget_range ?? "—"}</p>
       <p><strong>Message:</strong><br>${(data.message ?? "—").replace(/\n/g, "<br>")}</p>`,
    );
    return { ok: true };
  });