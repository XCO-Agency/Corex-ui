import type { ComponentEntry } from "../types";
import { ButtonVariants } from "@/examples/actions/ButtonVariants";
import ButtonVariantsRaw from "@/examples/actions/ButtonVariants.tsx?raw";
import { ButtonGroupExample } from "@/examples/actions/ButtonGroupExample";
import ButtonGroupExampleRaw from "@/examples/actions/ButtonGroupExample.tsx?raw";
import { LinkExample } from "@/examples/actions/LinkExample";
import LinkExampleRaw from "@/examples/actions/LinkExample.tsx?raw";
import { MenuExample } from "@/examples/actions/MenuExample";
import MenuExampleRaw from "@/examples/actions/MenuExample.tsx?raw";
import { ClickableExample } from "@/examples/actions/ClickableExample";
import ClickableExampleRaw from "@/examples/actions/ClickableExample.tsx?raw";

export const actionsComponents: ComponentEntry[] = [
  {
    name: "Button",
    slug: "button",
    category: "Actions",
    description: "Triggers an action or event, such as submitting a form or opening a dialog.",
    examples: [
      {
        title: "Variants",
        Example: ButtonVariants,
        code: ButtonVariantsRaw,
      },
    ],
  },
  {
    name: "ButtonGroup",
    slug: "button-group",
    category: "Actions",
    description: "Displays multiple buttons grouped together, optionally as a segmented control.",
    examples: [
      {
        title: "Segmented group",
        Example: ButtonGroupExample,
        code: ButtonGroupExampleRaw,
      },
    ],
  },
  {
    name: "Clickable",
    slug: "clickable",
    category: "Actions",
    description: "An unstyled interactive wrapper powered by Polaris s-clickable for custom actions, cards, and rows.",
    examples: [
      {
        title: "Interactive cards and actions",
        Example: ClickableExample,
        code: ClickableExampleRaw,
      },
    ],
  },
  {
    name: "Link",
    slug: "link",
    category: "Actions",
    description: "Makes text interactive for navigation.",
    examples: [
      {
        title: "External link",
        Example: LinkExample,
        code: LinkExampleRaw,
      },
    ],
  },
  {
    name: "Menu",
    slug: "menu",
    category: "Actions",
    description: "A dropdown list of actions, triggered by a Button using commandFor.",
    examples: [
      {
        title: "Actions menu",
        Example: MenuExample,
        code: MenuExampleRaw,
      },
    ],
  },
];
