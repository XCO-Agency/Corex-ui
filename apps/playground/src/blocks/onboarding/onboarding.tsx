import { ONBOARDING_STEPS_CONFIG } from "./constants";
import { useOnboarding } from "./use-onboarding";
import { ProgressHeader } from "./ProgressHeader";
import { Step1Initializing } from "./steps/step1-initializing";
import { Step2Foundation } from "./steps/step2-foundation";
import { Step3Configuration } from "./steps/step3-configuration";
import { Step4AddTools } from "./steps/step4-add-tools";
import { Step5ShopifyValidation } from "./steps/step5-shopify-validation";
import { Step6Celebration } from "./steps/step6-end";
import type { OnboardingStepIdType } from "./onboarding.types";
import { ReactNode, useEffect, useRef, useState } from "react";
import styles from "./onboarding.module.css";

export type OnboardingPropsType = {
  /** Called when the merchant taps the final CTA. Wire this to your router. */
  onGoToDashboard?: () => void;
  /** Called from the "Exit setup" link in the header, if provided. */
  onExit?: () => void;
  /** Optional — lets a host app offer to replay the flow (demo/QA convenience). */
  onRestart?: () => void;
};

export function Onboarding({ onGoToDashboard, onExit, onRestart }: OnboardingPropsType) {
  const { state, dispatch, stepIndex } = useOnboarding();

  const renderStep = () => {
    switch (state.currentStep) {
      case "initializing":
        return <Step1Initializing state={state} dispatch={dispatch} />;
      case "foundation":
        return <Step2Foundation state={state} dispatch={dispatch} />;
      case "configuration":
        return <Step3Configuration state={state} dispatch={dispatch} />;
      case "add-tools":
        return <Step4AddTools state={state} dispatch={dispatch} />;
      case "shopify-validation":
        return <Step5ShopifyValidation state={state} dispatch={dispatch} />;
      case "end":
        return (
          <Step6Celebration
            state={state}
            dispatch={dispatch}
            onGoToDashboard={onGoToDashboard}
            onRestart={onRestart}
          />
        );
      default:
        return null;
    }
  };

  return (
    <s-page>
      <ProgressHeader
        stepIndex={stepIndex}
        steps={ONBOARDING_STEPS_CONFIG}
        onGoToStep={(targetStep: OnboardingStepIdType) =>
          dispatch({ type: "GO_TO_STEP", step: targetStep })
        }
      />
      <br />
      <StepTransition stepKey={state.currentStep}>{renderStep()}</StepTransition>
    </s-page>
  );
}

export type StepTransitionPropsType = {
  stepKey: string;
  children: ReactNode;
};

export function StepTransition({ stepKey, children }: StepTransitionPropsType) {
  const [phase, setPhase] = useState<"enter" | "exit">("enter");
  const [renderedKey, setRenderedKey] = useState(stepKey);
  const activeKey = useRef(stepKey);
  const lastChildren = useRef(children);

  const showingCurrent = renderedKey === stepKey;
  if (showingCurrent) {
    // Not mid-transition: always keep this in sync so same-step re-renders
    // (e.g. the Step 1 checklist ticking, or a form field changing) show up
    // immediately, with no animation replay.
    lastChildren.current = children;
  }

  useEffect(() => {
    if (activeKey.current === stepKey) return;
    setPhase("exit");
    const timeout = window.setTimeout(() => {
      activeKey.current = stepKey;
      setRenderedKey(stepKey);
      setPhase("enter");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    }, 180);
    return () => window.clearTimeout(timeout);
    // Re-run only when the step identity changes, not on every content re-render.
  }, [stepKey]);

  return (
    <div
      key={renderedKey}
      className={phase === "enter" ? styles.stepPanelEnter : styles.stepPanelExit}
    >
      {showingCurrent ? children : lastChildren.current}
    </div>
  );
}

export default Onboarding;
