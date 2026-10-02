import type { CSSProperties, ReactNode } from "react";

export type InlineErrorPropsType = {
  /** Nothing renders without a message, matching v12. */
  message?: ReactNode;
  /**
   * The field this error belongs to. The error gets the id `${fieldID}-error`, so
   * the field can point at it with `aria-describedby` — which is the whole
   * reason v12 asked for it.
   */
  fieldID?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
};
