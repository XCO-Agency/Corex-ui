import { useState } from "react";
import {
  Badge,
  BlockStack,
  Button,
  Card,
  Divider,
  InlineStack,
  SaveBar,
  Text,
  useSaveBar,
} from "@xco-agency/corex-ui";

export function UseSaveBarDemo() {
  const saveBar = useSaveBar();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLogs((prev) => [`[${time}] ${msg}`, ...prev.slice(0, 4)]);
  };

  const handleShow = () => {
    setIsOpen(true);
    saveBar.show("demo-utils-savebar");
    addLog("saveBar.show('demo-utils-savebar') called");
  };

  const handleHide = () => {
    setIsOpen(false);
    saveBar.hide("demo-utils-savebar");
    addLog("saveBar.hide('demo-utils-savebar') called");
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    saveBar.toggle("demo-utils-savebar");
    addLog("saveBar.toggle('demo-utils-savebar') called");
  };

  const handleLeaveConfirm = async () => {
    addLog("saveBar.leaveConfirmation() requested");
    await saveBar.leaveConfirmation();
    addLog("leaveConfirmation completed");
  };

  const handleSave = () => {
    setIsLoading(true);
    addLog("Merchant clicked Save. Saving data...");
    setTimeout(() => {
      setIsLoading(false);
      setIsOpen(false);
      addLog("Save complete! SaveBar hidden.");
    }, 1000);
  };

  const handleDiscard = () => {
    setIsOpen(false);
    addLog("Merchant clicked Discard. Form reset.");
  };

  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack gap="base" justifyContent="space-between" blockAlign="center">
          <BlockStack gap="small-200">
            <Text as="h3" variant="base" heading>
              App Bridge SaveBar Controller
            </Text>
            <Text as="p" color="subdued">
              Controls the Shopify native top save bar imperatively with id-scoping and
              confirmation.
            </Text>
          </BlockStack>
          <Badge tone={isOpen ? "warning" : "info"}>
            {isOpen ? "SaveBar Active" : "SaveBar Idle"}
          </Badge>
        </InlineStack>

        <Divider />

        <InlineStack gap="small-200" wrap>
          <Button variant="primary" onClick={handleShow}>
            Show
          </Button>
          <Button onClick={handleHide}>Hide</Button>
          <Button onClick={handleToggle}>Toggle</Button>
          <Button onClick={handleLeaveConfirm}>Leave Confirmation</Button>
        </InlineStack>

        <SaveBar
          id="demo-utils-savebar"
          open={isOpen}
          loading={isLoading}
          onSave={handleSave}
          onDiscard={handleDiscard}
          saveText="Save changes"
          discardText="Discard"
        />

        <Divider />

        <BlockStack gap="small-100">
          <Text as="span" variant="small" color="subdued">
            Hook Activity Log:
          </Text>
          {logs.length === 0 ? (
            <Text as="p" variant="small" color="subdued">
              No actions triggered yet. Click one of the buttons above.
            </Text>
          ) : (
            logs.map((log, idx) => (
              <Text key={idx} as="p" variant="small">
                <code>{log}</code>
              </Text>
            ))
          )}
        </BlockStack>
      </BlockStack>
    </Card>
  );
}
