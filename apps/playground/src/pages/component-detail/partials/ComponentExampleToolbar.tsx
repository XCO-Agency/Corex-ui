import * as React from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { CanvasViewportType } from "../types";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ExampleToolbarVariantType = "inline" | "overlay";

export type ComponentExampleToolbarPropsType = {
  variant?: ExampleToolbarVariantType;
  activeTab: "preview" | "code";
  onActiveTabChange: (tab: "preview" | "code") => void;
  title: string;
  componentName?: string;
  viewport: CanvasViewportType;
  onViewportChange: (v: CanvasViewportType) => void;
  onRemount: () => void;
  actionText: string;
  copyText: string;
  copied: boolean;
  onCopy: () => void;
  isBlock?: boolean;
  onToggleFullscreen: () => void;
  /** Extra content injected to the right (e.g. Exit button in overlay) */
  rightSlot?: React.ReactNode;
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function TabSwitcher({
  activeTab,
  onChange,
}: {
  activeTab: "preview" | "code";
  onChange: (t: "preview" | "code") => void;
}) {
  const base = "rounded-md px-3 py-1 text-xs font-medium transition-all cursor-pointer";
  const active = "bg-background text-foreground shadow-xs font-semibold";
  const inactive = "text-muted-foreground hover:text-foreground";
  return (
    <div className="inline-flex items-center rounded-lg border border-border/80 bg-muted/30 p-0.5 shadow-2xs shrink-0">
      <button type="button" onClick={() => onChange("preview")} className={cn(base, activeTab === "preview" ? active : inactive)}>
        Preview
      </button>
      <button type="button" onClick={() => onChange("code")} className={cn(base, activeTab === "code" ? active : inactive)}>
        Code
      </button>
    </div>
  );
}

function ViewportPill({
  viewport,
  onViewportChange,
  onRemount,
  onToggleFullscreen,
}: {
  viewport: CanvasViewportType;
  onViewportChange: (v: CanvasViewportType) => void;
  onRemount: () => void;
  onToggleFullscreen: () => void;
}) {
  const iconBase = "size-6 rounded";
  const activeStyle = "bg-background text-foreground shadow-2xs font-semibold";
  const inactiveStyle = "text-muted-foreground hover:text-foreground";

  return (
    <div className="flex items-center rounded-lg border border-border/80 bg-muted/30 p-0.5 shadow-2xs shrink-0">
      <Tooltip>
        <TooltipTrigger render={<Button type="button" variant="ghost" size="icon-xs" className={cn(iconBase, viewport === "100%" ? activeStyle : inactiveStyle)} onClick={() => onViewportChange("100%")} />}>
          <Monitor className="size-3.5" />
        </TooltipTrigger>
        <TooltipContent>Desktop (100%)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger render={<Button type="button" variant="ghost" size="icon-xs" className={cn(iconBase, viewport === "768px" ? activeStyle : inactiveStyle)} onClick={() => onViewportChange("768px")} />}>
          <Tablet className="size-3.5" />
        </TooltipTrigger>
        <TooltipContent>Tablet (768px)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger render={<Button type="button" variant="ghost" size="icon-xs" className={cn(iconBase, viewport === "375px" ? activeStyle : inactiveStyle)} onClick={() => onViewportChange("375px")} />}>
          <Smartphone className="size-3.5" />
        </TooltipTrigger>
        <TooltipContent>Mobile (375px)</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger render={<Button type="button" variant="ghost" size="icon-xs" className="size-6 rounded text-muted-foreground hover:text-foreground hover:bg-background/80" onClick={onRemount} />}>
          <RotateCcw className="size-3.5" />
        </TooltipTrigger>
        <TooltipContent>Reset Example State</TooltipContent>
      </Tooltip>

      <div className="mx-0.5 h-3.5 w-px bg-border/60" />

      <Tooltip>
        <TooltipTrigger render={<Button type="button" variant="ghost" size="icon-xs" className="size-6 rounded text-muted-foreground hover:text-foreground hover:bg-background/80 cursor-pointer" onClick={onToggleFullscreen} />}>
          <Maximize2 className="size-3.5" />
        </TooltipTrigger>
        <TooltipContent>Full screen</TooltipContent>
      </Tooltip>
    </div>
  );
}

function FullscreenOnlyPill({ onToggleFullscreen }: { onToggleFullscreen: () => void }) {
  return (
    <div className="flex items-center rounded-lg border border-border/80 bg-muted/30 p-0.5 shadow-2xs shrink-0">
      <Tooltip>
        <TooltipTrigger render={<Button type="button" variant="ghost" size="icon-xs" className="size-6 rounded text-muted-foreground hover:text-foreground hover:bg-background/80 cursor-pointer" onClick={onToggleFullscreen} />}>
          <Maximize2 className="size-3.5" />
        </TooltipTrigger>
        <TooltipContent>Full screen</TooltipContent>
      </Tooltip>
    </div>
  );
}

function CopyPill({
  actionText,
  copyText,
  copied,
  onCopy,
  isBlock,
  componentName,
  className,
}: {
  actionText: string;
  copyText: string;
  copied: boolean;
  onCopy: () => void;
  isBlock?: boolean;
  componentName?: string;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn(
              "h-8 gap-2 px-3 font-mono text-xs text-muted-foreground hover:text-foreground shadow-2xs border-border/80 bg-background hover:bg-muted/40",
              className
            )}
            onClick={onCopy}
          />
        }
      >
        {isBlock ? (
          <>
            <Terminal className="size-3.5 text-primary" />
            <span className="truncate max-w-[160px] sm:max-w-[220px] xl:max-w-none">{actionText}</span>
          </>
        ) : (
          <span className="font-mono text-xs truncate max-w-[180px] sm:max-w-none">
            <span className="hidden 2xl:inline">
              import &#123; {componentName} &#125; from &quot;@xco-agency/corex-ui&quot;
            </span>
            <span className="inline 2xl:hidden">
              import &#123; {componentName} &#125;
            </span>
          </span>
        )}
        {copied ? (
          <Check className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        ) : (
          <Copy className="size-3.5 opacity-70 shrink-0" />
        )}
      </TooltipTrigger>
      <TooltipContent>
        {copied ? "Copied to clipboard!" : `Click to copy: ${copyText}`}
      </TooltipContent>
    </Tooltip>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function ComponentExampleToolbar({
  variant = "inline",
  activeTab,
  onActiveTabChange,
  title,
  componentName,
  viewport,
  onViewportChange,
  onRemount,
  actionText,
  copyText,
  copied,
  onCopy,
  isBlock,
  onToggleFullscreen,
  rightSlot,
}: ComponentExampleToolbarPropsType) {
  const isOverlay = variant === "overlay";

  const left = (
    <div className="flex items-center gap-2.5 min-w-0">
      <TabSwitcher activeTab={activeTab} onChange={onActiveTabChange} />
      <div className="h-4 w-px bg-border/70 shrink-0" />
      <div className="flex items-center gap-2 min-w-0">
        {isOverlay ? (
          <h2 className="text-sm font-semibold text-foreground truncate">{title}</h2>
        ) : (
          <h3 className="text-sm font-medium text-foreground tracking-tight truncate">{title}</h3>
        )}
        {isOverlay && componentName && (
          <span className="hidden md:inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground shrink-0">
            {componentName}
          </span>
        )}
      </div>
    </div>
  );

  const right = (
    <div className="flex items-center gap-2 shrink-0">
      {activeTab === "preview" ? (
        <ViewportPill
          viewport={viewport}
          onViewportChange={onViewportChange}
          onRemount={onRemount}
          onToggleFullscreen={onToggleFullscreen}
        />
      ) : (
        <FullscreenOnlyPill onToggleFullscreen={onToggleFullscreen} />
      )}

      <CopyPill
        actionText={actionText}
        copyText={copyText}
        copied={copied}
        onCopy={onCopy}
        isBlock={isBlock}
        componentName={componentName}
        className={isOverlay ? "hidden sm:inline-flex" : undefined}
      />

      {rightSlot && (
        <>
          <div className="h-4 w-px bg-border/70 shrink-0 hidden sm:block" />
          {rightSlot}
        </>
      )}
    </div>
  );

  if (isOverlay) {
    return (
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/80 px-4 sm:px-6 bg-background/95 backdrop-blur-md">
        {left}
        {right}
      </header>
    );
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {left}
      {right}
    </div>
  );
}
