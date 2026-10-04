import { ActionList, Button, Card, InlineStack } from "@xco-agency/corex-ui";

export function ActionListExample() {
  return (
    <Card>
      <InlineStack gap="base" alignItems="center">
        {/* Default 3-dots trigger button */}
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

        {/* Custom trigger button via children */}
        <ActionList
          items={[
            { content: "Export CSV", icon: "export", onAction: () => alert("Export") },
            { content: "Import CSV", icon: "import", onAction: () => alert("Import") },
          ]}
        >
          <Button variant="secondary">More actions</Button>
        </ActionList>
      </InlineStack>
    </Card>
  );
}

