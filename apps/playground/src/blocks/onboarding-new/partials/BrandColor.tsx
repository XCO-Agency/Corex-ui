import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  Badge,
  BlockStack,
  Box,
  Button,
  Card,
  ColorField,
  Grid,
  Icon,
  IconTile,
  InlineStack,
  Text,
} from "@xco-agency/corex-ui";
import type { BrandColorsType, OnboardingNewAnswersType } from "../types";
import { DEFAULT_BRAND_COLORS } from "../constants";

export type BrandColorPropsType = {
  answers: OnboardingNewAnswersType;
  setAnswers: Dispatch<SetStateAction<OnboardingNewAnswersType>>;
};

export function BrandColor({ answers, setAnswers }: BrandColorPropsType) {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const colors = answers.brand || DEFAULT_BRAND_COLORS;

  useEffect(() => {
    if (!answers.brand) {
      setAnswers((prev) => ({ ...prev, brand: DEFAULT_BRAND_COLORS }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateColor = (key: keyof BrandColorsType, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      brand: {
        ...(prev.brand || DEFAULT_BRAND_COLORS),
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
        brand: { ...detected, source: "scan" },
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
    <Card heading="Add your brand colors">
      <BlockStack gap="base">
        <Text color="subdued">
          We&apos;ll use these across your cart drawer, badges, and upsell widgets.
        </Text>

        <Box
          padding="base"
          borderRadius="base"
          borderWidth="0165"
          borderColor="border"
          background="bg-surface-secondary"
        >
          <InlineStack justifyContent="space-between" alignItems="center" gap="base" wrap>
            <InlineStack gap="base" alignItems="center">
              <IconTile tone="success" size="lg" borderRadius="full">
                <Icon type="store" tone="success" />
              </IconTile>
              <BlockStack gap="small-400">
                <Text variant="bodyMd" fontWeight="semibold">
                  Scan your store for branding
                </Text>
                <Text variant="bodySm" color="subdued">
                  We&apos;ll analyze your storefront and match your colors automatically.
                </Text>
              </BlockStack>
            </InlineStack>

            <Button variant="primary" loading={scanning} onClick={handleScan}>
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
                onChange={(val: string) => updateColor(key, val)}
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
    </Card>
  );
}
