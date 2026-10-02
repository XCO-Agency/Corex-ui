import type { CSSProperties, ReactNode } from "react";

export type DescriptionListItemType = {
  term: ReactNode;
  description: ReactNode;
};

export type DescriptionListPropsType = {
  items?: DescriptionListItemType[];
  /** v12 tightened or loosened the rows. Defaults to `loose`. */
  gap?: "tight" | "loose";
  id?: string;
  className?: string;
  style?: CSSProperties;
};
