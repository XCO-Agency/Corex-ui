import { useState } from "react";
import {
  BlockStack,
  Card,
  DropZone,
  Grid,
  InlineStack,
  Text,
} from "@xco-agency/corex-ui";

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
            <Text variant="small" color="subdued">
              {status}
            </Text>
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

      <Grid.Item>
        <Card>
          <BlockStack gap="base">
            <Text variant="headingSm">Square icon-only</Text>
            <InlineStack gap="base" alignItems="center">
              <DropZone
                size="small"
                label="Media"
                accessibilityLabel="Upload image"
                accept="image/*"
                onChange={() => setStatus("Square drop zone selected a file")}
              />
              <DropZone
                size="small"
                inlineSize="6rem"
                icon="plus"
                label="Add asset"
                accessibilityLabel="Add asset"
                accept="image/*"
                onChange={() => setStatus("Plus icon drop zone selected a file")}
              />
            </InlineStack>
            <Text variant="small" color="subdued">
              Use `size="small"` for a square surface with only a centered icon.
            </Text>
          </BlockStack>
        </Card>
      </Grid.Item>

      <Grid.Item>
        <Card>
          <BlockStack gap="base">
            <Text variant="headingSm">Fill a grid cell</Text>
            <Grid columns={4} gap="small">
              <Grid.Item>
                <DropZone
                  size="small"
                  inlineSize="fill"
                  label="Tile upload"
                  accessibilityLabel="Upload tile image"
                  accept="image/*"
                  onChange={() => setStatus("Grid cell drop zone selected a file")}
                />
              </Grid.Item>
            </Grid>
          </BlockStack>
        </Card>
      </Grid.Item>
    </Grid>
  );
}
