import { Avatar, Icon, InlineStack, Thumbnail } from "@xco/corex-ui";
import type { ComponentEntry } from "../types";

function IconExample() {
  return (
    <InlineStack gap="200">
      <Icon source="save" accessibilityLabel="Save" />
      <Icon source="delete" tone="critical" accessibilityLabel="Delete" />
    </InlineStack>
  );
}

function AvatarExample() {
  return (
    <InlineStack gap="200">
      <Avatar name="Ada Lovelace" initials="AL" />
      <Avatar name="Grace Hopper" initials="GH" />
    </InlineStack>
  );
}

function ThumbnailExample() {
  return (
    <Thumbnail source="https://burst.shopifycdn.com/photos/black-leather-choker-necklace.jpg" alt="Product photo" />
  );
}

export const mediaComponents: ComponentEntry[] = [
  {
    name: "Icon",
    slug: "icon",
    category: "Media",
    description: "Renders a graphic symbol, such as an action or status icon.",
    examples: [
      {
        title: "Icons",
        Example: IconExample,
        code: `<InlineStack gap="200">
  <Icon source="save" accessibilityLabel="Save" />
  <Icon source="delete" tone="critical" accessibilityLabel="Delete" />
</InlineStack>`,
      },
    ],
  },
  {
    name: "Avatar",
    slug: "avatar",
    category: "Media",
    description: "Shows a profile image, or initials as a fallback.",
    examples: [
      {
        title: "Avatars",
        Example: AvatarExample,
        code: `<InlineStack gap="200">
  <Avatar name="Ada Lovelace" initials="AL" />
  <Avatar name="Grace Hopper" initials="GH" />
</InlineStack>`,
      },
    ],
  },
  {
    name: "Thumbnail",
    slug: "thumbnail",
    category: "Media",
    description: "Displays a small preview image, such as a product photo.",
    examples: [
      {
        title: "Product photo",
        Example: ThumbnailExample,
        code: `<Thumbnail
  source="https://burst.shopifycdn.com/photos/black-leather-choker-necklace.jpg"
  alt="Product photo"
/>`,
      },
    ],
  },
];
