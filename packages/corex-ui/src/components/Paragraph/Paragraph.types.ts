import type { CSSProperties, ReactNode } from "react";
import type { PolarisPropsType } from "../../types/common";

type NativeParagraphProps = PolarisPropsType<"s-paragraph">;

export type ParagraphPropsType = Omit<NativeParagraphProps, "children"> & {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  [key: `aria-${string}`]: unknown;
  [key: `data-${string}`]: unknown;
};
