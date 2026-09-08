import { useState } from "react";
import {
  Badge,
  BlockStack,
  Box,
  Button,
  Card,
  Divider,
  InlineStack,
  Text,
  TextField,
  useStorage,
} from "@xco-agency/corex-ui";

type DemoDataType = {
  text: string;
  count: number;
};

export function UseStorageDemo() {
  const [storageType, setStorageType] = useState<"session" | "local">("local");

  // Reactive storage hook with TTL expiration
  const [data, setData, remove] = useStorage<DemoDataType>({
    key: "corex_ui_storage_demo_data",
    storage: storageType,
    initialValue: { text: "Stored merchant preference", count: 1 },
    expiresIn: 60 * 24, // 24 hours
    syncTabs: true,
  });

  const [inputVal, setInputVal] = useState(data.text);

  const handleUpdateText = () => {
    setData((prev) => ({
      ...prev,
      text: inputVal,
    }));
  };

  const handleIncrement = () => {
    setData((prev) => ({
      ...prev,
      count: (prev?.count ?? 0) + 1,
    }));
  };

  const handleDecrement = () => {
    setData((prev) => ({
      ...prev,
      count: Math.max(0, (prev?.count ?? 0) - 1),
    }));
  };

  const handleClear = () => {
    remove();
    setInputVal("");
  };

  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack gap="base" justifyContent="space-between" blockAlign="center">
          <BlockStack gap="small-200">
            <Text as="h3" variant="base" heading>
              Reactive Browser Storage with TTL
            </Text>
            <Text as="p" color="subdued">
              Syncs state across browser tabs with automatic JSON serialization, TTL
              expiration, and instant reactive re-renders.
            </Text>
          </BlockStack>
          <InlineStack gap="small-100" blockAlign="center">
            <Badge tone="info">
              {storageType === "local" ? "localStorage" : "sessionStorage"}
            </Badge>
            <Badge tone="success">Multi-Tab Synced</Badge>
          </InlineStack>
        </InlineStack>

        <InlineStack gap="small-200" blockAlign="center">
          <Text as="span" variant="small" color="subdued">
            Storage Engine:
          </Text>
          <Button
            variant={storageType === "local" ? "primary" : "secondary"}
            onClick={() => setStorageType("local")}
          >
            localStorage (Persistent)
          </Button>
          <Button
            variant={storageType === "session" ? "primary" : "secondary"}
            onClick={() => setStorageType("session")}
          >
            sessionStorage (Tab Lifecycle)
          </Button>
        </InlineStack>

        <Divider />

        {/* Live Stored Value Preview */}
        <Box
          padding="base"
          style={{
            background: "var(--p-color-bg-surface-secondary)",
            borderRadius: "8px",
            border: "1px solid var(--p-color-border)",
          }}
        >
          <BlockStack gap="small-200">
            <Text as="span" variant="small" heading>
              Live Stored Object:
            </Text>
            <Text as="p" variant="small">
              <code>{JSON.stringify(data, null, 2)}</code>
            </Text>
          </BlockStack>
        </Box>

        {/* Form controls */}
        <InlineStack gap="base" blockAlign="end" wrap>
          <TextField
            label="Stored Text Value"
            value={inputVal}
            onChange={setInputVal}
            placeholder="Type any value..."
          />
          <Button variant="primary" onClick={handleUpdateText}>
            Save Text
          </Button>
        </InlineStack>

        <InlineStack gap="base" justifyContent="space-between" blockAlign="center" wrap>
          <InlineStack gap="small-200" blockAlign="center">
            <Text as="span" variant="small" heading>
              Counter:
            </Text>
            <Badge tone="warning">{String(data?.count ?? 0)}</Badge>
            <Button onClick={handleIncrement}>+ Increment</Button>
            <Button onClick={handleDecrement}>- Decrement</Button>
          </InlineStack>

          <Button tone="critical" onClick={handleClear}>
            Remove from Storage
          </Button>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}
