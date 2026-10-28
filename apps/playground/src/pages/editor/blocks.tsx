import { Blocks } from "lucide-react";
import { blocks } from "@/data/registry";
import type { ComponentDefinitionType } from "./types";

export type BlockPaletteGroupType = {
  category: string;
  items: ComponentDefinitionType[];
};

const componentName = (filename: string | undefined, fallback: string) =>
  (filename ?? fallback).replace(/\.[jt]sx?$/, "").replace(/[^A-Za-z0-9]/g, "");

/**
 * Every ready-made block example becomes a leaf on the canvas: it renders the
 * example as-is and exports as an import of the block's example component.
 */
export const blockGroups: BlockPaletteGroupType[] = blocks.map(
  ({ category, components }) => ({
    category,
    items: components.flatMap((entry) =>
      entry.examples.map((example, index): ComponentDefinitionType => {
        const name = componentName(example.filename, `${entry.name}${index}`);
        const Example = example.Example;
        return {
          type: `block:${entry.slug}:${index}`,
          label:
            entry.examples.length > 1 ? `${entry.name} · ${example.title}` : entry.name,
          group: "Blocks",
          icon: Blocks,
          description: entry.description,
          defaultProps: {},
          fields: [],
          render: () => <Example />,
          toCode: () => ({
            name,
            props: {},
            importFrom: `// ${example.npxCommand ?? `npx @xco-agency/corex-ui@latest add ${entry.slug}`}\nimport { ${name} } from "./blocks/${entry.slug}";`,
          }),
        };
      }),
    ),
  }),
);

export const blockDefinitions = blockGroups.flatMap((group) => group.items);
