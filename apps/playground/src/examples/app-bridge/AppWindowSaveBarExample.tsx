import { useState } from "react";
import {
  AppWindow,
  Badge,
  BlockStack,
  Button,
  Card,
  InlineStack,
  Text,
} from "@xco-agency/corex-ui";

export function AppWindowSaveBarExample() {
  const [lastEvent, setLastEvent] = useState<string>("None");
  const [eventCount, setEventCount] = useState<number>(0);

  const handleSave = () => {
    setLastEvent("Host onSave fired (forwarded to child)");
    setEventCount((prev) => prev + 1);
  };

  const handleDiscard = () => {
    setLastEvent("Host onDiscard fired (forwarded to child)");
    setEventCount((prev) => prev + 1);
  };

  return (
    <Card>
      <BlockStack gap="base">
        <Text as="p" color="subdued">
          With the <code>saveBar</code> prop enabled, <code>&lt;AppWindow&gt;</code>{" "}
          automatically mounts a host <code>SaveBar</code> and bridges state (open,
          loading, disabled) and actions (Save, Discard) with{" "}
          <code>useAppWindowSaveBar</code> inside the iframe.
        </Text>

        <InlineStack gap="base" justifyContent="space-between" blockAlign="center">
          <InlineStack gap="small-200" blockAlign="center">
            <Button
              command="--show"
              commandFor="demo-app-window-savebar"
              variant="primary"
            >
              Open AppWindow
            </Button>
            <Button command="--hide" commandFor="demo-app-window-savebar">
              Close AppWindow
            </Button>
          </InlineStack>

          <InlineStack gap="small-200" blockAlign="center">
            <Text as="span" color="subdued">
              Host SaveBar callback:
            </Text>
            <Badge tone="info">{lastEvent}</Badge>
            {eventCount > 0 && <Badge tone="success">{`Triggered ${eventCount}x`}</Badge>}
          </InlineStack>
        </InlineStack>

        <AppWindow
          id="demo-app-window-savebar"
          src="/app-window-content.html"
          saveBar={{
            onSave: handleSave,
            onDiscard: handleDiscard,
            saveText: "Save changes",
            discardText: "Discard",
          }}
        />
      </BlockStack>
    </Card>
  );
}
