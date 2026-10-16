import type { CSSProperties, MouseEvent, ReactElement, ReactNode, RefObject } from "react";

/**
 * Side of the anchor the popover prefers.
 * `start` / `end` align to the anchor's edges; a bare side centers on it.
 * `start` is the left edge in LTR (top edge for `left` / `right`).
 */
export type FlexPopoverPositionType =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end";

export type FlexPopoverPropsType = {
  /** ID of the element the popover is positioned against (resolved in the owner document). */
  anchorId?: string;
  /** Direct ref to the anchor element. */
  anchorRef?: RefObject<HTMLElement | null>;
  isOpen: boolean;
  /** Fired on Escape, on pointer-down outside, or after hover leaves (see `openOnHover`). */
  onClose: () => void;
  /**
   * Fired when the pointer enters the anchor while `openOnHover` is set.
   * The popover stays controlled: set `isOpen` from this.
   */
  onOpen?: () => void;
  /** Optional heading displayed in the popover header. Defaults to "Filters". */
  heading?: ReactNode;
  /** Optional accessibility label for the header close button. */
  closeAccessibilityLabel?: string;
  width?: string;
  minWidth?: string;
  maxHeight?: string;
  /** Gap in pixels between the anchor and the popover. @default 8 */
  offset?: number;
  /**
   * Preferred placement relative to the anchor. Flips to the opposite side
   * when the preferred side cannot fit. @default "bottom-start"
   */
  position?: FlexPopoverPositionType;
  /** Whether the popover should match the width of the anchor element. */
  matchAnchorWidth?: boolean;
  /**
   * Opens when the pointer enters the anchor. Closing is delayed by
   * `closeDelay` so the pointer can cross `offset` without dismissing.
   */
  openOnHover?: boolean;
  /**
   * How long to wait, in ms, after the pointer leaves the anchor and the
   * popover before closing. The offset gap between them still counts as
   * inside, so a slow cross does not dismiss. @default 150
   */
  closeDelay?: number;
  /** Element whose clicks never dismiss the popover. */
  boundaryRef?: RefObject<HTMLElement | null>;
  /**
   * Clicks inside an element matching this selector never dismiss the popover.
   * Use it for a second popover that is portalled outside this one, such as a submenu.
   */
  boundarySelector?: string;
  className?: string;
  style?: CSSProperties;
  zIndex?: number;
  noHeader?: boolean;
  children: ReactNode;
};

/** Settings shared by every part of a composed `FlexPopover`. */
export type FlexPopoverCompoundPropsType = Pick<
  FlexPopoverPropsType,
  | "offset"
  | "position"
  | "matchAnchorWidth"
  | "openOnHover"
  | "closeDelay"
  | "boundaryRef"
  | "boundarySelector"
  | "onOpen"
> & {
  /** Fired when the popover closes (Escape, outside click, hover leave, close button). */
  onClose?: () => void;
  /** Controls the open state. Omit it and the popover manages itself. */
  isOpen?: boolean;
  /** Initial state when uncontrolled. @default false */
  defaultOpen?: boolean;
  anchorId?: undefined;
  anchorRef?: undefined;
  /** A `FlexPopover.Trigger` and a `FlexPopover.Content`. */
  children: ReactNode;
};

export type FlexPopoverTriggerPropsType = {
  children: ReactNode;
};

export type FlexPopoverContentPropsType = Pick<
  FlexPopoverPropsType,
  | "heading"
  | "closeAccessibilityLabel"
  | "noHeader"
  | "width"
  | "minWidth"
  | "maxHeight"
  | "className"
  | "style"
  | "zIndex"
  | "children"
> & {
  /** Preferred placement relative to the anchor (overrides root position if set). */
  position?: FlexPopoverPositionType;
  /** Gap in pixels between anchor and popover (overrides root offset if set). */
  offset?: number;
  /** Whether the popover should match the width of the anchor element. */
  matchAnchorWidth?: boolean;
  /** Optional callback fired when the panel's close button is clicked. */
  onClose?: () => void;
};

export type FlexPopoverRootPropsType = FlexPopoverPropsType | FlexPopoverCompoundPropsType;

export type FlexPopoverComponentType = {
  (props: FlexPopoverRootPropsType): ReactElement;
  Trigger: (props: FlexPopoverTriggerPropsType) => ReactElement;
  Content: (props: FlexPopoverContentPropsType) => ReactElement;
};
