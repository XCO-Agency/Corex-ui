import type { CSSProperties, Dispatch, SetStateAction } from "react";
import type { OnboardingNewAnswersType, StageChoiceQuestionsType } from "../types";
import { styles } from "../constants";

export type CheckIconPropsType = {
  selected?: boolean;
};

export function CheckIcon({ selected }: CheckIconPropsType) {
  return (
    <svg
      style={{
        ...(styles.checkIcon as CSSProperties),
        opacity: selected ? 1 : 0,
        transform: selected ? "scale(1)" : "scale(.5)",
      }}
      viewBox="0 0 16 16"
    >
      <path d="M3 8.5l3 3 7-7" style={styles.checkPath as CSSProperties} />
    </svg>
  );
}

export type ChoiceQuestionsPropsType = {
  stage: StageChoiceQuestionsType;
  answers: OnboardingNewAnswersType;
  setAnswers: Dispatch<SetStateAction<OnboardingNewAnswersType>>;
};

export function ChoiceQuestions({ stage, answers, setAnswers }: ChoiceQuestionsPropsType) {
  return (
    <>
      {stage.questions.map((q) => (
        <div key={q.id} style={styles.questionBlock as CSSProperties}>
          <div style={styles.qTitle as CSSProperties}>{q.question}</div>
          {q.subtitle && <div style={styles.qSub as CSSProperties}>{q.subtitle}</div>}

          {(q.type === "single" || q.type === "multi") && (
            <div
              style={styles.qOptions as CSSProperties}
              role={q.type === "multi" ? "group" : "radiogroup"}
            >
              {q.options?.map((opt) => {
                const isMulti = q.type === "multi";
                const currentVal = answers[q.id];
                const selected = isMulti
                  ? currentVal instanceof Set && currentVal.has(opt)
                  : currentVal === opt;

                return (
                  <button
                    key={opt}
                    type="button"
                    role={isMulti ? "checkbox" : "radio"}
                    aria-checked={selected}
                    className="q-option"
                    style={{
                      ...(styles.qOption as CSSProperties),
                      ...(selected ? (styles.qOptionSelected as CSSProperties) : {}),
                    }}
                    onClick={() => {
                      setAnswers((prev) => {
                        if (isMulti) {
                          const nextSet = new Set(prev[q.id] instanceof Set ? (prev[q.id] as Set<string>) : []);
                          if (nextSet.has(opt)) nextSet.delete(opt);
                          else nextSet.add(opt);
                          return { ...prev, [q.id]: nextSet };
                        }
                        return { ...prev, [q.id]: opt };
                      });
                    }}
                  >
                    <span
                      style={{
                        ...(styles.indicator as CSSProperties),
                        ...(isMulti ? (styles.indicatorSquare as CSSProperties) : {}),
                        ...(selected ? (styles.indicatorSelected as CSSProperties) : {}),
                      }}
                    >
                      <CheckIcon selected={selected} />
                    </span>
                    <span style={styles.optLabel as CSSProperties}>{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {q.type === "input" && (
            <div style={styles.qInputWrap as CSSProperties}>
              <span style={styles.qInputPrefix as CSSProperties}>{q.prefix}</span>
              <input
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder={q.placeholder}
                value={(answers[q.id] as string) || ""}
                className="q-input"
                style={styles.qInput as CSSProperties}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
              />
            </div>
          )}
        </div>
      ))}
    </>
  );
}
