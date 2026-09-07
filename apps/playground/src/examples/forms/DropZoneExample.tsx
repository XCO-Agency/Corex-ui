import { useState } from "react";
import { BlockStack, Card, DropZone, Grid, Text } from "@xco-agency/corex-ui";

export function DropZoneExample() {
  const [status, setStatus] = useState("No files uploaded yet");

  return (
    <Grid columns={2} gap="base">
      <Grid.Item>
        <Card>
          <BlockStack gap="base">
            <DropZone
              label="Product images"
              accept="image/*"
              multiple
              accessibilityLabel="Upload product images"
              details="Supported formats: JPG, PNG, WEBP (up to 10MB each)"
              onChange={() => setStatus("Files selected via file browser / drag")}
              onDropRejected={() => setStatus("Dropped file was rejected")}
            />
            <Text variant="small" tone="subdued">{status}</Text>
          </BlockStack>
        </Card>
      </Grid.Item>

      <Grid.Item>
        <Card>
          <BlockStack gap="base">
            <DropZone
              label="CSV bulk import"
              accept=".csv"
              details="Upload single CSV file for inventory sync"
              onChange={() => setStatus("CSV file ready for processing")}
            />
          </BlockStack>
        </Card>
      </Grid.Item>
    </Grid>
  );
}
