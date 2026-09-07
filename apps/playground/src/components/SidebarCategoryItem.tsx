import * as React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { type ComponentEntry } from "@/data/registry";

export type SidebarCategoryItemPropsType = {
  category: string;
  components: ComponentEntry[];
  icon: React.ComponentType<{ className?: string }>;
  basePath: "components" | "blocks";
  currentPath: string;
};

export function SidebarCategoryItem({
  category,
  components,
  icon: CategoryIcon,
  basePath,
  currentPath,
}: SidebarCategoryItemPropsType) {
  const isCategoryActive = React.useMemo(() => {
    return components.some((c) => currentPath === `/${basePath}/${c.slug}`);
  }, [components, currentPath, basePath]);

  const [isOpen, setIsOpen] = React.useState(isCategoryActive);

  // Auto-expand category if user navigates to an item within it
  React.useEffect(() => {
    if (isCategoryActive) {
      setIsOpen(true);
    }
  }, [isCategoryActive]);

  const effectiveOpen = isOpen;

  return (
    <Collapsible open={effectiveOpen} onOpenChange={setIsOpen} className="group/category">
      <SidebarMenuItem>
        <CollapsibleTrigger
          render={
            <SidebarMenuButton
              tooltip={category}
              className="w-full justify-between cursor-pointer"
            />
          }
        >
          <div className="flex items-center gap-2 min-w-0">
            <CategoryIcon className="size-4 shrink-0" />
            <span className="truncate">{category}</span>
          </div>
          <ChevronRight
            className={cn(
              "size-3.5 text-muted-foreground/70 shrink-0 transition-transform duration-200",
              effectiveOpen && "rotate-90",
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {components.map((component) => {
              const itemPath = `/${basePath}/${component.slug}`;
              const isActive = currentPath === itemPath;
              return (
                <SidebarMenuSubItem key={itemPath}>
                  <SidebarMenuSubButton
                    isActive={isActive}
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
