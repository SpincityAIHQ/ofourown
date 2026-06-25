import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { submitBooking } from "@/lib/intake.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function BookingForm({
  type,
}: {
  type: "training" | "wellness" | "fst" | "coaching";
}) {
  const submit = useServerFn(submitBooking);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

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
    try {
      await submit({ data });
      setDone(true);
      toast.success("Request received. Ben will be in touch.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="border border-foreground p-8">
        <h3 className="font-display text-2xl font-semibold">Request received.</h3>
        <p className="mt-2 text-muted-foreground">
          Ben (or his team) will reach out within 48 hours to confirm next steps.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required maxLength={120} />
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required maxLength={255} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" name="phone" type="tel" maxLength={40} />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="preferred_time">Preferred time / availability</Label>
        <Input id="preferred_time" name="preferred_time" maxLength={200} placeholder="e.g. Weekday mornings, EST" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="goals">What are you working toward?</Label>
        <Textarea id="goals" name="goals" rows={4} maxLength={2000} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="notes">Anything else?</Label>
        <Textarea id="notes" name="notes" rows={3} maxLength={2000} />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="h-12 rounded-none uppercase tracking-wider"
      >
        {loading ? "Sending..." : "Request a session"}
      </Button>
    </form>
  );
}