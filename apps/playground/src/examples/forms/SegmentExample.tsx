import { useState } from "react";
import { BlockStack, Card, Segment, Text } from "@xco-agency/corex-ui";

export function SegmentExample() {
  const [quantity, setQuantity] = useState("min");
  const [qtyStyle, setQtyStyle] = useState("dropdown");
  const [variant, setVariant] = useState("primary");
  const [size, setSize] = useState("base");

  return (
    <BlockStack gap="large-200">
      <Card>
        <BlockStack gap="base">
          <Text heading as="h3">
            Default variant
          </Text>
          <Text color="subdued">
            White elevated pill on a light track. Label is optional and hidden
            unless provided.
          </Text>
          <Segment
            label="Default quantity"
            options={[
              { label: "Min (1)", value: "min" },
              { label: "Max (purchased)", value: "max" },
            ]}
            value={quantity}
            onChange={setQuantity}
            inlineSize="fill"
          />
          <Segment
            label="Qty style"
            options={[
              { label: "Stepper", value: "stepper" },
              { label: "Dropdown", value: "dropdown" },
              { label: "Input", value: "input" },
            ]}
            value={qtyStyle}
            onChange={setQtyStyle}
            inlineSize="fill"
          />
          <Text color="subdued">
            Selected: {quantity} / {qtyStyle}
          </Text>
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="base">
          <Text heading as="h3">
            Primary variant
          </Text>
          <Text color="subdued">
            Dark filled active pill with light text on the same track.
          </Text>
          <Segment
            label="Variant"
            variant="primary"
            options={[
              { label: "Primary", value: "primary" },
              { label: "Secondary", value: "secondary" },
              { label: "Plain", value: "plain" },
            ]}
            value={variant}
            onChange={setVariant}
            inlineSize="fill"
          />
          <Text color="subdued">Selected: {variant}</Text>
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="base">
          <Text heading as="h3">
            Without label
          </Text>
          <Segment
            options={[
              { label: "Day", value: "day" },
              { label: "Week", value: "week" },
              { label: "Month", value: "month" },
            ]}
            defaultValue="week"
          />
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="base">
          <Text heading as="h3">
            Sizes
          </Text>
          <Segment
            label="Size"
            size="small"
            options={[
              { label: "Small", value: "small" },
              { label: "Base", value: "base" },
              { label: "Large", value: "large" },
            ]}
            value={size}
            onChange={setSize}
          />
          <Segment
            size="base"
            options={[
              { label: "Small", value: "small" },
              { label: "Base", value: "base" },
              { label: "Large", value: "large" },
            ]}
            value={size}
            onChange={setSize}
          />
          <Segment
            size="large"
            variant="primary"
            options={[
              { label: "Small", value: "small" },
              { label: "Base", value: "base" },
              { label: "Large", value: "large" },
            ]}
            value={size}
            onChange={setSize}
          />
        </BlockStack>
      </Card>
    </BlockStack>
  );
}

export default SegmentExample;
