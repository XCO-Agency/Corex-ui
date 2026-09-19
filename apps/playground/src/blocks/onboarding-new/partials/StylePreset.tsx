import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  BlockStack,
  Box,
  Clickable,
  Grid,
  Text,
} from "@xco-agency/corex-ui";
import type {
  CartPresetIdType,
  OnboardingNewAnswersType,
  StageStylePresetType,
} from "../types";

export type CartPreviewPropsType = {
  presetId: CartPresetIdType;
};

export function CartPreview({ presetId }: CartPreviewPropsType) {
  const isBold = presetId === "bold";
  const isRounded = presetId === "rounded";
  const isEditorial = presetId === "editorial";

  return (
    <Box
      inlineSize="100%"
      blockSize="64px"
      borderRadius={isRounded ? "large-100" : isEditorial ? "none" : "base"}
      background={isBold ? "bg-surface-secondary" : "bg-surface"}
      borderWidth="0165"
      borderColor="border"
      borderStyle={isEditorial ? "dashed" : "solid"}
    />
  );
}

export type StylePresetPropsType = {
  stage: StageStylePresetType;
  answers: OnboardingNewAnswersType;
  setAnswers: Dispatch<SetStateAction<OnboardingNewAnswersType>>;
};

export function StylePreset({ stage, answers, setAnswers }: StylePresetPropsType) {
  const selected = (answers[stage.id] as CartPresetIdType) || stage.default;

  useEffect(() => {
    if (!answers[stage.id]) {
      setAnswers((prev) => ({ ...prev, [stage.id]: stage.default }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid columns={{ xs: 2, sm: 4 }} gap="base">
      {stage.options.map((opt) => {
        const isSelected = selected === opt.id;
        return (
          <Grid.Item key={opt.id}>
            <Clickable
              onClick={() => setAnswers((prev) => ({ ...prev, [stage.id]: opt.id }))}
              inlineSize="fill"
              borderRadius="base"
            >
              <Box
                padding="small-200"
                borderRadius="base"
                borderWidth={isSelected ? "050" : "0165"}
                borderColor={isSelected ? "strong" : "border"}
                background={isSelected ? "bg-surface-secondary" : "bg-surface"}
              >
                <BlockStack gap="small-200" alignItems="center">
                  <CartPreview presetId={opt.id} />
                  <Text variant="bodySm" fontWeight="semibold" alignment="center">
                    {opt.label}
                  </Text>
                </BlockStack>
              </Box>
            </Clickable>
          </Grid.Item>
        );
      })}
    </Grid>
  );
}
