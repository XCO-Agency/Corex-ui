import type { CSSProperties, ReactNode } from "react";

export type CardActionType = {
  content: string;
  onAction?: () => void;
  url?: string;
  external?: boolean;
  disabled?: boolean;
  loading?: boolean;
  destructive?: boolean;
};

export type CardPaddingType = "base" | "none" | "0" | (string & {});

export type CardPropsType = {
  children?: ReactNode;
  /** Rendered as a heading above the card content. */
  title?: ReactNode;
  /**
   * @deprecated No equivalent on `s-section` — every `Card` already renders
   * as a single section. Kept only so legacy call sites keep compiling.
   */
  sectioned?: boolean;
  /** Card header actions. */
  actions?: CardActionType[];
  /** Primary action in the card footer. */
  primaryFooterAction?: CardActionType;
  /** Secondary actions in the card footer. */
  secondaryFooterActions?: CardActionType[];
  /** Card padding ('base' | 'none' | legacy '0'). */
  padding?: CardPaddingType;
  /** Card background color. */
  background?: string;
  className?: string;
  id?: string;
  style?: CSSProperties;
  [key: `aria-${string}`]: unknown;
  [key: `data-${string}`]: unknown;
};
