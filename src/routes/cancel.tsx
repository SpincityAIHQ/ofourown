import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, Eyebrow } from "@/components/section";

export const Route = createFileRoute("/cancel")({
  head: () => ({
    meta: [
      { title: "Checkout cancelled — OfOurOwn" },
      { name: "description", content: "Checkout cancelled." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CancelPage,
});

function CancelPage() {
  return (
    <Section>
      <div className="mx-auto max-w-xl text-center">
        <Eyebrow>Cancelled</Eyebrow>
        <h1 className="font-display text-5xl font-semibold">No charge made.</h1>
        <p className="mt-6 text-muted-foreground">
          Your checkout was cancelled. You can head back to the shop whenever you're ready.
        </p>
        <p className="mt-10">
          <Link to="/shop" className="text-sm uppercase tracking-wider underline">Back to shop</Link>
        </p>
      </div>
    </Section>
  );
}