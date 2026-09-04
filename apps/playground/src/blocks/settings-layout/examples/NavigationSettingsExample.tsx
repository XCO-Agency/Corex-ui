import * as React from "react";
import {
  Navigation,
  BlockStack,
  Text,
  Box,
  Page,
} from "@xco-agency/corex-ui";

export function NavigationSettingsExample() {
  const [selectedNav, setSelectedNav] = React.useState("social");

  const navigationSections = [
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
          icon: "tag",
        },
        {
          id: "bundles",
          label: "Bundles",
          icon: "package",
        },
        {
          id: "flow",
          label: "Collection flow",
          icon: "workflow",
        },
        {
          id: "optimize",
          label: "Optimize collection",
          icon: "sparkles",
        },
        {
          id: "moderation",
          label: "Publishing and moderation",
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
          icon: "customer",
        },
      ],
    },
  ];

  return (
    <Page inlineSize="base">
      {/* Left Sidebar: Vertical Navigation */}
      <Box inlineSize="200px" >
        <Navigation
          sections={navigationSections}
          selectedId={selectedNav}
          onSelect={setSelectedNav}
          searchable
          searchPlaceholder="Search (Ctrl + Shift + F)"
        />
      </Box>

     <BlockStack gap="400">
            <Text as="h1" variant="headingLg">
              <span style={{ fontWeight: 700, fontSize: "22px", color: "#202223" }}>
                {navigationSections
                  .flatMap((s) => s.items)
                  .find((i) => i.id === selectedNav)?.label ?? "Settings"}
              </span>
            </Text>
            <Text as="p" variant="bodyMd" tone="neutral">
              Configure settings and preferences for this section. Select &ldquo;Social sharing&rdquo;
              in the vertical navigation to view the social media dashboard.
            </Text>
          </BlockStack>
    </Page>
  );
}
