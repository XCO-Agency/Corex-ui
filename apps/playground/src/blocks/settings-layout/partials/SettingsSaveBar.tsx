import { Box, Card, InlineStack, Text, Button, Badge } from "@xco-agency/corex-ui";

export type SettingsSaveBarPropsType = {
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
  onDiscard: () => void;
};

export function SettingsSaveBar({
  isDirty,
  isSaving,
  onSave,
  onDiscard,
}: SettingsSaveBarPropsType) {
  if (!isDirty) return null;

  return (
    <Box padding="400">
      <Card>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <InlineStack gap="200" align="start" blockAlign="center">
            <Badge tone="warning">Unsaved changes</Badge>
            <Text as="span" variant="bodySm">
              You have unsaved changes in this section.
            </Text>
          </InlineStack>

          <InlineStack gap="200" align="end" blockAlign="center">
            <Button variant="secondary" disabled={isSaving} onClick={onDiscard}>
              Discard
            </Button>
            <Button variant="primary" loading={isSaving} onClick={onSave}>
              Save changes
            </Button>
          </InlineStack>
        </div>
      </Card>
    </Box>
  );
}
