import * as React from "react";
import {
  Command,
  Inbox,
  Search,
  Sparkles,
  X,
} from "lucide-react";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { type ComponentEntry, registry, blocks } from "@/data/registry";
import { getCategoryIcon } from "@/lib/category-icons";
import { Link } from "react-router-dom";

export type AppSidebarPropsType = React.ComponentProps<typeof Sidebar> & {
  onOpenSearch?: () => void;
};

export function AppSidebar({ onOpenSearch, ...props }: AppSidebarPropsType) {
  const [search, setSearch] = React.useState("");

  const filteredExamples = React.useMemo(() => {
    const trimmed = search.trim().toLowerCase();
    if (!trimmed) return registry;
    return registry.filter((component) => {
      const nameMatch = component.name.toLowerCase().includes(trimmed);
      const slugMatch = component.slug.toLowerCase().includes(trimmed);
      const categoryMatch = component.category.toLowerCase().includes(trimmed);
      const descMatch = component.description.toLowerCase().includes(trimmed);
      return nameMatch || slugMatch || categoryMatch || descMatch;
    });
  }, [search]);

  const groupedExamples = React.useMemo(() => {
    const grouped = filteredExamples.reduce((acc, component) => {
      const groupName = component.category;
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(component);
      return acc;
    }, {} as Record<string, ComponentEntry[]>);

    return Object.entries(grouped).map(([category, components]) => ({
      category,
      components,
    }));
  }, [filteredExamples]);

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

        {/* In-sidebar Quick Filter */}
        <div className="px-1">
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 size-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter components..."
              className="h-8 w-full rounded-md border border-sidebar-border bg-sidebar-accent/40 pl-8 pr-7 text-xs text-sidebar-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-sidebar-ring focus:bg-sidebar-accent"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 text-muted-foreground hover:text-foreground"
                title="Clear filter"
              >
                <X className="size-3" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenSearch}
                title="Open Command Palette (⌘K)"
                className="absolute right-1.5 flex h-5 items-center rounded border border-sidebar-border bg-sidebar-accent/80 px-1 font-mono text-[10px] text-muted-foreground hover:text-foreground"
              >
                ⌘K
              </button>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link to="/" />}>
                  <Inbox className="size-4" />
                  <span>Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Components SidebarGroup */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <span>Components</span>
            <span className="text-[10px] font-mono text-muted-foreground">
              {filteredExamples.length}
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {groupedExamples.length === 0 ? (
                <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                  No components matching &ldquo;{search}&rdquo;
                </div>
              ) : (
                groupedExamples.map(({ category, components }, idx) => {
                  const CategoryIcon = getCategoryIcon(category);
                  return (
                    <SidebarMenuItem key={idx}>
                      <SidebarMenuButton>
                        <CategoryIcon className="size-4" />
                        <span>{category}</span>
                      </SidebarMenuButton>
                      {components.map((component) => (
                        <SidebarMenuSub key={`/components/${component.slug}`}>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              render={
                                <Link to={`/components/${component.slug}`}>
                                  <span>{component.name}</span>
                                </Link>
                              }
                            />
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      ))}
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {blocks.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Blocks</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {blocks.map(({ category, components }, idx) => {
                  const BlockCategoryIcon = getCategoryIcon(category);
                  return (
                    <SidebarMenuItem key={idx}>
                      <SidebarMenuButton>
                        <BlockCategoryIcon className="size-4" />
                        <span>{category}</span>
                      </SidebarMenuButton>
                      {components.map((component) => (
                        <SidebarMenuSub key={`/components/${component.slug}`}>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              render={
                                <Link to={`/components/${component.slug}`}>
                                  <span>{component.name}</span>
                                </Link>
                              }
                            />
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      ))}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
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