import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  Badge,
  BlockStack,
  Box,
  Clickable,
  Grid,
  InlineStack,
  Switch,
  Text,
} from "@xco-agency/corex-ui";
import type {
  BrandColorsType,
  CartPresetIdType,
  CartPresetOptionType,
  OnboardingNewAnswersType,
} from "../types";
import { DEFAULT_BRAND_COLORS } from "../constants";
import { CartIframe } from "./CartIframe";
import { CartPreviewModal } from "./CartPreviewModal";
import styles from "../cart-variants.module.css";

export const STYLE_PRESET_OPTIONS: CartPresetOptionType[] = [
  { id: "minimal", label: "Minimal" },
  { id: "bold", label: "Bold" },
  { id: "rounded", label: "Rounded" },
  { id: "editorial", label: "Editorial" },
];

const PRESET_SUBTITLES: Record<CartPresetIdType, string> = {
  minimal: "Clean & Scandinavian with hairline borders",
  bold: "High-contrast dark mode with high urgency",
  rounded: "Soft friendly pill curves & warm accents",
  editorial: "Haute-couture serif typography & zero-radius",
};

export type CartPreviewPropsType = {
  presetId: CartPresetIdType;
  brandColors: BrandColorsType;
};

export type StylePresetPropsType = {
  answers: OnboardingNewAnswersType;
  setAnswers: Dispatch<SetStateAction<OnboardingNewAnswersType>>;
};

export function StylePreset({ answers, setAnswers }: StylePresetPropsType) {
  const selected = answers.cartStyle || "minimal";
  const brandColors = answers.brand || DEFAULT_BRAND_COLORS;
  const [modalPreset, setModalPreset] = useState<CartPresetIdType | null>(null);

  useEffect(() => {
    if (!answers.cartStyle) {
      setAnswers((prev) => ({ ...prev, cartStyle: "minimal" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCardClick = (presetId: CartPresetIdType) => {
    setAnswers((prev) => ({ ...prev, cartStyle: presetId }));
    setModalPreset(presetId);
  };

  return (
    <BlockStack inlineSize="100%" alignItems="center" gap="large-100">
      {/* Header text */}
      <BlockStack
        gap="small-200"
        maxInlineSize="520px"
        justifyContent="center"
        alignItems="center"
      >
        <Text variant="headingLg" heading>
          Pick a cart drawer style
        </Text>
        <Text color="subdued">
          A live preview of how your cart drawer will look with your brand colors. Click
          any card to expand it into a full mobile preview.
        </Text>
      </BlockStack>

      {/* 4-column Grid with miniature isolated iframe viewports */}
      <Grid columns={{ xs: 1, sm: 2, md: 4 }} gap="base">
        {STYLE_PRESET_OPTIONS.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <Grid.Item key={opt.id}>
              <Clickable
                onClick={() => handleCardClick(opt.id)}
                inlineSize="fill"
                borderRadius="large"
              >
                <Box
                  borderRadius="large"
                  borderWidth={isSelected ? "050" : "0165"}
                  borderColor={isSelected ? "strong" : "border-subdued"}
                  background="bg-surface"
                  padding="small-200"
                  overflow="hidden"
                >
                  <BlockStack gap="small-200">
                    {/* Miniature Scaled Iframe Viewport */}
                    <Box position="relative" className={styles.cardPreviewWrapper}>
                      <CartIframe
                        preset={opt.id}
                        brand={brandColors}
                        currency="MAD"
                        mode="preview"
                      />

                      {/* Expand Overlay Badge on Hover */}
                      <Box className={styles.expandOverlayBadge}>
                        <Text variant="bodySm" fontWeight="semibold">
                          🔍 Expand
                        </Text>
                      </Box>
                    </Box>

                    {/* Card Footer: Label, Subtitle & Switch */}
                    <Box paddingBlockStart="small-400" paddingInline="small-500">
                      <InlineStack
                        alignItems="center"
                        justifyContent="space-between"
                        gap="small-200"
                      >
                        <BlockStack gap="none">
                          <InlineStack alignItems="center" gap="small-300">
                            <Text variant="bodyMd" fontWeight="semibold">
                              {opt.label}
                            </Text>
                            {isSelected && (
                              <Badge tone="success">Selected</Badge>
                            )}
                          </InlineStack>
                          <Text variant="bodySm" color="subdued">
                            {PRESET_SUBTITLES[opt.id]}
                          </Text>
                        </BlockStack>

                        <Clickable
                          onClick={(e) => {
                            e.stopPropagation();
                            setAnswers((prev) => ({ ...prev, cartStyle: opt.id }));
                          }}
                        >
                          <Switch checked={isSelected} />
                        </Clickable>
                      </InlineStack>
                    </Box>
                  </BlockStack>
                </Box>
              </Clickable>
            </Grid.Item>
          );
        })}
      </Grid>

      {/* Expanded Animated Mobile Viewport Preview Modal */}
      <CartPreviewModal
        open={Boolean(modalPreset)}
        initialPreset={modalPreset || selected}
        brand={brandColors}
        currency="MAD"
        onSelectPreset={(preset) => {
          setAnswers((prev) => ({ ...prev, cartStyle: preset }));
        }}
        onClose={() => setModalPreset(null)}
      />
    </BlockStack>
  );
}
