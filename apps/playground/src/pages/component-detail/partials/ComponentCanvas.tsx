import * as React from "react";
import { cn } from "@/lib/utils";
import type { CanvasBackgroundType, CanvasViewportType } from "../types";

export type ComponentCanvasPropsType = {
  children: React.ReactNode;
  viewport?: CanvasViewportType;
  background?: CanvasBackgroundType;
  className?: string;
};

export function ComponentCanvas({
  children,
  viewport = "100%",
  background = "card",
  className,
}: ComponentCanvasPropsType) {
  const getViewportMaxWidth = (vp: CanvasViewportType) => {
    switch (vp) {
      case "375px":
        return "max-w-[375px]";
      case "768px":
        return "max-w-[768px]";
      default:
        return "w-full";
    }
  };

  const getBackgroundClass = (bg: CanvasBackgroundType) => {
    switch (bg) {
      case "dots":
        return "bg-card bg-[radial-gradient(oklch(0.7_0_0/0.2)_1px,transparent_1px)] dark:bg-[radial-gradient(oklch(1_0_0/0.15)_1px,transparent_1px)] [background-size:16px_16px]";
      case "subdued":
        return "bg-muted/50";
      default:
        return "bg-card";
    }
  };

  const isConstrained = viewport !== "100%";

  return (
    <div
      className={cn(
        "relative flex min-h-[260px] w-full items-center justify-center p-6 md:p-10 transition-colors duration-200 overflow-x-auto",
        getBackgroundClass(background),
        className
      )}
    >
      {/* Resizable frame container */}
      <div
        className={cn(
          "w-full transition-all duration-300 ease-out",
          getViewportMaxWidth(viewport),
          isConstrained &&
            "mx-auto rounded-lg border border-dashed border-border/80 bg-background/80 p-4 shadow-sm"
        )}
      >
        {/* Device frame label if constrained */}
        {isConstrained && (
          <div className="mb-3 flex items-center justify-between border-b border-border/60 pb-2 text-[11px] font-mono text-muted-foreground">
            <span>Viewport preview</span>
            <span>{viewport === "375px" ? "Mobile (375px)" : "Tablet (768px)"}</span>
          </div>
        )}

        <div className="flex w-full items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
