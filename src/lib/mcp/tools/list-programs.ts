import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const PROGRAMS = [
  {
    name: "Free Evaluation",
    url: "/evaluation",
    description:
      "The only entry point for training. Players are placed by skill after a free in-person evaluation.",
  },
  {
    name: "Group Training",
    url: "/training",
    pricing: { fourPack: "$320", eightPack: "$560" },
    description: "Group basketball development. Age 8+. Package only.",
  },
  {
    name: "Private Training",
    url: "/training",
    pricing: { single: "$350", fourPack: "$1,000" },
    description: "1:1 private basketball training. Age 10+. Package only.",
  },
  {
    name: "Private Plus (Flagship)",
    url: "/training",
    pricing: { single: "$500", fourPack: "$1,600" },
    description:
      "90-minute flagship session combining skills and performance work.",
  },
  {
    name: "One-Day Camp",
    url: "/training",
    pricing: { perChild: "$200" },
    description: "Single-day camp experience for young players.",
  },
  {
    name: "Fascia Stretch Therapy (FST)",
    url: "/fst",
    pricing: {
      "30min": "$100",
      "60min": "$150",
      "90min": "$225",
      addl30: "$300",
    },
    description: "Assisted stretch therapy sessions for mobility and recovery.",
  },
  {
    name: "Wellness Consult",
    url: "/wellness",
    description: "Private consults on sleep, nutrition, and recovery.",
  },
  {
    name: "1:1 Coaching",
    url: "/coaching",
    description: "Mentorship for athletes, founders, and operators.",
  },
  {
    name: "Speaking",
    url: "/speaking",
    pricing: { starting: "$5,000", corporate: "on request" },
    description: "Keynotes and events with Ben Gordon, NBA Veteran.",
  },
];

export default defineTool({
  name: "list_programs",
  title: "List programs and services",
  description:
    "Return the full catalog of OfOurOwn programs — training packages, FST, wellness, coaching, and speaking — with pricing and page URLs.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(PROGRAMS, null, 2) }],
    structuredContent: { programs: PROGRAMS },
  }),
});
