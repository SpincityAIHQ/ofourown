import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { submitLead } from "@/lib/intake.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function EmailCapture({
  source,
  placeholder = "you@example.com",
  cta = "Subscribe",
}: {
  source?: string;
  placeholder?: string;
  cta?: string;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const submit = useServerFn(submitLead);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await submit({ data: { email, source } });
      setDone(true);
      setEmail("");
      toast.success("You're on the list.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <p className="text-sm text-muted-foreground">
        Thanks — you'll hear from Ben soon.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md gap-2">
      <Input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        className="h-11 rounded-none border-foreground bg-transparent"
      />
      <Button
        type="submit"
        disabled={loading}
        className="h-11 rounded-none px-6 uppercase tracking-wider"
      >
        {loading ? "..." : cta}
      </Button>
    </form>
  );
}