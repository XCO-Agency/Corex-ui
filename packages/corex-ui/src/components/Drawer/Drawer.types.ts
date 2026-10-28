import type {
  CSSProperties,
  ComponentPropsWithoutRef,
  ForwardRefExoticComponent,
  ReactElement,
  ReactNode,
  RefAttributes,
} from "react";

/**
 * Side drawer width. Presets: `small` 20rem, `base` 24rem (default),
 * `large` 32rem, `large-100` 36rem, `large-200` 40rem, `large-300` 48rem,
 * `large-400` 56rem, `large-500` 64rem, `full` (viewport minus offsets).
 * Any CSS length (`"420px"`, `"30rem"`, `"60vw"`) or a number of pixels also works.
 * Every width is capped to the viewport minus the edge offsets.
 */
export type DrawerWidthType =
  | "full"
  | "small"
  | "base"
  | "large"
  | "large-100"
  | "large-200"
  | "large-300"
  | "large-400"
  | "large-500"
  | number
  | (string & {});

export type DrawerSwipeDirectionType = "up" | "down" | "left" | "right";

/**
 * Sheet snap point: a number `<= 1` is a fraction of the viewport height,
 * a larger number is pixels, a string is any CSS length (`"20rem"`).
 */
export type DrawerSnapPointType = number | string;

/** Why the open state changed. */
export type DrawerOpenChangeReasonType =
  | "trigger-press"
  | "close-press"
  | "outside-press"
  | "escape-key"
  | "swipe"
  /** `useDrawer().close()` / `open()` / `toggle()` or `closeDrawer(id)` & co. */
  | "imperative";

export type DrawerOpenChangeDetailsType = { reason: DrawerOpenChangeReasonType };

export type DrawerModalType = boolean | "trap-focus";

/**
 * How a nested drawer lays out against its parent (desktop side drawers only —
 * mobile sheets and vertical drawers always use `float`).
 * - `float` — stacks on top of the parent, which scales back behind it.
 * - `aside` — sits next to the parent: the nested panel takes the edge and the
 *   parent slides inward (`[parent · nested]` on the right, `[nested · parent]` on the left).
 * - `bottom` — shares the parent's column and pushes it up from the bottom.
 */
export type DrawerVariantType = "float" | "aside" | "bottom";

/**
 * Edge treatment between a sticky `Header` / `Footer` / `PreFooter` and the
 * scrolling content. `shadow` fades the content into the surface color while
 * there is more to scroll; `divider` draws a border.
 */
export type DrawerSeparatorType = "none" | "shadow" | "divider";

/** What a nested `aside` / `bottom` drawer reports to its parent so it can make room. */
export type DrawerChildLayoutType = {
  variant: "aside" | "bottom";
  /** Pixels the parent column slides inward from its edge. */
  shift: number;
  /** Pixels the parent's bottom edge moves up (`bottom` only). */
  push: number;
};

/** Geometry a drawer's panel shares with nested drawers (column width, offsets, slide). */
export type DrawerPanelContextType = {
  /** Resolved `--drawer-content-width`, or `undefined` for the CSS default. */
  width: string | undefined;
  offset: DrawerResolvedOffsetType;
  /** Pixels this panel is slid inward from its edge. */
  asideShift: number;
  /** This panel plus its ancestors' panels, so an `aside` / `bottom` child treats them as inside. */
  getPopups: () => Array<HTMLElement | null>;
};

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
  open: boolean;
  setOpen: (open: boolean, reason: DrawerOpenChangeReasonType) => void;
  /** Ids wired to the popup's `aria-labelledby` / `aria-describedby`. */
  titleId: string;
  descriptionId: string;
  popupId: string;
  /** Resolved nested layout (`float` at the top level, on mobile and on vertical drawers). */
  variant: DrawerVariantType;
  /** Number of nested drawers currently open inside this one. */
  nestedOpenCount: number;
  /** Open `float` descendants stacked on top of this drawer (drives the scale-back). */
  stackCount: number;
  /** Called by a nested `float` drawer when it opens (`+1`) or closes (`-1`). */
  onStackChange: (delta: number) => void;
  /** Pixels this drawer slides inward to make room for open `aside` (or shifted `bottom`) children. */
  asideShift: number;
  /** Pixels this drawer's bottom edge moves up for open `bottom` children. */
  bottomPush: number;
  /** Receives layout reports from nested `aside` / `bottom` drawers (`null` when one closes). */
  reportChildLayout: (key: string, layout: DrawerChildLayoutType | null) => void;
  /** The parent's `reportChildLayout` when this drawer is `aside` / `bottom`. */
  reportLayoutToParent?: (key: string, layout: DrawerChildLayoutType | null) => void;
  /** Key this drawer reports its layout under. */
  layoutKey: string;
  /** The parent panel's geometry (`null` at the top level or outside the parent's `Content`). */
  parentPanel: DrawerPanelContextType | null;
  /** Called by a nested drawer when it opens (`+1`) or closes (`-1`); forwarded to ancestors. */
  onNestedOpenChange: (delta: number) => void;
  /** True inside another Drawer's content. */
  isNested: boolean;
  /**
   * An ancestor drawer is modal and already renders the overlay, so this one
   * must not add a second (stacked, darker) backdrop.
   */
  hasModalAncestor: boolean;
  /** Height (px) of the frontmost open nested drawer, used to stack sheets. */
  frontmostHeight: number | null;
  /** Reports the frontmost nested drawer's height up the chain (`null` when it closes). */
  reportFrontmostHeight: (height: number | null) => void;
  /** The parent drawer's reporter, or `undefined` at the top level. */
  reportToParent?: (height: number | null) => void;
  /** Resolved snap point heights in px (sheets only), smallest first. */
  snapPointHeights: number[];
  activeSnapIndex: number;
  setActiveSnapIndex: (index: number) => void;
  onOpenChangeComplete?: (open: boolean) => void;
};

/** Imperative controls returned by `useDrawer()` / `useDrawer(id)`. */
export type DrawerControlsType = {
  /**
   * The target drawer's open state. For `useDrawer()` outside any Drawer:
   * whether any drawer is open.
   */
  isOpen: boolean;
  /** Opens the target drawer (needs a target: inside a Drawer, or an `id`). */
  open: () => void;
  /** Closes the target drawer — outside any Drawer without an id, the topmost open one. */
  close: () => void;
  toggle: () => void;
  /** Closes every open drawer, innermost first. */
  closeAll: () => void;
};

/**
 * `useDrawer()`: the controls, plus — inside a Drawer — that drawer's context
 * fields (`insideDrawer: true`). Outside, the context fields are `undefined`.
 */
export type DrawerHandleType = DrawerControlsType &
  Partial<DrawerContextType> & { insideDrawer: boolean };

export type DrawerPropsType = {
  children?: ReactNode;
  /**
   * Registers the drawer so it can be controlled from anywhere with
   * `useDrawer(id)`, `openDrawer(id)`, `closeDrawer(id)` or `toggleDrawer(id)`.
   */
  id?: string;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, details: DrawerOpenChangeDetailsType) => void;
  /** Called after the open or close transition finishes. */
  onOpenChangeComplete?: (open: boolean) => void;
  /** Sheet snap points (vertical presentations only). */
  snapPoints?: DrawerSnapPointType[];
  /** Controlled active snap point (one of `snapPoints`). */
  snapPoint?: DrawerSnapPointType | null;
  /** Initial snap point when uncontrolled. Defaults to the first one. */
  defaultSnapPoint?: DrawerSnapPointType | null;
  onSnapPointChange?: (snapPoint: DrawerSnapPointType | null) => void;
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
  /**
   * Layout of this drawer when nested inside another one (desktop side
   * drawers only; mobile keeps the `float` stack). `aside` and `bottom` take
   * the parent's side. A `bottom` drawer's height follows its content, or
   * `snapPoints` (fractions of the viewport height, px or CSS lengths) — drag
   * it to move between them.
   * @default "float"
   * @example
   * <Drawer variant="aside">…</Drawer>
   * <Drawer variant="bottom" snapPoints={[0.3, 0.6]}>…</Drawer>
   */
  variant?: DrawerVariantType;
};

type DrawerButtonPropsType = Omit<ComponentPropsWithoutRef<"button">, "children"> & {
  /**
   * Element to make the trigger/close (e.g. a Corex `Button`); its `onClick`
   * is composed. Plain content renders inside a native `<button>`.
   */
  children?: ReactNode;
  /** @deprecated No effect. Kept for compatibility with the previous API. */
  nativeButton?: boolean;
};

export type DrawerTriggerPropsType = DrawerButtonPropsType;

export type DrawerClosePropsType = DrawerButtonPropsType;

export type DrawerPortalPropsType = {
  children?: ReactNode;
  /** Mount target. Defaults to the body of the document hosting the Drawer. */
  container?: HTMLElement | null;
};

export type DrawerOverlayPropsType = ComponentPropsWithoutRef<"div">;

export type DrawerContentPropsType = Omit<ComponentPropsWithoutRef<"div">, "className"> & {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /**
   * Override root `offset` for this panel only (uniform or per-side).
   */
  offset?: DrawerOffsetType;
  /**
   * Side drawer width (horizontal): a preset (`"small"`, `"base"`, `"large"`,
   * `"large-100"`…`"large-500"`, `"full"`) or any CSS length / pixel number.
   * Defaults to `"base"` (24rem; 75% below 640px).
   */
  width?: DrawerWidthType;
  /**
   * Vertical sheet max height. Defaults to `calc(100dvh - 6rem)`.
   */
  maxHeight?: string;
};

export type DrawerHeaderPropsType = ComponentPropsWithoutRef<"div"> & {
  /**
   * Edge under the sticky header: `shadow` fades scrolled content into the
   * surface, `divider` draws a border.
   * @default "none"
   */
  separator?: DrawerSeparatorType;
};

export type DrawerFooterPropsType = ComponentPropsWithoutRef<"div"> & {
  /**
   * Edge above the sticky footer: `shadow` fades the content still below
   * into the surface, `divider` draws a border.
   * @default "none"
   */
  separator?: DrawerSeparatorType;
};

export type DrawerPreFooterPropsType = ComponentPropsWithoutRef<"div"> & {
  /**
   * Pin above the footer instead of scrolling with the content.
   * @default false
   */
  sticky?: boolean;
  /**
   * Edge above the pre-footer. `shadow` only shows while it is `sticky`.
   * @default "none"
   */
  separator?: DrawerSeparatorType;
};

export type DrawerTitlePropsType = ComponentPropsWithoutRef<"h2">;

export type DrawerDescriptionPropsType = ComponentPropsWithoutRef<"p">;

export type DrawerSwipeHandlePropsType = ComponentPropsWithoutRef<"div">;

export type DrawerBodyPropsType = ComponentPropsWithoutRef<"div">;

export type DrawerComponentType = ((props: DrawerPropsType) => ReactElement) & {
  Trigger: (props: DrawerTriggerPropsType) => ReactElement;
  Content: ForwardRefExoticComponent<DrawerContentPropsType & RefAttributes<HTMLDivElement>>;
  Header: (props: DrawerHeaderPropsType) => ReactElement;
  Footer: (props: DrawerFooterPropsType) => ReactElement;
  PreFooter: (props: DrawerPreFooterPropsType) => ReactElement;
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
