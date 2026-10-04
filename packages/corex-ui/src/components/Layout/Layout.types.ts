import type { CSSProperties, ReactNode } from "react";
import type { BoxPaddingType } from "../../types/common";
import type { ResponsivePropType } from "../Box/Box.types";
import type { GridColumnsType } from "../Grid/Grid.types";

/** v12's section widths. Anything else is full width. */
export type LayoutSectionVariantType =
  | "oneHalf"
  | "oneThird"
  | "oneFourth"
  | "twoThirds"
  | "threeFourths"
  | "secondary"
  | "fullWidth";

export type LayoutPropsType = {
  children?: ReactNode;
  /** Space between sections. Defaults to `base`. */
  gap?: BoxPaddingType;
  /** Grid columns configuration. Defaults to responsive { xs: 1, sm: 1, md: 12, lg: 12 }. */
  columns?: GridColumnsType;
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
  /** @deprecated alias for `variant="oneFourth"`. */
  oneFourth?: boolean;
  /** @deprecated alias for `variant="secondary"` (1/3 width). */
  secondary?: boolean;
  /** Custom column span override. */
  columnSpan?: ResponsivePropType<number>;
  /** Internal calculated column span injected by parent Layout. */
  _calculatedSpan?: number;
  id?: string;
  className?: string;
  style?: CSSProperties;
};
