import type { ElementType, ReactNode } from "react";
import type { Alignment, TextVariant, Tone } from "../../types/common";

export interface TextProps {
  children?: ReactNode;
  variant?: TextVariant;
  /** Legacy prop for choosing the rendered HTML tag, e.g. `as="p"`. */
  as?: ElementType;
  tone?: Tone;
  alignment?: Alignment;
  fontWeight?: "regular" | "medium" | "semibold" | "bold";
  truncate?: boolean;
  className?: string;
  id?: string;
}
