import { useState, useEffect } from "react";
import { BlockStack, Box, Spinner, Text } from "@xco-agency/corex-ui";

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
    }, 1000);

    const apiTimer = setTimeout(
      () => {
        onDone();
      },
      2600 + Math.random() * 400,
    );

    return () => {
      clearInterval(textTimer);
      clearTimeout(apiTimer);
    };
  }, [texts, onDone]);

  return (
    <Box paddingBlock="large-500" inlineSize="100%">
      <BlockStack gap="large-100" alignItems="center" inlineAlign="center">
        <Spinner size="large" accessibilityLabel="Loading stage" />
        <Box className="processing-text" opacity={changing ? "0" : "1"}>
          <Text variant="headingXl" lineClamp={1} heading>
            {texts[textIndex]}
          </Text>
        </Box>
      </BlockStack>
    </Box>
  );
}
