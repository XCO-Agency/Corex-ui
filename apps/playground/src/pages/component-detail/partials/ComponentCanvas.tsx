import * as React from "react";
import { Group, Panel, Separator, usePanelRef } from "react-resizable-panels";
import { BlockStack, Box } from "@xco-agency/corex-ui";
import type { CanvasViewportType } from "../types";
import { ComponentIframe } from "./ComponentIframe";

export type ComponentCanvasPropsType = {
  children: React.ReactNode;
  viewport?: CanvasViewportType;
  className?: string;
  isFullscreen?: boolean;
  /** Rendered inside the example card, which supplies the frame. */
  embedded?: boolean;
};

export function ComponentCanvas({
  children,
  viewport = "100%",
  className,
  isFullscreen = false,
  embedded = false,
}: ComponentCanvasPropsType) {
  const panelRef = usePanelRef();
  const [isDragging, setIsDragging] = React.useState(false);

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

  React.useEffect(() => {
    if (!isDragging) return;
    const handlePointerUp = () => setIsDragging(false);
    window.addEventListener("pointerup", handlePointerUp);
    return () => window.removeEventListener("pointerup", handlePointerUp);
  }, [isDragging]);

  return (
    <BlockStack className={className} inlineSize="100%" minBlockSize={isFullscreen ? "70vh" : "160px"}>
      <Group orientation="horizontal">
        <Panel
          panelRef={panelRef}
          defaultSize="100%"
          minSize="300px"
          className={embedded || isFullscreen ? undefined : "rounded-xl"}
        >
          {isDragging && (
            <Box
              position="absolute"
              insetBlockStart="0"
              insetInlineStart="0"
              insetInlineEnd="0"
              insetBlockEnd="0"
            />
          )}
          <ComponentIframe className={isFullscreen ? "h-full" : ""}>{children}</ComponentIframe>
        </Panel>
        <Separator onPointerDown={() => setIsDragging(true)} />
        <Panel defaultSize="0%" minSize="0px" />
      </Group>
    </BlockStack>
  );
}
