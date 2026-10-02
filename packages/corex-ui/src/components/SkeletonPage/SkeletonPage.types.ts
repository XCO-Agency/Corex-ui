import type { CSSProperties, ReactNode } from "react";

export type SkeletonPagePropsType = {
  children?: ReactNode;
  /** Draws a placeholder where the page title goes. Defaults to `true`. */
  title?: ReactNode | boolean;
  /** Draws a placeholder button in the title row. */
  primaryAction?: boolean;
  /** @deprecated v12 narrowed the page; wrap in a `Page` for that. */
  narrowWidth?: boolean;
  /** @deprecated v12 widened the page; wrap in a `Page` for that. */
  fullWidth?: boolean;
  id?: string;
  className?: string;
  style?: CSSProperties;
};
