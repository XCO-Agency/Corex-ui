import type { ComponentEntry } from "../types";
import { IconExample } from "@/examples/media/IconExample";
import IconExampleRaw from "@/examples/media/IconExample.tsx?raw";
import { AvatarExample } from "@/examples/media/AvatarExample";
import AvatarExampleRaw from "@/examples/media/AvatarExample.tsx?raw";
import { ThumbnailExample } from "@/examples/media/ThumbnailExample";
import ThumbnailExampleRaw from "@/examples/media/ThumbnailExample.tsx?raw";

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
        code: IconExampleRaw,
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
        code: AvatarExampleRaw,
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
        code: ThumbnailExampleRaw,
      },
    ],
  },
];
