import * as React from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  usePanelRef,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import type { CanvasViewportType } from "../types";
import { ComponentIframe } from "./ComponentIframe";

export type ComponentCanvasPropsType = {
  children: React.ReactNode;
  viewport?: CanvasViewportType;
  className?: string;
  isFullscreen?: boolean;
};

export function ComponentCanvas({
  children,
  viewport = "100%",
  className,
  isFullscreen = false,
}: ComponentCanvasPropsType) {
  const panelRef = usePanelRef();
  const [isDragging, setIsDragging] = React.useState(false);

  // Synchronize viewport state with resizable panel
  React.useEffect(() => {
    if (!panelRef.current) return;
    switch (viewport) {
      case "375px":
        panelRef.current.resize("375px");
        break;
      case "768px":
        panelRef.current.resize("768px");
        break;
      case "100%":
      default:
        panelRef.current.resize("100%");
        break;
    }
  }, [viewport, panelRef]);

  // Handle pointer cleanup for drag state
  React.useEffect(() => {
    if (!isDragging) return;
    const handlePointerUp = () => setIsDragging(false);
    window.addEventListener("pointerup", handlePointerUp);
    return () => window.removeEventListener("pointerup", handlePointerUp);
  }, [isDragging]);

  return (
    <div className={cn(className)}>
      <ResizablePanelGroup
        orientation="horizontal"
        className={cn(isFullscreen ? "min-h-[calc(100vh-9rem)]" : "min-h-65", "w-full")}
      >
        {/* Resizable Preview Canvas Panel */}
        <ResizablePanel
          panelRef={panelRef}
          defaultSize="100%"
          minSize="300px"
          className={cn(
            "relative flex justify-center bg-gray-50  overflow-clip  bg-[radial-gradient(oklch(0.7_0_0/0.2)_1px,transparent_1px)] dark:bg-[radial-gradient(oklch(1_0_0/0.15)_1px,transparent_1px)] bg-size-[16px_16px]",
            isFullscreen ? "items-start py-4" : "items-center rounded-xl border",
          )}
        >
          {/* Prevent iframe from capturing pointer events during drag resizing */}
          {isDragging && (
            <div className="absolute inset-0 z-50 cursor-col-resize select-none" />
          )}

          {/* Isolated iframe for Tailwind CSS isolation & authentic viewport simulation */}
          <ComponentIframe>{children}</ComponentIframe>
        </ResizablePanel>

        {/* Resizable drag handle */}
        <ResizableHandle
          withHandle

          onPointerDown={() => setIsDragging(true)}
          className=" bg-transparent after:transition-colors [&>div]:transition-all hover:[&>div]:w-2 hover:[&>div]:bg-amber-500"
        />

        {/* Secondary empty spacer panel (skipped content) */}
        <ResizablePanel defaultSize="0%" minSize="0px" className="bg-muted/15" />
      </ResizablePanelGroup>
    </div>
  );
}
