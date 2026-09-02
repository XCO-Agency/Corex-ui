import { useState } from "react";
import { Tabs, Text } from "@xco/corex-ui";
import type { ComponentEntry } from "../types";

function TabsExample() {
  const [selected, setSelected] = useState(0);
  const tabs = [
    { id: "all", content: "All" },
    { id: "drafts", content: "Drafts" },
    { id: "archived", content: "Archived" },
  ];
  return (
    <Tabs tabs={tabs} selected={selected} onSelect={setSelected}>
      <Text>Panel content for &ldquo;{tabs[selected]!.content}&rdquo;.</Text>
    </Tabs>
  );
}

export const navigationComponents: ComponentEntry[] = [
  {
    name: "Tabs",
    slug: "tabs",
    category: "Navigation",
    description: "Switches between different views of related content.",
    examples: [
      {
        title: "Controlled tabs",
        Example: TabsExample,
        code: `const [selected, setSelected] = useState(0);
const tabs = [
  { id: "all", content: "All" },
  { id: "drafts", content: "Drafts" },
  { id: "archived", content: "Archived" },
];

<Tabs tabs={tabs} selected={selected} onSelect={setSelected}>
  <Text>Panel content for "{tabs[selected].content}".</Text>
</Tabs>`,
      },
    ],
  },
];
