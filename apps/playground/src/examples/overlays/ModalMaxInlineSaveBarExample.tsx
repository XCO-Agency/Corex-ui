import { useCallback, useRef, useState } from "react";
import {
  Badge,
  BlockStack,
  Box,
  Button,
  Card,
  Divider,
  InlineStack,
  Modal,
  SaveBar,
  Select,
  Switch,
  Text,
  TextField,
  TitleBar,
} from "@xco-agency/corex-ui";

type FlowConfigType = {
  name: string;
  trigger: string;
  action: string;
  notifyOnSuccess: boolean;
};

const INITIAL_CONFIG: FlowConfigType = {
  name: "Order Fulfillment Alert",
  trigger: "orders/fulfilled",
  action: "send_slack_notification",
  notifyOnSuccess: true,
};

export function ModalMaxInlineSaveBarExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<FlowConfigType>(INITIAL_CONFIG);
  const [isSaving, setIsSaving] = useState(false);
  const [lastAction, setLastAction] = useState<string>("None");
  const initialRef = useRef<FlowConfigType>(INITIAL_CONFIG);

  const isDirty =
    config.name !== initialRef.current.name ||
    config.trigger !== initialRef.current.trigger ||
    config.action !== initialRef.current.action ||
    config.notifyOnSuccess !== initialRef.current.notifyOnSuccess;

  const handleSave = async () => {
    setIsSaving(true);
    setLastAction("Saving workflow changes...");
    // Simulate network delay
    await new Promise((res) => setTimeout(res, 800));
    initialRef.current = { ...config };
    setIsSaving(false);
    setLastAction("Changes saved successfully!");
  };

  const handleDiscard = () => {
    setConfig({ ...initialRef.current });
    setLastAction("Changes discarded, reset to initial state.");
  };

  const cleanupOnly = () => {
    // Non-blocking cleanup: only reset state/flags when modal actually closes
    setIsOpen(false);
    setLastAction("Modal dismissed (onHide executed cleanup)");
  };

  // Content programmatic close guarded by leaveConfirmation
  const handleProgrammaticClose = useCallback(async () => {
    if (isDirty) {
      try {
        const shopify =
          typeof window !== "undefined" ? (window as any).shopify : undefined;
        if (shopify?.saveBar?.leaveConfirmation) {
          await shopify.saveBar.leaveConfirmation();
        } else {
          const proceed = window.confirm(
            "You have unsaved changes. Are you sure you want to discard and leave?",
          );
          if (!proceed) return;
        }
      } catch {
        return; // Merchant chose to stay
      }
    }
    handleDiscard();
    setIsOpen(false);
  }, [isDirty]);

  return (
    <Card>
      <BlockStack gap="base">
        <BlockStack gap="small-200">
          <Text as="h3" variant="base" heading>
            Pattern A — Inline Max Modal with Contextual SaveBar
          </Text>
          <Text as="p" color="subdued">
            Renders App Bridge <code>variant=&quot;max&quot;</code> modal with an inline
            React workflow designer. <code>&lt;SaveBar&gt;</code> is placed as a direct
            child of <code>&lt;Modal&gt;</code> with empty button labels (letting App
            Bridge supply localized text). Programmatic close is guarded via{" "}
            <code>leaveConfirmation()</code>.
          </Text>
        </BlockStack>

        <InlineStack gap="base" justifyContent="space-between" blockAlign="center">
          <Button variant="primary" onClick={() => setIsOpen(true)}>
            Open Max Modal Editor
          </Button>

          <InlineStack gap="small-200" blockAlign="center">
            <Text as="span" color="subdued">
              Status:
            </Text>
            <Badge tone={isDirty ? "warning" : "success"}>
              {isDirty ? "Unsaved Changes" : "Pristine"}
            </Badge>
            <Badge tone="info">{lastAction}</Badge>
          </InlineStack>
        </InlineStack>

        <Modal
          open={isOpen}
          onHide={cleanupOnly}
          onClose={() => setIsOpen(false)}
          variant="max"
          id="flow-editor-modal"
        >
          <TitleBar title="Edit Automation Workflow">
            <button type="button" onClick={handleProgrammaticClose}>
              Done
            </button>
          </TitleBar>

          <SaveBar id="flow-editor-save-bar" open={isDirty} discardConfirmation>
            {/* FIRST button = primary/Save, SECOND button = Discard. App Bridge localized labels. */}
            <button
              type="button"
              variant="primary"
              loading={isSaving ? "" : undefined}
              disabled={!isDirty || isSaving}
              onClick={handleSave}
            />
            <button type="button" disabled={isSaving} onClick={handleDiscard} />
          </SaveBar>

          <Box padding="large-100">
            <BlockStack gap="large-100">
              {/* Contextual visual banner for playground feedback */}
              <Box
                padding="base"
                style={{
                  backgroundColor: isDirty
                    ? "var(--p-color-bg-surface-caution)"
                    : "var(--p-color-bg-surface-secondary)",
                  borderRadius: "var(--p-border-radius-200)",
                  border: isDirty
                    ? "1px solid var(--p-color-border-caution)"
                    : "1px solid var(--p-color-border-subdued)",
                }}
              >
                <InlineStack
                  gap="base"
                  justifyContent="space-between"
                  blockAlign="center"
                >
                  <InlineStack gap="small-200" blockAlign="center">
                    <Badge tone={isDirty ? "warning" : "neutral"}>
                      {isDirty ? "SaveBar Active" : "SaveBar Hidden"}
                    </Badge>
                    <Text as="span" variant="small">
                      {isDirty
                        ? "SaveBar will prompt if you attempt to dismiss or close this modal."
                        : "Make changes below to activate the contextual save bar."}
                    </Text>
                  </InlineStack>
                  <InlineStack gap="small-200">
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

              <Card>
                <BlockStack gap="base">
                  <Text as="h4" variant="base" heading>
                    Workflow Configuration
                  </Text>
                  <TextField
                    label="Workflow Name"
                    value={config.name}
                    onChange={(val) => setConfig((prev) => ({ ...prev, name: val }))}
                  />

                  <Select
                    label="Trigger Event"
                    options={[
                      {
                        label: "Order Fulfilled (orders/fulfilled)",
                        value: "orders/fulfilled",
                      },
                      { label: "Order Created (orders/create)", value: "orders/create" },
                      { label: "Inventory Low (inventory/low)", value: "inventory/low" },
                    ]}
                    value={config.trigger}
                    onChange={(val) => setConfig((prev) => ({ ...prev, trigger: val }))}
                  />

                  <Select
                    label="Action"
                    options={[
                      {
                        label: "Send Slack Notification",
                        value: "send_slack_notification",
                      },
                      { label: "Dispatch Webhook Event", value: "dispatch_webhook" },
                      { label: "Send Customer Email", value: "send_email" },
                    ]}
                    value={config.action}
                    onChange={(val) => setConfig((prev) => ({ ...prev, action: val }))}
                  />

                  <Divider />

                  <InlineStack justifyContent="space-between" blockAlign="center">
                    <BlockStack gap="none">
                      <Text as="span" heading>
                        Notify team on execution success
                      </Text>
                      <Text as="span" color="subdued" variant="small">
                        Dispatches automated digest alert to #ops channel.
                      </Text>
                    </BlockStack>
                    <Switch
                      checked={config.notifyOnSuccess}
                      onChange={(val) =>
                        setConfig((prev) => ({ ...prev, notifyOnSuccess: val }))
                      }
                    />
                  </InlineStack>
                </BlockStack>
              </Card>

              <InlineStack gap="base" justifyContent="flex-end">
                <Button onClick={handleProgrammaticClose}>Cancel / Close</Button>
                <Button
                  variant="primary"
                  loading={isSaving}
                  disabled={!isDirty || isSaving}
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </InlineStack>
            </BlockStack>
          </Box>
        </Modal>
      </BlockStack>
    </Card>
  );
}
