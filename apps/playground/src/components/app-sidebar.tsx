import * as React from "react";
import { Command, Inbox, Rocket, Search, Sparkles, ChevronDown, Code2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { SidebarCategoryItem } from "@/components/SidebarCategoryItem";
import { type ComponentEntry, registry, blocks } from "@/data/registry";
import { getCategoryIcon } from "@/lib/category-icons";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export type AppSidebarPropsType = React.ComponentProps<typeof Sidebar> & {
  onOpenSearch?: () => void;
};

export function AppSidebar({ onOpenSearch, ...props }: AppSidebarPropsType) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isBlockRoute = currentPath.startsWith("/blocks");
  const [isComponentsOpen, setIsComponentsOpen] = React.useState(true);
  const [isBlocksOpen, setIsBlocksOpen] = React.useState(() => isBlockRoute);

  React.useEffect(() => {
    if (isBlockRoute) {
      setIsBlocksOpen(true);
    } else if (currentPath.startsWith("/components")) {
      setIsComponentsOpen(true);
    }
  }, [currentPath, isBlockRoute]);

  // const isComponentsOpen = isComponentsOpen;
  const effectiveBlocksOpen = isBlocksOpen;

  const groupedExamples = React.useMemo(() => {
    const grouped = registry.reduce(
      (acc, component) => {
        const groupName = component.category;
        if (!acc[groupName]) {
          acc[groupName] = [];
        }
        acc[groupName].push(component);
        return acc;
      },
      {} as Record<string, ComponentEntry[]>,
    );

    return Object.entries(grouped).map(([category, components]) => ({
      category,
      components,
    }));
  }, []);

  return (
    <Sidebar {...props}>
      <SidebarHeader className="gap-3 pb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link to="/" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Command className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Corex UI</span>
                <span className="truncate text-xs text-muted-foreground">
                  Shopify UI library
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Search / Command Dialog Button */}
        <div className="px-1">
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex h-8 w-full cursor-pointer items-center justify-between rounded-md border border-sidebar-border bg-sidebar-accent/40 pl-2.5 pr-1.5 text-xs text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <div className="flex items-center gap-2">
              <Search className="size-3.5" />
              <span>Search documentation...</span>
            </div>
            <kbd className="pointer-events-none flex h-5 select-none items-center gap-0.5 rounded  bg-gray-200 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-[14px]/1px">⌘</span>K
            </kbd>
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link to="/" />}
                  isActive={currentPath === "/"}
                >
                  <Inbox className="size-4" />
                  <span>Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link to="/installation" />}
                  isActive={currentPath === "/installation"}
                >
                  <Rocket className="size-4" />
                  <span>Installation</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link to="/utils" />}
                  isActive={currentPath === "/utils" || currentPath.startsWith("/utils")}
                >
                  <Code2 className="size-4 text-emerald-500" />
                  <span>Utils &amp; Hooks</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Components SidebarGroup */}
        <Collapsible
          open={isComponentsOpen}
          defaultOpen={true}
          onOpenChange={setIsComponentsOpen}
          className="group/components-collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel
              render={
                <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between rounded-md px-2 transition-colors hover:bg-sidebar-accent/50" />
              }
            >
              <span>Components</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-muted-foreground">
                  {registry.length}
                </span>
                <ChevronDown
                  className={cn(
                    "size-3.5 text-muted-foreground transition-transform duration-200",
                    !isComponentsOpen && "-rotate-90",
                  )}
                />
              </div>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {groupedExamples.map(({ category, components }) => (
                    <SidebarCategoryItem
                      key={category}
                      category={category}
                      components={components}
                      icon={getCategoryIcon(category)}
                      basePath="components"
                      currentPath={currentPath}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {blocks.length > 0 && (
          <Collapsible
            open={effectiveBlocksOpen}
            onOpenChange={setIsBlocksOpen}
            className="group/blocks-collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                render={
                  <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between rounded-md px-2 transition-colors hover:bg-sidebar-accent/50" />
                }
              >
                <span>Blocks</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {blocks.reduce((acc, g) => acc + g.components.length, 0)}
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-3.5 text-muted-foreground transition-transform duration-200",
                      !effectiveBlocksOpen && "-rotate-90",
                    )}
                  />
                </div>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {blocks.map(({ category, components }) => (
                      <SidebarCategoryItem
                        key={category}
                        category={category}
                        components={components}
                        icon={getCategoryIcon(category)}
                        basePath="blocks"
                        currentPath={currentPath}
                      />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Sparkles className="size-4 text-emerald-500" />
              <span>v0.1.0 Ready</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
