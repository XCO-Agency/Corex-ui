import { useEffect, useRef, type Dispatch } from "react";
import type { OnboardingActionType, OnboardingStateType } from "../onboarding.types";
import {
  Box,
  BlockStack,
  InlineStack,
  Button,
  Clickable,
  Icon,
  Spinner,
  Text,
} from "@xco-agency/corex-ui";

const CHECK_DURATION_MS = 2600;

function getThemeEditorDeepLink(
  shopDomain: string,
  themeId: string,
  appEmbedBlockHandle: string,
): string {
  const params = new URLSearchParams({
    context: "apps",
    activateAppId: `${appEmbedBlockHandle}/journeva-embed`,
  });
  return `https://${shopDomain}/admin/themes/${themeId}/editor?${params.toString()}`;
}

export type Step5ShopifyValidationPropsType = {
  state: OnboardingStateType;
  dispatch: Dispatch<OnboardingActionType>;
};

export function Step5ShopifyValidation({
  state,
  dispatch,
}: Step5ShopifyValidationPropsType) {
  const checkTimeout = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(checkTimeout.current), []);

  const runCheck = () => {
    dispatch({ type: "SET_EMBED_STATUS", status: "checking" });
    window.clearTimeout(checkTimeout.current);
    checkTimeout.current = window.setTimeout(() => {
      dispatch({ type: "SET_EMBED_STATUS", status: "active" });
    }, CHECK_DURATION_MS);
  };

  const openThemeEditor = () => {
    // In production this opens a real tab via the deep link below; the
    // sandboxed demo simulates the round trip instead of navigating away.
    void getThemeEditorDeepLink("example.myshopify.com", "current", "journeva");
    runCheck();
  };

  return (
    <Box paddingBlock="large">
      <BlockStack gap="large" align="center">
        <Box
          padding="large"
          border="base"
          borderRadius="large"
          background="base"
          inlineSize="100%"
          maxInlineSize="460px"
        >
          <BlockStack gap="large-100" align="center">
            <BlockStack gap="small-100" align="center">
              <Text
                heading
                tooltip="Enabling the theme app extension allows the cart drawer and revenue widgets to render seamlessly without modifying liquid code directly."
              >
                Activate your theme embed
              </Text>
              <Text color="subdued">
                One click enables Journeva&rsquo;s cart drawer and upsells on your
                storefront.
              </Text>
            </BlockStack>

            <BlockStack gap="base" inlineSize="100%">
              <Clickable onClick={openThemeEditor} borderRadius="large">
                <Box
                  padding="base"
                  border="base"
                  borderRadius="large"
                  background="base"
                  inlineSize="100%"
                >
                  <InlineStack
                    align="space-between"
                    alignItems="center"
                    inlineSize="100%"
                  >
                    <BlockStack gap="none">
                      <Text fontWeight="semibold">Open Theme Editor</Text>
                      <Text color="subdued">Opens Shopify in a new tab</Text>
                    </BlockStack>
                    <Icon type="external" tone="neutral" />
                  </InlineStack>
                </Box>
              </Clickable>

              <InlineStack align="space-between" alignItems="center" inlineSize="100%">
                <InlineStack gap="small-200" alignItems="center">
                  {state.embedStatus === "active" ? (
                    <Icon type="check-circle-filled" tone="success" />
                  ) : state.embedStatus === "checking" ? (
                    <Spinner
                      accessibilityLabel="Checking installation status"
                      size="small"
                    />
                  ) : (
                    <Icon type="clock" tone="neutral" />
                  )}
                  <Text>
                    {state.embedStatus === "active"
                      ? "Theme embed active"
                      : state.embedStatus === "checking"
                        ? "Checking installation status…"
                        : "Not detected yet"}
                  </Text>
                </InlineStack>

                <Button onClick={runCheck} disabled={state.embedStatus === "checking"}>
                  Recheck
                </Button>
              </InlineStack>
            </BlockStack>
          </BlockStack>
        </Box>

        <InlineStack gap="small-200" alignItems="center">
          <Button onClick={() => dispatch({ type: "GO_BACK" })}>Back</Button>
          <Button variant="primary" onClick={() => dispatch({ type: "GO_NEXT" })}>
            Continue
          </Button>
        </InlineStack>
      </BlockStack>
    </Box>
  );
}
