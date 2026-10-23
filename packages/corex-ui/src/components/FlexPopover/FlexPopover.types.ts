import type {
  CSSProperties,
  MouseEvent,
  ReactElement,
  ReactNode,
  RefObject,
} from "react";

/**
 * Side of the anchor the popover prefers.
 *
 * - `start` / `end` align to the anchor's edges
 * - a bare side (`top`, `bottom`, `left`, `right`) or `*-center` centers on it
 *
 * `start` is the left edge in LTR (top edge for `left` / `right`).
 */
export type FlexPopoverPositionType =
  | "top"
  | "top-start"
  | "top-center"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-center"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-center"
  | "left-end"
  | "right"
  | "right-start"
  | "right-center"
  | "right-end";

/** Space between the panel edge and its content. `small` is 12px, `base` 16px, `large` 20px. */
export type FlexPopoverPaddingType =
  | "none"
  | "small-500"
  | "small-400"
  | "small-300"
  | "small-200"
  | "small-100"
  | "small"
  | "base"
  | "large";

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
  /**
   * Heading shown in the popover header. The header (heading and close button)
   * renders only when this is passed and `noHeader` is not set.
   */
  heading?: ReactNode;
  /** Optional accessibility label for the header close button. */
  closeAccessibilityLabel?: string;
  width?: string;
  minWidth?: string;
  /**
   * Cap on the panel body. Defaults to `320px` with scroll. Pass `"none"` or
   * `"auto"` for an uncapped panel (no scroll).
   */
  maxHeight?: string;
  /** Gap in pixels between the anchor and the popover. @default 8 */
  offset?: number;
  /**
   * Preferred placement relative to the anchor (`top-center`, `left-end`, …).
   * Flips to the opposite side when the preferred side cannot fit.
   * @default "bottom-start"
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
  /** Hides the header even when `heading` is passed. */
  noHeader?: boolean;
  /** Space between the panel edge and its content. @default "small-200" */
  padding?: FlexPopoverPaddingType;
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
  children: ReactNode | ((props: { open: boolean }) => ReactNode);
};

export type FlexPopoverContentPropsType = Pick<
  FlexPopoverPropsType,
  | "heading"
  | "closeAccessibilityLabel"
  | "noHeader"
  | "padding"
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

export type FlexPopoverRootPropsType =
  FlexPopoverPropsType | FlexPopoverCompoundPropsType;

export type FlexPopoverComponentType = {
  (props: FlexPopoverRootPropsType): ReactElement;
  Trigger: (props: FlexPopoverTriggerPropsType) => ReactElement;
  Content: (props: FlexPopoverContentPropsType) => ReactElement;
};
