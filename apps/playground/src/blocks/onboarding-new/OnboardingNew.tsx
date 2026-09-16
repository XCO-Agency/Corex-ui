import { useState, useEffect, useCallback } from "react";
import type { CSSProperties, Dispatch, SetStateAction } from "react";
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
  StageTransitionPropsType,
} from "./types";
import { FLOW, styles } from "./constants";
import { ProcessingStage } from "./partials/ProcessingStage";
import { ChoiceQuestions } from "./partials/ChoiceQuestions";
import { ToggleGrid } from "./partials/ToggleGrid";
import { StylePreset } from "./partials/StylePreset";
import { BrandColor } from "./partials/BrandColor";
import { CompleteStage } from "./partials/CompleteStage";
import { InlineStack } from "@xco-agency/corex-ui";

function StageTransition({ children, leaving }: StageTransitionPropsType) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(raf1);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: leaving ? 0 : entered ? 1 : 0,
        transform: leaving
          ? "translateY(-14px) scale(.96)"
          : entered
            ? "translateY(0) scale(1)"
            : "translateY(8px) scale(.96)",
        transition: leaving
          ? "opacity .35s ease, transform .35s ease"
          : "opacity .35s cubic-bezier(.22,1,.36,1), transform .35s cubic-bezier(.22,1,.36,1)",
      }}
    >
      {children}
    </div>
  );
}

function getStageValidity(
  stage: FlowStageType,
  answers: OnboardingNewAnswersType,
): boolean {
  if (stage.type === "questions") {
    if (stage.kind === "choice") {
      return stage.questions.every((q) => {
        const val = answers[q.id];
        if (q.type === "single") return !!val;
        if (q.type === "multi") return val instanceof Set && val.size > 0;
        if (q.type === "input") return !!val && parseFloat(String(val)) > 0;
        return true;
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
    <>
      <div className="panel" style={styles.panel as CSSProperties}>
        {stage.kind !== "choice" && (
          <>
            <h3 style={styles.batchTitle as CSSProperties}>{stage.title}</h3>
            {stage.subtitle && (
              <p style={styles.batchSubtitle as CSSProperties}>{stage.subtitle}</p>
            )}
          </>
        )}

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
      </div>

      <button
        type="button"
        className="btn"
        style={{
          ...(styles.btn as CSSProperties),
          ...(isValid ? {} : (styles.btnDisabled as CSSProperties)),
        }}
        disabled={!isValid}
        onClick={onContinue}
      >
        Continue
      </button>
    </>
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
    <InlineStack
      justifyContent="center"
      alignItems="center"
      inlineSize="100%"
      blockSize="800px"
    >
      <style dangerouslySetInnerHTML={{ __html: onboardingCss }} />

      <div
        style={{
          ...(styles.progressPill as CSSProperties),
          opacity: showProgress ? 1 : 0,
          transform: showProgress ? "translate(-50%, 0)" : "translate(-50%, -14px)",
          pointerEvents: showProgress ? "auto" : "none",
        }}
      >
        <div style={styles.progressTrack as CSSProperties}>
          <div
            style={{
              ...(styles.progressFill as CSSProperties),
              width: `${progressPct}%`,
            }}
          />
        </div>
        <span style={styles.progressLabel as CSSProperties}>
          Step {shownStep} of {totalQuestionStages}
        </span>
      </div>

      <div style={styles.stageWrap as CSSProperties}>
        <StageTransition key={stageIndex} leaving={leaving}>
          {currentStage.type === "processing" && (
            <ProcessingStage
              texts={(currentStage as StageProcessingType).texts}
              onDone={advance}
            />
          )}
          {currentStage.type === "questions" && (
            <QuestionsStage
              stage={
                currentStage as
                  | StageChoiceQuestionsType
                  | StageToggleGridType
                  | StageStylePresetType
                  | StageBrandColorType
              }
              answers={answers}
              setAnswers={setAnswers}
              onContinue={handleContinue}
            />
          )}
          {currentStage.type === "complete" && (
            <CompleteStage onRestart={handleReset} onGoToDashboard={onGoToDashboard} />
          )}
        </StageTransition>
      </div>
    </InlineStack>
  );
}

export default OnboardingNew;
