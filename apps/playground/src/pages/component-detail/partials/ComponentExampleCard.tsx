import * as React from "react";
import type { ComponentExampleType } from "@/data/types";
import type { CanvasViewportType } from "../types";
import { ComponentCanvas } from "./ComponentCanvas";
import { ComponentCodeViewer } from "./ComponentCodeViewer";
import { ComponentFullscreenOverlay } from "./ComponentFullscreenOverlay";
import { ComponentExampleToolbar } from "./ComponentExampleToolbar";

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
  const [isFullscreen, setIsFullscreen] = React.useState(false);

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
      {/* Shared Toolbar */}
      <ComponentExampleToolbar
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
        title={example.title}
        componentName={componentName}
        viewport={viewport}
        onViewportChange={setViewport}
        onRemount={handleRemount}
        actionText={actionText}
        copyText={copyText}
        copied={copiedImport}
        onCopy={handleCopyAction}
        isBlock={isBlock}
        onToggleFullscreen={() => setIsFullscreen(true)}
      />

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

      {/* Full Screen Overlay Portal */}
      <ComponentFullscreenOverlay
        open={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        example={example}
        componentName={componentName}
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
        viewport={viewport}
        onViewportChange={setViewport}
        onRemount={handleRemount}
        remountKey={remountKey}
      />
    </section>
  );
}
