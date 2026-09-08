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
  useParams,
} from "@xco-agency/corex-ui";

export function UseParamsDemo() {
  const { params, shop, host, locale, setParam, setParams, get } = useParams();
  const [paramKey, setParamKey] = useState("filter");
  const [paramValue, setParamValue] = useState("active");

  const handleApply = () => {
    if (paramKey.trim()) {
      setParam(paramKey.trim(), paramValue.trim() || null);
    }
  };

  const handleSetShopPreset = () => {
    setParams({
      shop: "quickstart-app.myshopify.com",
      host: "YWRtaW4uc2hvcGlmeS5jb20vc3RvcmUvcXVpY2tzdGFydA",
      locale: "en",
    });
  };

  const handleClearShopPreset = () => {
    setParams({
      shop: null,
      host: null,
      locale: null,
    });
  };

  const currentParamEntries = Object.entries(params);

  return (
    <Card>
      <BlockStack gap="base">
        <InlineStack gap="base" justifyContent="space-between" blockAlign="center">
          <BlockStack gap="small-200">
            <Text as="h3" variant="base" heading>
              Shopify App Embed URL Parameters
            </Text>
            <Text as="p" color="subdued">
              Safely parses standard Shopify embedded params (<code>shop</code>,{" "}
              <code>host</code>, <code>locale</code>) and updates URL query strings
              in-place without page reloads.
            </Text>
          </BlockStack>
          <Badge tone="info">{`${currentParamEntries.length} Params Active`}</Badge>
        </InlineStack>

        <Divider />

        {/* Standard Shopify Attributes */}
        <Box padding="base" borderRadius="large" border="base" background="base">
          <BlockStack gap="small-200">
            <Text as="span" variant="small" heading>
              Shopify Embedded Session Context:
            </Text>
            <InlineStack gap="small-200" wrap blockAlign="center">
              <InlineStack gap="small-100" blockAlign="center">
                <Text as="span" variant="xs" color="subdued">
                  shop:
                </Text>
                <Badge tone={shop ? "success" : "neutral"}>{shop ?? "none"}</Badge>
              </InlineStack>

              <InlineStack gap="small-100" blockAlign="center">
                <Text as="span" variant="xs" color="subdued">
                  host:
                </Text>
                <Badge tone={host ? "success" : "neutral"}>
                  {host ? `${host.slice(0, 12)}...` : "none"}
                </Badge>
              </InlineStack>

              <InlineStack gap="small-100" blockAlign="center">
                <Text as="span" variant="xs" color="subdued">
                  locale:
                </Text>
                <Badge tone={locale ? "info" : "neutral"}>{locale ?? "none"}</Badge>
              </InlineStack>
            </InlineStack>
          </BlockStack>
        </Box>

        {/* Mutate Parameters */}
        <InlineStack gap="base" blockAlign="end" wrap>
          <TextField
            label="Parameter Key"
            value={paramKey}
            onChange={setParamKey}
            placeholder="e.g. tab, sort, query"
          />
          <TextField
            label="Parameter Value"
            value={paramValue}
            onChange={setParamValue}
            placeholder="e.g. billing, asc"
          />
          <Button variant="primary" onClick={handleApply}>
            Set Parameter
          </Button>
          <Button
            onClick={() => {
              if (paramKey.trim()) setParam(paramKey.trim(), null);
            }}
          >
            Remove Key
          </Button>
        </InlineStack>

        <InlineStack gap="small-200" wrap>
          <Button onClick={handleSetShopPreset}>Load Sample Shopify Params</Button>
          <Button onClick={handleClearShopPreset}>Clear Shopify Params</Button>
        </InlineStack>

        <Divider />

        {/* Current URL search list */}
        <BlockStack gap="small-100">
          <Text as="span" variant="small" color="subdued">
            All Current Search Parameters:
          </Text>
          {currentParamEntries.length === 0 ? (
            <Text as="p" variant="small" color="subdued">
              No query parameters currently present in URL.
            </Text>
          ) : (
            currentParamEntries.map(([k, v]) => (
              <InlineStack key={k} gap="small-200" blockAlign="center">
                <Badge tone="info">{k}</Badge>
                <Text as="span" variant="small">
                  = <code>{v}</code>
                </Text>
              </InlineStack>
            ))
          )}
        </BlockStack>
      </BlockStack>
    </Card>
  );
}
