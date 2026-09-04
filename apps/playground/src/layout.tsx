import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/app-sidebar";
import { SearchDialog } from "@/components/search/SearchDialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { findEntryBySlug } from "@/data/registry";

export type LayoutPropsType = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutPropsType) {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const location = useLocation();

  const match = location.pathname.match(/^\/(components|blocks)\/([^/]+)/);
  const sectionType = match ? match[1] : null;
  const currentSlug = match ? match[2] : null;
  const currentEntry = currentSlug ? findEntryBySlug(currentSlug) : null;
  const isBlock = sectionType === "blocks";

  return (
    <SidebarProvider>
      <AppSidebar onOpenSearch={() => setSearchOpen(true)} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden sm:block">
                  <BreadcrumbLink render={<Link to="/" />}>
                    {isBlock ? "Blocks" : "Components"}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {currentEntry ? (
                  <>
                    <BreadcrumbSeparator className="hidden sm:block" />
                    <BreadcrumbItem className="hidden sm:block">
                      <span className="text-muted-foreground font-normal text-xs sm:text-sm">
                        {currentEntry.category}
                      </span>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden sm:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="font-medium text-foreground text-xs sm:text-sm">
                        {currentEntry.name}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                ) : null}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-6">{children}</div>
      </SidebarInset>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </SidebarProvider>
  );
}
