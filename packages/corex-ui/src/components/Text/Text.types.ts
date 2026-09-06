import type { CSSProperties, ElementType, ReactNode } from "react";
import type {
  AlignmentType,
  PolarisPropsType,
  TextVariantType,
  ToneType,
} from "../../types/common";

type NativeTextProps = PolarisPropsType<"s-text">;

export type TextPropsType = Omit<NativeTextProps, "children"> & {
  children?: ReactNode;
  variant?: "xs" | "small" | "base" | "large";
  /** Applies heading weight and semantic h* wrapper tag per variant */
  heading?: boolean;
  /** Custom tag override (e.g. `as="p"` or `as="span"`). */
  as?: ElementType;
  /** Modern Polaris text tone ('success' | 'warning' | 'critical' | 'info' | 'neutral'). */
  /** Shorthand for subdued color */
  underline?: boolean;
  alignment?: AlignmentType;
  truncate?: boolean;
  breakWord?: boolean;
  numeric?: boolean;
  className?: string;
  style?: CSSProperties;
  tooltip?: ReactNode;
  /** ID of the element (e.g. s-tooltip) that should respond to interest/hover on this text */
  interestFor?: string;
  [key: `aria-${string}`]: unknown;
  [key: `data-${string}`]: unknown;
};
