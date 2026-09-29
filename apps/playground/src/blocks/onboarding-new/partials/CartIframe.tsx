import { Box } from "@xco-agency/corex-ui";
import type { BrandColorsType, CartPresetIdType } from "../types";
import { CartDrawerContent } from "./CartDrawerContent";
import styles from "../cart-variants.module.css";

export interface CartIframePropsType {
  preset: CartPresetIdType;
  brand: BrandColorsType;
  currency?: string;
  mode?: "preview" | "full";
  interactive?: boolean;
  onClose?: () => void;
}

export function CartIframe({
  preset,
  brand,
  currency = "MAD",
  mode = "preview",
  interactive = mode === "full",
  onClose,
}: CartIframePropsType) {
  if (mode === "preview") {
    return (
      <Box className={styles.cardDrawerPreview} inlineSize="100%">
        <CartDrawerContent
          preset={preset}
          brand={brand}
          currency={currency}
          interactive={false}
        />
      </Box>
    );
  }

  // Full-size interactive viewport
  return (
    <Box
      inlineSize="100%"
      blockSize="100%"
      position="relative"
      background="transparent"
      overflow="hidden"
    >
      <CartDrawerContent
        preset={preset}
        brand={brand}
        currency={currency}
        interactive={interactive}
        onClose={onClose}
      />
    </Box>
  );
}
