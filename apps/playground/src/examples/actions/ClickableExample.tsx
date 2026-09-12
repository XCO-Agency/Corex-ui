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
} from "@xco-agency/corex-ui";
import { IconType } from "@xco-agency/corex-ui";

export function ClickableExample() {
  const [clickCount, setClickCount] = useState<number>(0);
  const [lastClickedItem, setLastClickedItem] = useState<string>("None");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const items = [
    { id: "orders", title: "Manage Orders", badge: "12 Pending", icon: "package" },
    { id: "customers", title: "Customer Audiences", badge: "Active", icon: "person" },
    {
      id: "discounts",
      title: "Promotions & Discounts",
      badge: "3 Running",
      icon: "discount",
    },
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
          Clickable (and its alias ClickableAction) directly exposes Polaris{" "}
          <code>&lt;s-clickable&gt;</code>, inheriting full <strong>BoxProps</strong>{" "}
          (background, border, padding, dimensions, overflow) along with action properties
          (href/url, target, loading, disabled, download, command).
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
            <Text as="h3" heading>
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
                inlineSize="fill"
                borderRadius="base"
                padding="base"
                accessibilityLabel={item.title}
                onClick={() => {
                  setClickCount((c) => c + 1);
                  setLastClickedItem(item.title);
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <InlineStack gap="300" alignItems="center">
                    <Icon type={item.icon as IconType} />
                    <Text as="span">{item.title}</Text>
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
          <Text as="h3" heading>
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
            >
              <InlineStack gap="small" alignItems="center">
                <Icon type="bolt" />
                <Text as="span">
                  {isLoading ? "Processing..." : "Trigger Async Action"}
                </Text>
              </InlineStack>
            </Clickable>

            {/* External Navigation Link */}
            <Clickable
              href="https://shopify.dev/docs/api/app-home/polaris-web-components"
              external
              background="subdued"
              borderWidth="small-100"
              borderColor="subdued"
              borderRadius="base"
              padding="small"
            >
              <InlineStack gap="small" alignItems="center">
                <Icon type="link" />
                <Text as="span">Shopify Web Components Docs</Text>
              </InlineStack>
            </Clickable>

            {/* Disabled Action */}
            <Clickable
              disabled
              background="subdued"
              borderWidth="small-100"
              borderColor="subdued"
              borderRadius="base"
              padding="small"
            >
              <Text as="span" tone="neutral">
                Disabled Clickable Action
              </Text>
            </Clickable>
          </InlineStack>
        </BlockStack>
      </Card>
    </BlockStack>
  );
}
