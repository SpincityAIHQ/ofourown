import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/components/contact-form";
import { PageHero, Section } from "@/components/section";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Ben Gordon" },
      { name: "description", content: "Reach out about training, wellness, coaching, press, or partnerships." },
      { property: "og:title", content: "Contact Ben Gordon" },
      { property: "og:description", content: "Reach out to Ben Gordon's team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Say hello." lede="Press, partnerships, support, or just a question — pick a reason and we'll get it to the right inbox." />
      <Section>
        <div className="mx-auto max-w-2xl">
          <ContactForm />
        </div>
      </Section>
    </>
  );
}