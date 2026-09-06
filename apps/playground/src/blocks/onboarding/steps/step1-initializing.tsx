import { useEffect, useRef, useState, type Dispatch } from "react";
import type { OnboardingActionType, OnboardingStateType } from "../types";
import { ProgressTracker } from "~/components/ui/ProgressTracker";
import { IconTile } from "~/components/ui/IconTile";
import Content from "~/components/ui/typography/Content";
import styles from "../onboarding.module.css";

const TASK_INTERVAL_MS = 750;
const HOLD_AFTER_COMPLETE_MS = 550;
const FALLBACK_VISIBLE_AFTER_MS = 6500;

export type Step1InitializingPropsType = {
  state: OnboardingStateType;
  dispatch: Dispatch<OnboardingActionType>;
};

export function Step1Initializing({ state, dispatch }: Step1InitializingPropsType) {
  const [showFallback, setShowFallback] = useState(false);
  const wasAlreadyComplete = useRef(state.syncComplete);
  const hasAutoAdvanced = useRef(false);

  // Safety net: never trap a merchant behind a spinner indefinitely.
  useEffect(() => {
    const timer = window.setTimeout(
      () => setShowFallback(true),
      FALLBACK_VISIBLE_AFTER_MS,
    );
    return () => window.clearTimeout(timer);
  }, []);

  // Advance one checklist item at a time, at a pace that feels real but never drags.
  useEffect(() => {
    if (state.syncComplete) return;
    const timer = window.setTimeout(
      () => dispatch({ type: "ADVANCE_SYNC_TASK" }),
      TASK_INTERVAL_MS,
    );
    return () => window.clearTimeout(timer);
  }, [state.syncTasks, state.syncComplete, dispatch]);

  // On initial sync completion (first run), advance automatically after a beat.
  useEffect(() => {
    if (!state.syncComplete || wasAlreadyComplete.current || hasAutoAdvanced.current)
      return;
    hasAutoAdvanced.current = true;
    const timer = window.setTimeout(
      () => dispatch({ type: "GO_NEXT" }),
      HOLD_AFTER_COMPLETE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [state.syncComplete, dispatch]);

  const doneCount = state.syncTasks.filter((task) => task.status === "done").length;
  const firstPendingIndex = state.syncTasks.findIndex((task) => task.status !== "done");

  return (
    <s-box paddingBlock="small">
      <s-stack direction="block" gap="large" alignItems="center">
        <s-box
          padding="large-400"
          border="base"
          borderRadius="large"
          background="base"
          inlineSize="100%"
          maxInlineSize="440px"
        >
          <s-stack direction="block" gap="base" alignItems="center">
            {state.syncComplete ? (
              <IconTile tone="success" size="lg" borderRadius="full">
                <s-icon type="check" tone="success" size="base" />
              </IconTile>
            ) : (
              <s-spinner accessibilityLabel="Syncing store" size="large" />
            )}

            <Content
              variant="headingMd"
              tooltip="We are automatically syncing your product catalog, multi-currency settings, and initializing your store's revenue engine."
            >
              {state.syncComplete ? "Store setup complete" : "Setting up Journeva"}
            </Content>

            <Content subdue>
              {state.syncComplete
                ? "Your store data and revenue engine have been synchronized successfully."
                : "Sit tight — we’re syncing your store and provisioning your revenue engine."}
            </Content>

            <s-box paddingBlock="small-100" inlineSize="100%">
              <s-stack direction="block" gap="small-200">
                {state.syncTasks.map((task, i) => {
                  const isDone = task.status === "done";
                  const isActive = !isDone && i === firstPendingIndex;

                  return (
                    <div
                      key={task.id}
                      className={styles.staggerItem}
                      style={{ animationDelay: `${i * 160}ms` }}
                    >
                      <s-stack direction="inline" gap="small-200" alignItems="center">
                        {isDone ? (
                          <s-icon type="check-circle-filled" tone="success" size="base" />
                        ) : isActive ? (
                          <s-spinner accessibilityLabel="Syncing task" size="base" />
                        ) : (
                          <s-icon type="clock" color="subdued" size="base" />
                        )}
                        {isActive || isDone ? (
                          <s-heading>{task.label}</s-heading>
                        ) : (
                          <s-paragraph color="subdued">{task.label}</s-paragraph>
                        )}
                      </s-stack>
                    </div>
                  );
                })}
              </s-stack>
            </s-box>

            <ProgressTracker
              progress={(doneCount / state.syncTasks.length) * 100}
              tone="success"
              style={{ marginTop: "1rem" }}
            />
          </s-stack>
        </s-box>

        {state.syncComplete ? (
          <s-button variant="primary" onClick={() => dispatch({ type: "GO_NEXT" })}>
            Continue
          </s-button>
        ) : showFallback ? (
          <s-button
            variant="tertiary"
            onClick={() => dispatch({ type: "FORCE_SYNC_COMPLETE" })}
          >
            Taking longer than usual? Continue anyway
          </s-button>
        ) : null}
      </s-stack>
    </s-box>
  );
}
