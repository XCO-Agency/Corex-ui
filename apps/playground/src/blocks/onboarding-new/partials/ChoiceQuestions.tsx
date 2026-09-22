import type { Dispatch, SetStateAction } from "react";
import { Card, ChoiceList } from "@xco-agency/corex-ui";
import type { ChoiceOptionItemType, OnboardingNewAnswersType } from "../types";

export const VOLUME_OPTIONS: ChoiceOptionItemType[] = [
  {
    label: "Under 100 orders",
    helpText: "Helper text to explain more about this option",
    value: "under-100",
  },
  {
    label: "100–500 orders",
    helpText: "Helper text to explain more about this option",
    value: "100-500",
  },
  {
    label: "500–2,000 orders",
    helpText: "Helper text to explain more about this option",
    value: "500-2000",
  },
  {
    label: "2,000+ orders",
    helpText: "Helper text to explain more about this option",
    value: "2000-plus",
  },
];

export type ChoiceQuestionsPropsType = {
  answers: OnboardingNewAnswersType;
  setAnswers: Dispatch<SetStateAction<OnboardingNewAnswersType>>;
};

export function ChoiceQuestions({
  answers,
  setAnswers,
}: ChoiceQuestionsPropsType) {
  const val = answers.volume;
  const selectedValues = val ? [val] : [];

  return (
    <Card heading="What's your average monthly order volume?">
      <ChoiceList
        label="This helps us tailor performance settings to your store size."
        choices={VOLUME_OPTIONS}
        selected={selectedValues}
        onChange={(values) => {
          setAnswers((prev) => ({
            ...prev,
            volume: values[0] ?? "",
          }));
        }}
      />
    </Card>
  );
}

