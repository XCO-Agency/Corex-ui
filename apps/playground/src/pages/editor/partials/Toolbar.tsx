import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  BlockStack,
  Box,
  Button,
  Clickable,
  Grid,
  InlineStack,
  Modal,
  Tabs,
  Text,
  Tooltip,
} from "@xco-agency/corex-ui";
import type { IconType } from "@xco-agency/corex-ui";
import { ComponentCodeViewer } from "@/pages/component-detail/partials/ComponentCodeViewer";
import { generateCode } from "../codegen";
import { useEditor } from "../store";
import { createRoot, templates } from "../templates";
import { countNodes } from "../tree";
import type { ViewportType } from "../types";

export const VIEWPORTS: {
  id: ViewportType;
  label: string;
  width: number | null;
  icon: IconType;
}[] = [
  { id: "desktop", label: "Desktop", width: null, icon: "desktop" },
  { id: "tablet", label: "Tablet · 820px", width: 820, icon: "tablet" },
  { id: "mobile", label: "Mobile · 390px", width: 390, icon: "mobile" },
];

function IconAction({
  label,
  icon,
  onClick,
  disabled,
  active,
}: {
  label: string;
  icon: IconType;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <Tooltip content={label}>
      <Button
        variant={active ? "secondary" : "tertiary"}
        icon={icon}
        accessibilityLabel={label}
        disabled={disabled}
        onClick={onClick}
      />
    </Tooltip>
  );
}

export type ToolbarPropsType = {
  viewport: ViewportType;
  onViewportChange: (viewport: ViewportType) => void;
  editing: boolean;
  onEditingChange: (editing: boolean) => void;
  leftOpen: boolean;
  onToggleLeft: () => void;
  rightOpen: boolean;
  onToggleRight: () => void;
};

type CodeTabType = "react" | "json";

export function Toolbar({
  viewport,
  onViewportChange,
  editing,
  onEditingChange,
  leftOpen,
  onToggleLeft,
  rightOpen,
  onToggleRight,
}: ToolbarPropsType) {
  const navigate = useNavigate();
  const { state, dispatch } = useEditor();
  const [codeOpen, setCodeOpen] = React.useState(false);
  const [templatesOpen, setTemplatesOpen] = React.useState(false);
  const [codeTab, setCodeTab] = React.useState<CodeTabType>("react");
  const nodeCount = countNodes(state.root) - 1;

  return (
    <Box paddingInline="small" paddingBlock="small-200" background="base">
      <InlineStack alignItems="center" gap="small" wrap={false}>
        <InlineStack grow alignItems="center" gap="small-200" wrap={false}>
          <IconAction
            label="Back to docs"
            icon="arrow-left"
            onClick={() => navigate("/")}
          />
          <Text fontWeight="semibold">Editor</Text>
          <Badge>{`${nodeCount} element${nodeCount === 1 ? "" : "s"}`}</Badge>
          <IconAction
            label="Toggle left panel"
            icon="layout-sidebar-left"
            active={leftOpen}
            onClick={onToggleLeft}
          />
          <IconAction
            label="Undo (⌘Z)"
            icon="undo"
            disabled={!state.past.length}
            onClick={() => dispatch({ type: "undo" })}
          />
          <IconAction
            label="Redo (⇧⌘Z)"
            icon="redo"
            disabled={!state.future.length}
            onClick={() => dispatch({ type: "redo" })}
          />
        </InlineStack>

        {/* s-button-group only renders secondary buttons, so the active state needs a plain row. */}
        <InlineStack gap="small-500" wrap={false}>
          {VIEWPORTS.map(({ id, label, icon }) => (
            <Button
              key={id}
              icon={icon}
              variant={viewport === id ? "secondary" : "tertiary"}
              accessibilityLabel={label}
              onClick={() => onViewportChange(id)}
            />
          ))}
        </InlineStack>

        <InlineStack
          grow
          justifyContent="end"
          alignItems="center"
          gap="small-200"
          wrap={false}
        >
          <Button
            variant="tertiary"
            icon="theme-template"
            onClick={() => setTemplatesOpen(true)}
          >
            Templates
          </Button>
          <InlineStack gap="small-500" wrap={false}>
            <Button
              icon="edit"
              variant={editing ? "secondary" : "tertiary"}
              onClick={() => onEditingChange(true)}
            >
              Edit
            </Button>
            <Button
              icon="view"
              variant={editing ? "tertiary" : "secondary"}
              onClick={() => onEditingChange(false)}
            >
              Preview
            </Button>
          </InlineStack>
          <Button variant="primary" icon="code" onClick={() => setCodeOpen(true)}>
            Export
          </Button>
          <IconAction
            label="Toggle right panel"
            icon="layout-sidebar-right"
            active={rightOpen}
            onClick={onToggleRight}
          />
        </InlineStack>
      </InlineStack>

      <Modal
        open={codeOpen}
        onClose={() => setCodeOpen(false)}
        heading="Export"
        variant="large"
      >
        <BlockStack gap="base">
          <Text color="subdued">
            Paste the component into your app, or keep the JSON to rebuild this canvas
            later.
          </Text>
          <Tabs
            tabs={[
              { id: "react", label: "React" },
              { id: "json", label: "JSON" },
            ]}
            value={codeTab}
            onChange={(id) => setCodeTab(id as CodeTabType)}
          />
          {codeOpen && (
            <ComponentCodeViewer
              key={codeTab}
              code={
                codeTab === "react"
                  ? generateCode(state.root)
                  : JSON.stringify(state.root, null, 2)
              }
              filename={codeTab === "react" ? "ComposedPage.tsx" : "canvas.json"}
              language={codeTab === "react" ? "tsx" : "json"}
            />
          )}
        </BlockStack>
      </Modal>

      <Modal
        open={templatesOpen}
        onClose={() => setTemplatesOpen(false)}
        heading="Start from a template"
      >
        <BlockStack gap="base">
          <Text color="subdued">Replaces the canvas. You can undo with ⌘Z.</Text>
          <Grid columns={3} gap="small">
            {templates.map((template) => (
              <Clickable
                key={template.id}
                padding="base"
                border="base"
                borderRadius="base"
                accessibilityLabel={`Use the ${template.name} template`}
                onClick={() => {
                  dispatch({
                    type: "replace",
                    root: createRoot(template.nodes),
                    selectedId: null,
                  });
                  setTemplatesOpen(false);
                }}
              >
                <BlockStack gap="small-300">
                  <Text fontWeight="semibold">{template.name}</Text>
                  <Text variant="small" color="subdued">
                    {template.description}
                  </Text>
                </BlockStack>
              </Clickable>
            ))}
          </Grid>
        </BlockStack>
      </Modal>
    </Box>
  );
}
