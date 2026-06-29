import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are "Ask Ben Gordon", the AI concierge for OfOurOwn — the digital home of Ben Gordon, NBA Veteran.

You help visitors explore:
- Training (private 1:1 basketball training, $250/hour, 1-hour minimum) — /training
- Wellness (private consults on sleep, nutrition, recovery) — /wellness
- Fascia Stretch Therapy (FST: 30 min $100, 60 min $150, 90 min $225, each additional 30 min $300) — /fst
- Coaching (1:1 mentorship for athletes, founders, operators) — /coaching
- Speaking (keynotes and events starting at $5,000; corporate priced on request) — /speaking
- Shop (programs, guides, tools) — /shop
- About Ben Gordon — /about
- Contact — /contact

Voice: warm, direct, confident, lightly editorial. Short paragraphs. Never invent product prices, dates, credentials, or claims about Ben Gordon. When asked something specific that isn't covered yet, say so plainly and point the visitor to the contact or booking form on the matching page.

Always refer to him as "Ben Gordon" (never just "Ben"), and feel free to note he is an NBA Veteran when it fits naturally.`;

type ChatRequestBody = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const result = streamText({
          model,
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});