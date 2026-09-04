import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ComponentNavigationItemType } from "../types";

export type ComponentPaginationPropsType = {
  prev: ComponentNavigationItemType;
  next: ComponentNavigationItemType;
};

export function ComponentPagination({ prev, next }: ComponentPaginationPropsType) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Component navigation"
      className="mt-14 grid grid-cols-1 gap-4 pt-6 border-t border-border/70 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          to={`/components/${prev.slug}`}
          className="group flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-xs"
        >
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
            <ChevronLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Previous</span>
          </div>
          <div className="text-base font-semibold text-foreground">{prev.name}</div>
          <div className="text-xs text-muted-foreground">{prev.category}</div>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {next ? (
        <Link
          to={`/components/${next.slug}`}
          className="group flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4 text-right transition-all hover:border-primary/50 hover:shadow-xs"
        >
          <div className="flex items-center justify-end gap-1.5 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
            <span>Next</span>
            <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
          <div className="text-base font-semibold text-foreground">{next.name}</div>
          <div className="text-xs text-muted-foreground">{next.category}</div>
        </Link>
      ) : null}
    </nav>
  );
}
