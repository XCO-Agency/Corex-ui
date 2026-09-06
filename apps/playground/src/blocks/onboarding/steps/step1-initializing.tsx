import { useEffect, useRef, useState, type Dispatch } from "react";
import type { OnboardingActionType, OnboardingStateType } from "../onboarding.types";
import {
  Box,
  BlockStack,
  InlineStack,
  Button,
  Icon,
  IconTile,
  ProgressBar,
  Spinner,
  Text,
} from "@xco-agency/corex-ui";
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
    <Box paddingBlock="small">
      <BlockStack gap="large" alignItems="center">
        <Box
          padding="large-400"
          border="base"
          borderRadius="large"
          background="base"
          inlineSize="100%"
          maxInlineSize="440px"
        >
          <BlockStack gap="base" alignItems="center">
            {state.syncComplete ? (
              <IconTile tone="success" size="lg">
                <Icon type="check" tone="success" />
              </IconTile>
            ) : (
              <Spinner accessibilityLabel="Syncing store" size="large" />
            )}

            <Text
              heading
              tooltip="We are automatically syncing your product catalog, multi-currency settings, and initializing your store's revenue engine."
            >
              {state.syncComplete ? "Store setup complete" : "Setting up Journeva"}
            </Text>

            <Text color="subdued">
              {state.syncComplete
                ? "Your store data and revenue engine have been synchronized successfully."
                : "Sit tight — we’re syncing your store and provisioning your revenue engine."}
            </Text>

            <Box paddingBlock="small-100" inlineSize="100%">
              <BlockStack gap="small-200">
                {state.syncTasks.map((task, i) => {
                  const isDone = task.status === "done";
                  const isActive = !isDone && i === firstPendingIndex;

                  return (
                    <div
                      key={task.id}
                      className={styles.staggerItem}
                      style={{ animationDelay: `${i * 160}ms` }}
                    >
                      <InlineStack gap="small-200" alignItems="center">
                        {isDone ? (
                          <Icon type="check-circle-filled" tone="success" />
                        ) : isActive ? (
                          <Spinner accessibilityLabel="Syncing task" size="small" />
                        ) : (
                          <Icon type="clock" tone="neutral" />
                        )}
                        {isActive || isDone ? (
                          <Text heading>{task.label}</Text>
                        ) : (
                          <Text color="subdued">{task.label}</Text>
                        )}
                      </InlineStack>
                    </div>
                  );
                })}
              </BlockStack>
            </Box>

            <ProgressBar
              progress={(doneCount / state.syncTasks.length) * 100}
              tone="success"
              style={{ marginTop: "1rem" }}
            />
          </BlockStack>
        </Box>

        {state.syncComplete ? (
          <Button variant="primary" onClick={() => dispatch({ type: "GO_NEXT" })}>
            Continue
          </Button>
        ) : showFallback ? (
          <Button
            variant="tertiary"
            onClick={() => dispatch({ type: "FORCE_SYNC_COMPLETE" })}
          >
            Taking longer than usual? Continue anyway
          </Button>
        ) : null}
      </BlockStack>
    </Box>
  );
}
