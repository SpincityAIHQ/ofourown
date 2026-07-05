import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const PAGES: Record<string, { title: string; summary: string; url: string }> = {
  home: { title: "OfOurOwn", url: "/", summary: "The digital home of Ben Gordon, NBA Veteran." },
  about: { title: "About Ben Gordon", url: "/about", summary: "Background on Ben Gordon, NBA Veteran and founder of OfOurOwn." },
  training: { title: "Training", url: "/training", summary: "In-person basketball development. Package only. Free evaluation required." },
  programs: { title: "Programs", url: "/programs", summary: "All training package options and pricing." },
  evaluation: { title: "Free Evaluation", url: "/evaluation", summary: "Book a free in-person evaluation — the only entry point to training." },
  wellness: { title: "Wellness", url: "/wellness", summary: "Private consults on sleep, nutrition, and recovery." },
  fst: { title: "Fascia Stretch Therapy", url: "/fst", summary: "Assisted stretch therapy: 30/60/90 min sessions." },
  coaching: { title: "1:1 Coaching", url: "/coaching", summary: "Mentorship for athletes, founders, and operators." },
  speaking: { title: "Speaking", url: "/speaking", summary: "Keynotes and events starting at $5,000." },
  shop: { title: "Shop", url: "/shop", summary: "Programs, guides, and tools." },
  contact: { title: "Contact", url: "/contact", summary: "Get in touch with the OfOurOwn team." },
};

export default defineTool({
  name: "get_page",
  title: "Get page summary",
  description:
    "Get a short summary and URL for a named page on the OfOurOwn site (home, about, training, programs, evaluation, wellness, fst, coaching, speaking, shop, contact).",
  inputSchema: {
    page: z
      .enum([
        "home",
        "about",
        "training",
        "programs",
        "evaluation",
        "wellness",
        "fst",
        "coaching",
        "speaking",
        "shop",
        "contact",
      ])
      .describe("Which page to summarize."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ page }) => {
    const info = PAGES[page];
    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
      structuredContent: info,
    };
  },
});
