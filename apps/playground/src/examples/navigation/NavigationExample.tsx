import * as React from "react";
import { Navigation, Box, Text } from "@xco-agency/corex-ui";

export function NavigationExample() {
  const [selected, setSelected] = React.useState("email");

  const sections = [
    {
      title: "GENERAL",
      items: [
        { id: "reviews", label: "Reviews", icon: "star" },
        { id: "email", label: "Email templates", icon: "email" },
        { id: "products", label: "Products", icon: "tag" },
      ],
    },
    {
      title: "PREFERENCES",
      items: [
        { id: "settings", label: "Settings", icon: "settings" },
      ],
    },
  ];

  return (
    <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", width: "100%" }}>
      <div style={{ width: "240px", flexShrink: 0 }}>
        <Navigation
          sections={sections}
          selectedId={selected}
          onSelect={setSelected}
          searchable
        />
      </div>
      <Box padding="400">
        <Text as="p" variant="bodyMd">
          Selected item: <strong>{selected}</strong>
        </Text>
      </Box>
    </div>
  );
}
