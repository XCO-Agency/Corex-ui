import type { ComponentEntry } from "../types";
import { ModalExample } from "@/examples/overlays/ModalExample";
import ModalExampleRaw from "@/examples/overlays/ModalExample.tsx?raw";

export const overlaysComponents: ComponentEntry[] = [
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
];
