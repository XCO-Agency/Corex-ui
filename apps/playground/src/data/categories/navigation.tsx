import type { ComponentEntry } from "../types";
import { TabsExample } from "@/examples/navigation/TabsExample";
import TabsExampleRaw from "@/examples/navigation/TabsExample.tsx?raw";

export const navigationComponents: ComponentEntry[] = [
  {
    name: "Tabs",
    slug: "tabs",
    category: "Navigation",
    description: "Switches between different views of related content.",
    examples: [
      {
        title: "Controlled tabs",
        Example: TabsExample,
        code: TabsExampleRaw,
      },
    ],
  },
];
