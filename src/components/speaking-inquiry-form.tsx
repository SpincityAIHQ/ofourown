import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { submitSpeakingInquiry } from "@/lib/intake.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const ENGAGEMENT_TYPES = [
  "Keynote",
  "Team",
  "College",
  "Corporate",
  "Men's Group",
  "Youth",
  "Advisory",
  "Other",
] as const;

export function SpeakingInquiryForm() {
  const submit = useServerFn(submitSpeakingInquiry);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      organization: String(fd.get("organization") ?? "") || undefined,
      engagement_type: String(fd.get("engagement_type") ?? "") || undefined,
      event_date: String(fd.get("event_date") ?? "") || undefined,
      audience_size: String(fd.get("audience_size") ?? "") || undefined,
      budget_range: String(fd.get("budget_range") ?? "") || undefined,
      message: String(fd.get("message") ?? "") || undefined,
    };
    setLoading(true);
    try {
      await submit({ data });
      setDone(true);
      toast.success("Inquiry received. Ben's team will be in touch.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="border border-foreground p-8">
        <h3 className="font-display text-2xl font-semibold">Inquiry received.</h3>
        <p className="mt-2 text-muted-foreground">
          Ben's team will reach out shortly to confirm fit, date, and scope.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-2 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="s_name">Name</Label>
          <Input id="s_name" name="name" required maxLength={120} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="s_email">Email</Label>
          <Input id="s_email" name="email" type="email" required maxLength={255} />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="s_org">Organization</Label>
        <Input id="s_org" name="organization" maxLength={200} />
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="s_type">Engagement type</Label>
          <select
            id="s_type"
            name="engagement_type"
            className="h-10 rounded-none border border-input bg-transparent px-3 text-sm"
            defaultValue=""
          >
            <option value="" disabled>
              Select…
            </option>
            {ENGAGEMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="s_date">Event date</Label>
          <Input id="s_date" name="event_date" maxLength={120} placeholder="e.g. Q4 2026 or 2026-11-12" />
        </div>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="s_size">Audience size</Label>
          <Input id="s_size" name="audience_size" maxLength={80} placeholder="e.g. 250" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="s_budget">Budget range</Label>
          <Input id="s_budget" name="budget_range" maxLength={80} placeholder="e.g. $10–25k" />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="s_msg">Message</Label>
        <Textarea id="s_msg" name="message" rows={4} maxLength={4000} />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="h-12 rounded-none uppercase tracking-wider"
      >
        {loading ? "Sending..." : "Send inquiry"}
      </Button>
    </form>
  );
}