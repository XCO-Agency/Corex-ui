import type { CSSProperties, ReactNode, RefObject } from "react";

export type FlexPopoverPropsType = {
  /** ID of the element the popover is positioned against (resolved in the owner document). */
  anchorId?: string;
  /** Direct ref to the anchor element. */
  anchorRef?: RefObject<HTMLElement | null>;
  isOpen: boolean;
  /** Fired on Escape or on pointer-down outside the popover, the anchor and `boundaryRef`. */
  onClose: () => void;
  width?: string;
  minWidth?: string;
  maxHeight?: string;
  offset?: number;
  /** Whether the popover should match the width of the anchor element. */
  matchAnchorWidth?: boolean;
  /** Element whose clicks never dismiss the popover. */
  boundaryRef?: RefObject<HTMLElement | null>;
  className?: string;
  style?: CSSProperties;
  zIndex?: number;
  noHeader?: boolean;
  children: ReactNode;
};
