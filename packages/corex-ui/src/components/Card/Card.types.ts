import type { CSSProperties, ReactNode } from "react";
import type { PolarisPropsType } from "../../types/common";

export type CardActionType = {
  content: string;
  onAction?: () => void;
  url?: string;
  external?: boolean;
  disabled?: boolean;
  loading?: boolean;
  destructive?: boolean;
};

export type CardPropsType = PolarisPropsType<"s-section"> & {
  /** @deprecated use heading Rendered as a heading above the card content. */
  title?: ReactNode;
  /**
   * @deprecated use
   */
  sectioned?: boolean;
  /** Card header actions. */
  actions?: CardActionType[];
  /** Primary action in the card footer. */
  primaryFooterAction?: CardActionType;
  /** Secondary actions in the card footer. */
  secondaryFooterActions?: CardActionType[];
  /** Card padding ('base' | 'none' | legacy '0'). */
  background?: string;
  id?: string;
  style?: CSSProperties;
  [key: `aria-${string}`]: unknown;
  [key: `data-${string}`]: unknown;
};
