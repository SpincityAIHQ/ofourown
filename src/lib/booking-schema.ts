import { z } from "zod";

export const ATHLETE_AGE_BANDS = [
  { value: "8-9", label: "8–9 years" },
  { value: "10-13", label: "10–13 years" },
  { value: "14-17", label: "14–17 years" },
  { value: "18+", label: "18 years or older" },
] as const;

export const bookingSchema = z
  .object({
    type: z.enum(["training", "wellness", "fst", "coaching"]),
    name: z.string().trim().min(1, "Enter the adult contact's name.").max(120),
    email: z.string().trim().email("Enter a valid email address.").max(255),
    phone: z.string().trim().max(40).optional(),
    goals: z.string().trim().max(2000).optional(),
    preferred_time: z.string().trim().max(200).optional(),
    notes: z.string().trim().max(2000).optional(),
    athlete_age_band: z.enum(["8-9", "10-13", "14-17", "18+"]).optional(),
    utm_source: z.string().trim().max(120).optional(),
    utm_medium: z.string().trim().max(120).optional(),
    utm_campaign: z.string().trim().max(120).optional(),
    utm_term: z.string().trim().max(120).optional(),
    utm_content: z.string().trim().max(120).optional(),
    landing_path: z.string().trim().startsWith("/").max(300).optional(),
  })
  .superRefine((data, context) => {
    if (data.type === "training" && !data.athlete_age_band) {
      context.addIssue({
        code: "custom",
        path: ["athlete_age_band"],
        message: "Choose the athlete's age group to request an evaluation.",
      });
    }
  });

export function bookingNotificationNotes(data: z.infer<typeof bookingSchema>) {
  const band = ATHLETE_AGE_BANDS.find((item) => item.value === data.athlete_age_band);
  return (
    [band ? `Athlete age group: ${band.label}` : undefined, data.notes]
      .filter(Boolean)
      .join("\n") || undefined
  );
}
