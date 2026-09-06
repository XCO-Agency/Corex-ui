import { useEffect, type Dispatch } from "react";
import type { OnboardingActionType, OnboardingStateType } from "../types";
import { IconTile } from "~/components/ui/IconTile";
import Content from "~/components/ui/typography/Content";

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
    <s-box paddingBlock="large">
      <s-stack direction="block" gap="large" alignItems="center">
        <s-box
          padding="large-300"
          border="base"
          borderRadius="large"
          background="base"
          inlineSize="100%"
          maxInlineSize="460px"
        >
          <s-stack direction="block" gap="large-100" alignItems="center">
            <s-stack direction="block" gap="small-100" alignItems="center">
              <IconTile tone="success" borderRadius="full" size="lg">
                <s-icon type="check" tone="success" size="base" />
              </IconTile>
              <Content
                variant="headingMd"
                tooltip="All revenue modules and default configurations have been deployed to your active storefront."
              >
                You&rsquo;re all set 🎉
              </Content>
              <Content subdue>
                Journeva is live on your store and already working in the background.
              </Content>
            </s-stack>

            <s-stack direction="block" gap="small-200" inlineSize="100%">
              {rows.map((row) => (
                <s-stack
                  key={row.label}
                  direction="inline"
                  gap="small-200"
                  alignItems="center"
                  inlineSize="100%"
                >
                  <s-icon
                    type={row.done ? "check-circle-filled" : "clock"}
                    tone={row.done ? "success" : "caution"}
                  />
                  <s-paragraph color={row.done ? "base" : "subdued"}>
                    {row.label}
                  </s-paragraph>
                </s-stack>
              ))}
            </s-stack>
          </s-stack>
        </s-box>
        <s-stack direction="block" gap="small-200" alignItems="center" inlineSize="100%">
          <s-stack direction="inline" gap="small-200" alignItems="center">
            <s-button onClick={() => dispatch({ type: "GO_BACK" })}>Back</s-button>
            <s-button variant="primary" onClick={onGoToDashboard}>
              Go to Revenue Dashboard
            </s-button>
          </s-stack>
          <Content subdue>
            Need to change anything? Everything&rsquo;s editable anytime from the Hub.
          </Content>
          {onRestart ? (
            <s-button variant="tertiary" onClick={onRestart}>
              Replay demo
            </s-button>
          ) : null}
        </s-stack>
      </s-stack>
    </s-box>
  );
}
