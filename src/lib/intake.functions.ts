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

async function notify(
  subject: string,
  heading: string,
  lines: Array<{ label: string; value: string }>,
  body?: string,
) {
  const to = process.env.NOTIFY_EMAIL;
  if (!to) return;
  try {
    const { sendInternalTransactionalEmail } = await import(
      "@/lib/email/send-internal.server"
    );
    await sendInternalTransactionalEmail({
      templateName: "internal-notification",
      recipientEmail: to,
      idempotencyKey: `notify-${subject}-${Date.now()}`,
      templateData: {
        subject,
        heading,
        submittedAt: new Date().toUTCString(),
        lines,
        body,
      },
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
      `New email signup`,
      [
        { label: "Email", value: data.email },
        { label: "Source", value: data.source ?? "website" },
      ],
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
    const notifyTo = process.env.NOTIFY_EMAIL;
    if (notifyTo) {
      try {
        const { sendInternalTransactionalEmail, buildGoogleCalendarUrl } =
          await import("@/lib/email/send-internal.server");
        const calendarUrl = buildGoogleCalendarUrl({
          title: `OOO ${data.type} — ${data.name}`,
          details:
            `Booking from ${data.name} (${data.email})\n` +
            (data.phone ? `Phone: ${data.phone}\n` : "") +
            (data.preferred_time ? `Preferred: ${data.preferred_time}\n` : "") +
            (data.goals ? `\nGoals:\n${data.goals}\n` : "") +
            (data.notes ? `\nNotes:\n${data.notes}\n` : ""),
        });
        await sendInternalTransactionalEmail({
          templateName: "booking-confirmation",
          recipientEmail: notifyTo,
          idempotencyKey: `booking-${data.email}-${Date.now()}`,
          templateData: {
            type: data.type,
            name: data.name,
            email: data.email,
            phone: data.phone,
            preferredTime: data.preferred_time,
            goals: data.goals,
            notes: data.notes,
            submittedAt: new Date().toUTCString(),
            calendarUrl,
          },
        });
      } catch (err) {
        console.error("[submitBooking] email notify failed", err);
      }
    }
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
      `New inquiry from ${data.name}`,
      [
        { label: "Name", value: data.name },
        { label: "Email", value: data.email },
        { label: "Reason", value: data.reason },
      ],
      data.message,
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
      `New speaking inquiry from ${data.name}`,
      [
        { label: "Name", value: data.name },
        { label: "Email", value: data.email },
        { label: "Organization", value: data.organization ?? "—" },
        { label: "Engagement", value: data.engagement_type ?? "—" },
        { label: "Event date", value: data.event_date ?? "—" },
        { label: "Audience size", value: data.audience_size ?? "—" },
        { label: "Budget", value: data.budget_range ?? "—" },
      ],
      data.message ?? undefined,
    );
    return { ok: true };
  });