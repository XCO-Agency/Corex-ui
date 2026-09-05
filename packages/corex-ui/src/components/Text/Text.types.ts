import type { CSSProperties, ElementType, ReactNode } from "react";
import type {
  AlignmentType,
  PolarisPropsType,
  TextVariantType,
  ToneType,
} from "../../types/common";

type NativeTextProps = PolarisPropsType<"s-text">;

export type TextPropsType = Omit<
  NativeTextProps,
  "children" | "color" | "tone" | "type"
> & {
  children?: ReactNode;
  variant?: TextVariantType;
  /** Legacy prop for choosing the rendered HTML tag, e.g. `as="p"`. */
  as?: ElementType;
  /** Modern Polaris text tone ('success' | 'warning' | 'critical' | 'info' | 'neutral'). */
  tone?: ToneType;
  /** Polaris text color ('base' | 'subdued') or legacy tone alias. */
  color?: "base" | "subdued" | ToneType | (string & {});
  alignment?: AlignmentType;
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
  type?: NativeTextProps["type"] | "strong" | "address" | "redundant" | "generic" | (string & {});
  tooltip?: ReactNode;
  [key: `aria-${string}`]: unknown;
  [key: `data-${string}`]: unknown;
};
