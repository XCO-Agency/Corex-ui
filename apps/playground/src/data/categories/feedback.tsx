import type { ComponentEntry } from "../types";
import { BadgeVariants } from "@/examples/feedback/BadgeVariants";
import BadgeVariantsRaw from "@/examples/feedback/BadgeVariants.tsx?raw";
import { BannerDismissible } from "@/examples/feedback/BannerDismissible";
import BannerDismissibleRaw from "@/examples/feedback/BannerDismissible.tsx?raw";
import { EmptyStateExample } from "@/examples/feedback/EmptyStateExample";
import EmptyStateExampleRaw from "@/examples/feedback/EmptyStateExample.tsx?raw";
import { SpinnerExample } from "@/examples/feedback/SpinnerExample";
import SpinnerExampleRaw from "@/examples/feedback/SpinnerExample.tsx?raw";
import { TooltipExample } from "@/examples/feedback/TooltipExample";
import TooltipExampleRaw from "@/examples/feedback/TooltipExample.tsx?raw";
import { SkeletonBasicExample } from "@/examples/feedback/SkeletonBasicExample";
import SkeletonBasicExampleRaw from "@/examples/feedback/SkeletonBasicExample.tsx?raw";
import { ProgressBarExample } from "@/examples/feedback/ProgressBarExample";
import ProgressBarExampleRaw from "@/examples/feedback/ProgressBarExample.tsx?raw";
import { IconTileExample } from "@/examples/feedback/IconTileExample";
import IconTileExampleRaw from "@/examples/feedback/IconTileExample.tsx?raw";

export const feedbackComponents: ComponentEntry[] = [
  {
    name: "Badge",
    slug: "badge",
    category: "Feedback",
    description:
      "A short status descriptor for a resource, such as an order or product state.",
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
    description:
      "Highlights important information or required actions prominently on the page.",
    examples: [
      {
        title: "Dismissible",
        Example: BannerDismissible,
        code: BannerDismissibleRaw,
      },
    ],
  },
  {
    name: "EmptyState",
    slug: "empty-state",
    category: "Feedback",
    description:
      "Communicates when there is no content to show, with guidance on how to get started.",
    examples: [
      {
        title: "EmptyState Variations",
        Example: EmptyStateExample,
        code: EmptyStateExampleRaw,
      },
    ],
  },
  {
    name: "IconTile",
    slug: "icon-tile",
    category: "Feedback",
    description:
      "A stylized background tile for icons, frequently used in feature lists and onboarding steps.",
    examples: [
      {
        title: "IconTile Variations",
        Example: IconTileExample,
        code: IconTileExampleRaw,
      },
    ],
  },
  {
    name: "ProgressBar",
    slug: "progress-bar",
    category: "Feedback",
    description:
      "Visual indicator communicating the percentage completion of a task or goal.",
    examples: [
      {
        title: "Progress Bar Variations",
        Example: ProgressBarExample,
        code: ProgressBarExampleRaw,
      },
    ],
  },
  {
    name: "Skeleton",
    slug: "skeleton",
    category: "Feedback",
    description: "Animated shimmer placeholder simulating content while data is loading.",
    examples: [
      {
        title: "Default Shimmer",
        Example: SkeletonBasicExample,
        code: SkeletonBasicExampleRaw,
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
