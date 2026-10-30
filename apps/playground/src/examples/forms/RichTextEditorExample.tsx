import { useState } from "react";
import { BlockStack, Card, RichTextEditor, Text } from "@xco-agency/corex-ui";

export function RichTextEditorExample() {
  const [html, setHtml] = useState(
    "<p>Write product descriptions, announcements, and page content with Shopify-style formatting.</p>",
  );

  return (
    <BlockStack gap="base">
      <Card>
        <RichTextEditor
          label="Description"
          value={html}
          onChange={setHtml}
          placeholder="Start typing…"
          minHeight="220px"
        />
      </Card>
      <BlockStack gap="small-100">
        <Text variant="bodySm" color="subdued" fontWeight="medium">
          HTML output
        </Text>
        <Text variant="bodySm" color="subdued">
          {html}
        </Text>
      </BlockStack>
    </BlockStack>
  );
}
