import {
  BlockStack,
  Box,
  Button,
  Card,
  Icon,
  IconTile,
  Text,
} from "@xco-agency/corex-ui";

export type CompleteStagePropsType = {
  onRestart?: () => void;
  onGoToDashboard?: () => void;
};

export function CompleteStage({
  onRestart,
  onGoToDashboard,
}: CompleteStagePropsType) {
  const handleAction = () => {
    if (onGoToDashboard) {
      onGoToDashboard();
    } else if (onRestart) {
      onRestart();
    }
  };

  return (
    <BlockStack gap="base" inlineSize="100%">
      <Card>
        <Box paddingBlock="large-100">
          <BlockStack gap="base" alignItems="center" inlineAlign="center">
            <IconTile tone="success" size="lg" borderRadius="full">
              <Icon type="check" tone="success" />
            </IconTile>
            <BlockStack gap="small-400" alignItems="center" inlineAlign="center">
              <Text variant="headingLg" heading>
                You&apos;re all set
              </Text>
              <Text variant="bodyMd" color="subdued">
                Your revenue tools are configured and ready to go.
              </Text>
            </BlockStack>
          </BlockStack>
        </Box>
      </Card>

      <Button
        variant="primary"
        size="large"
        inlineSize="fill"
        onClick={handleAction}
      >
        Enter dashboard
      </Button>
    </BlockStack>
  );
}
