import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  Badge,
  BlockStack,
  Box,
  Button,
  ColorField,
  Grid,
  Icon,
  IconTile,
  InlineStack,
  Text,
} from "@xco-agency/corex-ui";
import type {
  BrandColorsType,
  OnboardingNewAnswersType,
  StageBrandColorType,
} from "../types";
import { DEFAULT_BRAND_COLORS } from "../constants";

export type BrandColorPropsType = {
  stage: StageBrandColorType;
  answers: OnboardingNewAnswersType;
  setAnswers: Dispatch<SetStateAction<OnboardingNewAnswersType>>;
};

export function BrandColor({
  stage,
  answers,
  setAnswers,
}: BrandColorPropsType) {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const colors =
    (answers[stage.id] as BrandColorsType) || DEFAULT_BRAND_COLORS;

  useEffect(() => {
    if (!answers[stage.id]) {
      setAnswers((prev) => ({ ...prev, [stage.id]: DEFAULT_BRAND_COLORS }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateColor = (key: keyof BrandColorsType, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [stage.id]: {
        ...((prev[stage.id] as BrandColorsType) || DEFAULT_BRAND_COLORS),
        [key]: value,
        source: "manual",
      },
    }));
  };

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      const detected: BrandColorsType = {
        primary: "#1F6F50",
        secondary: "#10241C",
        accent: "#E8B84B",
        background: "#F2F5F1",
      };
      setAnswers((prev) => ({
        ...prev,
        [stage.id]: { ...detected, source: "scan" },
      }));
      setScanning(false);
      setScanned(true);
    }, 1500);
  };

  const order: [keyof BrandColorsType, string][] = [
    ["primary", "Primary"],
    ["secondary", "Secondary"],
    ["accent", "Accent"],
    ["background", "Background"],
  ];

  return (
    <BlockStack gap="base">
      <Box
        padding="base"
        borderRadius="base"
        borderWidth="0165"
        borderColor="border"
        background="bg-surface-secondary"
      >
        <InlineStack
          justifyContent="space-between"
          alignItems="center"
          gap="base"
          wrap
        >
          <InlineStack gap="base" alignItems="center">
            <IconTile tone="success" size="lg" borderRadius="full">
              <Icon type="store" tone="success" />
            </IconTile>
            <BlockStack gap="small-400">
              <Text variant="bodyMd" fontWeight="semibold">
                Scan your store for branding
              </Text>
              <Text variant="bodySm" color="subdued">
                We&apos;ll analyze your storefront and match your colors
                automatically.
              </Text>
            </BlockStack>
          </InlineStack>

          <Button
            variant="primary"
            loading={scanning}
            onClick={handleScan}
          >
            {scanned ? "Scan again" : "Scan now"}
          </Button>
        </InlineStack>
      </Box>

      {scanned && (
        <Box paddingBlock="small-200">
          <InlineStack gap="small-200" alignItems="center">
            <Icon type="check" tone="success" />
            <Text variant="bodySm" color="success" fontWeight="semibold">
              Colors updated from your store
            </Text>
          </InlineStack>
        </Box>
      )}

      <Grid columns={{ xs: 2, sm: 4 }} gap="base">
        {order.map(([key, label]) => (
          <Grid.Item key={key}>
            <ColorField
              label={label}
              value={colors[key] || "#000000"}
              onChange={(val) => updateColor(key, val)}
            />
          </Grid.Item>
        ))}
      </Grid>

      <Box
        padding="base"
        borderRadius="base"
        borderWidth="0165"
        borderColor="border"
        background="bg-surface-secondary"
      >
        <BlockStack gap="small">
          <Text variant="bodySm" color="subdued" fontWeight="semibold">
            Live preview
          </Text>
          <InlineStack gap="base" alignItems="center">
            <Button variant="primary">Add to cart</Button>
            <Badge tone="success">Sale</Badge>
          </InlineStack>
        </BlockStack>
      </Box>
    </BlockStack>
  );
}
