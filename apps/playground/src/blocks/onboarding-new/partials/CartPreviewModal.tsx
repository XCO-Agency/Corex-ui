import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  BlockStack,
  Box,
  Button,
  Clickable,
  InlineStack,
  Text,
  Transition,
} from "@xco-agency/corex-ui";
import type { BrandColorsType, CartPresetIdType } from "../types";
import { CartIframe } from "./CartIframe";
import styles from "../cart-variants.module.css";

export interface CartPreviewModalPropsType {
  open: boolean;
  initialPreset: CartPresetIdType;
  brand: BrandColorsType;
  currency?: string;
  onSelectPreset: (preset: CartPresetIdType) => void;
  onClose: () => void;
}

const PRESET_OPTIONS: { id: CartPresetIdType; label: string }[] = [
  { id: "minimal", label: "Minimal" },
  { id: "bold", label: "Bold" },
  { id: "rounded", label: "Rounded" },
  { id: "editorial", label: "Editorial" },
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
  const backdropRef = useRef<HTMLDivElement>(null);

  // Sync active preset whenever initialPreset updates or modal opens
  useEffect(() => {
    setActivePreset(initialPreset);
  }, [initialPreset, open]);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Handle backdrop click to close
  useEffect(() => {
    if (!open) return;
    const el = backdropRef.current;
    if (!el) return;
    const handleBackdropClick = (e: MouseEvent) => {
      if (e.target === el) {
        onClose();
      }
    };
    el.addEventListener("click", handleBackdropClick);
    return () => el.removeEventListener("click", handleBackdropClick);
  }, [open, onClose]);

  if (!open) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <Box
      position="fixed"
      insetBlockStart="0"
      insetInlineStart="0"
      zIndex={99999}
      ref={backdropRef as any}
      className={styles.modalBackdrop}
    >
      <Transition
        animate="scale-up"
        appear
        duration={{ enter: 320, exit: 220 }}
      >
        <Box className={styles.modalContentWrapper}>
          {/* Top Control Bar: Preset Switcher + Actions */}
          <Box
            background="bg-surface"
            padding="small-300 small-200"
            borderRadius="large"
            borderColor="border-subdued"
            borderWidth="0165"
            borderStyle="solid"
          >
            <InlineStack
              alignItems="center"
              justifyContent="space-between"
              gap="base"
            >
              {/* Preset Switcher Pills */}
              <InlineStack alignItems="center" gap="small-400">
                {PRESET_OPTIONS.map((option) => {
                  const isCurrent = activePreset === option.id;
                  return (
                    <Clickable
                      key={option.id}
                      onClick={() => setActivePreset(option.id)}
                      borderRadius="base"
                    >
                      <Box
                        padding="small-400 small-200"
                        borderRadius="base"
                        background={isCurrent ? "bg-surface-strong" : "transparent"}
                      >
                        <Text
                          variant="bodySm"
                          fontWeight={isCurrent ? "bold" : "regular"}
                          color={isCurrent ? undefined : "subdued"}
                        >
                          {option.label}
                        </Text>
                      </Box>
                    </Clickable>
                  );
                })}
              </InlineStack>

              {/* Action Buttons */}
              <InlineStack alignItems="center" gap="small-300">
                <Button
                  variant="primary"
                  onClick={() => {
                    onSelectPreset(activePreset);
                    onClose();
                  }}
                >
                  Select style
                </Button>
                <Button variant="tertiary" onClick={onClose}>
                  Done
                </Button>
              </InlineStack>
            </InlineStack>
          </Box>

          {/* Authentic Mobile Chassis Viewport */}
          <Box
            className={`${styles.modalChassis} ${
              activePreset === "bold" ? styles.modalChassisBold : ""
            }`}
          >
            {/* Simulated Device Status Bar */}
            <Box className={styles.deviceStatusBar}>
              <Text variant="bodySm" fontWeight="semibold">
                9:41
              </Text>
              <Box className={styles.deviceSpeakerNotch} />
              <InlineStack gap="small-500" alignItems="center">
                <Text variant="bodySm">5G</Text>
                <Text variant="bodySm">100%</Text>
              </InlineStack>
            </Box>

            {/* Interactive Cart Drawer inside Iframe */}
            <Box className={styles.deviceViewport}>
              <CartIframe
                preset={activePreset}
                brand={brand}
                currency={currency}
                mode="full"
                interactive={true}
                onClose={onClose}
              />
            </Box>
          </Box>
        </Box>
      </Transition>
    </Box>,
    document.body,
  );
}
