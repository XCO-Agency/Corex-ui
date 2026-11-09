import * as React from "react";
import {
  BlockStack,
  Box,
  Button,
  ButtonGroup,
  InlineStack,
  Segment,
  Text,
  Tooltip,
} from "@xco-agency/corex-ui";
import type { CanvasViewportType } from "../types";

export type ExampleToolbarVariantType = "inline" | "overlay" | "card";

export type ComponentExampleToolbarPropsType = {
  variant?: ExampleToolbarVariantType;
  activeTab: "preview" | "code";
  onActiveTabChange: (tab: "preview" | "code") => void;
  title: string;
  componentName?: string;
  viewport: CanvasViewportType;
  onViewportChange: (viewport: CanvasViewportType) => void;
  onRemount: () => void;
  actionText: string;
  copyText: string;
  copied: boolean;
  onCopy: () => void;
  isBlock?: boolean;
  onToggleFullscreen: () => void;
  rightSlot?: React.ReactNode;
};

function TabSwitcher({
  activeTab,
  onChange,
}: {
  activeTab: "preview" | "code";
  onChange: (tab: "preview" | "code") => void;
}) {
  return (
    <Segment
      accessibilityLabel="Example view"
      size="small"
      value={activeTab}
      onChange={onChange}
      options={[
        { label: "Preview", value: "preview" },
        { label: "Code", value: "code" },
      ]}
    />
  );
}

function ViewportControls({
  viewport,
  onViewportChange,
  onRemount,
  onToggleFullscreen,
  fullscreenOnly,
}: {
  viewport: CanvasViewportType;
  onViewportChange: (viewport: CanvasViewportType) => void;
  onRemount: () => void;
  onToggleFullscreen: () => void;
  fullscreenOnly?: boolean;
}) {
  return (
    <ButtonGroup gap="none" accessibilityLabel="Viewport">
      {!fullscreenOnly && (
        <>
          <Tooltip content="Desktop (100%)">
            <Button
              icon="desktop"
              variant={viewport === "100%" ? "secondary" : "tertiary"}
              accessibilityLabel="Desktop"
              onClick={() => onViewportChange("100%")}
            />
          </Tooltip>
          <Tooltip content="Tablet (768px)">
            <Button
              icon="tablet"
              variant={viewport === "768px" ? "secondary" : "tertiary"}
              accessibilityLabel="Tablet"
              onClick={() => onViewportChange("768px")}
            />
          </Tooltip>
          <Tooltip content="Mobile (375px)">
            <Button
              icon="mobile"
              variant={viewport === "375px" ? "secondary" : "tertiary"}
              accessibilityLabel="Mobile"
              onClick={() => onViewportChange("375px")}
            />
          </Tooltip>
          <Tooltip content="Reset example">
            <Button
              icon="reset"
              variant="tertiary"
              accessibilityLabel="Reset example"
              onClick={onRemount}
            />
          </Tooltip>
        </>
      )}
      <Tooltip content="Full screen">
        <Button
          icon="maximize"
          variant="tertiary"
          accessibilityLabel="Full screen"
          onClick={onToggleFullscreen}
        />
      </Tooltip>
    </ButtonGroup>
  );
}

function CopyAction({
  actionText,
  copyText,
  copied,
  onCopy,
  isBlock,
  componentName,
}: {
  actionText: string;
  copyText: string;
  copied: boolean;
  onCopy: () => void;
  isBlock?: boolean;
  componentName?: string;
}) {
  return (
    <Tooltip content={copied ? "Copied to clipboard" : `Click to copy: ${copyText}`}>
      <Button icon={copied ? "check" : "clipboard"} variant="secondary" onClick={onCopy}>
        {isBlock ? actionText : componentName}
      </Button>
    </Tooltip>
  );
}

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
  const tabs = <TabSwitcher activeTab={activeTab} onChange={onActiveTabChange} />;
  const viewportControls = (
    <ViewportControls
      viewport={viewport}
      onViewportChange={onViewportChange}
      onRemount={onRemount}
      onToggleFullscreen={onToggleFullscreen}
      fullscreenOnly={activeTab !== "preview"}
    />
  );
  const copy = (
    <CopyAction
      actionText={actionText}
      copyText={copyText}
      copied={copied}
      onCopy={onCopy}
      isBlock={isBlock}
      componentName={componentName}
    />
  );

  if (variant === "card") {
    return (
      <Box padding="small-200">
        <InlineStack alignItems="center" justifyContent="space-between" gap="small" wrap>
          {tabs}
          <InlineStack alignItems="center" gap="small-200" wrap>
            {isBlock ? copy : null}
            {viewportControls}
          </InlineStack>
        </InlineStack>
      </Box>
    );
  }

  return (
    <Box padding={variant === "overlay" ? "base" : "none"}>
      <InlineStack alignItems="center" justifyContent="space-between" gap="small" wrap>
        <InlineStack alignItems="center" gap="small" wrap>
          {tabs}
          <Text as={variant === "overlay" ? "h2" : "h3"} variant="headingSm" fontWeight="semibold">
            {title}
          </Text>
          {variant === "overlay" && componentName ? <BadgeLabel>{componentName}</BadgeLabel> : null}
        </InlineStack>
        <InlineStack alignItems="center" gap="small-200" wrap>
          {viewportControls}
          {copy}
          {rightSlot}
        </InlineStack>
      </InlineStack>
    </Box>
  );
}

function BadgeLabel({ children }: { children: string }) {
  return (
    <BlockStack>
      <Text color="subdued" variant="small">
        {children}
      </Text>
    </BlockStack>
  );
}
