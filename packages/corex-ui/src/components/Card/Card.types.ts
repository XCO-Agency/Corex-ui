import type { ReactNode } from "react";

export interface CardProps {
  children?: ReactNode;
  /** Rendered as a heading above the card content. */
  title?: ReactNode;
  /**
   * @deprecated No equivalent on `s-section` — every `Card` already renders
   * as a single section. Kept only so legacy call sites keep compiling.
   */
  sectioned?: boolean;
  padding?: string;
  background?: string;
  className?: string;
  id?: string;
}
