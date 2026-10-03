import type { CSSProperties, ReactNode } from "react";

export type PaginationPropsType = {
  hasPrevious?: boolean;
  hasNext?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  /** Rendered between the two buttons, e.g. "Showing 1–20 of 240". */
  label?: ReactNode;
  /** Accessible names for the two buttons. */
  previousTooltip?: string;
  nextTooltip?: string;
  /**
   * Renders the control as a raised pill (white surface, shadow) with quiet
   * buttons — the style used when it floats over page content.
   */
  floating?: boolean;
  /** @deprecated v12 bound `J`/`K`; not reproduced. */
  accessibilityLabel?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
};
