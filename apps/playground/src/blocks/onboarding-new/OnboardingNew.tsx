import { useState, useCallback } from "react";
import "./onboarding.css";
import onboardingCss from "./onboarding.css?inline";
import type {
  OnboardingNewAnswersType,
  OnboardingNewPropsType,
  StageIdType,
} from "./types";
import { FLOW_STAGES, INITIAL_LOADING_TEXTS, getStageProcessingTexts } from "./constants";
import { ProcessingStage } from "./partials/ProcessingStage";
import { ChoiceQuestions } from "./partials/ChoiceQuestions";
import { BrandColor } from "./partials/BrandColor";
import { StylePreset } from "./partials/StylePreset";
import { ToggleGrid } from "./partials/ToggleGrid";
import { CompleteStage } from "./partials/CompleteStage";
import {
  BlockStack,
  Box,
  Button,
  InlineStack,
  ProgressBar,
  Text,
  Transition,
} from "@xco-agency/corex-ui";

type ViewStateType = "initial_loading" | "question" | "save_processing" | "complete";

function getStageValidity(
  stageId: StageIdType,
  answers: OnboardingNewAnswersType,
): boolean {
  if (stageId === "volume") {
    return !!answers.volume;
  }
  return true;
}

export function OnboardingNew({
  onGoToDashboard,
  onRestart,
  initialAnswers = {},
  initialCompletedStages = [],
  onSaveStage,
}: OnboardingNewPropsType) {
  const initialCompletedSet = new Set<StageIdType>(initialCompletedStages);
  const allInitiallyComplete =
    FLOW_STAGES.length > 0 && FLOW_STAGES.every((s) => initialCompletedSet.has(s.id));

  // Determine starting index: first incomplete stage
  const firstIncompleteIdx = FLOW_STAGES.findIndex((s) => !initialCompletedSet.has(s.id));
  const startingStageIdx = firstIncompleteIdx >= 0 ? firstIncompleteIdx : 0;

  const [viewState, setViewState] = useState<ViewStateType>(
    allInitiallyComplete ? "complete" : "initial_loading",
  );
  const [stageIndex, setStageIndex] = useState<number>(startingStageIdx);
  const [answers, setAnswers] = useState<OnboardingNewAnswersType>(initialAnswers);
  const [completedStages, setCompletedStages] =
    useState<Set<StageIdType>>(initialCompletedSet);
  const [processingTexts, setProcessingTexts] = useState<string[]>(INITIAL_LOADING_TEXTS);
  const [leaving, setLeaving] = useState(false);

  const currentStage = FLOW_STAGES[stageIndex] || FLOW_STAGES[0]!;
  const canGoBack = stageIndex > 0;
  const isValid = getStageValidity(currentStage.id, answers);

  const handleInitialLoadingDone = useCallback(() => {
    setLeaving(true);
    setTimeout(() => {
      setViewState("question");
      setLeaving(false);
    }, 250);
  }, []);

  const handleContinue = async () => {
    if (!currentStage) return;

    // Call onSaveStage if provided
    const currentAnswer = answers[currentStage.id];
    if (onSaveStage) {
      await onSaveStage(currentStage.id, currentAnswer);
    }

    // Mark current stage as completed
    const nextCompleted = new Set(completedStages);
    nextCompleted.add(currentStage.id);
    setCompletedStages(nextCompleted);

    // Compute contextual dynamic loading texts based on selection
    const texts = getStageProcessingTexts(currentStage.id, answers);
    setProcessingTexts(texts);

    // Transition to save processing
    setLeaving(true);
    setTimeout(() => {
      setViewState("save_processing");
      setLeaving(false);
    }, 250);
  };

  const handleSaveProcessingDone = useCallback(() => {
    // Find next incomplete stage after current stageIndex
    const nextIdx = FLOW_STAGES.findIndex(
      (s, idx) => idx > stageIndex && !completedStages.has(s.id),
    );

    setLeaving(true);
    setTimeout(() => {
      if (nextIdx !== -1) {
        setStageIndex(nextIdx);
        setViewState("question");
      } else {
        // If no subsequent incomplete stage, check if any earlier stage is still incomplete
        const anyIncompleteIdx = FLOW_STAGES.findIndex(
          (s) => !completedStages.has(s.id) && s.id !== currentStage.id,
        );
        if (anyIncompleteIdx !== -1) {
          setStageIndex(anyIncompleteIdx);
          setViewState("question");
        } else {
          setViewState("complete");
        }
      }
      setLeaving(false);
    }, 250);
  }, [stageIndex, completedStages, currentStage?.id]);

  const handleBack = () => {
    if (stageIndex > 0) {
      setLeaving(true);
      setTimeout(() => {
        setStageIndex((i) => i - 1);
        setViewState("question");
        setLeaving(false);
      }, 250);
    }
  };

  const handleReset = () => {
    setAnswers(initialAnswers);
    setCompletedStages(new Set());
    setStageIndex(0);
    setProcessingTexts(INITIAL_LOADING_TEXTS);
    setViewState("initial_loading");
    if (onRestart) onRestart();
  };

  const totalSteps = FLOW_STAGES.length;
  const shownStep = viewState === "complete" ? totalSteps : stageIndex + 1;
  const progressPct =
    viewState === "complete" ? 100 : (completedStages.size / totalSteps) * 100;
  const showProgress = viewState !== "complete";

  return (
    <BlockStack inlineSize="100%" minBlockSize="760px" alignItems="center" padding="base">
      <style dangerouslySetInnerHTML={{ __html: onboardingCss }} />

      {showProgress && (
        <InlineStack alignItems="center" gap="base">
          <Box inlineSize="90px">
            <ProgressBar progress={progressPct} size="xs" tone="success" />
          </Box>
          <Text color="subdued" variant="small">
            Step {shownStep} of {totalSteps}
          </Text>
        </InlineStack>
      )}

      <BlockStack
        flex={1}
        gap="base"
        alignItems="center"
        justifyContent="center"
        inlineSize="100%"
        maxInlineSize="1200px"
      >
        <Box inlineSize="100%">
          <Transition
            reverse
            key={`${viewState}-${stageIndex}`}
            animate="fade-up"
            leaving={leaving}
            inlineSize="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            {viewState === "initial_loading" && (
              <ProcessingStage
                texts={INITIAL_LOADING_TEXTS}
                onDone={handleInitialLoadingDone}
              />
            )}

            {viewState === "save_processing" && (
              <ProcessingStage
                texts={processingTexts}
                onDone={handleSaveProcessingDone}
              />
            )}

            {viewState === "question" && (
              <BlockStack gap="large" inlineSize="100%" alignItems="center">
                {currentStage.id === "volume" && (
                  <ChoiceQuestions answers={answers} setAnswers={setAnswers} />
                )}
                {currentStage.id === "brand" && (
                  <BrandColor answers={answers} setAnswers={setAnswers} />
                )}
                {currentStage.id === "cartStyle" && (
                  <StylePreset answers={answers} setAnswers={setAnswers} />
                )}
                {currentStage.id === "addons" && (
                  <ToggleGrid answers={answers} setAnswers={setAnswers} />
                )}

                <InlineStack
                  gap="base"
                  inlineSize="100%"
                  maxInlineSize="420px"
                  alignItems="center"
                >
                  {canGoBack && (
                    <Button variant="tertiary" onClick={handleBack} icon="arrow-left">
                      Back
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    inlineSize="fill"
                    disabled={!isValid}
                    onClick={handleContinue}
                  >
                    Continue
                  </Button>
                </InlineStack>

                <Text color="subdued">
                  * All configuration are fully customizable anytime from the Hub.
                </Text>
              </BlockStack>
            )}

            {viewState === "complete" && (
              <CompleteStage onRestart={handleReset} onGoToDashboard={onGoToDashboard} />
            )}
          </Transition>
        </Box>
      </BlockStack>
    </BlockStack>
  );
}

export default OnboardingNew;
