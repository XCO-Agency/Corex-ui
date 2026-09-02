import type { ReactNode } from "react";
import type { Alignment, StackGap } from "../../types/common";

export interface InlineStackProps {
  children?: ReactNode;
  /** @deprecated Numeric values such as `"200"` still work; prefer Polaris tokens such as `"small"`. */
  gap?: StackGap;
  align?: Alignment;
  blockAlign?: Alignment;
  wrap?: boolean;
  className?: string;
  id?: string;
}
