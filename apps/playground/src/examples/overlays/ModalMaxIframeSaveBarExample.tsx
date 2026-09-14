import { useEffect, useState } from "react";
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
  Switch,
  Text,
  TextField,
  TitleBar,
} from "@xco-agency/corex-ui";

const CHANNEL_NAME = "claimify-preferences";

type PreferencesStateType = {
  storeEmail: string;
  senderName: string;
  portalBranding: boolean;
};

const INITIAL_PREFERENCES: PreferencesStateType = {
  storeEmail: "contact@store.com",
  senderName: "Support Team",
  portalBranding: true,
};

export function ModalMaxIframeSaveBarExample() {
  const [isOpen, setIsOpen] = useState(false);

  // Host mirrors state from the child iframe
  const [saveState, setSaveState] = useState({
    visible: false,
    disabled: false,
    saving: false,
  });

  // Local simulated iframe state
  const [preferences, setPreferences] = useState<PreferencesStateType>(INITIAL_PREFERENCES);
  const [initialPreferences, setInitialPreferences] = useState<PreferencesStateType>(INITIAL_PREFERENCES);
  const [resetKey, setResetKey] = useState(0);
  const [logMessages, setLogMessages] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogMessages((prev) => [
      `[${new Date().toLocaleTimeString()}] ${msg}`,
      ...prev.slice(0, 4),
    ]);
  };

  // 1. Host side: listen for dirty / saving / validity from iframe
  useEffect(() => {
    let ch: BroadcastChannel | null = null;
    try {
      ch = new BroadcastChannel(CHANNEL_NAME);
      ch.onmessage = (e) => {
        if (e.data?.type === "claimify-save-state") {
          setSaveState({
            visible: Boolean(e.data.visible),
            disabled: Boolean(e.data.disabled),
            saving: Boolean(e.data.saving),
          });
          addLog(
            `Host received state: dirty=${Boolean(e.data.visible)}, saving=${Boolean(e.data.saving)}`,
          );
        }
      };
    } catch {
      // ignore
    }
    return () => {
      ch?.close();
    };
  }, []);

  const postToIframe = (type: string) => {
    try {
      const ch = new BroadcastChannel(CHANNEL_NAME);
      ch.postMessage({ type });
      ch.close();
      addLog(`Host dispatched command: ${type}`);
    } catch {
      // ignore
    }
  };

  // 2. Iframe simulation side: calculate changes & report to host
  const hasChanges =
    preferences.storeEmail !== initialPreferences.storeEmail ||
    preferences.senderName !== initialPreferences.senderName ||
    preferences.portalBranding !== initialPreferences.portalBranding;

  const isValid = preferences.storeEmail.includes("@");

  useEffect(() => {
    try {
      const ch = new BroadcastChannel(CHANNEL_NAME);
      ch.postMessage({
        type: "claimify-save-state",
        visible: hasChanges,
        disabled: !isValid,
        saving: saveState.saving,
      });
      ch.close();
    } catch {
      // ignore
    }
  }, [hasChanges, isValid, saveState.saving]);

  // 3. Iframe simulation side: receive host Save / Discard commands
  useEffect(() => {
    let ch: BroadcastChannel | null = null;
    try {
      ch = new BroadcastChannel(CHANNEL_NAME);
      ch.onmessage = async (e) => {
        if (e.data?.type === "claimify-modal-save") {
          addLog("Iframe executing handleUnifiedSave()...");
          setSaveState((prev) => ({ ...prev, saving: true }));
          await new Promise((res) => setTimeout(res, 800));
          setInitialPreferences({ ...preferences });
          setSaveState({ visible: false, disabled: false, saving: false });
          addLog("Iframe save completed. State committed.");
        }
        if (e.data?.type === "claimify-modal-discard") {
          addLog("Iframe executing handleDiscard(): resetting state and bumping resetKey");
          setPreferences({ ...initialPreferences });
          setResetKey((k) => k + 1);
          setSaveState({ visible: false, disabled: false, saving: false });
        }
      };
    } catch {
      // ignore
    }
    return () => {
      ch?.close();
    };
  }, [preferences, initialPreferences]);

  const cleanup = () => {
    setIsOpen(false);
    addLog("Modal dismissed: onHide cleanup executed.");
  };

  return (
    <Card>
      <BlockStack gap="base">
        <BlockStack gap="small-200">
          <Text as="h3" variant="base" fontWeight="bold">
            Pattern B — Cross-Document Modal with BroadcastChannel Handshake
          </Text>
          <Text as="p" tone="subdued">
            Used when the modal loads a nested route via <code>src=&quot;...&quot;</code>.
            Because nested iframes lack App Bridge custom elements, <code>&lt;SaveBar&gt;</code>{" "}
            lives on the host <code>&lt;Modal&gt;</code>. An active <code>BroadcastChannel</code>{" "}
            synchronizes dirty state, validity, and triggers Save/Discard actions across documents.
          </Text>
        </BlockStack>

        <InlineStack gap="base" justifyContent="space-between" blockAlign="center">
          <Button variant="primary" onClick={() => setIsOpen(true)}>
            Open Cross-Document Preferences Modal
          </Button>

          <InlineStack gap="small-200" blockAlign="center">
            <Text as="span" tone="subdued">
              Host SaveBar:
            </Text>
            <Badge tone={saveState.visible ? "warning" : "neutral"}>
              {saveState.visible ? "open=true" : "open=false"}
            </Badge>
            {saveState.saving && <Badge tone="info">Saving...</Badge>}
          </InlineStack>
        </InlineStack>

        {/* Real-time BroadcastChannel event monitor */}
        <Box
          padding="base"
          style={{
            backgroundColor: "var(--p-color-bg-surface-secondary)",
            borderRadius: "var(--p-border-radius-200)",
            border: "1px solid var(--p-color-border-subdued)",
          }}
        >
          <BlockStack gap="small-200">
            <InlineStack justifyContent="space-between" blockAlign="center">
              <Text as="span" variant="small" fontWeight="semibold">
                BroadcastChannel Monitor (channel: &quot;{CHANNEL_NAME}&quot;)
              </Text>
              <Badge tone="info">Active Handshake</Badge>
            </InlineStack>
            {logMessages.length === 0 ? (
              <Text as="p" variant="small" tone="subdued">
                No events recorded yet. Open modal and modify preferences to inspect channel traffic.
              </Text>
            ) : (
              logMessages.map((log, index) => (
                <Text key={index} as="p" variant="small" tone="subdued">
                  <code>{log}</code>
                </Text>
              ))
            )}
          </BlockStack>
        </Box>

        <Modal
          id="preferences-modal"
          open={isOpen}
          onHide={cleanup}
          onClose={() => setIsOpen(false)}
          variant="max"
          src="/app/preferences/settings"
        >
          <TitleBar title="Settings &amp; Preferences" />

          {/* Host SaveBar attached to Modal, mirroring iframe state */}
          <SaveBar
            id="preferences-save-bar"
            open={saveState.visible}
            discardConfirmation
          >
            {/* First button = Save, Second button = Discard. App Bridge localized labels. */}
            <button
              type="button"
              variant="primary"
              loading={saveState.saving ? "" : undefined}
              disabled={saveState.disabled || saveState.saving}
              onClick={() => postToIframe("claimify-modal-save")}
            />
            <button
              type="button"
              disabled={saveState.saving}
              onClick={() => postToIframe("claimify-modal-discard")}
            />
          </SaveBar>

          {/* Simulated Iframe Interior (rendered in playground for inspection) */}
          <Box padding="large-100">
            <BlockStack gap="large-100">
              <Box
                padding="base"
                style={{
                  backgroundColor: "var(--p-color-bg-surface-info)",
                  borderRadius: "var(--p-border-radius-200)",
                  border: "1px solid var(--p-color-border-info)",
                }}
              >
                <InlineStack justifyContent="space-between" blockAlign="center">
                  <Text as="span" variant="small" tone="info">
                    <strong>Nested Iframe Context:</strong> Remount Key:{" "}
                    <code>resetKey={resetKey}</code>
                  </Text>
                  <Badge tone={hasChanges ? "warning" : "success"}>
                    {hasChanges ? "Iframe Dirty" : "Iframe Synced"}
                  </Badge>
                </InlineStack>
              </Box>

              <div key={`section-${resetKey}`}>
                <Card>
                  <BlockStack gap="base">
                    <Text as="h4" variant="base" fontWeight="bold">
                      Email &amp; Sender Configuration
                    </Text>

                    <TextField
                      label="Store Sender Email"
                      value={preferences.storeEmail}
                      onChange={(val) =>
                        setPreferences((prev) => ({ ...prev, storeEmail: val }))
                      }
                      helpText={
                        !isValid
                          ? "Must be a valid email address (host Save button is disabled while invalid)."
                          : undefined
                      }
                    />

                    <TextField
                      label="Sender Display Name"
                      value={preferences.senderName}
                      onChange={(val) =>
                        setPreferences((prev) => ({ ...prev, senderName: val }))
                      }
                    />

                    <Divider />

                    <InlineStack justifyContent="space-between" blockAlign="center">
                      <BlockStack gap="none">
                        <Text as="span" fontWeight="semibold">
                          Enable customer portal custom branding
                        </Text>
                        <Text as="span" tone="subdued" variant="small">
                          Inherit theme typography and color schemes.
                        </Text>
                      </BlockStack>
                      <Switch
                        checked={preferences.portalBranding}
                        onChange={(val) =>
                          setPreferences((prev) => ({ ...prev, portalBranding: val }))
                        }
                      />
                    </InlineStack>
                  </BlockStack>
                </Card>
              </div>

              <InlineStack gap="base" justifyContent="flex-end">
                <Button onClick={cleanup}>Close Modal</Button>
                <Button
                  variant="primary"
                  loading={saveState.saving}
                  disabled={!hasChanges || !isValid || saveState.saving}
                  onClick={() => postToIframe("claimify-modal-save")}
                >
                  Save (via BroadcastChannel)
                </Button>
              </InlineStack>
            </BlockStack>
          </Box>
        </Modal>
      </BlockStack>
    </Card>
  );
}
