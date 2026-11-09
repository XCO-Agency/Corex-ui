import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Command, Icon } from "@xco-agency/corex-ui";
import { blocks, registry, type ComponentEntry } from "@/data/registry";
import { getCategoryIcon } from "@/lib/category-icons";

const UTILS_ENTRIES: ComponentEntry[] = [
  {
    name: "useSaveBar",
    slug: "utils#use-save-bar",
    category: "Utilities",
    description:
      "App Bridge hook to show, hide, toggle, and manage confirmation for the SaveBar.",
    examples: [],
  },
  {
    name: "useAppWindowSaveBar",
    slug: "utils#use-app-window-save-bar",
    category: "Utilities",
    description:
      "Bidirectional SaveBar bridge hook for iframe pages opened via <AppWindow saveBar />.",
    examples: [],
  },
  {
    name: "useToast",
    slug: "utils#use-toast",
    category: "Utilities",
    description:
      "App Bridge hook to trigger native non-blocking toast notifications in Shopify admin.",
    examples: [],
  },
  {
    name: "useDimension",
    slug: "utils#use-dimension",
    category: "Utilities",
    description: "Responsive container/window dimensions and Polaris breakpoints hook.",
    examples: [],
  },
  {
    name: "useParams",
    slug: "utils#use-params",
    category: "Utilities",
    description:
      "URL search parameters hook with Shopify app embed param extraction (shop, host, locale).",
    examples: [],
  },
  {
    name: "useStorage",
    slug: "utils#use-storage",
    category: "Utilities",
    description:
      "Reactive localStorage and sessionStorage hook with TTL expiration and multi-tab sync.",
    examples: [],
  },
];

type SearchItemType = {
  value: string;
  entry: ComponentEntry;
  href: string;
};

const searchItems: SearchItemType[] = [
  ...registry.map((entry) => ({
    value: `component:${entry.slug}`,
    entry,
    href: `/components/${entry.slug}`,
  })),
  ...blocks.flatMap((group) =>
    group.components.map((entry) => ({
      value: `block:${entry.slug}`,
      entry,
      href: `/blocks/${entry.slug}`,
    })),
  ),
  ...UTILS_ENTRIES.map((entry) => ({
    value: `util:${entry.slug}`,
    entry,
    href: `/${entry.slug}`,
  })),
  {
    value: "page:icons",
    entry: {
      name: "Icons Library",
      slug: "icons",
      category: "Media",
      description:
        "Browse, search, preview, and copy all official Shopify Polaris icons with tones and keywords.",
      examples: [],
    },
    href: "/icons",
  },
  {
    value: "page:apps-icons",
    entry: {
      name: "Apps Icons & Trust Badges",
      slug: "apps-icons",
      category: "Media",
      description:
        "Store trust badges, free shipping, easy returns, secure checkout, and payment vector SVGs.",
      examples: [],
    },
    href: "/apps-icons",
  },
];

const itemByValue = new Map(searchItems.map((item) => [item.value, item]));

function getSearchScore(entry: ComponentEntry, query: string): number {
  const name = entry.name.toLowerCase();
  const slug = entry.slug.toLowerCase();
  const category = entry.category.toLowerCase();
  const desc = entry.description.toLowerCase();

  if (name === query || slug === query) return 1000;
  if (name.startsWith(query)) return 500;
  if (slug.startsWith(query)) return 400;
  if (name.split(/[\s-_]+/).some((word) => word.startsWith(query))) return 300;
  if (name.includes(query)) return 200;
  if (slug.includes(query)) return 150;
  if (desc.split(/[\s-_]+/).some((word) => word === query)) return 80;
  if (desc.includes(query)) return 50;
  if (category === query) return 30;
  if (category.includes(query)) return 10;
  return 0;
}

const groupedItems = (() => {
  const groups = new Map<string, SearchItemType[]>();
  for (const item of searchItems) {
    const list = groups.get(item.entry.category) ?? [];
    list.push(item);
    groups.set(item.entry.category, list);
  }
  return [...groups.entries()];
})();

export type SearchDialogPropsType = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function SearchDialog({
  open: controlledOpen,
  onOpenChange,
}: SearchDialogPropsType) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const navigate = useNavigate();

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (isControlled) onOpenChange?.(nextOpen);
      else setInternalOpen(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable);

      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setOpen(!isOpen);
      } else if (event.key === "/" && !isOpen && !typing) {
        event.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setOpen]);

  const select = (value: string) => {
    const item = itemByValue.get(value);
    if (!item) return;
    setOpen(false);
    navigate(item.href);
  };

  return (
    <Command.Dialog
      open={isOpen}
      onOpenChange={(next) => setOpen(next)}
      title="Search components"
      description="Search for components, blocks, and utilities."
    >
      <Command
        label="Search components"
        loop
        filter={(value, search) => {
          const query = search.trim().toLowerCase();
          if (!query) return 1;
          const item = itemByValue.get(value);
          return item ? getSearchScore(item.entry, query) : 0;
        }}
      >
        <Command.Input placeholder="Search components, categories, or keywords..." />
        <Command.List maxHeight="380px">
          <Command.Empty>No components found.</Command.Empty>
          {groupedItems.map(([category, items]) => (
            <Command.Group key={category} heading={category} value={category}>
              {items.map((item) => (
                <Command.Item key={item.value} value={item.value} onSelect={select}>
                  <Icon source={getCategoryIcon(item.entry.category)} />
                  {item.entry.name}
                  <Command.Shortcut>{item.entry.category}</Command.Shortcut>
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>
      </Command>
    </Command.Dialog>
  );
}
