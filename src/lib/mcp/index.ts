import { defineMcp } from "@lovable.dev/mcp-js";
import listProgramsTool from "./tools/list-programs";
import getPageTool from "./tools/get-page";

export default defineMcp({
  name: "ofourown-mcp",
  title: "OfOurOwn — Ben Gordon",
  version: "0.1.0",
  instructions:
    "Tools for the OfOurOwn site — the digital home of Ben Gordon, NBA Veteran. Use `list_programs` to see all training, wellness, FST, coaching, and speaking offerings with pricing. Use `get_page` to get a short summary and URL for a named page.",
  tools: [listProgramsTool, getPageTool],
});
