import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, Check, ChevronRight } from "lucide-react";
import { EmailCapture } from "@/components/email-capture";
import homeReel from "@/assets/home-reel.jpg";
import trainingCover from "@/assets/training-vsl-cover.jpg";
import communityPhoto from "@/assets/community-photo.jpg";

const SITE_ORIGIN = "https://oooelitebasketballtraining.com";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OOO Performance — Basketball Development with Ben Gordon" },
      {
        name: "description",
        content:
          "Build your game with OOO Performance, founded by NBA veteran Ben Gordon. Start with a free evaluation, then find the training that fits your level.",
      },
      { property: "og:title", content: "OOO Performance — Build your game." },
      {
        property: "og:description",
        content:
          "Basketball development with Ben Gordon. Free evaluation. Skill-based placement. A clear next step.",
      },
      { property: "og:image", content: `${SITE_ORIGIN}${homeReel}` },
      { property: "og:image:alt", content: "A basketball player on a sunlit hardwood court." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const PROGRAMS = [
  {
    number: "01",
    name: "Group Training",
    detail: "1 hour · up to 10 players",
    description: "Build your fundamentals alongside players at a similar skill level.",
    fit: "Ages 8+",
    price: "From $70 / session",
    note: "With an 8-session package",
  },
  {
    number: "02",
    name: "Private Training",
    detail: "1 hour · one-on-one",
    description:
      "Focused instruction, shaped around your game and the details you need to develop.",
    fit: "Ages 10+",
    price: "From $250 / session",
    note: "With a 4-session package",
  },
  {
    number: "03",
    name: "Private Plus",
    detail: "90 minutes · skills + performance",
    description: "Dedicated skill work alongside strength, mobility, stretching, or recovery.",
    fit: "Personal development",
    price: "From $400 / session",
    note: "With a 4-session package",
  },
  {
    number: "04",
    name: "One-Day Camp",
    detail: "3 hours · Ben + coaching team",
    description: "An intensive mix of instruction and competitive play. Ask about upcoming dates.",
    fit: "Train. Compete. Learn.",
    price: "$200 / player",
    note: "One-day camp",
  },
] as const;

const FAQS = [
  {
    question: "Where do we start?",
    answer:
      "Request a free evaluation. Tell us your goals and availability, and the team will contact you about dates and location. Your request becomes a reservation only after the team confirms it.",
  },
  {
    question: "What ages can train?",
    answer:
      "Group training starts at age 8. Private one-on-one training starts at age 10. Players aged 8–9 train in a group setting. Placement within the program is based on skill.",
  },
  {
    question: "Does my player need experience?",
    answer:
      "The program includes beginner, intermediate, and experienced levels. The evaluation helps identify the right starting point. Players with an established playing resume may ask about direct placement.",
  },
  {
    question: "How do packages work?",
    answer:
      "Group training is offered in 4- and 8-session packages. Private and Private Plus offer single sessions and 4-session packages. The group 8-pack expires after 90 days; other packages expire after 60 days. View Programs & Pricing for the full details.",
  },
] as const;

function Index() {
  return (
    <>
      <section className="ooo-hero relative isolate overflow-hidden bg-[#101010] text-white">
        <div className="ooo-court-lines pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-[1440px] lg:min-h-[720px] lg:grid-cols-[1.08fr_1fr]">
          <div className="relative z-10 flex flex-col justify-center px-6 pb-12 pt-14 sm:px-10 lg:py-24 lg:pl-16 lg:pr-12">
            <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.24em] text-white/65">
              <span className="h-px w-9 bg-white/50" />
              Of Our Own. Built together.
            </p>
            <h1 className="mt-8 max-w-xl text-[clamp(3.8rem,8vw,7.25rem)] font-semibold leading-[0.96] tracking-[-0.06em]">
              Build
              <br />
              your <span className="italic font-normal">game.</span>
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-white/70">
              Basketball development with Ben Gordon. Professional experience. Purposeful training.
              Your next step starts here.
            </p>
            <Link
              to="/evaluation"
              className="mt-8 inline-flex min-h-14 w-fit items-center justify-between gap-7 bg-white px-6 py-4 text-sm font-semibold text-[#101010] transition hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Request a free evaluation <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <p className="mt-3 text-xs text-white/55">
              Ages 8+ · Skill-based placement · No payment to request
            </p>
            <a
              href="#programs"
              className="mt-12 flex w-fit items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-white/60 hover:text-white"
            >
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
              Explore the programs
            </a>
          </div>
          <div className="relative min-h-[310px] overflow-hidden sm:min-h-[420px] lg:min-h-full">
            <img
              src={homeReel}
              alt="A basketball player preparing on a sunlit hardwood court."
              className="absolute inset-0 h-full w-full object-cover object-[35%_center]"
              fetchPriority="high"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#101010]/25 lg:to-transparent" />
            <div className="absolute bottom-7 left-6 right-6 flex items-end justify-between border-t border-white/35 pt-4 sm:left-10 sm:right-10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/70">
                  The work is the way
                </p>
                <p className="mt-1 text-xl font-medium">Every detail. Every rep.</p>
              </div>
              <span className="text-3xl font-semibold tracking-[-0.1em]" aria-hidden="true">
                OOO
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label="Ben Gordon's playing career"
        className="border-b border-border bg-[#f3f2ee]"
      >
        <div className="mx-auto grid max-w-[1312px] grid-cols-2 px-6 py-7 md:grid-cols-4 md:py-9">
          {[
            { value: "NBA veteran", label: "Ben Gordon" },
            { value: "Sixth Man", label: "NBA award winner" },
            { value: "NCAA champion", label: "Championship experience" },
            { value: "Player development", label: "The next chapter" },
          ].map((item, index) => (
            <div
              key={item.value}
              className={`px-3 py-3 sm:px-6 ${index % 2 ? "border-l border-black/15" : ""} ${index > 1 ? "md:border-l" : ""}`}
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {item.label}
              </p>
              <p className="mt-2 font-display text-lg font-semibold sm:text-2xl">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1312px] px-6 py-16 sm:px-10 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-24">
          <div>
            <p className="ooo-eyebrow">01 / Start with clarity</p>
            <h2 className="mt-5 max-w-lg text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
              A better player starts
              <br />
              with a clear plan.
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
              More reps matter when they have a purpose. We start by understanding the player, then
              recommend the right environment to build.
            </p>
            <Link to="/evaluation" className="ooo-text-link mt-7">
              Find your starting point <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ol className="divide-y divide-border border-y border-border">
            {[
              {
                title: "Evaluate your game",
                body: "Understand your strengths, habits, and the skills that need attention.",
              },
              {
                title: "Find the right fit",
                body: "Get a recommendation based on demonstrated skill, with age requirements for each format.",
              },
              {
                title: "Train with intention",
                body: "Build through a focused training package and a clear next step.",
              },
            ].map((step, index) => (
              <li key={step.title} className="flex gap-5 py-6">
                <span className="pt-1 text-xs tabular-nums text-muted-foreground">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-semibold">{step.title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="programs" className="scroll-mt-24 border-y border-border bg-[#f5f4f0]">
        <div className="mx-auto max-w-[1312px] px-6 py-16 sm:px-10 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="ooo-eyebrow">02 / Choose your training</p>
              <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                One standard.
                <br />
                <span className="font-normal italic">Your way to train.</span>
              </h2>
            </div>
            <Link to="/programs" className="ooo-text-link">
              Full programs & pricing <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {PROGRAMS.map((program) => (
              <article
                key={program.number}
                className="group flex flex-col border border-black/15 bg-background p-6 transition duration-300 hover:-translate-y-1 hover:border-black/50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{program.number}</span>
                  <span className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                    {program.fit}
                  </span>
                </div>
                <h3 className="mt-9 font-display text-2xl font-semibold">{program.name}</h3>
                <p className="mt-2 text-xs font-medium">{program.detail}</p>
                <p className="mb-9 mt-5 text-sm leading-relaxed text-muted-foreground">
                  {program.description}
                </p>
                <div className="mt-auto border-t border-border pt-5">
                  <p className="text-sm font-semibold">{program.price}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{program.note}</p>
                  <Link
                    to="/programs"
                    aria-label={`View ${program.name} details`}
                    className="mt-6 flex min-h-10 items-center justify-between text-xs font-medium"
                  >
                    View program{" "}
                    <ChevronRight
                      className="h-4 w-4 transition group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            Start with a free evaluation. Training dates, placement, and availability are confirmed
            by the team. Package terms apply.
          </p>
        </div>
      </section>

      <section className="bg-[#111] text-white">
        <div className="mx-auto grid max-w-[1440px] md:grid-cols-2">
          <div className="relative min-h-[380px] overflow-hidden md:min-h-[620px]">
            <img
              src={trainingCover}
              alt="Basketball training on an indoor court."
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover grayscale"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
          <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
            <p className="ooo-eyebrow text-white/50">03 / The OOO philosophy</p>
            <h2 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
              Train the details.
              <br />
              <span className="font-normal italic">Develop the player.</span>
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-white/65">
              Ben brings the perspective of a professional playing career to the work in front of
              you: the footwork, the decisions, the habits, and the teammate you become.
            </p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                "Shooting mechanics",
                "Footwork & balance",
                "Decision-making",
                "Basketball IQ",
                "Confidence & habits",
                "Leadership",
              ].map((skill) => (
                <li className="flex items-center gap-2 text-sm text-white/80" key={skill}>
                  <Check className="h-3.5 w-3.5 text-white/50" aria-hidden="true" />
                  {skill}
                </li>
              ))}
            </ul>
            <Link
              to="/philosophy"
              className="mt-9 inline-flex w-fit items-center gap-3 border-b border-white/35 pb-2 text-sm hover:border-white"
            >
              Explore the philosophy <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1312px] px-6 py-16 sm:px-10 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="ooo-eyebrow">04 / Before you step on court</p>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Good questions.
              <br />
              <span className="font-normal italic">Clear answers.</span>
            </h2>
            <Link to="/contact" className="ooo-text-link mt-7">
              Talk to the team <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="border-t border-border">
            {FAQS.map((faq) => (
              <details key={faq.question} className="ooo-faq border-b border-border">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 text-base font-medium">
                  {faq.question}
                  <span
                    className="ooo-faq-icon text-xl font-normal text-muted-foreground"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-xl pb-6 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-[#f3f2ee]">
        <div className="mx-auto grid max-w-[1312px] gap-10 px-6 py-14 sm:px-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="ooo-eyebrow">Beyond the session</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              Stay connected to the work.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Training insights and updates from OOO Performance. Get the next note in your inbox.
            </p>
          </div>
          <EmailCapture source="home_newsletter" cta="Get the updates" />
        </div>
      </section>

      <section className="mx-auto max-w-[1312px] px-6 py-12 sm:px-10 md:py-16">
        <div className="grid gap-5 md:grid-cols-2">
          <Link
            to="/about"
            className="group flex items-center justify-between gap-5 border border-border p-7 transition hover:bg-muted"
          >
            <div>
              <p className="ooo-eyebrow">Behind the standard</p>
              <h2 className="mt-2 font-display text-2xl font-semibold">Meet Ben Gordon</h2>
            </div>
            <ArrowRight
              className="h-5 w-5 transition group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
          <Link
            to="/community"
            className="group relative flex items-center justify-between gap-5 overflow-hidden border border-border bg-[#111] p-7 text-white"
          >
            <img
              src={communityPhoto}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-20 grayscale"
              loading="lazy"
            />
            <div className="relative">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Of Our Own</p>
              <h2 className="mt-2 font-display text-2xl font-semibold">Explore the community</h2>
            </div>
            <ArrowRight
              className="relative h-5 w-5 transition group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </section>
    </>
  );
}
