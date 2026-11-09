import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Badge,
  BlockStack,
  Button,
  Clickable,
  Collapsible,
  Icon,
  InlineStack,
  Navigation,
  Text,
  type IconType,
} from "@xco-agency/corex-ui";
import { SidebarCategoryItem } from "@/components/SidebarCategoryItem";
import { type ComponentEntry, blocks, registry } from "@/data/registry";
import { APP_ICONS_DATA } from "@/data/apps-icons";
import { COREX_UI_VERSION } from "@/lib/version";

export type AppSidebarPropsType = {
  onOpenSearch?: () => void;
  onNavigate?: () => void;
};

const GUIDE_LINKS: {
  to: string;
  label: string;
  icon: IconType;
  match: (pathname: string) => boolean;
  count?: number;
}[] = [
  { to: "/", label: "Overview", icon: "home", match: (pathname) => pathname === "/" },
  {
    to: "/installation",
    label: "Installation",
    icon: "import",
    match: (pathname) => pathname === "/installation",
  },
  { to: "/icons", label: "Icons", icon: "grid", match: (pathname) => pathname === "/icons" },
  {
    to: "/apps-icons",
    label: "Apps Icons",
    icon: "apps",
    match: (pathname) => pathname === "/apps-icons" || pathname === "/app-icons",
    count: APP_ICONS_DATA.length,
  },
  {
    to: "/editor",
    label: "Editor",
    icon: "edit",
    match: (pathname) => pathname === "/editor",
  },
  {
    to: "/utils",
    label: "Utils & Hooks",
    icon: "code",
    match: (pathname) => pathname.startsWith("/utils"),
  },
];

const groupByCategory = (entries: ComponentEntry[]) =>
  Object.entries(
    entries.reduce<Record<string, ComponentEntry[]>>((acc, entry) => {
      (acc[entry.category] ??= []).push(entry);
      return acc;
    }, {}),
  ).map(([category, components]) => ({ category, components }));

function SectionGroup({
  label,
  count,
  defaultOpen,
  children,
}: {
  label: string;
  count: number;
  defaultOpen: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  React.useEffect(() => {
    if (defaultOpen) setOpen(true);
  }, [defaultOpen]);

  return (
    <Collapsible
      framed={false}
      expanded={open}
      onExpandedChange={setOpen}
      accessibilityLabel={label}
      content={<BlockStack gap="none">{children}</BlockStack>}
    >
      {({ expanded, toggle }) => (
        <Clickable
          inlineSize="fill"
          paddingInline="small-200"
          paddingBlock="small-200"
          onClick={toggle}
          aria-expanded={expanded}
        >
          <InlineStack alignItems="center" justifyContent="space-between">
            <Text variant="xs" color="subdued" fontWeight="medium">
              {label}
            </Text>
            <InlineStack alignItems="center" gap="small-300">
              <Text variant="xs" color="subdued">
                {count}
              </Text>
              <Icon source={expanded ? "chevron-up" : "chevron-down"} />
            </InlineStack>
          </InlineStack>
        </Clickable>
      )}
    </Collapsible>
  );
}

export function AppSidebar({ onOpenSearch, onNavigate }: AppSidebarPropsType) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const componentGroups = React.useMemo(() => groupByCategory(registry), []);
  const blockCount = blocks.reduce((acc, group) => acc + group.components.length, 0);

  const go = (to: string) => {
    navigate(to);
    onNavigate?.();
  };

  return (
    <Navigation>
      <BlockStack gap="small">
        <InlineStack alignItems="center" justifyContent="space-between" gap="small-200">
          <Clickable onClick={() => go("/")} paddingInline="small-200" paddingBlock="small-300">
            <InlineStack alignItems="center" gap="small-200">
              <Text fontWeight="bold">cx</Text>
              <Text fontWeight="semibold">Corex UI</Text>
            </InlineStack>
          </Clickable>
          <Badge>v{COREX_UI_VERSION}</Badge>
        </InlineStack>
        <Button icon="search" variant="secondary" onClick={onOpenSearch} inlineSize="fill">
          Search
        </Button>
      </BlockStack>

      <Navigation.Section>
        {GUIDE_LINKS.map(({ to, label, icon, match, count }) => (
          <Navigation.Item
            key={to}
            id={to}
            label={label}
            icon={icon}
            selected={match(pathname)}
            badge={count !== undefined ? <Badge>{count}</Badge> : undefined}
            onClick={() => go(to)}
          />
        ))}
      </Navigation.Section>

      <SectionGroup
        label="Components"
        count={registry.length}
        defaultOpen={!pathname.startsWith("/blocks")}
      >
        {componentGroups.map(({ category, components }) => (
          <SidebarCategoryItem
            key={category}
            category={category}
            components={components}
            basePath="components"
            currentPath={pathname}
            onNavigate={onNavigate}
          />
        ))}
      </SectionGroup>

      {blocks.length > 0 && (
        <SectionGroup
          label="Blocks"
          count={blockCount}
          defaultOpen={pathname.startsWith("/blocks")}
        >
          {blocks.map(({ category, components }) => (
            <SidebarCategoryItem
              key={category}
              category={category}
              components={components}
              basePath="blocks"
              currentPath={pathname}
              onNavigate={onNavigate}
            />
          ))}
        </SectionGroup>
      )}
    </Navigation>
  );
}
