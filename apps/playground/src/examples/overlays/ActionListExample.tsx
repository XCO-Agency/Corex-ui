import { ActionList, Box, Button, Card, Popover } from "@xco-agency/corex-ui";

export function ActionListExample() {
  return (
    <Card>
      <ActionList
        sections={[
          {
            title: "Manage",
            items: [
              { content: "Edit", icon: "edit", onAction: () => alert("Edit") },
              {
                content: "Duplicate",
                icon: "duplicate",
                helpText: "Keeps the original",
                onAction: () => alert("Duplicate"),
              },
            ],
          },
          {
            title: "Danger zone",
            items: [
              {
                content: "Delete",
                icon: "delete",
                destructive: true,
                onAction: () => alert("Delete"),
              },
            ],
          },
        ]}
      />
    </Card>
  );
}
