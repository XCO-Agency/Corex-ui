import type { ComponentEntry } from "../types";
import { TextVariants } from "@/examples/typography/TextVariants";
import TextVariantsRaw from "@/examples/typography/TextVariants.tsx?raw";

export const typographyComponents: ComponentEntry[] = [
  {
    name: "Text",
    slug: "text",
    category: "Typography",
    description: "Displays styled text, from body copy to headings, with tone and weight options.",
    examples: [
      {
        title: "Variants & tones",
        Example: TextVariants,
        code: TextVariantsRaw,
      },
    ],
  },
];
