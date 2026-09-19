import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  Badge,
  BlockStack,
  Box,
  Clickable,
  Grid,
  IconTile,
  InlineStack,
  Switch,
  Text,
} from "@xco-agency/corex-ui";
import type { OnboardingNewAnswersType, StageToggleGridType } from "../types";

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
    <BlockStack gap="base">
      <Grid columns={{ xs: 1, sm: 2 }} gap="base">
        {stage.options.map((opt) => {
          const isOn = selected.has(opt.id);
          return (
            <Grid.Item key={opt.id}>
              <Clickable
                onClick={() => toggle(opt.id)}
                inlineSize="fill"
                borderRadius="base"
              >
                <Box
                  position="relative"
                  padding="base"
                  borderRadius="base"
                  borderWidth={isOn ? "050" : "0165"}
                  borderColor={isOn ? "strong" : "border"}
                  background={isOn ? "bg-surface-secondary" : "bg-surface"}
                  blockSize="100%"
                >
                  {opt.badge && (
                    <Box
                      position="absolute"
                      insetBlockStart="8px"
                      insetInlineEnd="8px"
                      zIndex={1}
                    >
                      <Badge tone="success">{opt.badge}</Badge>
                    </Box>
                  )}

                  <BlockStack gap="small">
                    <IconTile
                      tone={isOn ? "success" : "subdued"}
                      size="md"
                      borderRadius="base"
                    >
                      <Text variant="headingSm">{opt.icon}</Text>
                    </IconTile>

                    <Text variant="bodyMd" fontWeight="semibold">
                      {opt.title}
                    </Text>

                    <Text variant="bodySm" color="subdued">
                      {opt.desc}
                    </Text>

                    <InlineStack justifyContent="flex-end" alignItems="center">
                      <Clickable onClick={(e) => e.stopPropagation()}>
                        <Switch
                          checked={isOn}
                          onChange={() => toggle(opt.id)}
                          accessibilityLabel={`Toggle ${opt.title}`}
                        />
                      </Clickable>
                    </InlineStack>
                  </BlockStack>
                </Box>
              </Clickable>
            </Grid.Item>
          );
        })}
      </Grid>

      <Box paddingBlockStart="small-200">
        <Text variant="bodySm" color="subdued">
          You can add or remove these anytime from your dashboard.
        </Text>
      </Box>
    </BlockStack>
  );
}
