import * as React from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/app-sidebar";
import { SearchDialog } from "@/components/search/SearchDialog";
import { SearchTrigger } from "@/components/search/SearchTrigger";

export type LayoutPropsType = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutPropsType) {
  const [searchOpen, setSearchOpen] = React.useState(false);

  return (
    <SidebarProvider>
      <AppSidebar onOpenSearch={() => setSearchOpen(true)} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <span className="text-sm font-medium text-muted-foreground">
              Playground
            </span>
          </div>

          <div className="flex items-center gap-3">
            <SearchTrigger onClick={() => setSearchOpen(true)} />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-6">
          {children}
        </div>
      </SidebarInset>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </SidebarProvider>
  );
}