import type { Dispatch, SetStateAction } from "react";
import { BlockStack, Card, ChoiceList, Text } from "@xco-agency/corex-ui";
import type { OnboardingNewAnswersType, StageChoiceQuestionsType } from "../types";

export type ChoiceQuestionsPropsType = {
  stage: StageChoiceQuestionsType;
  answers: OnboardingNewAnswersType;
  setAnswers: Dispatch<SetStateAction<OnboardingNewAnswersType>>;
};

export function ChoiceQuestions({
  stage,
  answers,
  setAnswers,
}: ChoiceQuestionsPropsType) {
  return (
    <Card heading="What's your average">
      {stage.questions.map((q) => {
        const isMulti = q.type === "multi";
        const val = answers[q.id];
        const selectedValues = Array.isArray(val)
          ? val
          : typeof val === "string" && val
            ? [val]
            : [];

        return (
          <ChoiceList
            key={q.id}
            label={q.subtitle}
            choices={q.options}
            selected={selectedValues}
            multiple={isMulti}
            onChange={(values) => {
              setAnswers((prev) => ({
                ...prev,
                [q.id]: isMulti ? values : (values[0] ?? ""),
              }));
            }}
          />
        );
      })}
    </Card>
  );
}
