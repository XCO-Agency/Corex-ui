import { useEffect, useRef, type Dispatch } from "react";
import type { OnboardingActionType, OnboardingStateType } from "../types";
import Content from "~/components/ui/typography/Content";

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
    <s-box paddingBlock="large">
      <s-stack direction="block" gap="large" alignItems="center">
        <s-box
          padding="large"
          border="base"
          borderRadius="large"
          background="base"
          inlineSize="100%"
          maxInlineSize="460px"
        >
          <s-stack direction="block" gap="large-100" alignItems="center">
            <s-stack direction="block" gap="small-100" alignItems="center">
              <Content
                variant="headingMd"
                tooltip="Enabling the theme app extension allows the cart drawer and revenue widgets to render seamlessly without modifying liquid code directly."
              >
                Activate your theme embed
              </Content>
              <Content subdue>
                One click enables Journeva&rsquo;s cart drawer and upsells on your
                storefront.
              </Content>
            </s-stack>

            <s-stack direction="block" gap="base" inlineSize="100%">
              <s-clickable onClick={openThemeEditor} borderRadius="large">
                <s-box
                  padding="base"
                  border="base"
                  borderRadius="large"
                  background="base"
                  inlineSize="100%"
                >
                  <s-stack
                    direction="inline"
                    justifyContent="space-between"
                    alignItems="center"
                    inlineSize="100%"
                  >
                    <s-stack direction="block" gap="none">
                      <s-heading>Open Theme Editor</s-heading>
                      <s-paragraph color="subdued">
                        Opens Shopify in a new tab
                      </s-paragraph>
                    </s-stack>
                    <s-icon type="external" tone="neutral" size="base" />
                  </s-stack>
                </s-box>
              </s-clickable>

              <s-stack
                direction="inline"
                justifyContent="space-between"
                alignItems="center"
                inlineSize="100%"
              >
                <s-stack direction="inline" gap="small-200" alignItems="center">
                  {state.embedStatus === "active" ? (
                    <s-icon type="check-circle-filled" tone="success" size="base" />
                  ) : state.embedStatus === "checking" ? (
                    <s-spinner
                      accessibilityLabel="Checking installation status"
                      size="base"
                    />
                  ) : (
                    <s-icon type="clock" tone="neutral" size="base" />
                  )}
                  <s-text>
                    {state.embedStatus === "active"
                      ? "Theme embed active"
                      : state.embedStatus === "checking"
                        ? "Checking installation status…"
                        : "Not detected yet"}
                  </s-text>
                </s-stack>

                <s-button onClick={runCheck} disabled={state.embedStatus === "checking"}>
                  Recheck
                </s-button>
              </s-stack>
            </s-stack>
          </s-stack>
        </s-box>

        <s-stack direction="inline" gap="small-200" alignItems="center">
          <s-button onClick={() => dispatch({ type: "GO_BACK" })}>Back</s-button>
          <s-button variant="primary" onClick={() => dispatch({ type: "GO_NEXT" })}>
            Continue
          </s-button>
        </s-stack>
      </s-stack>
    </s-box>
  );
}
