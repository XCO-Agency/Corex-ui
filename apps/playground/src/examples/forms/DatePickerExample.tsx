import { useState } from "react";
import { DatePicker, BlockStack, Box, Text } from "@xco-agency/corex-ui";
import type { DateRangeType } from "@xco-agency/corex-ui";

export function DatePickerExample() {
  const [range, setRange] = useState<DateRangeType>({
    start: "2026-01-01",
    end: "2026-09-05",
  });

  return (
    <BlockStack gap="600">
      <Box padding="200">
        <BlockStack gap="200">
          <Text as="h4" heading>
            Popover Mode with Presets & Date Range
          </Text>
          <DatePicker
            selected={range}
            presets={true}
            onApply={(newRange) => setRange(newRange)}
          />
          <Text as="p" color="subdued">
            Active range: {range.start} to {range.end}
          </Text>
        </BlockStack>
      </Box>

      <Box padding="200">
        <BlockStack gap="200">
          <Text as="h4" heading>
            Inline Mode
          </Text>
          <DatePicker
            inline
            selected={range}
            presets={true}
            onApply={(newRange) => setRange(newRange)}
          />
        </BlockStack>
      </Box>
    </BlockStack>
  );
}
