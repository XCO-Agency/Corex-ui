import * as React from "react";
import { createPortal } from "react-dom";
import { BlockStack, Box, Button, InlineStack } from "@xco-agency/corex-ui";
import type { ComponentExampleType } from "@/data/types";
import type { CanvasViewportType } from "../types";
import { ComponentCanvas } from "./ComponentCanvas";
import { ComponentCodeViewer } from "./ComponentCodeViewer";
import { ComponentExampleToolbar } from "./ComponentExampleToolbar";

export type ComponentFullscreenOverlayPropsType = {
  open: boolean;
  onClose: () => void;
  example: ComponentExampleType;
  componentName?: string;
  activeTab: "preview" | "code";
  onActiveTabChange: (tab: "preview" | "code") => void;
  viewport: CanvasViewportType;
  onViewportChange: (viewport: CanvasViewportType) => void;
  onRemount: () => void;
  remountKey: number;
};

export function ComponentFullscreenOverlay({
  open,
  onClose,
  example,
  componentName = "Component",
  activeTab,
  onActiveTabChange,
  viewport,
  onViewportChange,
  onRemount,
  remountKey,
}: ComponentFullscreenOverlayPropsType) {
  const [copiedCommand, setCopiedCommand] = React.useState(false);
  const isBlock = Boolean(example.npxCommand);
  const actionText = isBlock
    ? example.npxCommand!
    : `import { ${componentName} } from "@xco-agency/corex-ui"`;

  const handleCopyAction = async () => {
    try {
      await navigator.clipboard.writeText(actionText);
      setCopiedCommand(true);
      setTimeout(() => setCopiedCommand(false), 2000);
    } catch {
      // ignore
    }
  };

  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <BlockStack
      position="fixed"
      className="inset-0 z-50 bg-background"
      inlineSize="100%"
      blockSize="100vh"
      gap="none"
      role="dialog"
      aria-modal="true"
      aria-label={`${example.title} full screen preview`}
    >
      <ComponentExampleToolbar
        variant="overlay"
        activeTab={activeTab}
        onActiveTabChange={onActiveTabChange}
        title={example.title}
        componentName={componentName}
        viewport={viewport}
        onViewportChange={onViewportChange}
        onRemount={onRemount}
        actionText={actionText}
        copyText={actionText}
        copied={copiedCommand}
        onCopy={handleCopyAction}
        isBlock={isBlock}
        onToggleFullscreen={onClose}
        rightSlot={
          <Button variant="secondary" onClick={onClose}>
            Exit
          </Button>
        }
      />
      <Box padding="base" overflow="hidden">
        {activeTab === "preview" ? (
          <ComponentCanvas viewport={viewport} key={remountKey} isFullscreen>
            <example.Example />
          </ComponentCanvas>
        ) : (
          <InlineStack justifyContent="center">
            <BlockStack inlineSize="100%" maxInlineSize="72rem">
              <ComponentCodeViewer
                code={example.code ?? ""}
                filename={example.filename ?? `${componentName}.tsx`}
                files={example.files}
              />
            </BlockStack>
          </InlineStack>
        )}
      </Box>
    </BlockStack>,
    document.body,
  );
}
