import {
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { BREAKPOINT_WIDTHS } from "../../hooks/useDimension";
import { DRAWER_CSS, DRAWER_STYLE_ID } from "./Drawer.css";
import type {
  DrawerBodyPropsType,
  DrawerClosePropsType,
  DrawerComponentType,
  DrawerContentPropsType,
  DrawerContextType,
  DrawerDescriptionPropsType,
  DrawerFooterPropsType,
  DrawerHeaderPropsType,
  DrawerOffsetType,
  DrawerOverlayPropsType,
  DrawerPortalPropsType,
  DrawerPresentationType,
  DrawerPropsType,
  DrawerResolvedOffsetType,
  DrawerSwipeDirectionType,
  DrawerSwipeHandlePropsType,
  DrawerTitlePropsType,
  DrawerTriggerPropsType,
} from "./Drawer.types";

const DRAWER_OFFSET_DEFAULT = 8;

const DrawerContext = createContext<DrawerContextType | null>(null);

/**
 * Reads drawer root config (resolved direction, presentation, offset, handle).
 * Must be used under `<Drawer>`.
 */
export function useDrawer(): DrawerContextType {
  const ctx = useContext(DrawerContext);
  if (!ctx) {
    throw new Error("Drawer compound components must be used within a <Drawer />");
  }
  return ctx;
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

function resolveNativeButton(child: ReactNode): boolean | undefined {
  if (!isValidElement(child)) return undefined;
  const type = child.type;
  if (type === "button") return true;
  // Polaris / Corex Button renders `s-button`, not a native <button>.
  return false;
}

/**
 * Responsive swipeable drawer.
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
/**
 * Viewport width of the document that hosts the Drawer (iframe-aware).
 * `useBreakpoints` / `window.innerWidth` always read the top window, which
 * breaks playground device previews and embedded Shopify iframes.
 */
function useHostViewportMobile(hostDoc: Document | null): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < BREAKPOINT_WIDTHS.md;
  });

  useEffect(() => {
    const win = hostDoc?.defaultView;
    if (!win) return;

    const update = () => {
      setIsMobile(win.innerWidth < BREAKPOINT_WIDTHS.md);
    };
    update();
    win.addEventListener("resize", update, { passive: true });
    return () => win.removeEventListener("resize", update);
  }, [hostDoc]);

  return isMobile;
}

function DrawerRoot({
  children,
  modal = true,
  showSwipeHandle = false,
  snapPoints,
  swipeDirection = "right",
  responsive = true,
  offset,
  ...props
}: DrawerPropsType): ReactElement {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const [hostDoc, setHostDoc] = useState<Document | null>(null);
  const isMobile = useHostViewportMobile(hostDoc);

  const markerRef = useCallback((node: HTMLSpanElement | null) => {
    if (!node) {
      setPortalContainer(null);
      setHostDoc(null);
      return;
    }
    ensureDrawerStyles(node);
    // Keep the portal in the same document as the trigger (e.g. playground
    // preview iframes). Base UI defaults to the top-window `document.body`.
    setPortalContainer(node.ownerDocument.body);
    setHostDoc(node.ownerDocument);
  }, []);

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

  // Match shadcn Base demos: floating panel with 8px edge gap on every side.
  // Override with `offset` (number | string | per-side object).
  const resolvedOffset = useMemo(() => resolveDrawerOffset(offset), [offset]);
  const hasSnapPoints = snapPoints != null && snapPoints.length > 0;

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
      {/* Remount when presentation axis changes so Base UI swipe state stays consistent. */}
      <DrawerPrimitive.Root
        key={`${resolvedSwipeDirection}-${presentation}`}
        data-slot="drawer"
        data-presentation={presentation}
        modal={modal}
        snapPoints={presentation === "sheet" ? snapPoints : undefined}
        swipeDirection={resolvedSwipeDirection}
        {...props}
      >
        {children}
      </DrawerPrimitive.Root>
    </DrawerContext.Provider>
  );
}
DrawerRoot.displayName = "Drawer";

function DrawerTrigger({ children, nativeButton, ...props }: DrawerTriggerPropsType): ReactElement {
  const resolvedNative =
    nativeButton ?? (children !== undefined ? resolveNativeButton(children) : true);

  if (isValidElement(children)) {
    return (
      <DrawerPrimitive.Trigger
        data-slot="drawer-trigger"
        nativeButton={resolvedNative}
        render={children}
        {...props}
      />
    );
  }

  return (
    <DrawerPrimitive.Trigger data-slot="drawer-trigger" nativeButton={resolvedNative} {...props}>
      {children}
    </DrawerPrimitive.Trigger>
  );
}
DrawerTrigger.displayName = "Drawer.Trigger";

function DrawerClose({ children, nativeButton, ...props }: DrawerClosePropsType): ReactElement {
  const resolvedNative =
    nativeButton ?? (children !== undefined ? resolveNativeButton(children) : true);

  if (isValidElement(children)) {
    return (
      <DrawerPrimitive.Close
        data-slot="drawer-close"
        nativeButton={resolvedNative}
        render={children}
        {...props}
      />
    );
  }

  return (
    <DrawerPrimitive.Close data-slot="drawer-close" nativeButton={resolvedNative} {...props}>
      {children}
    </DrawerPrimitive.Close>
  );
}
DrawerClose.displayName = "Drawer.Close";

function DrawerPortal({ container, ...props }: DrawerPortalPropsType): ReactElement {
  const { portalContainer } = useDrawer();
  return (
    <DrawerPrimitive.Portal
      data-slot="drawer-portal"
      container={container ?? portalContainer ?? undefined}
      {...props}
    />
  );
}
DrawerPortal.displayName = "Drawer.Portal";

const DrawerOverlay = forwardRef<HTMLDivElement, DrawerOverlayPropsType>(
  function DrawerOverlay({ style, className, ...props }, ref) {
    return (
      <DrawerPrimitive.Backdrop
        ref={ref}
        data-slot="drawer-overlay"
        className={className}
        style={style}
        {...props}
      />
    );
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

/**
 * High-level panel: portal + overlay + viewport + popup + inner content.
 * Swipe-to-dismiss applies to the full popup surface (not handle-only).
 */
const DrawerContent = forwardRef<HTMLDivElement, DrawerContentPropsType>(function DrawerContent(
  { children, className, style, offset, width, maxHeight, ...props },
  ref,
) {
  const {
    hasSnapPoints,
    modal,
    showSwipeHandle,
    swipeDirection,
    presentation,
    offset: rootOffset,
    portalContainer,
  } = useDrawer();
  const swipeAxis =
    swipeDirection === "down" || swipeDirection === "up" ? "y" : "x";
  const resolvedOffset =
    offset !== undefined ? resolveDrawerOffset(offset, DRAWER_OFFSET_DEFAULT) : rootOffset;
  const floated = hasNonZeroOffset(resolvedOffset);

  useLayoutEffect(() => {
    if (portalContainer) ensureDrawerStyles(portalContainer);
  }, [portalContainer]);

  const popupStyle: CSSProperties = {
    ...offsetToCssVars(resolvedOffset),
    ...(width ? { ["--drawer-content-width" as string]: width } : null),
    ...(maxHeight ? { ["--drawer-content-max-height" as string]: maxHeight } : null),
    ...style,
  };

  return (
    <DrawerPrimitive.Portal
      data-slot="drawer-portal"
      container={portalContainer ?? undefined}
    >
      {modal === true && <DrawerOverlay />}
      <DrawerPrimitive.Viewport
        data-slot="drawer-viewport"
        data-modal={modal === true ? "true" : "false"}
        data-presentation={presentation}
      >
        <DrawerPrimitive.Popup
          ref={ref}
          data-slot="drawer-popup"
          data-swipe-axis={swipeAxis}
          data-presentation={presentation}
          data-snap-points={hasSnapPoints && presentation === "sheet" ? "" : undefined}
          data-has-offset={floated ? "" : undefined}
          className={className}
          style={popupStyle}
          {...props}
        >
          {/* Handle is mobile-sheet only; never mounts on desktop (no layout space). */}
          {showSwipeHandle ? <DrawerSwipeHandle /> : null}
          <DrawerPrimitive.Content data-slot="drawer-content">{children}</DrawerPrimitive.Content>
        </DrawerPrimitive.Popup>
      </DrawerPrimitive.Viewport>
    </DrawerPrimitive.Portal>
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
  return (
    <DrawerPrimitive.Title
      ref={ref}
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
    return (
      <DrawerPrimitive.Description
        ref={ref}
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
