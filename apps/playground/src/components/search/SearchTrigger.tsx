import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type SearchTriggerPropsType = {
  onClick?: () => void;
  className?: string;
  compact?: boolean;
};

export function SearchTrigger({ onClick, className, compact = false }: SearchTriggerPropsType) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-border/80 hover:bg-muted/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
        compact ? "w-auto" : "w-full max-w-sm",
        className
      )}
      aria-label="Search components"
    >
      <div className="flex items-center gap-2 truncate">
        <Search className="size-4 shrink-0 transition-colors group-hover:text-foreground" />
        <span className="truncate text-xs sm:text-sm">Search components...</span>
      </div>
      <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground shadow-xs">
        <span className="text-xs">⌘</span>K
      </kbd>
    </button>
  );
}
