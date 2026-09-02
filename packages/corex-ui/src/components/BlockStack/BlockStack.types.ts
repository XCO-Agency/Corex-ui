import type { ReactNode } from "react";
import type { Alignment, StackGap } from "../../types/common";

export interface BlockStackProps {
  children?: ReactNode;
  /** @deprecated Numeric values such as `"400"` still work; prefer Polaris tokens such as `"base"`. */
  gap?: StackGap;
  align?: Alignment;
  inlineAlign?: Alignment;
  className?: string;
  id?: string;
}
