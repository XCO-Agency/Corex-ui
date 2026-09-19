import { useState, useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";
import "./onboarding.css";
import onboardingCss from "./onboarding.css?inline";
import type {
  FlowStageType,
  OnboardingNewAnswersType,
  OnboardingNewPropsType,
  StageChoiceQuestionsType,
  StageProcessingType,
  StageStylePresetType,
  StageToggleGridType,
  StageBrandColorType,
} from "./types";
import { FLOW } from "./constants";
import { ProcessingStage } from "./partials/ProcessingStage";
import { ChoiceQuestions } from "./partials/ChoiceQuestions";
import { ToggleGrid } from "./partials/ToggleGrid";
import { StylePreset } from "./partials/StylePreset";
import { BrandColor } from "./partials/BrandColor";
import { CompleteStage } from "./partials/CompleteStage";
import {
  BlockStack,
  Box,
  Button,
  Card,
  InlineStack,
  ProgressBar,
  Text,
  Transition,
} from "@xco-agency/corex-ui";

function getStageValidity(
  stage: FlowStageType,
  answers: OnboardingNewAnswersType,
): boolean {
  if (stage.type === "questions") {
    if (stage.kind === "choice") {
      return stage.questions.every((q) => {
        const val = answers[q.id];
        if (Array.isArray(val)) return val.length > 0;
        if (val instanceof Set) return val.size > 0;
        return !!val;
      });
    }
    if (stage.kind === "style-preset") return !!answers[stage.id];
  }
  return true;
}

type QuestionsStagePropsType = {
  stage:
    | StageChoiceQuestionsType
    | StageToggleGridType
    | StageStylePresetType
    | StageBrandColorType;
  answers: OnboardingNewAnswersType;
  setAnswers: Dispatch<SetStateAction<OnboardingNewAnswersType>>;
  onContinue: () => void;
};

function QuestionsStage({
  stage,
  answers,
  setAnswers,
  onContinue,
}: QuestionsStagePropsType) {
  const isValid = getStageValidity(stage, answers);

  return (
    <BlockStack gap="base" inlineSize="100%">
      {stage.kind === "choice" && (
        <ChoiceQuestions stage={stage} answers={answers} setAnswers={setAnswers} />
      )}
      {stage.kind === "toggle-grid" && (
        <ToggleGrid stage={stage} answers={answers} setAnswers={setAnswers} />
      )}
      {stage.kind === "style-preset" && (
        <StylePreset stage={stage} answers={answers} setAnswers={setAnswers} />
      )}
      {stage.kind === "brand-color" && (
        <BrandColor stage={stage} answers={answers} setAnswers={setAnswers} />
      )}

      <Button
        variant="primary"
        size="large"
        inlineSize="fill"
        disabled={!isValid}
        onClick={onContinue}
      >
        Continue
      </Button>
    </BlockStack>
  );
}

export function OnboardingNew({
  onGoToDashboard,
  onRestart,
  initialAnswers = {},
}: OnboardingNewPropsType) {
  const [stageIndex, setStageIndex] = useState(0);
  const [answers, setAnswers] = useState<OnboardingNewAnswersType>(initialAnswers);
  const [questionStagesDone, setQuestionStagesDone] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const fallbackStage = FLOW[0] as FlowStageType;
  const currentStage: FlowStageType = FLOW[stageIndex] ?? fallbackStage;
  const totalQuestionStages = FLOW.filter((s) => s.type === "questions").length;

  const advance = useCallback(() => setStageIndex((i) => i + 1), []);

  const handleContinue = () => {
    setLeaving(true);
    setTimeout(() => {
      setQuestionStagesDone((d) => d + 1);
      setStageIndex((i) => i + 1);
      setLeaving(false);
    }, 300);
  };

  const handleReset = () => {
    setAnswers(initialAnswers);
    setQuestionStagesDone(0);
    setStageIndex(0);
    if (onRestart) onRestart();
  };

  const progressPct = (questionStagesDone / totalQuestionStages) * 100;
  const shownStep = Math.min(questionStagesDone + 1, totalQuestionStages);
  const showProgress = currentStage.type !== "complete";

  return (
    <BlockStack inlineSize="100%" minBlockSize="760px" alignItems="center" padding="base">
      <style dangerouslySetInnerHTML={{ __html: onboardingCss }} />

      {showProgress && (
        <Box className="progress-pill" paddingInline="large-100" paddingBlock="small-200">
          <InlineStack alignItems="center" gap="base">
            <Box inlineSize="90px">
              <ProgressBar progress={progressPct} size="xs" tone="success" />
            </Box>
            <Text variant="bodySm" color="subdued" fontWeight="semibold">
              Step {shownStep} of {totalQuestionStages}
            </Text>
          </InlineStack>
        </Box>
      )}
      <BlockStack
        flex={1}
        gap="base"
        alignItems="center"
        justifyContent="center"
        inlineSize="100%"
        maxInlineSize="520px"
      >
        <Box inlineSize="100%">
          <Transition
            reverse
            key={stageIndex}
            animate="fade-up"
            leaving={leaving}
            inlineSize="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            {currentStage.type === "processing" && (
              <ProcessingStage
                texts={(currentStage as StageProcessingType).texts}
                onDone={advance}
              />
            )}
            {currentStage.type === "questions" && (
              <QuestionsStage
                stage={currentStage}
                answers={answers}
                setAnswers={setAnswers}
                onContinue={handleContinue}
              />
            )}
            {currentStage.type === "complete" && (
              <CompleteStage onRestart={handleReset} onGoToDashboard={onGoToDashboard} />
            )}
          </Transition>
        </Box>
      </BlockStack>
    </BlockStack>
  );
}

export default OnboardingNew;
