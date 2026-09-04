import type { CSSProperties, ElementType, ReactNode } from "react";
import type { Alignment, AlignmentType, TextVariant, TextVariantType, Tone, ToneType } from "../../types/common";

export type TextPropsType = {
  children?: ReactNode;
  variant?: TextVariantType | TextVariant;
  /** Legacy prop for choosing the rendered HTML tag, e.g. `as="p"`. */
  as?: ElementType;
  /** Modern Polaris text tone ('success' | 'warning' | 'critical' | 'info' | 'neutral'). */
  tone?: ToneType | Tone;
  /** @deprecated Use `tone`. Kept for legacy-API compatibility. */
  color?: ToneType | Tone | "subdued" | (string & {});
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
  [key: `aria-${string}`]: unknown;
  [key: `data-${string}`]: unknown;
};

export type TextProps = TextPropsType;
