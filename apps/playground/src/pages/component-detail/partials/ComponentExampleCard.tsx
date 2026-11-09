import * as React from "react";
import {
  BlockStack,
  Box,
  Button,
  Divider,
  InlineStack,
  Text,
} from "@xco-agency/corex-ui";
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
    <BlockStack gap="small" id={anchorId}>
      <InlineStack gap="small-200" alignItems="center">
        <Text as="h3" variant="headingSm" heading>
          {example.title}
        </Text>
        <Button
          icon="hashtag"
          variant="tertiary"
          accessibilityLabel={`Link to ${example.title}`}
          href={`#${anchorId}`}
        />
      </InlineStack>

      <Box borderWidth="base" borderColor="base" borderRadius="base" overflow="hidden" background="base">
        <BlockStack gap="none">
          <ComponentExampleToolbar
            variant="card"
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
          <Divider />
          {activeTab === "preview" ? (
            <ComponentCanvas viewport={viewport} key={remountKey} embedded>
              <example.Example />
            </ComponentCanvas>
          ) : (
            <ComponentCodeViewer
              code={example.code ?? ""}
              filename={example.filename ?? `${componentName}.tsx`}
              files={example.files}
            />
          )}
        </BlockStack>
      </Box>

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
    </BlockStack>
  );
}
