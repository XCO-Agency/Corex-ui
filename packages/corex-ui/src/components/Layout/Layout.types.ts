import type { CSSProperties, ReactNode } from "react";
import type { BoxPaddingType } from "../../types/common";

/** v12's section widths. Anything else is full width. */
export type LayoutSectionVariantType =
  | "oneHalf"
  | "oneThird"
  | "oneFourth"
  | "fullWidth";

export type LayoutPropsType = {
  children?: ReactNode;
  /** Space between sections. Defaults to `base`. */
  gap?: BoxPaddingType;
  id?: string;
  className?: string;
  style?: CSSProperties;
};

export type LayoutSectionPropsType = {
  children?: ReactNode;
  variant?: LayoutSectionVariantType;
  /** @deprecated v12 alias for `variant="fullWidth"`. */
  fullWidth?: boolean;
  /** @deprecated v12 alias for `variant="oneThird"`. */
  oneThird?: boolean;
  /** @deprecated v12 alias for `variant="oneHalf"`. */
  oneHalf?: boolean;
  id?: string;
  className?: string;
  style?: CSSProperties;
};
