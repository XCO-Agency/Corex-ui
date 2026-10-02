import type { CSSProperties, ReactNode } from "react";

export type TextContainerSpacingType = "tight" | "loose";

export type TextContainerPropsType = {
  children?: ReactNode;
  /** v12's two rhythms. Defaults to `loose`. */
  spacing?: TextContainerSpacingType;
  id?: string;
  className?: string;
  style?: CSSProperties;
};
