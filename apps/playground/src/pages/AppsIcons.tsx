import * as React from "react";
import {
  Search,
  X,
  Copy,
  Check,
  Download,
  Info,
  ExternalLink,
  Sparkles,
  SlidersHorizontal,
  Code2,
  BadgeCheck,
  CheckCircle2,
  Paintbrush,
  Maximize2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  APP_ICONS_DATA,
  APP_ICON_CATEGORIES,
  type AppIconItemType,
  type AppIconCategoryType,
  AppIcon,
  getRawSvg,
  getReactSnippet,
  getLiquidSnippet,
  getDataUri,
} from "@/data/apps-icons";

const COLOR_PRESETS = [
  { id: "default", label: "Default", color: "currentColor", bgClass: "bg-foreground" },
  { id: "emerald", label: "Emerald", color: "#059669", bgClass: "bg-emerald-600" },
  { id: "sky", label: "Sky Blue", color: "#0284c7", bgClass: "bg-sky-600" },
  { id: "indigo", label: "Indigo", color: "#4f46e5", bgClass: "bg-indigo-600" },
  { id: "amber", label: "Amber", color: "#d97706", bgClass: "bg-amber-600" },
  { id: "rose", label: "Rose", color: "#e11d48", bgClass: "bg-rose-600" },
];

const SIZE_PRESETS = [20, 24, 32, 40, 48];
const STROKE_PRESETS = [1.5, 1.75, 2.0, 2.5];
const TILE_STYLES = [
  { id: "none", label: "Plain" },
  { id: "rounded", label: "Soft Tile" },
  { id: "circle", label: "Circle" },
  { id: "bordered", label: "Bordered" },
];

export function AppsIcons() {
  const [query, setQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<AppIconCategoryType>("All");
  const [iconSize, setIconSize] = React.useState<number>(28);
  const [strokeWidth, setStrokeWidth] = React.useState<number>(1.75);
  const [selectedColor, setSelectedColor] = React.useState<string>("currentColor");
  const [customColor, setCustomColor] = React.useState<string>("#059669");
  const [tileStyle, setTileStyle] = React.useState<string>("rounded");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [inspectIcon, setInspectIcon] = React.useState<AppIconItemType | null>(null);
  const [modalTab, setModalTab] = React.useState<"svg" | "react" | "liquid" | "dataUri">("svg");
  const [copiedModalSnippet, setCopiedModalSnippet] = React.useState<string | null>(null);
  const [modalBg, setModalBg] = React.useState<"light" | "dark" | "slate" | "tint">("light");

  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Focus search on '/' keypress
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

  // Filter icons
  const filteredIcons = React.useMemo(() => {
    return APP_ICONS_DATA.filter((icon) => {
      const matchesCategory =
        selectedCategory === "All" || icon.category === selectedCategory;

      if (!matchesCategory) return false;

      const trimmed = query.trim().toLowerCase();
      if (!trimmed) return true;

      const titleMatch = icon.title.toLowerCase().includes(trimmed);
      const idMatch = icon.id.toLowerCase().includes(trimmed);
      const descMatch = icon.description.toLowerCase().includes(trimmed);
      const keywordMatch = icon.keywords.some((k) => k.toLowerCase().includes(trimmed));
      const placementMatch = icon.placements.some((p) => p.toLowerCase().includes(trimmed));

      return titleMatch || idMatch || descMatch || keywordMatch || placementMatch;
    });
  }, [query, selectedCategory]);

  // Quick download helper
  const handleDownloadSvg = React.useCallback(
    (e: React.MouseEvent, icon: AppIconItemType) => {
      e.stopPropagation();
      const svgCode = getRawSvg(icon, {
        color: selectedColor === "currentColor" ? "#111827" : selectedColor,
        strokeWidth,
        size: 24,
      });
      const blob = new Blob([svgCode], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${icon.id}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [selectedColor, strokeWidth]
  );

  // Quick copy SVG helper
  const handleCopySvg = React.useCallback(
    (icon: AppIconItemType) => {
      const svgCode = getRawSvg(icon, {
        color: selectedColor === "currentColor" ? "currentColor" : selectedColor,
        strokeWidth,
        size: iconSize,
      });
      navigator.clipboard.writeText(svgCode);
      setCopiedId(icon.id);
      setTimeout(() => {
        setCopiedId((curr) => (curr === icon.id ? null : curr));
      }, 1800);
    },
    [selectedColor, strokeWidth, iconSize]
  );

  // Copy modal snippet
  const handleCopyModalSnippet = React.useCallback((text: string, snippetId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedModalSnippet(snippetId);
    setTimeout(() => {
      setCopiedModalSnippet((curr) => (curr === snippetId ? null : curr));
    }, 1800);
  }, []);

  const activeColorValue =
    selectedColor === "custom"
      ? customColor
      : selectedColor === "currentColor"
      ? undefined
      : selectedColor;

  return (
    <div className="mx-auto w-full max-w-7xl px-2 pb-24 sm:px-4">
      {/* Hero Header */}
      <header className="relative space-y-4 pt-4 pb-6 text-center sm:pt-6">
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 font-mono text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20">
            <BadgeCheck className="size-3.5" />
            Shopify Storefront &amp; Apps
          </Badge>
          <Badge variant="outline" className="text-xs font-mono text-muted-foreground">
            51 Vector SVGs
          </Badge>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Apps Icons &amp; Trust Badges
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-muted-foreground sm:text-base">
            High-converting store trust badges, shipping, returns, security seals, and payment icons.
            Clean, lightweight vector SVGs ready to embed in Shopify themes, app embeds, cart drawers, and product pages.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mx-auto max-w-2xl pt-2">
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-4 size-5 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search store icons (e.g. free shipping, easy returns, secure checkout, 24/7, eco)..."
              className="h-12 w-full rounded-2xl border border-border bg-card pr-20 pl-11 text-base text-foreground shadow-xs transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
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

      {/* Category Pills Filter */}
      <div className="no-scrollbar mb-6 flex items-center gap-1.5 overflow-x-auto pb-2 sm:justify-center">
        {APP_ICON_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count =
            cat === "All"
              ? APP_ICONS_DATA.length
              : APP_ICONS_DATA.filter((i) => i.category === cat).length;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
              )}
            >
              <span>{cat}</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 text-[10px] font-mono",
                  isSelected
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-background/80 text-muted-foreground"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Customizer Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-3.5 shadow-xs">
        <div className="flex flex-wrap items-center gap-4">
          {/* Color Presets */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Paintbrush className="size-3.5" /> Color:
            </span>
            <div className="flex items-center gap-1.5">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedColor(preset.color)}
                  title={preset.label}
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full border transition-all cursor-pointer",
                    selectedColor === preset.color
                      ? "ring-2 ring-primary ring-offset-2 scale-110 border-transparent"
                      : "border-border hover:scale-105"
                  )}
                >
                  <span className={cn("size-4 rounded-full", preset.bgClass)} />
                </button>
              ))}

              {/* Custom Color Input */}
              <div className="relative flex items-center">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    setSelectedColor("custom");
                  }}
                  className="size-6 cursor-pointer rounded-full border border-border p-0 opacity-0 absolute inset-0"
                  title="Choose custom HEX color"
                />
                <div
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full border cursor-pointer",
                    selectedColor === "custom"
                      ? "ring-2 ring-primary ring-offset-2 scale-110 border-transparent"
                      : "border-border"
                  )}
                  style={{ backgroundColor: customColor }}
                  title="Pick custom color"
                />
              </div>
            </div>
          </div>

          {/* Size Selector */}
          <div className="flex items-center gap-2 border-l border-border pl-4">
            <span className="text-xs font-medium text-muted-foreground">Size:</span>
            <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg">
              {SIZE_PRESETS.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setIconSize(size)}
                  className={cn(
                    "px-2 py-0.5 text-xs font-mono rounded-md transition-all cursor-pointer",
                    iconSize === size
                      ? "bg-background text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>

          {/* Stroke Width Selector */}
          <div className="flex items-center gap-2 border-l border-border pl-4">
            <span className="text-xs font-medium text-muted-foreground">Stroke:</span>
            <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg">
              {STROKE_PRESETS.map((stroke) => (
                <button
                  key={stroke}
                  type="button"
                  onClick={() => setStrokeWidth(stroke)}
                  className={cn(
                    "px-2 py-0.5 text-xs font-mono rounded-md transition-all cursor-pointer",
                    strokeWidth === stroke
                      ? "bg-background text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {stroke}
                </button>
              ))}
            </div>
          </div>

          {/* Tile Style */}
          <div className="flex items-center gap-2 border-l border-border pl-4">
            <span className="text-xs font-medium text-muted-foreground">Tile:</span>
            <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg">
              {TILE_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setTileStyle(style.id)}
                  className={cn(
                    "px-2 py-0.5 text-xs rounded-md transition-all cursor-pointer",
                    tileStyle === style.id
                      ? "bg-background text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Status Count */}
        <div className="text-xs font-mono text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredIcons.length}</span> of{" "}
          {APP_ICONS_DATA.length} icons
        </div>
      </div>

      {/* Empty State */}
      {filteredIcons.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground">
            <Search className="size-7" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">No store icons found</h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground sm:text-sm">
            No matching icons found for &ldquo;{query}&rdquo;. Try another search term or click below to clear.
          </p>
          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedCategory("All");
                searchInputRef.current?.focus();
              }}
              className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        </div>
      ) : (
        /* Icons Grid */
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredIcons.map((icon) => {
            const isCopied = copiedId === icon.id;

            return (
              <div
                key={icon.id}
                role="button"
                tabIndex={0}
                onClick={() => handleCopySvg(icon)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCopySvg(icon);
                  }
                }}
                className={cn(
                  "group relative flex flex-col items-center justify-between rounded-xl border p-3 transition-all duration-150 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isCopied
                    ? "border-emerald-500 bg-emerald-500/10 shadow-xs"
                    : "border-border/80 bg-card hover:border-primary/50 hover:bg-accent/30 hover:shadow-sm"
                )}
                title={`Click to copy raw SVG: ${icon.title}`}
              >
                {/* Top Action Buttons (Hover) */}
                <div className="absolute top-1.5 right-1.5 z-10 flex items-center gap-1 opacity-0 transition-all group-hover:opacity-100">
                  {/* Download SVG */}
                  <button
                    type="button"
                    onClick={(e) => handleDownloadSvg(e, icon)}
                    aria-label={`Download ${icon.id}.svg`}
                    title="Download .SVG file"
                    className="flex size-6 items-center justify-center rounded-md bg-background/80 text-muted-foreground shadow-xs backdrop-blur-xs transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                  >
                    <Download className="size-3" />
                  </button>

                  {/* Inspect Details */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setInspectIcon(icon);
                    }}
                    aria-label={`Inspect ${icon.title}`}
                    title="Inspect & Copy Snippets"
                    className="flex size-6 items-center justify-center rounded-md bg-background/80 text-muted-foreground shadow-xs backdrop-blur-xs transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                  >
                    <Info className="size-3" />
                  </button>
                </div>

                {/* SVG Visual Container */}
                <div
                  className={cn(
                    "flex h-20 w-full items-center justify-center transition-all group-hover:scale-105",
                    tileStyle === "rounded" && "rounded-xl bg-muted/60",
                    tileStyle === "circle" && "mx-auto size-16 rounded-full bg-muted/60",
                    tileStyle === "bordered" && "rounded-xl border border-dashed border-border/80 bg-background",
                    tileStyle === "none" && ""
                  )}
                >
                  <AppIcon
                    name={icon.id}
                    size={iconSize}
                    strokeWidth={strokeWidth}
                    color={activeColorValue}
                  />
                </div>

                {/* Title & Category Info */}
                <div className="mt-2.5 flex w-full flex-col items-center text-center">
                  <span
                    className={cn(
                      "block w-full truncate text-xs font-medium transition-colors",
                      isCopied
                        ? "font-semibold text-emerald-600 dark:text-emerald-400"
                        : "text-foreground group-hover:text-primary"
                    )}
                    title={icon.title}
                  >
                    {icon.title}
                  </span>
                  <span className="truncate font-mono text-[10px] text-muted-foreground">
                    {icon.id}
                  </span>
                </div>

                {/* Copied Feedback Badge */}
                {isCopied && (
                  <div className="pointer-events-none absolute inset-x-2 bottom-2 flex items-center justify-center gap-1 rounded-md bg-emerald-600 py-1 font-mono text-[10px] font-semibold text-white shadow-xs">
                    <Check className="size-3" />
                    <span>SVG Copied!</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Inspect Icon Detail Modal Dialog */}
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
          <DialogContent className="max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl sm:max-w-2xl">
            <DialogHeader className="gap-1.5 pb-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {inspectIcon.category}
                  </Badge>
                  <span className="font-mono text-xs text-muted-foreground">
                    {inspectIcon.id}.svg
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleDownloadSvg(e, inspectIcon)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium hover:bg-muted transition-colors cursor-pointer"
                >
                  <Download className="size-3" />
                  <span>Download SVG</span>
                </button>
              </div>

              <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                {inspectIcon.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {inspectIcon.description}
              </DialogDescription>
            </DialogHeader>

            {/* Modal Body */}
            <div className="space-y-4 pt-1">
              {/* Interactive Preview Canvas */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-medium">Live Canvas Preview</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setModalBg("light")}
                      className={cn(
                        "rounded px-2 py-0.5 text-[11px] transition-colors cursor-pointer",
                        modalBg === "light"
                          ? "bg-foreground text-background font-semibold"
                          : "hover:bg-muted"
                      )}
                    >
                      Light
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalBg("dark")}
                      className={cn(
                        "rounded px-2 py-0.5 text-[11px] transition-colors cursor-pointer",
                        modalBg === "dark"
                          ? "bg-foreground text-background font-semibold"
                          : "hover:bg-muted"
                      )}
                    >
                      Dark
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalBg("slate")}
                      className={cn(
                        "rounded px-2 py-0.5 text-[11px] transition-colors cursor-pointer",
                        modalBg === "slate"
                          ? "bg-foreground text-background font-semibold"
                          : "hover:bg-muted"
                      )}
                    >
                      Slate
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalBg("tint")}
                      className={cn(
                        "rounded px-2 py-0.5 text-[11px] transition-colors cursor-pointer",
                        modalBg === "tint"
                          ? "bg-foreground text-background font-semibold"
                          : "hover:bg-muted"
                      )}
                    >
                      Tint
                    </button>
                  </div>
                </div>

                <div
                  className={cn(
                    "flex h-36 items-center justify-center rounded-xl border border-border transition-colors",
                    modalBg === "light" && "bg-white text-zinc-900",
                    modalBg === "dark" && "bg-zinc-950 text-white",
                    modalBg === "slate" && "bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-white",
                    modalBg === "tint" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  )}
                >
                  <AppIcon
                    name={inspectIcon.id}
                    size={64}
                    strokeWidth={strokeWidth}
                    color={activeColorValue}
                  />
                </div>
              </div>

              {/* Recommended Placements */}
              <div>
                <span className="text-xs font-semibold text-muted-foreground">
                  Recommended Store Placements
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {inspectIcon.placements.map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[11px] text-foreground"
                    >
                      <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Code Snippets Tabs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setModalTab("svg")}
                      className={cn(
                        "px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer",
                        modalTab === "svg"
                          ? "bg-background text-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Raw SVG
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalTab("react")}
                      className={cn(
                        "px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer",
                        modalTab === "react"
                          ? "bg-background text-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      React Component
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalTab("liquid")}
                      className={cn(
                        "px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer",
                        modalTab === "liquid"
                          ? "bg-background text-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Shopify Liquid
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalTab("dataUri")}
                      className={cn(
                        "px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer",
                        modalTab === "dataUri"
                          ? "bg-background text-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      CSS Data URI
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      let code = "";
                      if (modalTab === "svg") {
                        code = getRawSvg(inspectIcon, {
                          color: selectedColor === "currentColor" ? "currentColor" : selectedColor,
                          strokeWidth,
                          size: 24,
                        });
                      } else if (modalTab === "react") {
                        code = getReactSnippet(inspectIcon);
                      } else if (modalTab === "liquid") {
                        code = getLiquidSnippet(inspectIcon);
                      } else {
                        code = getDataUri(inspectIcon, activeColorValue || "#111827");
                      }
                      handleCopyModalSnippet(code, modalTab);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1 text-xs font-medium hover:bg-muted transition-colors cursor-pointer"
                  >
                    {copiedModalSnippet === modalTab ? (
                      <>
                        <Check className="size-3 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Code Viewer */}
                <div className="relative max-h-48 overflow-auto rounded-xl border border-border bg-zinc-950 p-3.5 font-mono text-xs text-zinc-100 dark:bg-black">
                  <pre className="whitespace-pre-wrap">
                    {modalTab === "svg" &&
                      getRawSvg(inspectIcon, {
                        color: selectedColor === "currentColor" ? "currentColor" : selectedColor,
                        strokeWidth,
                        size: 24,
                      })}
                    {modalTab === "react" && getReactSnippet(inspectIcon)}
                    {modalTab === "liquid" && getLiquidSnippet(inspectIcon)}
                    {modalTab === "dataUri" &&
                      getDataUri(inspectIcon, activeColorValue || "#111827")}
                  </pre>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
