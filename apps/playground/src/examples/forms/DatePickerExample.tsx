import { useState } from "react";
import { DatePicker, SDatePicker, BlockStack, Box, Text } from "@xco-agency/corex-ui";
import type { DateRangeType } from "@xco-agency/corex-ui";

export function DatePickerExample() {
  const [range, setRange] = useState<DateRangeType>({
    start: "2025-05-20",
    end: "2025-06-10",
  });

  return (
    <BlockStack gap="large-200">
      <Box padding="base" background="base" borderRadius="base" borderWidth="small-100" borderColor="subdued">
        <BlockStack gap="small-100">
          <Text heading>
            Popover DatePicker (2-Month View & Presets)
          </Text>
          <DatePicker
            type="range"
            name="reporting-period"
            visibleMonths="2"
            view="2025-05"
            selected={range}
            presets={true}
            onApply={(newRange) => setRange(newRange)}
          />
          <Text color="subdued">
            Active range: {range.start} to {range.end}
          </Text>
        </BlockStack>
      </Box>

      <Box padding="base" background="base" borderRadius="base" borderWidth="small-100" borderColor="subdued">
        <BlockStack gap="small-100">
          <Text heading>
            Inline DatePicker (2-Month View & Presets)
          </Text>
          <DatePicker
            inline
            type="range"
            name="reporting-period"
            visibleMonths="2"
            view="2025-05"
            selected={range}
            presets={true}
            onApply={(newRange) => setRange(newRange)}
          />
        </BlockStack>
      </Box>
      
    </BlockStack>
  );
}
