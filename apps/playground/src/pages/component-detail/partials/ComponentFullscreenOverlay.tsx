import * as React from "react";
import { createPortal } from "react-dom";
import { Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      // ignore clipboard error
    }
  };

  // Lock background scroll and listen for Escape key
  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
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

  const exitButton = (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClose}
      className="h-8 gap-1.5 px-3 text-xs font-medium border-border/80 bg-background hover:bg-muted/50 cursor-pointer shadow-2xs"
    >
      <Minimize2 className="size-3.5" />
      <span className="hidden sm:inline">Exit</span>
      <kbd className="hidden sm:inline-flex rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
        Esc
      </kbd>
    </Button>
  );

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${example.title} full screen preview`}
      className="fixed inset-0 z-50 flex flex-col bg-background text-foreground animate-in fade-in-0 duration-200"
    >
      {/* Shared toolbar — overlay variant */}
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
        rightSlot={exitButton}
      />

      {/* Full Screen Body Canvas */}
      <div className="flex-1 overflow-auto bg-gray-500/10">
        {activeTab === "preview" ? (
          <ComponentCanvas
            viewport={viewport}
            key={remountKey}
            isFullscreen
            className="w-full h-full"
          >
            <example.Example />
          </ComponentCanvas>
        ) : (
          <div className="h-full flex justify-center p-4 sm:p-6 lg:p-8 overflow-auto">
            <div className="w-full max-w-6xl shadow-xl border border-border/80 rounded-xl overflow-hidden bg-card h-fit">
              <ComponentCodeViewer
                code={example.code ?? ""}
                filename={example.filename ?? `${componentName}.tsx`}
                files={example.files}
              />
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
