import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { submitBooking } from "@/lib/intake.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function BookingForm({ type }: { type: "training" | "wellness" | "fst" | "coaching" }) {
  const submit = useServerFn(submitBooking);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const isEvaluation = type === "training";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      type,
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? "") || undefined,
      goals: String(fd.get("goals") ?? "") || undefined,
      preferred_time: String(fd.get("preferred_time") ?? "") || undefined,
      notes: String(fd.get("notes") ?? "") || undefined,
    };
    setLoading(true);
    setError("");
    try {
      await submit({ data });
      setDone(true);
      toast.success("Request received. Ben will be in touch.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div role="status" className="border border-foreground p-8">
        <h3 className="font-display text-2xl font-semibold">Request received.</h3>
        <p className="mt-2 text-muted-foreground">
          {isEvaluation
            ? "The OOO team will contact you about available dates and location. Your evaluation is not reserved until the team confirms it."
            : "Ben or his team will reach out to confirm availability and next steps."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5" aria-busy={loading}>
      <div className="grid gap-2">
        <Label htmlFor="name">
          {isEvaluation ? "Parent, guardian, or adult athlete name" : "Name"}
        </Label>
        <Input id="name" name="name" autoComplete="name" required maxLength={120} />
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={255}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={40} />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="preferred_time">Preferred time / availability</Label>
        <Input
          id="preferred_time"
          name="preferred_time"
          maxLength={200}
          placeholder="e.g. Weekday evenings, Eastern Time"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="goals">What are you working toward?</Label>
        <Textarea id="goals" name="goals" rows={4} maxLength={2000} />
      </div>
      <details className="border-y border-border py-3">
        <summary className="cursor-pointer text-sm text-muted-foreground">
          Add a note (optional)
        </summary>
        <div className="mt-3 grid gap-2">
          <Label htmlFor="notes">Anything else the team should know?</Label>
          <Textarea
            id="notes"
            name="notes"
            rows={3}
            maxLength={2000}
            placeholder="Please avoid including sensitive personal or medical details."
          />
        </div>
      </details>
      <p className="text-xs leading-relaxed text-muted-foreground">
        By submitting, you ask the OOO team to contact you about this request.{" "}
        {isEvaluation
          ? "This is an evaluation request, not a confirmed reservation."
          : "Session dates and availability will be confirmed by the team."}
      </p>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error} Your entries are still here so you can retry.
        </p>
      ) : null}
      <Button
        type="submit"
        disabled={loading}
        className="h-12 rounded-none uppercase tracking-wider"
      >
        {loading
          ? "Sending your request..."
          : isEvaluation
            ? "Request my free evaluation"
            : "Request a session"}
      </Button>
    </form>
  );
}
