import { useState } from "react";
import {
  Box,
  BlockStack,
  InlineStack,
  Button,
  Text,
  Badge,
  Divider,
  TextField,
  Popover,
  usePopover,
} from "@xco-agency/corex-ui";

function PopoverFilterForm({
  currentFilter,
  onApply,
}: {
  currentFilter: string;
  onApply: (val: string) => void;
}) {
  const { close } = usePopover();
  const [value, setValue] = useState(currentFilter);

  const handleApply = () => {
    onApply(value);
    close();
  };

  const handleCancel = () => {
    close();
  };

  return (
    <Box padding="base">
      <BlockStack gap="small-300">
        <InlineStack justifyContent="space-between" alignItems="center">
          <Text variant="base" heading as="h4">
            Filter Customers
          </Text>
          <Badge tone="info">Live</Badge>
        </InlineStack>
        <Text as="p" variant="small" color="subdued">
          Enter a keyword to filter customer records.
        </Text>
        <TextField
          label="Search keyword"
          labelAccessibilityVisibility="exclusive"
          placeholder="e.g. VIP, Wholesale"
          value={value}
          onChange={(val) => setValue(val)}
        />
        <Divider />
        <InlineStack justifyContent="end" alignItems="center" gap="small-200">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button variant="primary" onClick={handleApply}>
            Apply
          </Button>
        </InlineStack>
      </BlockStack>
    </Box>
  );
}

export function PopoverExample() {
  const [filter, setFilter] = useState<string>("");

  return (
    <BlockStack gap="base">
      <InlineStack
        gap="small-200"
        alignItems="center"
        inlineSize="400px"
        position="relative"
      >
        <Popover>
          <Popover.Trigger>
            <Button icon="filter" inlineSize="fill">
              Filter
            </Button>
          </Popover.Trigger>
          <Popover.Content fitTrigger>
            <PopoverFilterForm currentFilter={filter} onApply={(val) => setFilter(val)} />
          </Popover.Content>
        </Popover>
      </InlineStack>
    </BlockStack>
  );
}
