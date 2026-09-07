import { useEffect, type Dispatch } from "react";
import type { OnboardingActionType, OnboardingStateType } from "../onboarding.types";
import {
  Box,
  BlockStack,
  InlineStack,
  Button,
  Icon,
  IconTile,
  Text,
} from "@xco-agency/corex-ui";

export type Step6CelebrationPropsType = {
  state: OnboardingStateType;
  dispatch: Dispatch<OnboardingActionType>;
  onGoToDashboard?: () => void;
  onRestart?: () => void;
};

export function Step6Celebration({
  state,
  dispatch,
  onGoToDashboard,
  onRestart,
}: Step6CelebrationPropsType) {
  useEffect(() => {
    if (state.onboardingCompleted) return;
    dispatch({ type: "COMPLETE_ONBOARDING" });
  }, [state.onboardingCompleted, dispatch]);

  const toolsActivated =
    state.coreTools.length + state.optionalTools.filter((t) => t.configured).length;
  const embedActive = state.embedStatus === "active";

  const rows = [
    { label: "Catalog & currencies synced", done: true },
    {
      label: `${toolsActivated} revenue tool${toolsActivated === 1 ? "" : "s"} active`,
      done: true,
    },
    {
      label: embedActive ? "Theme embed active" : "Theme embed pending activation",
      done: embedActive,
    },
  ];

  return (
    <Box paddingBlock="large">
      <BlockStack gap="large" alignItems="center">
        <BlockStack gap="small-100" alignItems="center">
          <IconTile tone="success">
            <Icon type="check-circle-filled" tone="success" />
          </IconTile>
          <Text
            variant="large"
            heading
            tooltip="All revenue modules and default configurations have been deployed to your active storefront."
          >
            You&rsquo;re all set 🎉
          </Text>
          <Text color="subdued">
            Journeva is live on your store and already working in the background.
          </Text>
        </BlockStack>
        <Box
          padding="large-300"
          border="base"
          borderRadius="large"
          background="base"
          inlineSize="100%"
          maxInlineSize="460px"
        >
          <BlockStack gap="large-100" alignItems="center">
            <BlockStack gap="small-200" inlineSize="100%">
              {rows.map((row) => (
                <InlineStack
                  key={row.label}
                  gap="small-200"
                  alignItems="center"
                  inlineSize="100%"
                >
                  <Icon
                    type={row.done ? "check-circle-filled" : "clock"}
                    tone={row.done ? "success" : "caution"}
                  />
                  <Text color={row.done ? "base" : "subdued"}>{row.label}</Text>
                </InlineStack>
              ))}
            </BlockStack>
          </BlockStack>
        </Box>
        <BlockStack
          gap="small-200"
          alignItems="center"
          inlineSize="100%"
          maxInlineSize="460px"
        >
          <InlineStack
            gap="small-200"
            alignItems="center"
            justifyContent="space-between"
            inlineSize="100%"
          >
            <Button onClick={() => dispatch({ type: "GO_BACK" })}>Back</Button>
            <Button variant="primary" onClick={onGoToDashboard}>
              Go to Revenue Dashboard
            </Button>
          </InlineStack>
          <Text color="subdued">
            Need to change anything? Everything&rsquo;s editable anytime from the Hub.
          </Text>
          {onRestart ? (
            <Button variant="tertiary" onClick={onRestart}>
              Replay demo
            </Button>
          ) : null}
        </BlockStack>
      </BlockStack>
    </Box>
  );
}
