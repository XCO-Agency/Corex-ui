import type { ComponentEntry } from "../types";
import { TabsExample } from "@/examples/navigation/TabsExample";
import TabsExampleRaw from "@/examples/navigation/TabsExample.tsx?raw";
import { NavigationExample } from "@/examples/navigation/NavigationExample";
import NavigationExampleRaw from "@/examples/navigation/NavigationExample.tsx?raw";
import { PaginationExample } from "@/examples/navigation/PaginationExample";
import PaginationExampleRaw from "@/examples/navigation/PaginationExample.tsx?raw";

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
  {
    name: "Navigation",
    slug: "navigation",
    category: "Navigation",
    description:
      "Vertical navigation menu with search, group titles, icons, and item states.",
    examples: [
      {
        title: "Vertical navigation with search",
        Example: NavigationExample,
        code: NavigationExampleRaw,
      },
    ],
  },
  {
    name: "Pagination",
    slug: "pagination",
    category: "Navigation",
    description: "Previous and next paging, with an optional count between the buttons.",
    examples: [
      {
        title: "Paging a list",
        Example: PaginationExample,
        code: PaginationExampleRaw,
      },
    ],
  },
];
