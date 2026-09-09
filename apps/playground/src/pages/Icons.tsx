import * as React from "react";
import { Search, X, Copy, Check, Sparkles, Code2, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Icon, IconType } from "@xco-agency/corex-ui";
import { cn } from "@/lib/utils";
import iconsDataRaw from "@/data/icons.json";

export type IconItemType = {
  name: string;
  title: string;
  category: string;
  keywords: string[];
};

export type ToneVariantConfigType = {
  id: string;
  label: string;
  tone?: "info" | "success" | "caution" | "critical" | "white";
  color?: "base" | "subdued";
  dark?: boolean;
};

const ICONS_DATA: IconItemType[] = iconsDataRaw as IconItemType[];

const MODAL_TONE_VARIANTS: ToneVariantConfigType[] = [
  { id: "auto", label: "Default", color: "base" },
  { id: "subdued", label: "Subdued", color: "subdued" },
  { id: "info", label: "Info", tone: "info", color: "base" },
  { id: "success", label: "Success", tone: "success", color: "base" },
  { id: "caution", label: "Caution", tone: "caution", color: "base" },
  { id: "critical", label: "Critical", tone: "critical", color: "base" },
  { id: "white", label: "White", tone: "white", color: "base", dark: true },
];

/** Check if sub sequence characters appear in order within str */
function isSubsequence(sub: string, str: string): boolean {
  if (sub.length < 2) return false;
  let i = 0;
  let j = 0;
  while (i < sub.length && j < str.length) {
    if (sub[i] === str[j]) i++;
    j++;
  }
  return i === sub.length;
}

export function Icons() {
  const [query, setQuery] = React.useState("");
  const [copiedIcon, setCopiedIcon] = React.useState<string | null>(null);
  const [inspectIcon, setInspectIcon] = React.useState<IconItemType | null>(null);
  const [copiedModalSnippet, setCopiedModalSnippet] = React.useState<string | null>(null);

  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Global shortcut to focus search with '/'
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.key === "/" &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Enhanced search algorithm with multi-tier scoring, fuzzy matching, and ranking
  const filteredIcons = React.useMemo(() => {
    const rawTrimmed = query.trim().toLowerCase();
    if (!rawTrimmed) {
      return ICONS_DATA;
    }

    const tokens = rawTrimmed.split(/\s+/).filter(Boolean);
    const scored: { item: IconItemType; score: number }[] = [];

    for (const item of ICONS_DATA) {
      let itemScore = 0;
      let allTokensMatch = true;
      const itemNameLower = item.name.toLowerCase();
      const itemTitleLower = item.title.toLowerCase();
      const itemKeywords = item.keywords.map((k) => k.toLowerCase());
      const initials = itemNameLower
        .split("-")
        .map((w) => w[0])
        .join("");

      for (const token of tokens) {
        let tokenScore = 0;

        // 1. Exact icon name match
        if (itemNameLower === token) {
          tokenScore = 10000;
        }
        // 2. Icon name starts with query
        else if (itemNameLower.startsWith(token)) {
          tokenScore = 5000 - itemNameLower.length;
        }
        // 3. Icon name contains query substring
        else if (itemNameLower.includes(token)) {
          tokenScore = 3000 - itemNameLower.length;
        }
        // 4. Title match
        else if (itemTitleLower.startsWith(token)) {
          tokenScore = 2500;
        } else if (itemTitleLower.includes(token)) {
          tokenScore = 2200;
        }
        // 5. Keyword exact match
        else if (itemKeywords.includes(token)) {
          tokenScore = 2000;
        }
        // 6. Keyword starts with query
        else if (itemKeywords.some((k) => k.startsWith(token))) {
          tokenScore = 1200;
        }
        // 7. Keyword contains query
        else if (itemKeywords.some((k) => k.includes(token))) {
          tokenScore = 800;
        }
        // 8. Acronym / initials match (e.g. "aur" matches "arrow-up-right")
        else if (initials === token || initials.startsWith(token)) {
          tokenScore = 500;
        }
        // 9. Fuzzy sub-sequence match on name (e.g. "shw" matches "slideshow", "crtd" matches "cart-discount")
        else if (isSubsequence(token, itemNameLower)) {
          tokenScore = 300 - itemNameLower.length;
        }
        // 10. Fuzzy sub-sequence match on keyword
        else if (itemKeywords.some((k) => isSubsequence(token, k))) {
          tokenScore = 150;
        }

        if (tokenScore === 0) {
          allTokensMatch = false;
          break;
        }
        itemScore += tokenScore;
      }

      if (allTokensMatch && itemScore > 0) {
        scored.push({ item, score: itemScore });
      }
    }

    scored.sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name));
    return scored.map((s) => s.item);
  }, [query]);

  const handleCopy = React.useCallback((iconName: string) => {
    navigator.clipboard.writeText(iconName);
    setCopiedIcon(iconName);
    setTimeout(() => {
      setCopiedIcon((current) => (current === iconName ? null : current));
    }, 1800);
  }, []);

  const handleCopyModalSnippet = React.useCallback((text: string, snippetId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedModalSnippet(snippetId);
    setTimeout(() => {
      setCopiedModalSnippet((curr) => (curr === snippetId ? null : curr));
    }, 1800);
  }, []);

  return (
    <div className="mx-auto w-full max-w-7xl px-2 pb-24 sm:px-4">
      {/* Hero Section */}
      <header className="relative space-y-5 pt-4 pb-4 text-center sm:pt-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Icon Library
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base">
            Complete, interactive catalog of all official Shopify Polaris icons. Search by
            name, synonym, or keyword, preview tones, and copy JSX snippets instantly.
          </p>
        </div>

        {/* Centered Search Bar */}
        <div className="mx-auto max-w-2xl pt-2">
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-4 size-5 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 517 icons by name, keyword, or synonym (e.g. cart, search, trash, arrow, show)..."
              className="h-12 w-full rounded-2xl border border-border bg-card pr-20 pl-11 text-base text-foreground shadow-sm transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
            <div className="absolute right-3 flex items-center gap-1.5">
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    searchInputRef.current?.focus();
                  }}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
                  title="Clear search"
                >
                  <X className="size-4" />
                </button>
              ) : (
                <kbd className="pointer-events-none hidden select-none items-center rounded border border-border bg-muted/60 px-2 py-0.5 font-mono text-[11px] font-medium text-muted-foreground sm:inline-flex">
                  /
                </kbd>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Controls & Toolbar */}

      {/* Empty State */}
      {filteredIcons.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground">
            <Search className="size-7" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">No icons found</h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground sm:text-sm">
            No matching icons found for &ldquo;{query}&rdquo;. Try another search term or
            click below to reset.
          </p>
          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setQuery("");
                searchInputRef.current?.focus();
              }}
              className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors cursor-pointer"
            >
              Clear search
            </button>
          </div>
        </div>
      ) : (
        /* 8-Column Grid for Icons */
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-10 xl:grid-cols-12">
          {filteredIcons.map((item) => {
            const isCopied = copiedIcon === item.name;

            return (
              <div
                key={item.name}
                role="button"
                tabIndex={0}
                onClick={() => handleCopy(item.name)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCopy(item.name);
                  }
                }}
                className={cn(
                  "group relative flex flex-col items-center justify-between rounded-xl border p-0.5 transition-all duration-150 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isCopied
                    ? "border-emerald-500 bg-emerald-500/10 shadow-xs"
                    : "border-border/80 bg-card hover:border-primary/50 hover:bg-accent/40 hover:shadow-sm",
                )}
                title={`Click to copy: ${item.name}`}
              >
                {/* Inspect Button on hover (top-right) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInspectIcon(item);
                  }}
                  aria-label={`Inspect ${item.name}`}
                  title="Inspect icon details"
                  className="absolute top-1.5 right-1.5 z-10 flex size-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100 cursor-pointer"
                >
                  <Info className="size-3.5" />
                </button>

                {/* Icon Container */}
                <div className="flex h-16 w-full items-center justify-center rounded-lg bg-muted transition-all group-hover:scale-105 group-hover:bg-muted/60">
                  <Icon type={item.name as IconType} />
                </div>

                {/* Icon Name Label */}
                <div className="py-1.5 mt-0.5 flex w-full items-center justify-center px-1">
                  <span
                    className={cn(
                      "block truncate font-mono text-[11px] transition-colors",
                      isCopied
                        ? "font-semibold text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                    title={item.name}
                  >
                    {item.name}
                  </span>
                </div>

                {/* Copied Feedback Badge */}
                {isCopied && (
                  <div className="pointer-events-none absolute inset-x-2 bottom-2 flex items-center justify-center gap-1 rounded-md bg-emerald-600 py-1 font-mono text-[10px] font-semibold text-white shadow-xs">
                    <Check className="size-3" />
                    <span>Copied!</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Inspect Icon Detail Dialog */}
      <Dialog
        open={Boolean(inspectIcon)}
        onOpenChange={(open) => {
          if (!open) {
            setInspectIcon(null);
            setCopiedModalSnippet(null);
          }
        }}
      >
        {inspectIcon && (
          <DialogContent className="max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <DialogHeader className="gap-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono text-xs">
                  {inspectIcon.category}
                </Badge>
                <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                  {inspectIcon.title}
                </DialogTitle>
              </div>
              <DialogDescription className="font-mono text-xs text-muted-foreground">
                type=&quot;{inspectIcon.name}&quot;
              </DialogDescription>
            </DialogHeader>

            {/* Icon Multi-Tone Previews */}
            <div className="space-y-4 pt-2">
              <div>
                <span className="text-xs font-semibold text-muted-foreground">
                  Tone Variants
                </span>
                <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-7">
                  {MODAL_TONE_VARIANTS.map((variant) => (
                    <div
                      key={variant.id}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border/80 p-2 text-center",
                        variant.dark ? "bg-zinc-900 text-white" : "bg-muted/30",
                      )}
                    >
                      <div className="flex size-8 items-center justify-center">
                        <Icon
                          type={inspectIcon.name as any}
                          tone={variant.tone as any}
                          color={variant.color as any}
                        />
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-medium",
                          variant.dark ? "text-zinc-400" : "text-muted-foreground",
                        )}
                      >
                        {variant.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ready to use code snippets */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  JSX Usage
                </span>

                <div className="relative flex items-center justify-between rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs text-foreground">
                  <code>{`<Icon type="${inspectIcon.name}" />`}</code>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyModalSnippet(
                        `<Icon type="${inspectIcon.name}" />`,
                        "jsx-standard",
                      )
                    }
                    className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    title="Copy snippet"
                  >
                    {copiedModalSnippet === "jsx-standard" ? (
                      <Check className="size-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </div>

                <div className="relative flex items-center justify-between rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs text-foreground">
                  <code>{`import { Icon } from "@xco-agency/corex-ui";`}</code>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyModalSnippet(
                        `import { Icon } from "@xco-agency/corex-ui";`,
                        "import-stmt",
                      )
                    }
                    className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    title="Copy import statement"
                  >
                    {copiedModalSnippet === "import-stmt" ? (
                      <Check className="size-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Associated Keywords & Search Terms */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">
                  Keywords &amp; Synonyms ({inspectIcon.keywords.length})
                </span>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1 border border-border/50 rounded-lg bg-muted/20">
                  {inspectIcon.keywords.map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => {
                        setInspectIcon(null);
                        setQuery(kw);
                      }}
                      className="rounded bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground cursor-pointer"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal footer copy buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleCopyModalSnippet(inspectIcon.name, "modal-name")}
                  className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors cursor-pointer"
                >
                  {copiedModalSnippet === "modal-name" ? (
                    <>
                      <Check className="mr-1.5 size-3.5 text-emerald-500" />
                      Copied Name
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1.5 size-3.5" />
                      Copy Name
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleCopyModalSnippet(
                      `<Icon type="${inspectIcon.name}" />`,
                      "modal-jsx-btn",
                    )
                  }
                  className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
                >
                  {copiedModalSnippet === "modal-jsx-btn" ? (
                    <>
                      <Check className="mr-1.5 size-3.5 text-emerald-300" />
                      Copied JSX
                    </>
                  ) : (
                    <>
                      <Code2 className="mr-1.5 size-3.5" />
                      Copy JSX
                    </>
                  )}
                </button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
