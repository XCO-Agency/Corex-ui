import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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

function GithubMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export type LayoutPropsType = {
  children: React.ReactNode;
};

const STATIC_PAGES: [RegExp, string][] = [
  [/^\/installation$/, "Installation"],
  [/^\/icons$/, "Icons"],
  [/^\/apps?-icons$/, "Apps Icons"],
  [/^\/utils(\/|$)/, "Utils & Hooks"],
];

/** Builds the trail after the root crumb, e.g. ["Actions", "Button"]. */
function useBreadcrumbTrail() {
  const { pathname } = useLocation();

  const staticPage = STATIC_PAGES.find(([pattern]) => pattern.test(pathname));
  if (staticPage) return { root: "Corex UI", trail: [staticPage[1]] };

  const match = pathname.match(/^\/(components|blocks)\/([^/]+)/);
  const entry = match ? findEntryBySlug(match[2]!) : null;
  const root = match?.[1] === "blocks" ? "Blocks" : "Components";
  return { root, trail: entry ? [entry.category, entry.name] : [] };
}

export default function Layout({ children }: LayoutPropsType) {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const { root, trail } = useBreadcrumbTrail();

  return (
    <SidebarProvider>
      <AppSidebar onOpenSearch={() => setSearchOpen(true)} />
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-11 shrink-0 items-center justify-between gap-2 border-b border-border/60 bg-background/80 px-3 backdrop-blur-md">
          <div className="flex min-w-0 items-center gap-2">
            <SidebarTrigger className="size-7 text-muted-foreground" />
            <Separator orientation="vertical" className="mr-1.5 h-4 my-2" />
            <Breadcrumb>
              <BreadcrumbList className="gap-1 text-[13px] sm:gap-1.5">
                <BreadcrumbItem className="hidden sm:block">
                  <BreadcrumbLink
                    render={<Link to="/" />}
                    className="text-muted-foreground"
                  >
                    {root}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {trail.map((crumb, index) => {
                  const isLast = index === trail.length - 1;
                  return (
                    <React.Fragment key={crumb}>
                      <BreadcrumbSeparator className="hidden sm:block" />
                      <BreadcrumbItem className={isLast ? undefined : "hidden sm:block"}>
                        {isLast ? (
                          <BreadcrumbPage className="font-medium text-foreground">
                            {crumb}
                          </BreadcrumbPage>
                        ) : (
                          <span className="text-muted-foreground">{crumb}</span>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex shrink-0 items-center gap-0.5">
            <Button
              variant="ghost"
              nativeButton={false}
              size="xs"
              className="hidden h-7 px-2 text-xs text-muted-foreground sm:inline-flex"
              render={<a href="/SKILL.md" target="_blank" rel="noopener noreferrer" />}
            >
              <Sparkles />
              SKILL.md
            </Button>
            <Button
              variant="ghost"
              nativeButton={false}
              size="icon-sm"
              aria-label="GitHub repository"
              className="size-7 text-muted-foreground [&_svg]:size-3.5"
              render={
                <a
                  href="https://github.com/XCO-Agency/Corex-ui"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <GithubMark />
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col px-4 py-6 sm:px-8 lg:px-10">{children}</div>
      </SidebarInset>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </SidebarProvider>
  );
}
