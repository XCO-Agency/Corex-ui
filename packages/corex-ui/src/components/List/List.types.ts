import type { CSSProperties, ReactNode } from "react";

export type ListTypeType = "bullet" | "number";

export type ListPropsType = {
  children?: ReactNode;
  /** `bullet` renders `s-unordered-list`, `number` renders `s-ordered-list`. */
  type?: ListTypeType;
  /** @deprecated The native lists own their spacing. */
  gap?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
};

export type ListItemPropsType = {
  children?: ReactNode;
  id?: string;
  className?: string;
  style?: CSSProperties;
};
