import type { ComponentEntry } from "../types";
import { BadgeVariants } from "@/examples/feedback/BadgeVariants";
import BadgeVariantsRaw from "@/examples/feedback/BadgeVariants.tsx?raw";
import { BannerDismissible } from "@/examples/feedback/BannerDismissible";
import BannerDismissibleRaw from "@/examples/feedback/BannerDismissible.tsx?raw";
import { SpinnerExample } from "@/examples/feedback/SpinnerExample";
import SpinnerExampleRaw from "@/examples/feedback/SpinnerExample.tsx?raw";
import { TooltipExample } from "@/examples/feedback/TooltipExample";
import TooltipExampleRaw from "@/examples/feedback/TooltipExample.tsx?raw";

export const feedbackComponents: ComponentEntry[] = [
  {
    name: "Badge",
    slug: "badge",
    category: "Feedback",
    description: "A short status descriptor for a resource, such as an order or product state.",
    examples: [
      {
        title: "Tones",
        Example: BadgeVariants,
        code: BadgeVariantsRaw,
      },
    ],
  },
  {
    name: "Banner",
    slug: "banner",
    category: "Feedback",
    description: "Highlights important information or required actions prominently on the page.",
    examples: [
      {
        title: "Dismissible",
        Example: BannerDismissible,
        code: BannerDismissibleRaw,
      },
    ],
  },
  {
    name: "Spinner",
    slug: "spinner",
    category: "Feedback",
    description: "An animated loading indicator for content that is still being fetched.",
    examples: [
      {
        title: "Large spinner",
        Example: SpinnerExample,
        code: SpinnerExampleRaw,
      },
    ],
  },
  {
    name: "Tooltip",
    slug: "tooltip",
    category: "Feedback",
    description: "Displays helpful information when hovering or focusing an element.",
    examples: [
      {
        title: "On a destructive action",
        Example: TooltipExample,
        code: TooltipExampleRaw,
      },
    ],
  },
];
