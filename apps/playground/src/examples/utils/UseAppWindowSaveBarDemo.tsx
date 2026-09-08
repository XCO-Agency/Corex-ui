import { useState } from "react";
import {
  Badge,
  BlockStack,
  Box,
  Button,
  Card,
  Divider,
  InlineStack,
  Text,
  TextField,
} from "@xco-agency/corex-ui";

export function UseAppWindowSaveBarDemo() {
  const initialTitle = "Summer Flash Sale Banner";
  const [title, setTitle] = useState(initialTitle);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Pristine — No unsaved edits");

  const isDirty = title !== initialTitle;

  const handleSave = () => {
    setIsSaving(true);
    setStatusMessage("Child hook processing onSave()...");
    setTimeout(() => {
      setIsSaving(false);
      setTitle(title);
      setStatusMessage("Saved successfully! Host SaveBar dismissed.");
    }, 900);
  };

  const handleDiscard = () => {
    setTitle(initialTitle);
    setStatusMessage("Discarded changes. Restored initial value.");
  };

  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack gap="base" justifyContent="space-between" blockAlign="center">
          <BlockStack gap="small-200">
            <Text as="h3" variant="base" heading>
              Bidirectional AppWindow SaveBar Bridge
            </Text>
            <Text as="p" color="subdued">
              Used inside an iframe page opened by{" "}
              <code>&lt;AppWindow saveBar /&gt;</code>. Syncs dirty state outward and
              receives host Save &amp; Discard events inward.
            </Text>
          </BlockStack>
          <Badge tone={isDirty ? "warning" : "success"}>
            {isDirty ? "Unsaved Changes" : "Synced"}
          </Badge>
        </InlineStack>

        <Divider />

        {/* Simulated Host Window SaveBar Bar */}
        <Box
          padding="base"
          borderRadius="large"
          border="base"
          background={isDirty ? "strong" : "base"}
        >
          <InlineStack gap="base" justifyContent="space-between" blockAlign="center">
            <InlineStack gap="small-200" blockAlign="center">
              <Text as="span" variant="small" heading>
                Host Page &lt;SaveBar /&gt;
              </Text>
              <Badge tone={isDirty ? "caution" : "neutral"}>
                {isDirty ? "Bar Visible (open=true)" : "Bar Hidden (open=false)"}
              </Badge>
            </InlineStack>

            <InlineStack gap="small-200" blockAlign="center">
              <Button
                variant="secondary"
                disabled={!isDirty || isSaving}
                onClick={handleDiscard}
              >
                Discard
              </Button>
              <Button
                variant="primary"
                disabled={!isDirty || isSaving}
                loading={isSaving}
                onClick={handleSave}
              >
                Save
              </Button>
            </InlineStack>
          </InlineStack>
        </Box>

        {/* Simulated Child Iframe Form */}
        <Box padding="base" borderRadius="large" border="base" background="base">
          <BlockStack gap="small-300">
            <InlineStack
              gap="small-200"
              justifyContent="space-between"
              blockAlign="center"
            >
              <Text as="h4" variant="small" heading>
                Child Iframe View (using <code>useAppWindowSaveBar()</code>)
              </Text>
              <Badge tone="info">Iframe Scope</Badge>
            </InlineStack>

            <TextField
              label="Campaign Title"
              value={title}
              onChange={setTitle}
              helpText="Type to change this text and observe how the host SaveBar reacts instantly."
            />

            <InlineStack gap="small-200" blockAlign="center">
              <Button onClick={() => setTitle("Limited 50% Off Special")}>
                Set preset dirty value
              </Button>
              <Button onClick={() => setTitle(initialTitle)}>Reset to pristine</Button>
            </InlineStack>
          </BlockStack>
        </Box>

        <Divider />

        <InlineStack gap="small-200" blockAlign="center">
          <Text as="span" variant="small" color="subdued">
            Status:
          </Text>
          <Text as="span" variant="small">
            <code>{statusMessage}</code>
          </Text>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}
