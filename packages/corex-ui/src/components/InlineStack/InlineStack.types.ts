import type { ReactNode } from "react";
import type { AlignmentType, StackGapType } from "../../types/common";

export type InlineStackPropsType = {
  children?: ReactNode;
  /**
   * Spacing between children.
   * Uses Polaris web-component spacing tokens (e.g. `"small-200"`, `"base"`).
   * Legacy numeric values such as `"200"` are supported for backward compatibility.
   */
  gap?: StackGapType;
  align?: AlignmentType;
  blockAlign?: AlignmentType;
  wrap?: boolean;
  className?: string;
  id?: string;
};

export type InlineStackProps = InlineStackPropsType;
