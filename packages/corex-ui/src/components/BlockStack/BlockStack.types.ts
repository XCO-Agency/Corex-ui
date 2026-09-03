import type { ReactNode } from "react";
import type { AlignmentType, StackGapType } from "../../types/common";

export type BlockStackPropsType = {
  children?: ReactNode;
  /**
   * Spacing between children.
   * Uses Polaris web-component spacing tokens (e.g. `"small-200"`, `"base"`).
   * Legacy numeric values such as `"400"` are supported for backward compatibility.
   */
  gap?: StackGapType;
  align?: AlignmentType;
  inlineAlign?: AlignmentType;
  className?: string;
  id?: string;
};

export type BlockStackProps = BlockStackPropsType;
