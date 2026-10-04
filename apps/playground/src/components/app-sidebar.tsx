import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BadgeCheck,
  BookOpen,
  ChevronRight,
  Code2,
  Grid2x2,
  Rocket,
  Search,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SidebarCategoryItem } from "@/components/SidebarCategoryItem";
import { type ComponentEntry, blocks, registry } from "@/data/registry";
import { APP_ICONS_DATA } from "@/data/apps-icons";
import { COREX_UI_VERSION } from "@/lib/version";
import { cn } from "@/lib/utils";

export type AppSidebarPropsType = React.ComponentProps<typeof Sidebar> & {
  onOpenSearch?: () => void;
};

const GUIDE_LINKS = [
  { to: "/", label: "Overview", icon: BookOpen, match: (p: string) => p === "/" },
  {
    to: "/installation",
    label: "Installation",
    icon: Rocket,
    match: (p: string) => p === "/installation",
  },
  { to: "/icons", label: "Icons", icon: Grid2x2, match: (p: string) => p === "/icons" },
  {
    to: "/apps-icons",
    label: "Apps Icons",
    icon: BadgeCheck,
    match: (p: string) => p === "/apps-icons" || p === "/app-icons",
    count: APP_ICONS_DATA.length,
  },
  {
    to: "/utils",
    label: "Utils & Hooks",
    icon: Code2,
    match: (p: string) => p.startsWith("/utils"),
  },
];

const navButtonClass =
  "h-7 gap-2.5 px-2 text-[13px] text-muted-foreground hover:bg-foreground/5 hover:text-foreground data-active:bg-foreground/[0.06] data-active:text-foreground [&_svg]:size-3.5";

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
    <Collapsible open={open} onOpenChange={setOpen}>
      <SidebarGroup className="py-1">
        <SidebarGroupLabel
          render={
            <CollapsibleTrigger className="group/label flex h-7 w-full cursor-pointer items-center justify-between px-2 text-[11px] font-medium tracking-wide text-muted-foreground/80 uppercase hover:text-foreground" />
          }
        >
          <span>{label}</span>
          <span className="flex items-center gap-1 font-mono text-[10px] normal-case tracking-normal">
            {count}
            <ChevronRight
              className={cn("size-3 transition-transform duration-200", open && "rotate-90")}
            />
          </span>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu className="gap-px">{children}</SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

export function AppSidebar({ onOpenSearch, ...props }: AppSidebarPropsType) {
  const { pathname } = useLocation();
  const componentGroups = React.useMemo(() => groupByCategory(registry), []);
  const blockCount = blocks.reduce((acc, group) => acc + group.components.length, 0);

  return (
    <Sidebar {...props}>
      <SidebarHeader className="gap-2.5 px-3 pt-3 pb-2">
        <Link to="/" className="flex h-7 items-center gap-2 px-1">
          <span className="flex size-5 items-center justify-center rounded-[5px] bg-foreground font-mono text-[10px] font-bold text-background">
            cx
          </span>
          <span className="text-sm font-semibold tracking-tight">Corex UI</span>
          <span className="ml-auto rounded border border-sidebar-border px-1.5 py-px font-mono text-[10px] text-muted-foreground">
            v{COREX_UI_VERSION}
          </span>
        </Link>

        <button
          type="button"
          onClick={onOpenSearch}
          className="flex h-7 w-full cursor-pointer items-center gap-2 rounded-md border border-sidebar-border bg-background px-2 text-xs text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
        >
          <Search className="size-3.5" />
          <span className="flex-1 text-left">Search</span>
          <kbd className="pointer-events-none font-mono text-[10px] text-muted-foreground/80">
            ⌘K
          </kbd>
        </button>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-1 pb-4">
        <SidebarGroup className="py-1">
          <SidebarGroupContent>
            <SidebarMenu className="gap-px">
              {GUIDE_LINKS.map(({ to, label, icon: Icon, match, count }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton
                    render={<Link to={to} />}
                    isActive={match(pathname)}
                    className={navButtonClass}
                  >
                    <Icon />
                    <span className="flex-1">{label}</span>
                    {count !== undefined && (
                      <span className="font-mono text-[10px] text-muted-foreground/70">
                        {count}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

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
              />
            ))}
          </SectionGroup>
        )}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
