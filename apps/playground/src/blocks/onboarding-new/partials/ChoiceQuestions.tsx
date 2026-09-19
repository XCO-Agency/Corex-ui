import type { Dispatch, SetStateAction } from "react";
import { BlockStack, ChoiceList, Text } from "@xco-agency/corex-ui";
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
    <BlockStack gap="base">
      {stage.questions.map((q) => {
        const isMulti = q.type === "multi";
        const val = answers[q.id];
        const selectedValues = Array.isArray(val)
          ? val
          : typeof val === "string" && val
            ? [val]
            : [];

        return (
          <BlockStack key={q.id} gap="small-200">
            {q.subtitle && (
              <Text variant="bodySm" color="subdued">
                {q.subtitle}
              </Text>
            )}
            <ChoiceList
              title={q.question}
              choices={q.options}
              selected={selectedValues}
              allowMultiple={isMulti}
              onChange={(newSelected) => {
                setAnswers((prev) => ({
                  ...prev,
                  [q.id]: isMulti ? newSelected : (newSelected[0] ?? ""),
                }));
              }}
            />
          </BlockStack>
        );
      })}
    </BlockStack>
  );
}
