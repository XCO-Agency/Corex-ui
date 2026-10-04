import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ComponentNavigationItemType } from "../types";

export type ComponentPaginationPropsType = {
  prev: ComponentNavigationItemType;
  next: ComponentNavigationItemType;
  /** `/components` or `/blocks`. */
  basePath?: string;
};

const linkClass =
  "group flex min-w-0 flex-col gap-0.5 rounded-md py-1 text-[13px] transition-colors";

export function ComponentPagination({
  prev,
  next,
  basePath = "/components",
}: ComponentPaginationPropsType) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Component navigation"
      className="flex items-start justify-between gap-4 border-t border-border/60 pt-5"
    >
      {prev ? (
        <Link to={`${basePath}/${prev.slug}`} className={linkClass}>
          <span className="text-[11px] text-muted-foreground">Previous</span>
          <span className="flex items-center gap-1 truncate font-medium text-foreground/80 group-hover:text-foreground">
            <ChevronLeft className="size-3.5 shrink-0 transition-transform group-hover:-translate-x-0.5" />
            {prev.name}
          </span>
        </Link>
      ) : (
        <span />
      )}

      {next ? (
        <Link to={`${basePath}/${next.slug}`} className={`${linkClass} items-end text-right`}>
          <span className="text-[11px] text-muted-foreground">Next</span>
          <span className="flex items-center gap-1 truncate font-medium text-foreground/80 group-hover:text-foreground">
            {next.name}
            <ChevronRight className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
