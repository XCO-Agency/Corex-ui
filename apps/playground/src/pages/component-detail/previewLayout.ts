import type {
  ComponentEntryType,
  ComponentExampleType,
  PreviewLayoutType,
} from "@/data/types";

/** The example's own `layout`, else the entry's, else centered for components and full for blocks. */
export function resolvePreviewLayout(
  entry: Pick<ComponentEntryType, "layout">,
  example: Pick<ComponentExampleType, "layout" | "npxCommand">,
): PreviewLayoutType {
  return example.layout ?? entry.layout ?? (example.npxCommand ? "full" : "centered");
}
