import React from "react";
import { Badge, Clickable, InlineStack } from "@xco-agency/corex-ui";
import type { OnboardingStepIdType, StepConfigItemType } from "./onboarding.types";

export type ProgressHeaderPropsType = {
  stepIndex: number;
  steps: StepConfigItemType[];
  onGoToStep?: (step: OnboardingStepIdType) => void;
};

export function ProgressHeader({
  stepIndex,
  steps,
  onGoToStep,
}: ProgressHeaderPropsType) {
  return (
    <InlineStack
      gap="small-300"
      justifyContent="center"
      inlineSize="100%"
      maxInlineSize="640px"
      alignItems="center"
    >
      {steps.map((item, idx) => {
        const isCompleted = idx < stepIndex;
        const isCurrent = idx === stepIndex;

        return (
          <React.Fragment key={item.id}>
            {idx > 0 && (
              <span
                style={{
                  flex: 1,
                  height: 2,
                  maxWidth: "2rem",
                  minWidth: "1rem",
                  backgroundColor: isCompleted ? "#059669" : "#e5e7eb",
                  borderRadius: "9999px",
                  transition: "background-color 250ms ease",
                }}
                aria-hidden="true"
              />
            )}
            {isCompleted ? (
              <Clickable
                onClick={() => onGoToStep?.(item.id)}
                accessibilityLabel={`Go back to ${item.label}`}
              >
                <Badge tone="success" size="large" icon="check">
                  {item.label}
                </Badge>
              </Clickable>
            ) : isCurrent ? (
              <Badge tone="info" size="large" icon={item.icon}>
                {item.label}
              </Badge>
            ) : (
              <Badge tone="auto" size="large" icon={item.icon}>
                {item.label}
              </Badge>
            )}
          </React.Fragment>
        );
      })}
    </InlineStack>
  );
}
