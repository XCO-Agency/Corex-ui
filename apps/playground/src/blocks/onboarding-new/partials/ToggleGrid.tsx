import { useEffect } from "react";
import type { CSSProperties, Dispatch, SetStateAction } from "react";
import type { OnboardingNewAnswersType, StageToggleGridType } from "../types";
import { styles } from "../constants";

export type ToggleGridPropsType = {
  stage: StageToggleGridType;
  answers: OnboardingNewAnswersType;
  setAnswers: Dispatch<SetStateAction<OnboardingNewAnswersType>>;
};

export function ToggleGrid({ stage, answers, setAnswers }: ToggleGridPropsType) {
  const selected =
    answers[stage.id] instanceof Set
      ? (answers[stage.id] as Set<string>)
      : new Set(stage.options.filter((o) => o.default).map((o) => o.id));

  useEffect(() => {
    if (!(answers[stage.id] instanceof Set)) {
      setAnswers((prev) => ({ ...prev, [stage.id]: selected }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (id: string) => {
    setAnswers((prev) => {
      const current = prev[stage.id];
      const next = new Set(current instanceof Set ? (current as Set<string>) : []);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...prev, [stage.id]: next };
    });
  };

  return (
    <>
      <div className="toggle-grid" style={styles.toggleGrid as CSSProperties}>
        {stage.options.map((opt) => {
          const isOn = selected.has(opt.id);
          return (
            <div
              key={opt.id}
              role="switch"
              aria-checked={isOn}
              tabIndex={0}
              style={{
                ...(styles.toggleCard as CSSProperties),
                ...(isOn ? (styles.toggleCardOn as CSSProperties) : {}),
              }}
              onClick={() => toggle(opt.id)}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  toggle(opt.id);
                }
              }}
            >
              {opt.badge && <span style={styles.badge as CSSProperties}>{opt.badge}</span>}
              <div
                style={{
                  ...(styles.toggleIconWrap as CSSProperties),
                  ...(isOn ? (styles.toggleIconWrapOn as CSSProperties) : {}),
                }}
              >
                {opt.icon}
              </div>
              <div style={styles.toggleTitle as CSSProperties}>{opt.title}</div>
              <div style={styles.toggleDesc as CSSProperties}>{opt.desc}</div>
              <div
                className={`toggle-switch${isOn ? " is-on" : ""}`}
                style={{
                  ...(styles.toggleSwitch as CSSProperties),
                  ...(isOn ? (styles.toggleSwitchOn as CSSProperties) : {}),
                }}
              />
            </div>
          );
        })}
      </div>
      <p style={styles.hintNote as CSSProperties}>You can add or remove these anytime from your dashboard.</p>
    </>
  );
}
