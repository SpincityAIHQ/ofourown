import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { submitInquiry } from "@/lib/intake.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Reason = "general" | "press" | "partnership" | "support" | "other";

export function ContactForm() {
  const submit = useServerFn(submitInquiry);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [reason, setReason] = useState<Reason>("general");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try {
      await submit({
        data: {
          name: String(fd.get("name") ?? ""),
          email: String(fd.get("email") ?? ""),
          reason,
          message: String(fd.get("message") ?? ""),
        },
      });
      setDone(true);
      toast.success("Message sent.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="border border-foreground p-8">
        <h3 className="font-display text-2xl font-semibold">Message received.</h3>
        <p className="mt-2 text-muted-foreground">Expect a reply within a few business days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-2 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required maxLength={120} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required maxLength={255} />
        </div>
      </div>
      <div className="grid gap-2">
        <Label>Reason</Label>
        <Select value={reason} onValueChange={(v) => setReason(v as Reason)}>
          <SelectTrigger className="h-11 rounded-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="press">Press</SelectItem>
            <SelectItem value="partnership">Partnership</SelectItem>
            <SelectItem value="support">Support</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" rows={6} required maxLength={4000} />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="h-12 rounded-none uppercase tracking-wider"
      >
        {loading ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}