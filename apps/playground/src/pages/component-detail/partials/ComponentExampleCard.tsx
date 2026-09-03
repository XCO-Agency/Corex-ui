import * as React from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  Copy,
  Check,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ComponentExampleType } from "@/data/types";
import type { CanvasViewportType } from "../types";
import { ComponentCanvas } from "./ComponentCanvas";
import { ComponentCodeViewer } from "./ComponentCodeViewer";

export type ComponentExampleCardPropsType = {
  example: ComponentExampleType;
  index: number;
  componentName?: string;
};

export function ComponentExampleCard({
  example,
  index,
  componentName = "Component",
}: ComponentExampleCardPropsType) {
  const [activeTab, setActiveTab] = React.useState<"preview" | "code">("preview");
  const [viewport, setViewport] = React.useState<CanvasViewportType>("100%");
  const [remountKey, setRemountKey] = React.useState(0);
  const [copiedImport, setCopiedImport] = React.useState(false);

  const anchorId = `example-${index}-${example.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  // For regular components: "import { Component } from '@xco-agency/corex-ui'"
  // For future blocks: npxCommand (e.g. "npx shadcn@latest add ...")
  const isBlock = Boolean(example.npxCommand);
  const actionText = isBlock
    ? example.npxCommand!
    : `import { ${componentName} } from "@xco-agency/corex-ui"`;

  const copyText = isBlock
    ? example.npxCommand!
    : `import { ${componentName} } from "@xco-agency/corex-ui";`;

  const handleCopyAction = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopiedImport(true);
      setTimeout(() => setCopiedImport(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleRemount = () => {
    setRemountKey((prev) => prev + 1);
    setViewport("100%");
  };

  return (
    <section id={anchorId} className="group/section scroll-mt-20 space-y-3">
      {/* Top Toolbar Bar (Outside the Card) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left Side: [Preview | Code] toggle + Separator + Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="inline-flex items-center rounded-lg border border-border/80 bg-muted/30 p-0.5 shadow-2xs shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-all",
                activeTab === "preview"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("code")}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-all",
                activeTab === "code"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Code
            </button>
          </div>

          <div className="h-4 w-px bg-border/70 shrink-0" />

          <h3 className="text-sm font-medium text-foreground tracking-tight whitespace-nowrap">
            {example.title}
          </h3>
        </div>

        {/* Right Side: Viewport Switchers + Import/NPX Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Viewport size switcher pill (shown in Preview tab) */}
          {activeTab === "preview" && (
            <div className="flex items-center rounded-lg border border-border/80 bg-muted/30 p-0.5 shadow-2xs shrink-0">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className={cn(
                        "size-6 rounded",
                        viewport === "100%"
                          ? "bg-background text-foreground shadow-2xs font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      onClick={() => setViewport("100%")}
                    />
                  }
                >
                  <Monitor className="size-3.5" />
                </TooltipTrigger>
                <TooltipContent>Desktop (100%)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className={cn(
                        "size-6 rounded",
                        viewport === "768px"
                          ? "bg-background text-foreground shadow-2xs font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      onClick={() => setViewport("768px")}
                    />
                  }
                >
                  <Tablet className="size-3.5" />
                </TooltipTrigger>
                <TooltipContent>Tablet (768px)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className={cn(
                        "size-6 rounded",
                        viewport === "375px"
                          ? "bg-background text-foreground shadow-2xs font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                      onClick={() => setViewport("375px")}
                    />
                  }
                >
                  <Smartphone className="size-3.5" />
                </TooltipTrigger>
                <TooltipContent>Mobile (375px)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      className="size-6 rounded text-muted-foreground hover:text-foreground hover:bg-background/80"
                      onClick={handleRemount}
                    />
                  }
                >
                  <RotateCcw className="size-3.5" />
                </TooltipTrigger>
                <TooltipContent>Reset Example State</TooltipContent>
              </Tooltip>
            </div>
          )}

          {/* Import / NPX Command Action Pill */}
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-2 px-3 font-mono text-xs text-muted-foreground hover:text-foreground shadow-2xs border-border/80 bg-background hover:bg-muted/40"
                  onClick={handleCopyAction}
                />
              }
            >
              {isBlock ? (
                <>
                  <Terminal className="size-3.5 text-primary" />
                  <span>{actionText}</span>
                </>
              ) : (
                <span className="font-mono text-xs">
                  <span className="hidden 2xl:inline">
                    import &#123; {componentName} &#125; from "@xco-agency/corex-ui"
                  </span>
                  <span className="inline 2xl:hidden">
                    import &#123; {componentName} &#125;
                  </span>
                </span>
              )}
              {copiedImport ? (
                <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="size-3.5 opacity-70" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              {copiedImport ? "Copied to clipboard!" : `Click to copy: ${copyText}`}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Main Preview Canvas or Code Panel */}
      {activeTab === "preview" ? (
        <ComponentCanvas viewport={viewport} key={remountKey}>
          <example.Example />
        </ComponentCanvas>
      ) : (
        <ComponentCodeViewer
          code={example.code ?? ""}
          filename={example.filename ?? `${componentName}.tsx`}
          files={example.files}
        />
      )}
    </section>
  );
}
