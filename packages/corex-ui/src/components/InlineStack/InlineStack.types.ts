import type { ReactNode } from "react";
import type {
  AlignmentType,
  PolarisPropsType,
  StackGapType,
} from "../../types/common";

type NativeStackProps = PolarisPropsType<"s-stack">;

export type InlineStackPropsType = Omit<
  NativeStackProps,
  "gap" | "direction" | "children"
> & {
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
