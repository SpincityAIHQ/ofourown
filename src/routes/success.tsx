import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, Eyebrow } from "@/components/section";

export const Route = createFileRoute("/success")({
  head: () => ({
    meta: [
      { title: "Thank you — Ben Gordon" },
      { name: "description", content: "Order confirmed." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  return (
    <Section>
      <div className="mx-auto max-w-xl text-center">
        <Eyebrow>Confirmed</Eyebrow>
        <h1 className="font-display text-5xl font-semibold">Thank you.</h1>
        <p className="mt-6 text-muted-foreground">
          Your order is in. A receipt is on its way to your inbox, and you'll receive access details shortly.
        </p>
        <p className="mt-10">
          <Link to="/" className="text-sm uppercase tracking-wider underline">Back to home</Link>
        </p>
      </div>
    </Section>
  );
}