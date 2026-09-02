import * as React from "react";
import {
  Command,
  HelpCircle,
  Inbox,
  Layers,
  MoreHorizontal,
  Plus,
  Settings,
  Sparkles,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ComponentEntry, registry, blocks } from "@/data/registry";
import { Link } from "react-router-dom";

export type AppSidebarPropsType = React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ ...props }: AppSidebarPropsType) {
    const [search, setSearch] = React.useState('')
    const filtredExamples = React.useMemo(()=> {
        return registry.filter(({examples, ...rest}) => JSON.stringify(rest).toLowerCase().includes(search.toLowerCase()));
    }, [])
    
    const groupedExamples = React.useMemo(()=> {
        const grouped = filtredExamples.reduce((acc, component)=> {
            const groupName = component.category;
            if (!acc[groupName]) {
                acc[groupName] = [];
            }
            acc[groupName].push(component);
            return acc;
        }, {} as Record<string, ComponentEntry[]>);
        return Object.entries(grouped).map(([category, components])=> ({
            category,
            components,
        }));
    }, [filtredExamples])


  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link to="#" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Command className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Corex UI</span>
                <span className="truncate text-xs text-muted-foreground">
                  Shopify ui library
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
             <SidebarGroupContent>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link to="/" />}>
                  <Inbox className="size-4" />
                  <span>Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
             </SidebarGroupContent>
        </SidebarGroup>
        
        {/* First SidebarGroup: with Label, Action, Content, and Menu */}
        <SidebarGroup>
          <SidebarGroupLabel>Components</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* MenuItem 2: with Button and MenuSub */}
              {groupedExamples.map(({category, components}, idx)=> (
                
              <SidebarMenuItem key={idx}>
                <SidebarMenuButton >
                  <Layers className="size-4" />
                  <span>{category}</span>
                </SidebarMenuButton>
                {
                    components.map((component)=> (
                        <SidebarMenuSub key={`/components/${component.slug}`}>
                            <SidebarMenuSubItem>
                                <SidebarMenuSubButton render={<Link to={`/components/${component.slug}`}>
                                        <span>{component.name}</span>
                                    </Link>} >
                                    
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            
                        </SidebarMenuSub>
                    ))
                }
              </SidebarMenuItem>
              ))}


            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {blocks.length > 0 && <SidebarGroup>
          <SidebarGroupLabel>Blocks</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
 
              {/* MenuItem 2: with Button and MenuSub */}
              {blocks.map(({category, components}, idx)=> (
                
              <SidebarMenuItem key={idx}>
                <SidebarMenuButton >
                  <Layers className="size-4" />
                  <span>{category}</span>
                </SidebarMenuButton>
                {
                    components.map((component)=> (
                        <SidebarMenuSub key={`/components/${component.slug}`}>
                            <SidebarMenuSubItem>
                                <SidebarMenuSubButton slot="div" render={  <Link to={`/components/${component.slug}`}>
                                        <span>{component.name}</span>
                                    </Link>} >
                                  
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            
                        </SidebarMenuSub>
                    ))
                }
              </SidebarMenuItem>
              ))}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
}



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