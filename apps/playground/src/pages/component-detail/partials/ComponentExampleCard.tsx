import * as React from "react";
import {
  Eye,
  Code2,
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  Copy,
  Check,
  Grid,
  Square,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ComponentExampleType } from "@/data/types";
import type { CanvasBackgroundType, CanvasViewportType } from "../types";
import { ComponentCanvas } from "./ComponentCanvas";
import { ComponentCodeViewer } from "./ComponentCodeViewer";

export type ComponentExampleCardPropsType = {
  example: ComponentExampleType;
  index: number;
};

export function ComponentExampleCard({ example, index }: ComponentExampleCardPropsType) {
  const [activeTab, setActiveTab] = React.useState<"preview" | "code">("preview");
  const [viewport, setViewport] = React.useState<CanvasViewportType>("100%");
  const [background, setBackground] = React.useState<CanvasBackgroundType>("card");
  const [remountKey, setRemountKey] = React.useState(0);
  const [copied, setCopied] = React.useState(false);

  const anchorId = `example-${index}-${example.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  const handleCopyCode = async () => {
    if (!example.code) return;
    try {
      await navigator.clipboard.writeText(example.code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleRemount = () => {
    setRemountKey((prev) => prev + 1);
  };

  return (
      <section
        id={anchorId}
        className="group/section scroll-mt-20 space-y-3"
      >
        {/* Section title with anchor link */}
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {example.title}
          </h2>
          <a
            href={`#${anchorId}`}
            className="opacity-0 group-hover/section:opacity-100 transition-opacity text-muted-foreground hover:text-foreground p-1"
            title="Link to this section"
            aria-label={`Link to ${example.title}`}
          >
            <Hash className="size-4" />
          </a>
        </div>

        {/* Interactive card container */}
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
          {/* Card Header Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 bg-muted/30 px-3 py-2 sm:px-4">
            {/* Tabs: Preview / Code */}
            <div className="flex items-center rounded-lg border border-border/60 bg-background/80 p-0.5 shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                  activeTab === "preview"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Eye className="size-3.5" />
                <span>Preview</span>
              </button>

              {example.code && (
                <button
                  type="button"
                  onClick={() => setActiveTab("code")}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                    activeTab === "code"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Code2 className="size-3.5" />
                  <span>Code</span>
                </button>
              )}
            </div>

            {/* Toolbar controls (visible during Preview tab) */}
            {activeTab === "preview" ? (
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Viewport size switcher */}
                <div className="hidden sm:flex items-center rounded-md border border-border/50 bg-background/60 p-0.5">
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
                              ? "bg-muted text-foreground font-semibold"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                          onClick={() => setViewport("100%")}
                        />
                      }
                    >
                      <Monitor className="size-3.5" />
                    </TooltipTrigger>
                    <TooltipContent>Full Width (100%)</TooltipContent>
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
                              ? "bg-muted text-foreground font-semibold"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                          onClick={() => setViewport("768px")}
                        />
                      }
                    >
                      <Tablet className="size-3.5" />
                    </TooltipTrigger>
                    <TooltipContent>Tablet Width (768px)</TooltipContent>
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
                              ? "bg-muted text-foreground font-semibold"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                          onClick={() => setViewport("375px")}
                        />
                      }
                    >
                      <Smartphone className="size-3.5" />
                    </TooltipTrigger>
                    <TooltipContent>Mobile Width (375px)</TooltipContent>
                  </Tooltip>
                </div>

                {/* Background switcher */}
                <div className="flex items-center rounded-md border border-border/50 bg-background/60 p-0.5">
                
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          className={cn(
                            "size-6 rounded",
                            background === "card"
                              ? "bg-muted text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                          onClick={() => setBackground("card")}
                        />
                      }
                    >
                      <Square className="size-3.5" />
                    </TooltipTrigger>
                    <TooltipContent>Default Canvas</TooltipContent>
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
                            background === "dots"
                              ? "bg-muted text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                          onClick={() => setBackground("dots")}
                        />
                      }
                    >
                      <Grid className="size-3.5" />
                    </TooltipTrigger>
                    <TooltipContent>Dot Grid Pattern</TooltipContent>
                  </Tooltip>
                </div>

                {/* Re-mount / Reset state button */}
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        className="size-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-background"
                        onClick={handleRemount}
                      />
                    }
                  >
                    <RotateCcw className="size-3.5" />
                  </TooltipTrigger>
                  <TooltipContent>Reset Example State</TooltipContent>
                </Tooltip>

                {/* Quick copy code button in preview bar */}
                {example.code && (
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          className="size-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-background"
                          onClick={handleCopyCode}
                        />
                      }
                    >
                      {copied ? (
                        <Check className="size-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      {copied ? "Copied code!" : "Copy Code"}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            ) : null}
          </div>

          {/* Active Tab View */}
          {activeTab === "preview" ? (
            <ComponentCanvas
              viewport={viewport}
              background={background}
              key={remountKey}
            >
              <example.Example />
            </ComponentCanvas>
          ) : example.code ? (
            <ComponentCodeViewer code={example.code} language="tsx" />
          ) : null}
        </div>
      </section>
  );
}
