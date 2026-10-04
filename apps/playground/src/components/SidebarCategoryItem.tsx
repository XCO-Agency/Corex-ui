import * as React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { type ComponentEntry } from "@/data/registry";

export type SidebarCategoryItemPropsType = {
  category: string;
  components: ComponentEntry[];
  basePath: "components" | "blocks";
  currentPath: string;
};

export function SidebarCategoryItem({
  category,
  components,
  basePath,
  currentPath,
}: SidebarCategoryItemPropsType) {
  const isCategoryActive = components.some(
    (c) => currentPath === `/${basePath}/${c.slug}`,
  );
  const [isOpen, setIsOpen] = React.useState(isCategoryActive);

  // Auto-expand when navigating to an item inside this category.
  React.useEffect(() => {
    if (isCategoryActive) setIsOpen(true);
  }, [isCategoryActive]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <SidebarMenuItem>
        <CollapsibleTrigger
          render={
            <SidebarMenuButton
              tooltip={category}
              className={cn(
                "h-7 cursor-pointer justify-between px-2 text-[13px] hover:bg-foreground/5",
                isCategoryActive ? "text-foreground" : "text-foreground/80",
              )}
            />
          }
        >
          <span className="truncate font-medium">{category}</span>
          <span className="flex items-center gap-1.5 text-muted-foreground/60">
            <span className="font-mono text-[10px]">{components.length}</span>
            <ChevronRight
              className={cn("size-3! transition-transform duration-200", isOpen && "rotate-90")}
            />
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="mx-0 ml-3 gap-px border-sidebar-border/80 py-0.5 pr-0 pl-0">
            {components.map((component) => {
              const itemPath = `/${basePath}/${component.slug}`;
              const isActive = currentPath === itemPath;
              return (
                <SidebarMenuSubItem key={itemPath}>
                  <SidebarMenuSubButton
                    isActive={isActive}
                    className={cn(
                      "-ml-px h-6.5 rounded-none rounded-r-md border-l px-3 text-[13px] hover:bg-foreground/5",
                      isActive
                        ? "border-foreground bg-transparent! font-medium text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground",
                    )}
                    render={
                      <Link to={itemPath}>
                        <span>{component.name}</span>
                      </Link>
                    }
                  />
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
