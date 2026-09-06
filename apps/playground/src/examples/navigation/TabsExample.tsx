import { useState } from "react";
import { Tabs, Text } from "@xco-agency/corex-ui";

export function TabsExample() {
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
