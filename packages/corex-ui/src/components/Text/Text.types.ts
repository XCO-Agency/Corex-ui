import type { CSSProperties, ElementType, ReactNode } from "react";
import type {
  Alignment,
  AlignmentType,
  TextVariant,
  TextVariantType,
  Tone,
  ToneType,
} from "../../types/common";

export type TextPropsType = {
  children?: ReactNode;
  variant?: TextVariantType | TextVariant;
  /** Legacy prop for choosing the rendered HTML tag, e.g. `as="p"`. */
  as?: ElementType;
  /** Modern Polaris text tone ('success' | 'warning' | 'critical' | 'info' | 'neutral'). */
  tone?: ToneType | Tone;
  /** Polaris text color ('base' | 'subdued') or legacy tone alias. */
  color?: "base" | "subdued" | ToneType | Tone | (string & {});
  alignment?: AlignmentType | Alignment;
  fontWeight?: "regular" | "medium" | "semibold" | "bold";
  truncate?: boolean;
  breakWord?: boolean;
  numeric?: boolean;
  /** Visually hide text while keeping accessible to screen readers. */
  visuallyHidden?: boolean;
  className?: string;
  id?: string;
  style?: CSSProperties;
  /** Polaris web-component type attribute ('strong' | 'address' | 'redundant' | 'generic'). */
  type?: "strong" | "address" | "redundant" | "generic" | (string & {});
  /** Associates text with an interactive element (e.g. s-tooltip id). */
  interestFor?: string;
  /** Polaris web-component font-variant-numeric ('auto' | 'normal' | 'tabular-nums'). */
  fontVariantNumeric?: "auto" | "normal" | "tabular-nums" | (string & {});
  tooltip?: ReactNode;
  [key: `aria-${string}`]: unknown;
  [key: `data-${string}`]: unknown;
};

export type TextProps = TextPropsType;
