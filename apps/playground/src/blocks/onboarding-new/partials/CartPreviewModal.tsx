import { useEffect, useState } from "react";
import {
  Badge,
  BlockStack,
  Box,
  Button,
  Clickable,
  Grid,
  InlineStack,
  Modal,
  Text,
} from "@xco-agency/corex-ui";
import type { BrandColorsType, CartPresetIdType } from "../types";
import { CartDrawerContent } from "./CartDrawerContent";
import styles from "../cart-variants.module.css";

export interface CartPreviewModalPropsType {
  open: boolean;
  initialPreset: CartPresetIdType;
  brand: BrandColorsType;
  currency?: string;
  onSelectPreset: (preset: CartPresetIdType) => void;
  onClose: () => void;
}

type PresetOptionType = {
  id: CartPresetIdType;
  label: string;
  badge: string;
  description: string;
  tone: "success" | "info" | "neutral" | "warning";
};

const PRESET_OPTIONS: PresetOptionType[] = [
  {
    id: "minimal",
    label: "Minimal",
    badge: "Clean",
    description: "Clean & Scandinavian with hairline borders",
    tone: "neutral",
  },
  {
    id: "bold",
    label: "Bold",
    badge: "Dark Mode",
    description: "High-contrast dark mode with high urgency",
    tone: "warning",
  },
  {
    id: "rounded",
    label: "Rounded",
    badge: "Friendly",
    description: "Soft friendly pill curves & warm accents",
    tone: "info",
  },
  {
    id: "editorial",
    label: "Editorial",
    badge: "Haute-Couture",
    description: "Haute-couture serif typography & zero-radius",
    tone: "neutral",
  },
];

export function CartPreviewModal({
  open,
  initialPreset,
  brand,
  currency = "MAD",
  onSelectPreset,
  onClose,
}: CartPreviewModalPropsType) {
  const [activePreset, setActivePreset] = useState<CartPresetIdType>(initialPreset);

  // Sync active preset whenever initialPreset updates or modal opens
  useEffect(() => {
    setActivePreset(initialPreset);
  }, [initialPreset, open]);

  const activeOption = PRESET_OPTIONS.find((p) => p.id === activePreset);

  const handleApply = () => {
    onSelectPreset(activePreset);
    onClose();
  };

  return (
    <Modal size="base" open={open} onClose={onClose} title="Preview Cart Drawer Style">
      <Grid columns={{ xs: 1, md: 5 }} gap="large-100">
        {/* Actions to switch styles on the LEFT (2 columns on md) */}
        <Grid.Item columnSpan={{ xs: 1, md: 2 }}>
          <BlockStack gap="base">
            <BlockStack gap="small-200">
              <Text variant="headingSm" as="h3" fontWeight="semibold">
                Select Drawer Style
              </Text>
              <Text variant="bodySm" color="subdued">
                Click any style below to switch the live cart drawer preview.
              </Text>
            </BlockStack>

            {/* Vertical Stack of Preset Switcher Action Cards */}
            <BlockStack gap="small-300">
              {PRESET_OPTIONS.map((option) => {
                const isActive = activePreset === option.id;
                const isCurrentSaved = initialPreset === option.id;

                return (
                  <Clickable
                    key={option.id}
                    onClick={() => setActivePreset(option.id)}
                    borderRadius="large"
                  >
                    <Box
                      padding="small-200 base"
                      borderRadius="large"
                      borderWidth={isActive ? "050" : "0165"}
                      borderColor={isActive ? "strong" : "border-subdued"}
                      background={isActive ? "bg-surface-secondary" : "bg-surface"}
                    >
                      <BlockStack gap="small-100">
                        <InlineStack
                          justifyContent="space-between"
                          alignItems="center"
                          gap="small-200"
                        >
                          <InlineStack gap="small-200" alignItems="center">
                            <Text
                              variant="bodyMd"
                              fontWeight={isActive ? "bold" : "semibold"}
                            >
                              {option.label}
                            </Text>
                            <Badge tone={option.tone}>{option.badge}</Badge>
                          </InlineStack>

                          {isActive && <Badge tone="success">Active</Badge>}
                          {isCurrentSaved && !isActive && (
                            <Badge tone="info">Saved</Badge>
                          )}
                        </InlineStack>

                        <Text variant="bodySm" color="subdued">
                          {option.description}
                        </Text>
                      </BlockStack>
                    </Box>
                  </Clickable>
                );
              })}
            </BlockStack>

            <InlineStack gap="small-200">
              <Button variant="primary" onClick={handleApply}>
                Apply {activeOption?.label || "Selected"} Style
              </Button>
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
            </InlineStack>
          </BlockStack>
        </Grid.Item>

        {/* Cart Drawer Viewport on the RIGHT (3 columns on md) */}
        <Grid.Item columnSpan={{ xs: 1, md: 3 }}>
          <Box className={styles.modalDeviceViewport}>
            <CartDrawerContent
              preset={activePreset}
              brand={brand}
              currency={currency}
              interactive={true}
              onClose={onClose}
            />
          </Box>
        </Grid.Item>
      </Grid>
    </Modal>
  );
}
