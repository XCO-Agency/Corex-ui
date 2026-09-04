import { useState } from "react";
import {
  Clickable,
  Card,
  BlockStack,
  InlineStack,
  Text,
  Badge,
  Icon,
  Banner,
} from "@xco/corex-ui";

export function ClickableExample() {
  const [clickCount, setClickCount] = useState<number>(0);
  const [lastClickedItem, setLastClickedItem] = useState<string>("None");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const items = [
    { id: "orders", title: "Manage Orders", badge: "12 Pending", icon: "package" },
    { id: "customers", title: "Customer Audiences", badge: "Active", icon: "customer" },
    { id: "discounts", title: "Promotions & Discounts", badge: "3 Running", icon: "discount" },
  ];

  const handleSimulatedAsyncAction = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setClickCount((c) => c + 1);
      setLastClickedItem("Simulated Async Action");
    }, 1200);
  };

  return (
    <BlockStack gap="400">
      <Banner tone="info">
        <Text as="p">
          Clickable (and its alias ClickableAction) directly exposes Polaris <code>&lt;s-clickable&gt;</code>,
          inheriting full <strong>BoxProps</strong> (background, border, padding, dimensions, overflow)
          along with action properties (href/url, target, loading, disabled, download, command).
        </Text>
      </Banner>

      <Card>
        <BlockStack gap="400">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text as="h3" variant="headingSm">
              Interactive Box Rows with BoxProps
            </Text>
            <Badge tone="info">{`Clicks: ${clickCount}`}</Badge>
          </div>

          <Text as="p" tone="neutral">
            Last activated item: <strong>{lastClickedItem}</strong>
          </Text>

          <BlockStack gap="200">
            {items.map((item) => (
              <Clickable
                key={item.id}
                background="base"
                borderWidth="small-100"
                borderColor="subdued"
                borderRadius="base"
                padding="base"
                accessibilityLabel={item.title}
                onClick={() => {
                  setClickCount((c) => c + 1);
                  setLastClickedItem(item.title);
                }}
                style={{
                  display: "block",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background-color 0.15s ease, border-color 0.15s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <InlineStack gap="300" blockAlign="center">
                    <Icon source={item.icon} />
                    <Text as="span" variant="bodyMd" fontWeight="semibold">
                      {item.title}
                    </Text>
                  </InlineStack>
                  <Badge tone="neutral">{item.badge}</Badge>
                </div>
              </Clickable>
            ))}
          </BlockStack>
        </BlockStack>
      </Card>

      <Card>
        <BlockStack gap="300">
          <Text as="h3" variant="headingSm">
            Loading, Navigation & Disabled Action Props
          </Text>

          <InlineStack gap="300">
            {/* Loading Action */}
            <Clickable
              loading={isLoading}
              background="subdued"
              borderWidth="small-100"
              borderColor="subdued"
              borderRadius="base"
              padding="small"
              onClick={handleSimulatedAsyncAction}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <Icon source="sparkles" />
              <Text as="span" variant="bodySm" fontWeight="medium">
                {isLoading ? "Processing..." : "Trigger Async Action"}
              </Text>
            </Clickable>

            {/* External Navigation Link */}
            <Clickable
              url="https://shopify.dev/docs/api/app-home/polaris-web-components"
              external
              background="subdued"
              borderWidth="small-100"
              borderColor="subdued"
              borderRadius="base"
              padding="small"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <Icon source="link" />
              <Text as="span" variant="bodySm" fontWeight="medium">
                Shopify Web Components Docs
              </Text>
            </Clickable>

            {/* Disabled Action */}
            <Clickable
              disabled
              background="subdued"
              borderWidth="small-100"
              borderColor="subdued"
              borderRadius="base"
              padding="small"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                opacity: 0.5,
                cursor: "not-allowed",
              }}
            >
              <Text as="span" variant="bodySm" tone="neutral">
                Disabled Clickable Action
              </Text>
            </Clickable>
          </InlineStack>
        </BlockStack>
      </Card>
    </BlockStack>
  );
}
