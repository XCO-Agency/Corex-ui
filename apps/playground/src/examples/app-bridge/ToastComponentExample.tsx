import { useState } from "react";
import { BlockStack, Button, Card, Text, Toast } from "@xco-agency/corex-ui";

/**
 * v12 mounted a Toast element conditionally. The component keeps that shape and
 * raises App Bridge's toast, so it only appears inside a real embedded admin
 * session; `useToast()` is the better call in new code.
 */
export function ToastComponentExample() {
  const [saved, setSaved] = useState(false);

  return (
    <Card>
      <BlockStack gap="small-200">
        <Text>Mount the component to raise a toast, as v12 did.</Text>
        <Button variant="primary" onClick={() => setSaved(true)}>
          Save changes
        </Button>
        {saved ? (
          <Toast content="Changes saved" onDismiss={() => setSaved(false)} />
        ) : null}
      </BlockStack>
    </Card>
  );
}
