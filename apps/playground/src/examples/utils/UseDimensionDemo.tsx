import { useState } from "react";
import {
  Badge,
  BlockStack,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  InlineStack,
  Text,
  useDimension,
} from "@xco-agency/corex-ui";
import { ToneType } from "@xco-agency/corex-ui";

export function UseDimensionDemo() {
  const [containerWidth, setContainerWidth] = useState<string>("100%");
  const { width, height, breakpoint, isXs, isSm, isMd, isLg, ref } = useDimension({
    debounceMs: 50,
  });

  const getBreakpointTone = (bp: string): ToneType => {
    switch (bp) {
      case "xs":
        return "caution";
      case "sm":
        return "info";
      case "md":
        return "warning";
      case "lg":
      default:
        return "success";
    }
  };

  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack gap="base" justifyContent="space-between" alignItems="center">
          <BlockStack gap="small-200">
            <Text as="h3" variant="base" heading>
              Responsive Dimension &amp; Breakpoints
            </Text>
            <Text as="p" color="subdued">
              Observes element or window resize with Polaris breakpoints (
              <code>xs &lt; 490px</code>, <code>sm &lt; 768px</code>,{" "}
              <code>md &lt; 1040px</code>, <code>lg &ge; 1040px</code>).
            </Text>
          </BlockStack>
          <Badge tone={getBreakpointTone(breakpoint)}>
            {`Breakpoint: ${breakpoint.toUpperCase()}`}
          </Badge>
        </InlineStack>

        <InlineStack gap="small-200" wrap alignItems="center">
          <Text as="span" variant="small" color="subdued">
            Container Width Preset:
          </Text>
          <Button
            variant={containerWidth === "380px" ? "primary" : "secondary"}
            onClick={() => setContainerWidth("380px")}
          >
            380px (XS)
          </Button>
          <Button
            variant={containerWidth === "580px" ? "primary" : "secondary"}
            onClick={() => setContainerWidth("580px")}
          >
            580px (SM)
          </Button>
          <Button
            variant={containerWidth === "880px" ? "primary" : "secondary"}
            onClick={() => setContainerWidth("880px")}
          >
            880px (MD)
          </Button>
          <Button
            variant={containerWidth === "100%" ? "primary" : "secondary"}
            onClick={() => setContainerWidth("100%")}
          >
            100% (Auto)
          </Button>
        </InlineStack>

        <Divider />

        {/* Live observed container */}
        <div
          style={{
            width: containerWidth,
            maxWidth: "100%",
            transition: "width 0.3s ease",
          }}
        >
          <Box
            ref={ref}
            padding="base"
            borderRadius="large"
            border="base"
            background="base"
          >
            <BlockStack gap="base">
              <InlineStack
                gap="base"
                justifyContent="space-between"
                alignItems="center"
                wrap
              >
                <InlineStack gap="small-200" alignItems="center">
                  <Text as="span" variant="small" heading>
                    Observed Size:
                  </Text>
                  <Badge tone="info">{`${Math.round(width)}px × ${Math.round(height)}px`}</Badge>
                </InlineStack>

                <InlineStack gap="small-100" alignItems="center">
                  <Badge tone={isXs ? "critical" : "neutral"}>isXs</Badge>
                  <Badge tone={isSm ? "caution" : "neutral"}>isSm</Badge>
                  <Badge tone={isMd ? "warning" : "neutral"}>isMd</Badge>
                  <Badge tone={isLg ? "success" : "neutral"}>isLg</Badge>
                </InlineStack>
              </InlineStack>

              {/* Dynamic Responsive Layout */}
              <Grid columns={isXs ? 1 : isSm ? 2 : 3} gap="small-200">
                <Box
                  padding="small-200"
                  borderRadius="large"
                  border="base"
                  background="base"
                >
                  <Text as="p" variant="small" heading>
                    Metric Column 1
                  </Text>
                  <Text as="p" variant="xs" color="subdued">
                    {isXs ? "Stacked full-width" : "Grid column"}
                  </Text>
                </Box>
                <Box
                  padding="small-200"
                  borderRadius="large"
                  border="base"
                  background="base"
                >
                  <Text as="p" variant="small" heading>
                    Metric Column 2
                  </Text>
                  <Text as="p" variant="xs" color="subdued">
                    Adapts to breakpoint
                  </Text>
                </Box>
                <Box
                  padding="small-200"
                  borderRadius="large"
                  border="base"
                  background="base"
                >
                  <Text as="p" variant="small" heading>
                    Metric Column 3
                  </Text>
                  <Text as="p" variant="xs" color="subdued">
                    Hidden on single-col
                  </Text>
                </Box>
              </Grid>
            </BlockStack>
          </Box>
        </div>
      </BlockStack>
    </Card>
  );
}
