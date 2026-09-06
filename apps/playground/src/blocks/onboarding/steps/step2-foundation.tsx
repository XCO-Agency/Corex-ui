import type { Dispatch } from "react";
import type { CoreToolIdType, OnboardingActionType, OnboardingStateType } from "../types";
import Content from "~/components/ui/typography/Content";
import { IconTile } from "~/components/ui/IconTile";
import styles from "../onboarding.module.css";

const CORE_ICONS: Record<CoreToolIdType, "cart" | "collection" | "chart-vertical"> = {
  "cart-drawer": "cart",
  fbt: "collection",
  analytics: "chart-vertical",
};

export type Step2RevenueFoundationPropsType = {
  state: OnboardingStateType;
  dispatch: Dispatch<OnboardingActionType>;
};

export function Step2Foundation({ state, dispatch }: Step2RevenueFoundationPropsType) {
  return (
    <s-box paddingBlock="large">
      <s-stack direction="block" gap="large" alignItems="center">
        <s-box inlineSize="100%" maxInlineSize="640px">
          <s-stack direction="block" rowGap="large-500" alignItems="center">
            <s-stack direction="block" gap="small-100" alignItems="center">
              <s-badge tone="caution" size="large" icon="check">
                Activation complete
              </s-badge>
              <Content
                variant="headingMd"
                tooltip={
                  <>
                    <s-paragraph>Core conversion features Cart Drawer</s-paragraph>
                    <s-paragraph tone="info">
                      Frequently Bought Together, and Realtime Analytics are
                      pre-configured and live out of the box.
                    </s-paragraph>
                  </>
                }
              >
                Your revenue foundation is ready
              </Content>
              <Content subdue>
                We&rsquo;ve already configured the essentials nothing to set up, nothing
                to break.
              </Content>
            </s-stack>

            <s-stack direction="block" gap="small" inlineSize="100%">
              {state.coreTools.map((tool, i) => (
                <div
                  key={tool.id}
                  className={styles.staggerItem}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <s-box
                    padding="small"
                    border="base"
                    borderRadius="large"
                    background="base"
                    inlineSize="100%"
                  >
                    <s-stack
                      direction="inline"
                      gap="base"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <s-stack direction="inline" gap="base" alignItems="center">
                        <IconTile tone="neutral">
                          <s-icon type={CORE_ICONS[tool.id]} tone="success" size="base" />
                        </IconTile>
                        <s-stack direction="block" gap="none">
                          <s-heading>{tool.name}</s-heading>
                          <s-paragraph color="subdued">{tool.description}</s-paragraph>
                        </s-stack>
                      </s-stack>
                      <s-badge tone="success">Active</s-badge>
                    </s-stack>
                  </s-box>
                </div>
              ))}
            </s-stack>

            <s-stack direction="block" gap="small-200" alignItems="center">
              <s-stack direction="inline" gap="small-200" alignItems="center">
                <s-button onClick={() => dispatch({ type: "GO_BACK" })}>Back</s-button>
                <s-button variant="primary" onClick={() => dispatch({ type: "GO_NEXT" })}>
                  Continue
                </s-button>
              </s-stack>
              <Content subdue>Fully customizable anytime from the Hub.</Content>
            </s-stack>
          </s-stack>
        </s-box>
      </s-stack>
    </s-box>
  );
}
