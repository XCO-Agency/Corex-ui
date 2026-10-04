import { BlockStack, Button, Card, Modal, Text, TitleBar } from "@xco-agency/corex-ui";
import { useState } from "react";

export function TitleBarExample() {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <BlockStack gap="base">
        <Text heading>App Bridge Modal with TitleBar</Text>
        <Text color="subdued">
          TitleBar wraps the native ui-title-bar component for Shopify App Bridge modals.
        </Text>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>

        <Modal open={open} onClose={() => setOpen(false)}>
          <TitleBar title="Export Customers">
            <Button variant="primary" onClick={() => setOpen(false)}>
              Export
            </Button>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
          </TitleBar>
          <Card>
            <Text>Select your preferred export format and destination.</Text>
          </Card>
        </Modal>
      </BlockStack>
    </Card>
  );
}
