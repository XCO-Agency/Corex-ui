import type { ReactNode } from "react";
import type { IconType, PolarisPropsType } from "../../types/common";

export type CardActionType = {
  content: string;
  onAction?: () => void;
  url?: string;
  external?: boolean;
  disabled?: boolean;
  loading?: boolean;
  destructive?: boolean;
};

/**
 * Props for `<Card>`.
 * Note: `<Card>` wraps Shopify's `<s-section>` web component.
 * Do not rely on passing inline `style` to `<Card>` as styles will not reliably apply
 * to the underlying web component surface. Use an outer wrapper or internal child elements instead.
 */
export type CardPropsType = PolarisPropsType<"s-section"> & {
  /** @deprecated use "@heading" Rendered as a heading above the card content. */
  title?: ReactNode;
  /**
   * @deprecated use
   */
  sectioned?: boolean;
  /** Card header actions. */
  icon?: IconType;
  description?: ReactNode;
  tooltip?: ReactNode;
  actions?: ReactNode;
  /** Primary action in the card footer. */
  primaryFooterAction?: CardActionType;
  /** Secondary actions in the card footer. */
  secondaryFooterActions?: CardActionType[];
  /** Card padding ('base' | 'none' | legacy '0'). */
  background?: string;
  id?: string;
  [key: `aria-${string}`]: unknown;
  [key: `data-${string}`]: unknown;
};
