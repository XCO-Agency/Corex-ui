import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  Badge,
  BlockStack,
  Box,
  Card,
  Clickable,
  Grid,
  IconTile,
  InlineStack,
  Switch,
  Text,
} from "@xco-agency/corex-ui";
import type { OnboardingNewAnswersType, RevenueToolOptionType } from "../types";

export const REVENUE_TOOL_OPTIONS: RevenueToolOptionType[] = [
  {
    id: "shipping-protection",
    icon: "📦",
    title: "Shipping protection",
    desc: "Let customers insure their order against loss or damage.",
    default: false,
  },
  {
    id: "warranty",
    icon: "🛡️",
    title: "Product warranty",
    desc: "Offer extended warranty coverage at checkout.",
    default: false,
  },
  {
    id: "gift-wrap",
    icon: "🎁",
    title: "Gift wrapping",
    desc: "Let customers add gift wrap for a small fee.",
    default: false,
  },
  {
    id: "cart-upsells",
    icon: "🛒",
    title: "Cart drawer upsells",
    desc: "Show smart product recommendations in the cart.",
    default: true,
    badge: "Recommended",
  },
];

export type ToggleGridPropsType = {
  answers: OnboardingNewAnswersType;
  setAnswers: Dispatch<SetStateAction<OnboardingNewAnswersType>>;
};

export function ToggleGrid({ answers, setAnswers }: ToggleGridPropsType) {
  const selected =
    answers.addons instanceof Set
      ? (answers.addons as Set<string>)
      : new Set(REVENUE_TOOL_OPTIONS.filter((o) => o.default).map((o) => o.id));

  useEffect(() => {
    if (!(answers.addons instanceof Set)) {
      setAnswers((prev) => ({ ...prev, addons: selected }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (id: string) => {
    setAnswers((prev) => {
      const current = prev.addons;
      const next = new Set(current instanceof Set ? (current as Set<string>) : []);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...prev, addons: next };
    });
  };

  return (
    <Card heading="Add revenue tools to your cart">
      <BlockStack gap="base">
        <Text color="subdued">
          Turn these on now, or customize them anytime from your dashboard.
        </Text>
        <Grid columns={{ xs: 1, sm: 2 }} gap="base">
          {REVENUE_TOOL_OPTIONS.map((opt) => {
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
      </BlockStack>
    </Card>
  );
}
