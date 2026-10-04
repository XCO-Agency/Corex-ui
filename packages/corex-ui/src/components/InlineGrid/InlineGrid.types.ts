import type { CSSProperties, ReactNode } from "react";
import type { BoxPaddingType } from "../../types/common";
import type { GridAlignItemsKeywordType } from "../Grid/Grid.types";

/**
 * v12 accepted three shapes: a column count (`2`), a track list
 * (`"1fr auto"` or `["oneThird", "twoThirds"]`), and a per-breakpoint object of
 * either.
 */
export type InlineGridTrackType = number | string | string[];

export type InlineGridColumnsType =
  | InlineGridTrackType
  | {
      xs?: InlineGridTrackType;
      sm?: InlineGridTrackType;
      md?: InlineGridTrackType;
      lg?: InlineGridTrackType;
    };

export type InlineGridPropsType = {
  children?: ReactNode;
  columns?: InlineGridColumnsType;
  gap?: BoxPaddingType;
  alignItems?: GridAlignItemsKeywordType;
  id?: string;
  className?: string;
  style?: CSSProperties;
};
