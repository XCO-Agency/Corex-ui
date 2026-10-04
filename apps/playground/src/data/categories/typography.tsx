import type { ComponentEntry } from "../types";
import { TextVariants } from "@/examples/typography/TextVariants";
import TextVariantsRaw from "@/examples/typography/TextVariants.tsx?raw";
import { ParagraphExample } from "@/examples/typography/ParagraphExample";
import ParagraphExampleRaw from "@/examples/typography/ParagraphExample.tsx?raw";
import { InlineCodeExample } from "@/examples/typography/InlineCodeExample";
import InlineCodeExampleRaw from "@/examples/typography/InlineCodeExample.tsx?raw";
import { InlineErrorExample } from "@/examples/typography/InlineErrorExample";
import InlineErrorExampleRaw from "@/examples/typography/InlineErrorExample.tsx?raw";

export const typographyComponents: ComponentEntry[] = [
  {
    name: "Text",
    slug: "text",
    category: "Typography",
    description:
      "Displays styled text, from body copy to headings, with tone and weight options.",
    examples: [
      {
        title: "Variants & tones",
        Example: TextVariants,
        code: TextVariantsRaw,
      },
    ],
  },
  {
    name: "Paragraph",
    slug: "paragraph",
    category: "Typography",
    description:
      "Displays paragraph body copy using Polaris <s-paragraph> primitive.",
    examples: [
      {
        title: "Paragraph body text",
        Example: ParagraphExample,
        code: ParagraphExampleRaw,
      },
    ],
  },
  {
    name: "InlineCode",
    slug: "inline-code",
    category: "Typography",
    description:
      "A snippet of code inside a sentence, on a monospace face and a tinted surface.",
    examples: [
      {
        title: "Code in prose",
        Example: InlineCodeExample,
        code: InlineCodeExampleRaw,
      },
    ],
  },
  {
    name: "InlineError",
    slug: "inline-error",
    category: "Typography",
    description:
      "The message under a field that failed validation, tied to it by id for screen readers.",
    examples: [
      {
        title: "Validation message",
        Example: InlineErrorExample,
        code: InlineErrorExampleRaw,
      },
    ],
  },
];
