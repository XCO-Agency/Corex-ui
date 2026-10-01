import type { CSSProperties, ReactNode } from "react";
import type { StackGapType } from "../../types/common";

export type FormLayoutPropsType = {
  children?: ReactNode;
  /** Space between fields. Defaults to `base`. */
  gap?: StackGapType;
  id?: string;
  className?: string;
  style?: CSSProperties;
};

export type FormLayoutGroupPropsType = {
  children?: ReactNode;
  /** v12's tighter row. */
  condensed?: boolean;
  /** @deprecated v12 drew a heading above the group; pass a `Text` instead. */
  title?: ReactNode;
  /** @deprecated v12's help text under the group; pass a `Text` instead. */
  helpText?: ReactNode;
  id?: string;
  className?: string;
  style?: CSSProperties;
};
