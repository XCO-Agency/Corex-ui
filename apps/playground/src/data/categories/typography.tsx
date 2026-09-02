import { BlockStack, Text } from "@xco/corex-ui";
import type { ComponentEntry } from "../types";

function TextVariants() {
  return (
    <BlockStack gap="small-200">
      <Text variant="headingLg">Heading large</Text>
      <Text variant="headingMd">Heading medium</Text>
      <Text tone="success">Success tone</Text>
      <Text tone="critical">Critical tone</Text>
    </BlockStack>
  );
}

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
        code: `<BlockStack gap="small-200">
  <Text variant="headingLg">Heading large</Text>
  <Text variant="headingMd">Heading medium</Text>
  <Text tone="success">Success tone</Text>
  <Text tone="critical">Critical tone</Text>
</BlockStack>`,
      },
    ],
  },
];
