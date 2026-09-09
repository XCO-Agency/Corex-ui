import type { ComponentEntry } from "../types";
import { ModalExample } from "@/examples/overlays/ModalExample";
import ModalExampleRaw from "@/examples/overlays/ModalExample.tsx?raw";
import { FloatingControlsExample } from "@/examples/overlays/FloatingControlsExample";
import FloatingControlsExampleRaw from "@/examples/overlays/FloatingControlsExample.tsx?raw";
import { FloatingAbsoluteExample } from "@/examples/overlays/FloatingAbsoluteExample";
import FloatingAbsoluteExampleRaw from "@/examples/overlays/FloatingAbsoluteExample.tsx?raw";
import { PopoverExample } from "@/examples/overlays/PopoverExample";
import PopoverExampleRaw from "@/examples/overlays/PopoverExample.tsx?raw";

export const overlaysComponents: ComponentEntry[] = [
  {
    name: "Floating",
    slug: "floating",
    category: "Overlays",
    description:
      "A flexible, transparent floating overlay container with customizable edge offsets, anchoring positions, and collapsible mode.",
    examples: [
      {
        title: "Floating Controls & Positions",
        Example: FloatingControlsExample,
        code: FloatingControlsExampleRaw,
      },
      {
        title: "In-Container Absolute Floating Showcase",
        Example: FloatingAbsoluteExample,
        code: FloatingAbsoluteExampleRaw,
      },
    ],
  },
  {
    name: "Modal",
    slug: "modal",
    category: "Overlays",
    description: "A focused overlay dialog for confirmations or short focused tasks.",
    examples: [
      {
        title: "Confirmation modal",
        Example: ModalExample,
        code: ModalExampleRaw,
      },
    ],
  },
  {
    name: "Popover",
    slug: "popover",
    category: "Overlays",
    description:
      "A non-modal contextual overlay anchored to a trigger, with programmatic close actions via usePopover.",
    examples: [
      {
        title: "Filter Popover with programmatic close",
        Example: PopoverExample,
        code: PopoverExampleRaw,
      },
    ],
  },
];
