import { useState } from "react";
import { BlockStack, Card, InlineError, TextField } from "@xco-agency/corex-ui";

export function InlineErrorExample() {
  const [email, setEmail] = useState("not-an-email");
  const error = email.includes("@") ? undefined : "Enter a valid email address";

  return (
    <Card>
      <BlockStack gap="small-300">
        <TextField
          id="email"
          label="Notification email"
          value={email}
          onChange={setEmail}
        />
        <InlineError message={error} fieldID="email" />
      </BlockStack>
    </Card>
  );
}
