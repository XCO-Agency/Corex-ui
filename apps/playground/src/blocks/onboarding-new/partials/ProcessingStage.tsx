import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { styles } from "../constants";
import { Spinner, Text } from "@xco-agency/corex-ui";

export type ProcessingStagePropsType = {
  texts: string[];
  onDone: () => void;
};

export function ProcessingStage({ texts, onDone }: ProcessingStagePropsType) {
  const [textIndex, setTextIndex] = useState(0);
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    const textTimer = setInterval(() => {
      setChanging(true);
      setTimeout(() => {
        setTextIndex((i) => (i + 1) % texts.length);
        setChanging(false);
      }, 200);
    }, 2000);

    const apiTimer = setTimeout(
      () => {
        onDone();
      },
      8600 + Math.random() * 400,
    );

    return () => {
      clearInterval(textTimer);
      clearTimeout(apiTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={styles.processing as CSSProperties}>
      <span style={{ scale: "1.5" }}>
        <Spinner />
      </span>
      <span
        className="processing-text"
        style={{
          ...(styles.processingText as CSSProperties),
          WebkitTextFillColor: "transparent",
          opacity: changing ? 0 : 1,
          transform: changing ? "translateY(6px)" : "translateY(0)",
        }}
      >
        <Text variant="headingXl" lineClamp={1} heading>
          {texts[textIndex]}
        </Text>
      </span>
    </div>
  );
}
