import * as React from "react";
import {
  Navigation,
  BlockStack,
  Text,
  Page,
  type NavigationItemType,
  InlineStack,
} from "@xco-agency/corex-ui";

export function NavigationSettingsExample() {
  const [selectedNav, setSelectedNav] = React.useState("social");

  const navigationSections: { items: NavigationItemType[]; title: string }[] = [
    {
      title: "REVIEW COLLECTION",
      items: [
        {
          id: "import",
          label: "Import reviews",
          icon: "import",
        },
        {
          id: "request",
          label: "Request reviews",
          icon: "send",
        },
        {
          id: "scheduling",
          label: "Request scheduling",
          icon: "clock",
        },
        {
          id: "templates",
          label: "Email templates",
          icon: "email",
        },
        {
          id: "products",
          label: "Product management",
          icon: "product",
        },
        {
          id: "bundles",
          label: "Bundles",
          icon: "package",
        },
        {
          id: "flow",
          label: "Collection flow",
          icon: "git-branch",
        },
        {
          id: "optimize",
          label: "Optimize collection",
          icon: "bolt",
        },
        {
          id: "moderation",
          label: "Moderation",
          icon: "thumbs-up",
        },
      ],
    },
    {
      title: "REVIEW DISPLAY",
      items: [
        {
          id: "widgets",
          label: "Widgets",
          icon: "star",
        },
        {
          id: "product-groups",
          label: "Product groups",
          icon: "link",
        },
        {
          id: "social",
          label: "Social sharing",
          icon: "chat",
        },
        {
          id: "seo",
          label: "Google, SEO and AI",
          icon: "search",
        },
      ],
    },
    {
      title: "DISCOUNT AND REWARDS",
      items: [
        {
          id: "coupons",
          label: "Coupons",
          icon: "discount",
        },
        {
          id: "referrals",
          label: "Referrals",
          icon: "person",
        },
      ],
    },
  ];

  return (
    <Page inlineSize="base">
      {/* Left Sidebar: Vertical Navigation */}
      <InlineStack gap="large">
        <Navigation inlineSize="220px" sectionned defaultSelected="social">
          <Navigation.Search onChange={(e) => console.log(e)} />

          {navigationSections.map((item, index) => (
            <Navigation.Section key={index} title={item.title}>
              {item.items.map((item, index) => (
                <Navigation.Item
                  key={index}
                  id={item.id}
                  label={item.label}
                  icon={item.icon}
                  badge={item.badge}
                />
              ))}
            </Navigation.Section>
          ))}

          <Navigation.Footer divider>
            <Navigation.Item
              id="help"
              label="Help & Support"
              icon="question-circle"
              url="https://shopify.dev"
            />
          </Navigation.Footer>
        </Navigation>

        <div style={{ flex: 1 }}>
          <BlockStack gap="400">
            <Text variant="large" heading>
              {navigationSections
                .flatMap((s) => s.items)
                .find((i) => i.id === selectedNav)?.label ?? "Settings"}
            </Text>
            <Text tone="neutral">
              Configure settings and preferences for this section. Select &ldquo;Social
              sharing&rdquo; in the vertical navigation to view the social media
              dashboard.
            </Text>
          </BlockStack>
        </div>
      </InlineStack>
    </Page>
  );
}
