import type { CSSProperties, ReactNode } from "react";
import type { StackGapType } from "../../types/common";
import type { InlineGridColumnsType } from "../InlineGrid/InlineGrid.types";

export type FormLayoutPropsType = {
  children?: ReactNode;
  /** Space between fields. Defaults to `base`. */
  gap?: StackGapType;
  /** Width of the form layout. Defaults to `100%`. */
  inlineSize?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
};

export type FormLayoutGroupPropsType = {
  children?: ReactNode;
  /** Tighter spacing between fields (`small-200` instead of `base`). */
  condensed?: boolean;
  /** Group title / heading rendered above the fields. */
  title?: ReactNode;
  /** Additional help text rendered beneath the fields. */
  helpText?: ReactNode;
  /** Custom columns count or responsive spec. Defaults to equal columns across children. */
  columns?: InlineGridColumnsType;
  id?: string;
  className?: string;
  style?: CSSProperties;
};
