import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { BREAKPOINT_WIDTHS } from "../../hooks/useDimension";
import { mergeRefs } from "../../core/mergeRefs";
import {
  presenceAttributes,
  useDismissableLayer,
  useFocusContainment,
  useOpenState,
  usePresence,
  useScrollLock,
} from "../../core/overlay";
import { DRAWER_CSS, DRAWER_STYLE_ID } from "./Drawer.css";
import { devWarning } from "../../utils/devWarning";
import {
  closeAllDrawers,
  closeDrawer,
  isDrawerOpen,
  openDrawer,
  registerDrawer,
  setDrawerOpenState,
  subscribeDrawers,
  toggleDrawer,
} from "./drawerRegistry";
import type {
  DrawerBodyPropsType,
  DrawerClosePropsType,
  DrawerComponentType,
  DrawerContentPropsType,
  DrawerContextType,
  DrawerControlsType,
  DrawerDescriptionPropsType,
  DrawerFooterPropsType,
  DrawerHandleType,
  DrawerHeaderPropsType,
  DrawerOffsetType,
  DrawerOpenChangeReasonType,
  DrawerOverlayPropsType,
  DrawerPortalPropsType,
  DrawerPresentationType,
  DrawerPropsType,
  DrawerResolvedOffsetType,
  DrawerSnapPointType,
  DrawerSwipeDirectionType,
  DrawerSwipeHandlePropsType,
  DrawerTitlePropsType,
  DrawerTriggerPropsType,
  DrawerWidthType,
} from "./Drawer.types";

const DRAWER_OFFSET_DEFAULT = 8;

const DrawerContext = createContext<DrawerContextType | null>(null);

/**
 * The nearest drawer's resolved config (direction, presentation, offset…).
 * Throws outside a `<Drawer>`; use `useDrawer()` for controls that work anywhere.
 */
export function useDrawerContext(): DrawerContextType {
  const ctx = useContext(DrawerContext);
  if (!ctx) {
    throw new Error("Drawer compound components must be used within a <Drawer />");
  }
  return ctx;
}

const noopSubscribe = () => () => {};

/**
 * Drawer controls that work anywhere — no `<Drawer>` ancestor required.
 *
 * - `useDrawer()` inside a `<Drawer>` (its content, footer, a nested
 *   component…): controls for that nearest drawer, plus its context fields.
 * - `useDrawer()` outside any Drawer: `close()` closes the topmost open
 *   drawer, `closeAll()` every drawer, `isOpen` is "any drawer open".
 * - `useDrawer(id)` anywhere: controls for the `<Drawer id={id}>`, wherever
 *   it is mounted. `isOpen` stays in sync with it.
 *
 * ```tsx
 * function SaveButton() {
 *   const drawer = useDrawer();
 *   return <Button onClick={async () => { await save(); drawer.close(); }}>Save</Button>;
 * }
 *
 * const cart = useDrawer("cart"); // e.g. in a header, outside the Drawer
 * cart.open();
 * ```
 */
export function useDrawer(): DrawerHandleType;
export function useDrawer(id: string): DrawerControlsType;
export function useDrawer(id?: string): DrawerHandleType | DrawerControlsType {
  const ctx = useContext(DrawerContext);
  const scope: "id" | "nearest" | "global" =
    id !== undefined ? "id" : ctx ? "nearest" : "global";
  const registryOpen = useSyncExternalStore(
    scope === "nearest" ? noopSubscribe : subscribeDrawers,
    () => (scope === "id" ? isDrawerOpen(id) : scope === "global" ? isDrawerOpen() : false),
    () => false,
  );
  const setOpen = ctx?.setOpen;
  const isOpen = scope === "nearest" ? Boolean(ctx?.open) : registryOpen;

  const controls = useMemo<DrawerControlsType>(() => {
    const closeAll = () => closeAllDrawers();
    if (scope === "id") {
      return {
        isOpen,
        open: () => void openDrawer(id!),
        close: () => void closeDrawer(id),
        toggle: () => void toggleDrawer(id!),
        closeAll,
      };
    }
    if (scope === "nearest") {
      return {
        isOpen,
        open: () => setOpen?.(true, "imperative"),
        close: () => setOpen?.(false, "imperative"),
        toggle: () => setOpen?.(!isOpen, "imperative"),
        closeAll,
      };
    }
    const noTarget = () =>
      devWarning(
        "Drawer",
        "useDrawer() outside a <Drawer> has no drawer to open. Pass an id: useDrawer(\"cart\") with <Drawer id=\"cart\">.",
      );
    return {
      isOpen,
      open: noTarget,
      close: () => void closeDrawer(),
      toggle: () => (isDrawerOpen() ? void closeDrawer() : noTarget()),
      closeAll,
    };
  }, [scope, id, isOpen, setOpen]);

  return useMemo(() => {
    if (scope === "id") return controls;
    if (scope === "nearest" && ctx) return { ...ctx, ...controls, insideDrawer: true };
    return { ...controls, insideDrawer: false };
  }, [scope, ctx, controls]);
}

function formatOffsetValue(value: number | string): string {
  return typeof value === "number" ? `${value}px` : value;
}

function isZeroOffset(value: string): boolean {
  const trimmed = value.trim();
  return !trimmed || trimmed === "0" || trimmed === "0px";
}

/**
 * Resolves uniform or per-side edge gaps into CSS lengths for `--drawer-offset-*`.
 * Missing sides in an object fall back to `defaultUniform` (default `8`).
 */
export function resolveDrawerOffset(
  offset: DrawerOffsetType | undefined,
  defaultUniform: number | string = DRAWER_OFFSET_DEFAULT,
): DrawerResolvedOffsetType {
  const fallback = formatOffsetValue(defaultUniform);

  if (offset === undefined) {
    return { top: fallback, right: fallback, bottom: fallback, left: fallback };
  }

  if (typeof offset === "number" || typeof offset === "string") {
    const value = formatOffsetValue(offset);
    return { top: value, right: value, bottom: value, left: value };
  }

  return {
    top: formatOffsetValue(offset.top ?? offset.y ?? defaultUniform),
    bottom: formatOffsetValue(offset.bottom ?? offset.y ?? defaultUniform),
    left: formatOffsetValue(offset.left ?? offset.x ?? defaultUniform),
    right: formatOffsetValue(offset.right ?? offset.x ?? defaultUniform),
  };
}

function hasNonZeroOffset(offset: DrawerResolvedOffsetType): boolean {
  return (
    !isZeroOffset(offset.top) ||
    !isZeroOffset(offset.right) ||
    !isZeroOffset(offset.bottom) ||
    !isZeroOffset(offset.left)
  );
}

function offsetToCssVars(offset: DrawerResolvedOffsetType): CSSProperties {
  return {
    ["--drawer-offset-top" as string]: offset.top,
    ["--drawer-offset-right" as string]: offset.right,
    ["--drawer-offset-bottom" as string]: offset.bottom,
    ["--drawer-offset-left" as string]: offset.left,
  };
}

const DRAWER_WIDTH_PRESETS: Record<string, string> = {
  small: "20rem",
  base: "24rem",
  large: "32rem",
  "large-100": "36rem",
  "large-200": "40rem",
  "large-300": "48rem",
  "large-400": "56rem",
  "large-500": "64rem",
  full: "calc(100% - var(--drawer-offset-left) - var(--drawer-offset-right))",
};

/** Preset name, pixel number or CSS length → CSS width for `--drawer-content-width`. */
export function resolveDrawerWidth(width: DrawerWidthType): string {
  if (typeof width === "number") return `${width}px`;
  const trimmed = width.trim();
  return DRAWER_WIDTH_PRESETS[trimmed] ?? (/^\d*\.?\d+$/.test(trimmed) ? `${trimmed}px` : trimmed);
}

function isSideDirection(direction: DrawerSwipeDirectionType): boolean {
  return direction === "left" || direction === "right";
}

function ensureDrawerStyles(node: HTMLElement | null) {
  const doc = node?.ownerDocument ?? (typeof document !== "undefined" ? document : null);
  if (!doc) return;
  const existing = doc.getElementById(DRAWER_STYLE_ID);
  if (existing) {
    if (existing.textContent !== DRAWER_CSS) existing.textContent = DRAWER_CSS;
    return;
  }
  const style = doc.createElement("style");
  style.id = DRAWER_STYLE_ID;
  style.textContent = DRAWER_CSS;
  doc.head.appendChild(style);
}

/**
 * Size of the viewport of the document that hosts the Drawer (iframe-aware).
 * `useBreakpoints` / `window.innerWidth` always read the top window, which
 * breaks playground device previews and embedded Shopify iframes.
 */
function useHostViewport(hostDoc: Document | null): { isMobile: boolean; height: number } {
  const [size, setSize] = useState(() => ({
    isMobile: typeof window !== "undefined" && window.innerWidth < BREAKPOINT_WIDTHS.md,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  }));

  useEffect(() => {
    const win = hostDoc?.defaultView;
    if (!win) return;
    const update = () => {
      const next = { isMobile: win.innerWidth < BREAKPOINT_WIDTHS.md, height: win.innerHeight };
      setSize((current) =>
        current.isMobile === next.isMobile && current.height === next.height ? current : next,
      );
    };
    update();
    win.addEventListener("resize", update, { passive: true });
    return () => win.removeEventListener("resize", update);
  }, [hostDoc]);

  return size;
}

/** Snap point to pixels: `<= 1` is a viewport fraction, larger numbers are px, strings are CSS lengths. */
export function resolveSnapPointHeight(
  point: DrawerSnapPointType,
  viewportHeight: number,
  rootFontSize = 16,
): number {
  if (typeof point === "number") return point <= 1 ? point * viewportHeight : point;
  const match = /^(-?\d*\.?\d+)\s*(px|rem|em|vh|dvh|svh|lvh|%)?$/.exec(point.trim());
  if (!match) return viewportHeight;
  const value = Number(match[1]);
  switch (match[2]) {
    case "rem":
    case "em":
      return value * rootFontSize;
    case "vh":
    case "dvh":
    case "svh":
    case "lvh":
    case "%":
      return (value / 100) * viewportHeight;
    default:
      return value;
  }
}

/**
 * Responsive swipeable drawer, dependency-free.
 *
 * - **Desktop (`md+`)**: side drawer — default `swipeDirection="right"`. No
 *   swipe handle and no reserved handle space. Dismiss by swiping the panel.
 * - **Mobile**: side drawers become a bottom **sheet** (`down`) with optional
 *   handle. Sheet is never used as the desktop presentation.
 *
 * ```tsx
 * <Drawer>
 *   <Drawer.Trigger>
 *     <Button>Open</Button>
 *   </Drawer.Trigger>
 *   <Drawer.Content>
 *     <Drawer.Header>
 *       <Drawer.Title>Details</Drawer.Title>
 *     </Drawer.Header>
 *     <Drawer.Body>…</Drawer.Body>
 *   </Drawer.Content>
 * </Drawer>
 * ```
 */
function DrawerRoot({
  children,
  id,
  open: openProp,
  defaultOpen,
  onOpenChange,
  onOpenChangeComplete,
  modal = true,
  showSwipeHandle = false,
  snapPoints,
  snapPoint,
  defaultSnapPoint,
  onSnapPointChange,
  swipeDirection = "right",
  responsive = true,
  offset,
}: DrawerPropsType): ReactElement {
  const parent = useContext(DrawerContext);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const [hostDoc, setHostDoc] = useState<Document | null>(null);
  const { isMobile, height: viewportHeight } = useHostViewport(hostDoc);
  const [open, setOpen] = useOpenState<DrawerOpenChangeReasonType>(
    openProp,
    defaultOpen,
    onOpenChange,
  );
  const [nestedOpenCount, setNestedOpenCount] = useState(0);
  const baseId = useId().replace(/:/g, "");

  const markerRef = useCallback((node: HTMLSpanElement | null) => {
    if (!node) {
      setPortalContainer(null);
      setHostDoc(null);
      return;
    }
    ensureDrawerStyles(node);
    // Keep the portal in the same document as the trigger (e.g. playground
    // preview iframes), not the top window's body.
    setPortalContainer(node.ownerDocument.body);
    setHostDoc(node.ownerDocument);
  }, []);

  // Counts every open descendant (not just children) so each level scales back
  // one more step, like a stack of cards.
  const parentNestedChange = parent?.onNestedOpenChange;
  const onNestedOpenChange = useCallback(
    (delta: number) => {
      setNestedOpenCount((count) => Math.max(0, count + delta));
      parentNestedChange?.(delta);
    },
    [parentNestedChange],
  );

  const [frontmostHeight, setFrontmostHeight] = useState<number | null>(null);
  const parentReport = parent?.reportFrontmostHeight;
  const reportFrontmostHeight = useCallback(
    (height: number | null) => {
      setFrontmostHeight(height);
      parentReport?.(height);
    },
    [parentReport],
  );

  // Every drawer registers so it can be controlled from anywhere: by `id`
  // (`useDrawer(id)`, `closeDrawer(id)`) or as the topmost open drawer
  // (`useDrawer().close()` outside a Drawer, `closeDrawer()`).
  const registryKey = `${baseId}-drawer`;
  const openRef = useRef(open);
  openRef.current = open;
  useEffect(
    () =>
      registerDrawer(registryKey, id, ({ type, reason }) => {
        const next = type === "toggle" ? !openRef.current : type === "open";
        setOpen(next, reason);
      }),
    [registryKey, id, setOpen],
  );
  useEffect(() => {
    setDrawerOpenState(registryKey, open);
  }, [registryKey, open, id]);

  // Tell the parent drawer a nested one is open so it can scale back.
  useEffect(() => {
    if (!open || !parentNestedChange) return undefined;
    parentNestedChange(1);
    return () => parentNestedChange(-1);
  }, [open, parentNestedChange]);

  const requestedSwipeDirection = swipeDirection;
  const resolvedSwipeDirection: DrawerSwipeDirectionType =
    responsive && isMobile && isSideDirection(requestedSwipeDirection)
      ? "down"
      : requestedSwipeDirection;

  const presentation: DrawerPresentationType =
    resolvedSwipeDirection === "down" || resolvedSwipeDirection === "up"
      ? "sheet"
      : "drawer";

  // Handle only on mobile sheets when explicitly requested — never on desktop
  // side drawers (no reserved space). Swipe always works from the full panel.
  const resolvedShowSwipeHandle = presentation === "sheet" && showSwipeHandle === true;

  // Match shadcn demos: floating panel with 8px edge gap on every side.
  const resolvedOffset = useMemo(() => resolveDrawerOffset(offset), [offset]);
  const hasSnapPoints = presentation === "sheet" && snapPoints != null && snapPoints.length > 0;

  const snapPointHeights = useMemo(() => {
    if (!hasSnapPoints || !snapPoints) return [];
    const rootFontSize = hostDoc?.defaultView
      ? Number.parseFloat(hostDoc.defaultView.getComputedStyle(hostDoc.documentElement).fontSize) || 16
      : 16;
    return snapPoints.map((point) =>
      Math.min(viewportHeight, resolveSnapPointHeight(point, viewportHeight, rootFontSize)),
    );
  }, [hasSnapPoints, snapPoints, viewportHeight, hostDoc]);

  const [uncontrolledSnapIndex, setUncontrolledSnapIndex] = useState(() =>
    Math.max(0, snapPoints && defaultSnapPoint != null ? snapPoints.indexOf(defaultSnapPoint) : 0),
  );
  const snapControlled = snapPoint !== undefined;
  const activeSnapIndex = snapControlled
    ? Math.max(0, snapPoints && snapPoint != null ? snapPoints.indexOf(snapPoint) : 0)
    : uncontrolledSnapIndex;
  const onSnapPointChangeRef = useRef(onSnapPointChange);
  onSnapPointChangeRef.current = onSnapPointChange;
  const setActiveSnapIndex = useCallback(
    (index: number) => {
      if (!snapControlled) setUncontrolledSnapIndex(index);
      onSnapPointChangeRef.current?.(snapPoints?.[index] ?? null);
    },
    [snapControlled, snapPoints],
  );

  const contextValue = useMemo<DrawerContextType>(
    () => ({
      hasSnapPoints,
      modal,
      showSwipeHandle: resolvedShowSwipeHandle,
      swipeDirection: resolvedSwipeDirection,
      requestedSwipeDirection,
      presentation,
      isMobile,
      offset: resolvedOffset,
      portalContainer,
      open,
      setOpen,
      titleId: `${baseId}-title`,
      descriptionId: `${baseId}-description`,
      popupId: `${baseId}-popup`,
      nestedOpenCount,
      onNestedOpenChange,
      isNested: parent != null,
      hasModalAncestor: Boolean(parent && (parent.modal === true || parent.hasModalAncestor)),
      frontmostHeight,
      reportFrontmostHeight,
      reportToParent: parentReport,
      snapPointHeights,
      activeSnapIndex,
      setActiveSnapIndex,
      onOpenChangeComplete,
    }),
    [
      hasSnapPoints,
      modal,
      resolvedShowSwipeHandle,
      resolvedSwipeDirection,
      requestedSwipeDirection,
      presentation,
      isMobile,
      resolvedOffset,
      portalContainer,
      open,
      setOpen,
      baseId,
      nestedOpenCount,
      onNestedOpenChange,
      parent,
      frontmostHeight,
      reportFrontmostHeight,
      parentReport,
      snapPointHeights,
      activeSnapIndex,
      setActiveSnapIndex,
      onOpenChangeComplete,
    ],
  );

  return (
    <DrawerContext.Provider value={contextValue}>
      <span
        ref={markerRef}
        data-slot="drawer-marker"
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
        aria-hidden
      />
      {children}
    </DrawerContext.Provider>
  );
}
DrawerRoot.displayName = "Drawer";

// `any` element: the control may be a native <button> or a web component host.
type ClickableElementPropsType = { onClick?: (event: ReactMouseEvent<any>) => void }; // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * Renders `children` as the control: an element (e.g. a Corex `Button`) gets
 * the attributes and a composed `onClick`; anything else sits in a `<button>`.
 */
function renderControl(
  children: ReactNode,
  props: Record<string, unknown> & ClickableElementPropsType,
  onActivate: () => void,
): ReactElement {
  const { onClick, ...rest } = props;
  if (isValidElement<ClickableElementPropsType>(children)) {
    const childOnClick = children.props.onClick;
    return cloneElement(children, {
      ...rest,
      onClick: (event: ReactMouseEvent<HTMLElement>) => {
        childOnClick?.(event);
        onClick?.(event);
        if (!event.defaultPrevented) onActivate();
      },
    } as ClickableElementPropsType);
  }
  return (
    <button
      type="button"
      {...rest}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) onActivate();
      }}
    >
      {children}
    </button>
  );
}

function DrawerTrigger({ children, nativeButton: _nativeButton, ...props }: DrawerTriggerPropsType): ReactElement {
  const { open, setOpen, popupId } = useDrawerContext();
  return renderControl(
    children,
    {
      "data-slot": "drawer-trigger",
      "aria-haspopup": "dialog",
      "aria-expanded": open,
      "aria-controls": open ? popupId : undefined,
      ...props,
    },
    () => setOpen(!open, "trigger-press"),
  );
}
DrawerTrigger.displayName = "Drawer.Trigger";

function DrawerClose({ children, nativeButton: _nativeButton, ...props }: DrawerClosePropsType): ReactElement {
  const { setOpen } = useDrawerContext();
  return renderControl(children, { "data-slot": "drawer-close", ...props }, () =>
    setOpen(false, "close-press"),
  );
}
DrawerClose.displayName = "Drawer.Close";

function DrawerPortal({ container, children }: DrawerPortalPropsType): ReactElement | null {
  const { portalContainer } = useDrawerContext();
  const target = container ?? portalContainer;
  return target ? createPortal(children, target) : null;
}
DrawerPortal.displayName = "Drawer.Portal";

const DrawerOverlay = forwardRef<HTMLDivElement, DrawerOverlayPropsType>(
  function DrawerOverlay(props, ref) {
    return <div ref={ref} data-slot="drawer-overlay" {...props} />;
  },
);
DrawerOverlay.displayName = "Drawer.Overlay";

function DrawerSwipeHandle({ style, className, ...props }: DrawerSwipeHandlePropsType): ReactElement {
  return (
    <div
      data-slot="drawer-swipe-handle"
      aria-hidden="true"
      className={className}
      style={style}
      {...props}
    />
  );
}
DrawerSwipeHandle.displayName = "Drawer.SwipeHandle";

const FIELD_SELECTOR =
  'input, textarea, select, [contenteditable="true"], s-text-field, s-text-area, s-select, s-search-field, s-number-field, s-email-field, s-password-field, s-url-field, s-money-field, s-date-field, s-color-field';

/** True when an element between `target` and `popup` can still scroll toward the dismiss direction. */
function canScrollTowardDismiss(
  target: HTMLElement,
  popup: HTMLElement,
  axis: "x" | "y",
  sign: 1 | -1,
): boolean {
  const view = popup.ownerDocument.defaultView;
  for (let el: HTMLElement | null = target; el && el !== popup; el = el.parentElement) {
    const overflow = view?.getComputedStyle(el)[axis === "y" ? "overflowY" : "overflowX"];
    if (overflow !== "auto" && overflow !== "scroll") continue;
    if (axis === "y") {
      if (el.scrollHeight <= el.clientHeight) continue;
      if (sign === 1 ? el.scrollTop > 0 : el.scrollTop + el.clientHeight < el.scrollHeight - 1) return true;
    } else {
      if (el.scrollWidth <= el.clientWidth) continue;
      const scrollLeft = Math.abs(el.scrollLeft);
      if (sign === 1 ? scrollLeft > 0 : scrollLeft + el.clientWidth < el.scrollWidth - 1) return true;
    }
  }
  return false;
}

/**
 * High-level panel: portal + overlay + viewport + popup + inner content.
 * Swipe-to-dismiss applies to the full popup surface (not handle-only).
 */
const DrawerContent = forwardRef<HTMLDivElement, DrawerContentPropsType>(function DrawerContent(
  { children, className, style, offset, width, maxHeight, onPointerDown, ...props },
  ref,
) {
  const ctx = useDrawerContext();
  const {
    hasSnapPoints,
    modal,
    showSwipeHandle,
    swipeDirection,
    presentation,
    offset: rootOffset,
    portalContainer,
    open,
    setOpen,
    popupId,
    nestedOpenCount,
    hasModalAncestor,
    frontmostHeight,
    reportToParent,
    snapPointHeights,
    activeSnapIndex,
    setActiveSnapIndex,
    onOpenChangeComplete,
  } = ctx;
  const popupRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMemo(() => mergeRefs(ref, popupRef), [ref]);
  const swipeAxis = swipeDirection === "down" || swipeDirection === "up" ? "y" : "x";
  const resolvedOffset =
    offset !== undefined ? resolveDrawerOffset(offset, DRAWER_OFFSET_DEFAULT) : rootOffset;
  const floated = hasNonZeroOffset(resolvedOffset);

  const { mounted, phase } = usePresence(open, popupRef, {
    onExitComplete: () => onOpenChangeComplete?.(false),
  });
  useEffect(() => {
    if (phase !== "open" || !onOpenChangeComplete) return undefined;
    const timer = window.setTimeout(() => onOpenChangeComplete(true), 450);
    return () => window.clearTimeout(timer);
  }, [phase, onOpenChangeComplete]);

  useLayoutEffect(() => {
    if (portalContainer) ensureDrawerStyles(portalContainer);
  }, [portalContainer]);

  const doc = portalContainer?.ownerDocument ?? null;
  // Only once the panel is in the DOM: the portal target arrives one render late.
  const active = open && mounted && Boolean(portalContainer);
  useDismissableLayer({
    id: popupId,
    active,
    doc,
    getInside: () => [popupRef.current],
    onEscape: () => setOpen(false, "escape-key"),
    onOutsidePress: (event) => {
      // The trigger toggles on its own click; closing here would reopen it.
      // Elements marked `data-drawer-outside-control` (external open/close
      // buttons) are ignored the same way, for every drawer.
      const target = event.target as Element | null;
      if (target?.closest?.(`[aria-controls="${popupId}"], [data-drawer-outside-control]`)) return;
      setOpen(false, "outside-press");
    },
  });
  useFocusContainment(popupRef, { id: popupId, active, trap: modal !== false });
  useScrollLock(doc, active && modal === true);

  // While this is the frontmost nested drawer, tell the ancestors its height so
  // a parent sheet can match it and peek out above it (desktop and mobile alike).
  const frontmost = active && nestedOpenCount === 0;
  useEffect(() => {
    const popup = popupRef.current;
    if (!reportToParent || !frontmost || !popup) return undefined;
    const report = () => {
      const height = popup.getBoundingClientRect().height;
      reportToParent(height > 0 ? height : null);
    };
    report();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(report) : null;
    observer?.observe(popup);
    return () => {
      observer?.disconnect();
      reportToParent(null);
    };
  }, [reportToParent, frontmost]);

  const snapHeight = hasSnapPoints ? snapPointHeights[activeSnapIndex] : undefined;
  const viewportHeight = doc?.defaultView?.innerHeight ?? 0;
  const snapOffset =
    snapHeight !== undefined ? Math.max(0, viewportHeight - snapHeight) * (swipeDirection === "up" ? -1 : 1) : 0;

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    onPointerDown?.(event);
    if (event.defaultPrevented || (event.pointerType === "mouse" && event.button !== 0)) return;
    const popup = popupRef.current;
    const view = popup?.ownerDocument.defaultView;
    if (!popup || !view || !open) return;
    // Only the active (frontmost) drawer swipes. A nested drawer's panel is
    // portaled out of this popup's DOM, but its React pointer events still
    // bubble here through the component tree — ignore those, and ignore every
    // press while a nested drawer is open on top of this one.
    if (nestedOpenCount > 0) return;
    const target = event.target as HTMLElement;
    if (!popup.contains(target)) return;
    if (target.closest(FIELD_SELECTOR)) return;

    const axis = swipeAxis;
    const sign: 1 | -1 = swipeDirection === "down" || swipeDirection === "right" ? 1 : -1;
    if (canScrollTowardDismiss(target, popup, axis, sign)) return;

    const pointerId = event.pointerId;
    const startX = event.clientX;
    const startY = event.clientY;
    const size = axis === "y" ? popup.offsetHeight : popup.offsetWidth;
    const movementVar = axis === "y" ? "--drawer-swipe-movement-y" : "--drawer-swipe-movement-x";
    const heights = snapPointHeights;
    const currentHeight = hasSnapPoints ? (heights[activeSnapIndex] ?? size) : size;
    const maxHeight = heights.length ? Math.max(...heights) : size;
    let dragging = false;
    let movement = 0;
    let lastTime = event.timeStamp;
    let lastMovement = 0;
    let velocity = 0;

    const reset = () => {
      popup.removeAttribute("data-swiping");
      popup.style.removeProperty(movementVar);
      overlayRef.current?.style.removeProperty("--drawer-swipe-progress");
    };

    const handleMove = (move: PointerEvent) => {
      if (move.pointerId !== pointerId) return;
      const along = (axis === "y" ? move.clientY - startY : move.clientX - startX) * sign;
      const cross = axis === "y" ? move.clientX - startX : move.clientY - startY;
      if (!dragging) {
        // A gesture along the other axis is a scroll or a text selection, not a swipe.
        if (Math.abs(cross) > 8 && Math.abs(cross) > Math.abs(along)) {
          stop();
          return;
        }
        if (Math.abs(along) < 6) return;
        dragging = true;
        popup.setAttribute("data-swiping", "");
        view.getSelection()?.removeAllRanges();
      }
      // Toward a larger snap point the sheet follows the finger; past the edge it resists.
      movement =
        along >= 0
          ? along
          : hasSnapPoints && currentHeight < maxHeight
            ? Math.max(along, -(maxHeight - currentHeight))
            : along * 0.2;
      const dt = Math.max(1, move.timeStamp - lastTime);
      velocity = (movement - lastMovement) / dt;
      lastTime = move.timeStamp;
      lastMovement = movement;
      popup.style.setProperty(movementVar, `${movement * sign}px`);
      overlayRef.current?.style.setProperty(
        "--drawer-swipe-progress",
        String(Math.min(1, Math.max(0, movement / Math.max(1, currentHeight)))),
      );
    };

    const finish = (released: boolean) => {
      stop();
      if (!dragging) return;
      // Swallow the click that ends the drag so buttons under the pointer don't fire.
      popup.addEventListener("click", (click) => click.stopPropagation(), { capture: true, once: true });
      if (!released) {
        reset();
        return;
      }
      const flick = velocity > 0.5 && movement > 16;
      if (hasSnapPoints && heights.length > 0) {
        const visible = currentHeight - movement;
        const smallest = Math.min(...heights);
        if (visible < smallest * 0.5 || (flick && currentHeight === smallest)) {
          popup.style.setProperty("--drawer-swipe-strength", String(Math.max(0.3, 1 - velocity / 3)));
          setOpen(false, "swipe");
          return;
        }
        const target = flick
          ? Math.max(smallest, ...heights.filter((h) => h < currentHeight))
          : velocity < -0.5
            ? Math.min(maxHeight, ...heights.filter((h) => h > currentHeight))
            : heights.reduce((best, h) => (Math.abs(h - visible) < Math.abs(best - visible) ? h : best));
        reset();
        setActiveSnapIndex(heights.indexOf(target));
        return;
      }
      if (movement > size * 0.3 || flick) {
        popup.style.setProperty("--drawer-swipe-strength", String(Math.max(0.3, 1 - velocity / 3)));
        setOpen(false, "swipe");
        return;
      }
      reset();
    };

    const handleUp = (up: PointerEvent) => {
      if (up.pointerId === pointerId) finish(true);
    };
    const handleCancel = (cancel: PointerEvent) => {
      if (cancel.pointerId === pointerId) finish(false);
    };
    function stop() {
      view!.removeEventListener("pointermove", handleMove);
      view!.removeEventListener("pointerup", handleUp);
      view!.removeEventListener("pointercancel", handleCancel);
    }
    view.addEventListener("pointermove", handleMove);
    view.addEventListener("pointerup", handleUp);
    view.addEventListener("pointercancel", handleCancel);
  };

  if (!mounted || !portalContainer) return null;

  const popupStyle = {
    ...offsetToCssVars(resolvedOffset),
    ...(width !== undefined && width !== ""
      ? { ["--drawer-content-width" as string]: resolveDrawerWidth(width) }
      : null),
    ...(maxHeight ? { ["--drawer-content-max-height" as string]: maxHeight } : null),
    ...(hasSnapPoints ? { ["--drawer-snap-point-offset" as string]: `${snapOffset}px` } : null),
    ["--nested-drawers" as string]: nestedOpenCount,
    ...(nestedOpenCount > 0 && frontmostHeight != null
      ? { ["--drawer-frontmost-height" as string]: `${frontmostHeight}px` }
      : null),
    ...style,
  } as CSSProperties;

  const presence = presenceAttributes(phase);

  return createPortal(
    <>
      {/* One backdrop for the whole stack: the outermost modal drawer owns it. */}
      {modal === true && !hasModalAncestor ? <DrawerOverlay ref={overlayRef} {...presence} /> : null}
      <div
        data-slot="drawer-viewport"
        data-modal={modal === true ? "true" : "false"}
        data-presentation={presentation}
      >
        <div
          ref={mergedRef}
          id={popupId}
          role="dialog"
          aria-modal={modal === true ? true : undefined}
          aria-labelledby={ctx.titleId}
          aria-describedby={ctx.descriptionId}
          tabIndex={-1}
          data-slot="drawer-popup"
          data-swipe-axis={swipeAxis}
          data-swipe-direction={swipeDirection}
          data-presentation={presentation}
          data-snap-points={hasSnapPoints ? "" : undefined}
          data-has-offset={floated ? "" : undefined}
          data-width={typeof width === "string" && width in DRAWER_WIDTH_PRESETS ? width : undefined}
          data-nested-drawer-open={nestedOpenCount > 0 ? "" : undefined}
          data-nested={ctx.isNested ? "" : undefined}
          data-stack-measured={nestedOpenCount > 0 && frontmostHeight != null ? "" : undefined}
          {...presence}
          className={className}
          style={popupStyle}
          onPointerDown={handlePointerDown}
          {...props}
        >
          {/* Handle is mobile-sheet only; never mounts on desktop (no layout space). */}
          {showSwipeHandle ? <DrawerSwipeHandle /> : null}
          <div data-slot="drawer-content">{children}</div>
        </div>
      </div>
    </>,
    portalContainer,
  );
});
DrawerContent.displayName = "Drawer.Content";

function DrawerHeader({ className, style, ...props }: DrawerHeaderPropsType): ReactElement {
  return <div data-slot="drawer-header" className={className} style={style} {...props} />;
}
DrawerHeader.displayName = "Drawer.Header";

function DrawerFooter({ className, style, ...props }: DrawerFooterPropsType): ReactElement {
  return <div data-slot="drawer-footer" className={className} style={style} {...props} />;
}
DrawerFooter.displayName = "Drawer.Footer";

function DrawerBody({ className, style, ...props }: DrawerBodyPropsType): ReactElement {
  return <div data-slot="drawer-body" className={className} style={style} {...props} />;
}
DrawerBody.displayName = "Drawer.Body";

const DrawerTitle = forwardRef<HTMLHeadingElement, DrawerTitlePropsType>(function DrawerTitle(
  { className, style, ...props },
  ref,
) {
  const { titleId } = useDrawerContext();
  return (
    <h2
      ref={ref}
      id={titleId}
      data-slot="drawer-title"
      className={className}
      style={style}
      {...props}
    />
  );
});
DrawerTitle.displayName = "Drawer.Title";

const DrawerDescription = forwardRef<HTMLParagraphElement, DrawerDescriptionPropsType>(
  function DrawerDescription({ className, style, ...props }, ref) {
    const { descriptionId } = useDrawerContext();
    return (
      <p
        ref={ref}
        id={descriptionId}
        data-slot="drawer-description"
        className={className}
        style={style}
        {...props}
      />
    );
  },
);
DrawerDescription.displayName = "Drawer.Description";

export const Drawer = Object.assign(DrawerRoot, {
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Header: DrawerHeader,
  Footer: DrawerFooter,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Close: DrawerClose,
  Overlay: DrawerOverlay,
  SwipeHandle: DrawerSwipeHandle,
  Body: DrawerBody,
  Portal: DrawerPortal,
}) as unknown as DrawerComponentType;
