import type {
  CSSProperties,
  ComponentPropsWithoutRef,
  ForwardRefExoticComponent,
  ReactElement,
  ReactNode,
  RefAttributes,
} from "react";
import type {
  DrawerRoot,
  DrawerTrigger,
  DrawerClose,
  DrawerPortal,
  DrawerBackdrop,
  DrawerPopup,
  DrawerTitle,
  DrawerDescription,
} from "@base-ui/react/drawer";

export type DrawerSwipeDirectionType = "up" | "down" | "left" | "right";

export type DrawerSnapPointType = number | string;

export type DrawerModalType = boolean | "trap-focus";

/** Visual presentation after responsive resolution. */
export type DrawerPresentationType = "drawer" | "sheet";

/**
 * Per-side edge gaps. Same shape as Floating's offset details — use `x` / `y`
 * as shorthand for both horizontal / vertical sides.
 */
export type DrawerOffsetDetailsType = {
  x?: number | string;
  y?: number | string;
  top?: number | string;
  bottom?: number | string;
  left?: number | string;
  right?: number | string;
};

/**
 * Edge float gap from the viewport.
 * - `number` — pixels on every side (e.g. `16`)
 * - `string` — CSS length on every side (e.g. `"1rem"`)
 * - object — per-side overrides (`top` / `right` / `bottom` / `left`, or `x` / `y`)
 */
export type DrawerOffsetType = number | string | DrawerOffsetDetailsType;

/** Resolved CSS lengths applied as `--drawer-offset-*`. */
export type DrawerResolvedOffsetType = {
  top: string;
  right: string;
  bottom: string;
  left: string;
};

type DrawerRootPropsType = DrawerRoot.Props;
type DrawerTriggerBasePropsType = DrawerTrigger.Props;
type DrawerCloseBasePropsType = DrawerClose.Props;
type DrawerPortalBasePropsType = DrawerPortal.Props;
type DrawerBackdropBasePropsType = DrawerBackdrop.Props;
type DrawerPopupBasePropsType = DrawerPopup.Props;
type DrawerTitleBasePropsType = DrawerTitle.Props;
type DrawerDescriptionBasePropsType = DrawerDescription.Props;

export type DrawerContextType = {
  hasSnapPoints: boolean;
  modal: DrawerModalType;
  /** True only when a sheet handle should render (mobile sheet + opted in). */
  showSwipeHandle: boolean;
  /** Resolved swipe direction after responsive mapping. */
  swipeDirection: DrawerSwipeDirectionType;
  /** Requested direction before responsive remapping (e.g. `"right"`). */
  requestedSwipeDirection: DrawerSwipeDirectionType;
  presentation: DrawerPresentationType;
  isMobile: boolean;
  /** Resolved per-side edge offsets (`--drawer-offset-*`). */
  offset: DrawerResolvedOffsetType;
  /**
   * Portal mount target — the Drawer trigger's `ownerDocument.body` so overlays
   * stay inside iframes / shadow hosts instead of escaping to the top window.
   */
  portalContainer: HTMLElement | null;
};

export type DrawerPropsType = Omit<
  DrawerRootPropsType,
  "swipeDirection" | "modal" | "children"
> & {
  children?: ReactNode;
  /**
   * Preferred side on desktop. With `responsive` (default), `left` / `right`
   * become a bottom sheet (`down`) below the `md` breakpoint.
   * @default "right"
   */
  swipeDirection?: DrawerSwipeDirectionType;
  /**
   * When `true` (default), side drawers (`left`/`right`) render as a bottom
   * sheet on mobile. Desktop keeps the side drawer. Set `false` to lock the
   * requested `swipeDirection` at every breakpoint.
   * @default true
   */
  responsive?: boolean;
  /**
   * Modal behavior. `true` traps focus and locks scroll; `false` allows page
   * interaction; `"trap-focus"` traps focus without locking scroll.
   * @default true
   */
  modal?: DrawerModalType;
  /**
   * Mobile sheet grabber only. Never rendered on desktop side drawers (no
   * reserved space). Swipe-to-dismiss always works from the full panel surface.
   * @default false
   */
  showSwipeHandle?: boolean;
  /**
   * Floats the panel from the viewport edges. Defaults to `8` on every side
   * (shadcn demos). Pass `0` for flush, a CSS length, or per-side object.
   * @default 8
   * @example
   * offset={16}
   * offset="1rem"
   * offset={{ top: 8, bottom: 8, left: 0, right: 16 }}
   */
  offset?: DrawerOffsetType;
};

export type DrawerTriggerPropsType = DrawerTriggerBasePropsType & {
  children?: ReactNode;
};

export type DrawerClosePropsType = DrawerCloseBasePropsType & {
  children?: ReactNode;
};

export type DrawerPortalPropsType = DrawerPortalBasePropsType;

export type DrawerOverlayPropsType = DrawerBackdropBasePropsType & {
  className?: string;
  style?: CSSProperties;
};

export type DrawerContentPropsType = Omit<DrawerPopupBasePropsType, "className"> & {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /**
   * Override root `offset` for this panel only (uniform or per-side).
   */
  offset?: DrawerOffsetType;
  /**
   * Side drawer width (horizontal). Defaults to `min(24rem, 75vw)`.
   */
  width?: string;
  /**
   * Vertical sheet max height. Defaults to `calc(100dvh - 6rem)`.
   */
  maxHeight?: string;
};

export type DrawerHeaderPropsType = ComponentPropsWithoutRef<"div">;

export type DrawerFooterPropsType = ComponentPropsWithoutRef<"div">;

export type DrawerTitlePropsType = DrawerTitleBasePropsType;

export type DrawerDescriptionPropsType = DrawerDescriptionBasePropsType;

export type DrawerSwipeHandlePropsType = ComponentPropsWithoutRef<"div">;

export type DrawerBodyPropsType = ComponentPropsWithoutRef<"div">;

export type DrawerComponentType = ((props: DrawerPropsType) => ReactElement) & {
  Trigger: (props: DrawerTriggerPropsType) => ReactElement;
  Content: ForwardRefExoticComponent<DrawerContentPropsType & RefAttributes<HTMLDivElement>>;
  Header: (props: DrawerHeaderPropsType) => ReactElement;
  Footer: (props: DrawerFooterPropsType) => ReactElement;
  Title: ForwardRefExoticComponent<DrawerTitlePropsType & RefAttributes<HTMLHeadingElement>>;
  Description: ForwardRefExoticComponent<
    DrawerDescriptionPropsType & RefAttributes<HTMLParagraphElement>
  >;
  Close: (props: DrawerClosePropsType) => ReactElement;
  Overlay: ForwardRefExoticComponent<DrawerOverlayPropsType & RefAttributes<HTMLDivElement>>;
  SwipeHandle: (props: DrawerSwipeHandlePropsType) => ReactElement;
  Body: (props: DrawerBodyPropsType) => ReactElement;
  Portal: (props: DrawerPortalPropsType) => ReactElement;
};
