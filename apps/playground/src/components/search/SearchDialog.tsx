import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, ArrowRight, CornerDownLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { allEntries, blocks, type ComponentEntry } from "@/data/registry";
import { getCategoryIcon } from "@/lib/category-icons";
import { cn } from "@/lib/utils";

export type SearchDialogPropsType = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function SearchDialog({
  open: controlledOpen,
  onOpenChange,
}: SearchDialogPropsType) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (isControlled) {
        onOpenChange?.(nextOpen);
      } else {
        setInternalOpen(nextOpen);
      }
      if (!nextOpen) {
        setQuery("");
        setActiveIndex(0);
      }
    },
    [isControlled, onOpenChange],
  );

  // Global keyboard shortcut: Cmd+K / Ctrl+K or /
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(!isOpen);
      } else if (
        e.key === "/" &&
        !isOpen &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setOpen]);

  // Filter components and blocks
  const results = React.useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return allEntries;
    }
    return allEntries.filter((component) => {
      const nameMatch = component.name.toLowerCase().includes(trimmed);
      const slugMatch = component.slug.toLowerCase().includes(trimmed);
      const categoryMatch = component.category.toLowerCase().includes(trimmed);
      const descMatch = component.description.toLowerCase().includes(trimmed);
      return nameMatch || slugMatch || categoryMatch || descMatch;
    });
  }, [query]);

  // Reset active index when query changes
  React.useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Ensure active element is scrolled into view
  React.useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector<HTMLElement>(
        `[data-result-index="${activeIndex}"]`,
      );
      activeEl?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const handleSelect = React.useCallback(
    (component: ComponentEntry) => {
      setOpen(false);
      const isBlock = blocks.some((b) =>
        b.components.some((c) => c.slug === component.slug),
      );
      navigate(isBlock ? `/blocks/${component.slug}` : `/components/${component.slug}`);
    },
    [navigate, setOpen],
  );

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = results[activeIndex];
      if (selected) {
        handleSelect(selected);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="max-w-2xl gap-0 overflow-hidden p-0 border border-border bg-card shadow-2xl rounded-2xl"
      >
        <DialogTitle className="sr-only">Search components</DialogTitle>
        <DialogDescription className="sr-only">
          Search for components by name, category, or description.
        </DialogDescription>

        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
          <Search className="size-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search components, categories, or keywords..."
            className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground outline-none"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="rounded p-1 text-muted-foreground hover:text-foreground transition-colors"
              title="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex select-none items-center gap-1 rounded border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} className="max-h-[380px] overflow-y-auto p-2 scroll-py-2">
          {results.length === 0 ? (
            <div className="py-12 text-center">
              <Search className="mx-auto size-8 text-muted-foreground/60 mb-2" />
              <p className="text-sm font-medium text-foreground">No components found</p>
              <p className="text-xs text-muted-foreground mt-1">
                No matching results for &ldquo;{query}&rdquo;. Try another search term.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((component, idx) => {
                const Icon = getCategoryIcon(component.category);
                const isActive = idx === activeIndex;

                return (
                  <button
                    key={component.slug}
                    type="button"
                    data-result-index={idx}
                    onClick={() => handleSelect(component)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-accent/50",
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-lg border",
                          isActive
                            ? "border-accent-foreground/20 bg-background text-foreground"
                            : "border-border bg-muted/40 text-muted-foreground",
                        )}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-foreground truncate">
                            {component.name}
                          </span>
                          <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            {component.category}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {component.description}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center text-muted-foreground">
                      {isActive ? (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-foreground">
                          Open <CornerDownLeft className="size-3" />
                        </span>
                      ) : (
                        <ArrowRight className="size-3.5 opacity-40" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="flex items-center justify-between border-t border-border bg-muted/20 px-4 py-2.5 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono text-[10px]">
                ↑
              </kbd>
              <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono text-[10px]">
                ↓
              </kbd>
              <span>navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono text-[10px]">
                ↵
              </kbd>
              <span>select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono text-[10px]">
                esc
              </kbd>
              <span>close</span>
            </span>
          </div>

          <span className="font-mono text-[10px]">
            {results.length} {results.length === 1 ? "component" : "components"}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
