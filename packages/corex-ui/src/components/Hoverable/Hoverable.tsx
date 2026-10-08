import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
  type ReactElement,
} from "react";
import type {
  HoverableAnimationType,
  HoverablePropsType,
  HoverableSlotPropsType,
  HoverableStateType,
} from "./Hoverable.types";

const STYLE_ID = "cx-hoverable-styles";

/** Starting transform of each animation, applied while the slot is hidden. */
const ANIMATION_FROM: Record<HoverableAnimationType, string> = {
  fade: "none",
  "slide-up": "translateY(4px)",
  "slide-down": "translateY(-4px)",
  scale: "scale(0.96)",
  none: "none",
};

// Group and slots are `display: contents`, so they add no box and never change
// the layout, and the animation runs on the slot's direct children.
// Polaris hosts (`s-button`, `s-text`, ...) are themselves `display: contents`
// and cannot be animated, so for those the slot switches to "self" mode: it
// takes the outer display of the box that actually renders and animates itself.
// `visibility` waits for the fade-out before hiding, and switches on at once.
const HOVERABLE_CSS = `
.cx-hoverable, .cx-hoverable-slot { display: contents; }
.cx-hoverable-slot[data-mode="self"] { display: var(--cx-hv-display); }
.cx-hoverable-slot[data-ready="true"][data-mode="children"] > *,
.cx-hoverable-slot[data-ready="true"][data-mode="self"] {
  transition:
    opacity var(--cx-hv-duration) ease,
    transform var(--cx-hv-duration) ease,
    visibility 0s linear 0s;
}
.cx-hoverable-slot[data-mode="children"][data-visible="false"] > *,
.cx-hoverable-slot[data-mode="self"][data-visible="false"] {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: var(--cx-hv-from);
  transition-delay: 0s, 0s, var(--cx-hv-duration);
}
.cx-hoverable-slot[data-mode="children"][data-visible="false"][data-keep-space="false"] > *,
.cx-hoverable-slot[data-mode="self"][data-visible="false"][data-keep-space="false"] {
  display: none;
}
@media (prefers-reduced-motion: reduce) {
  .cx-hoverable-slot[data-ready="true"][data-mode="children"] > *,
  .cx-hoverable-slot[data-ready="true"][data-mode="self"] { transition: none; }
}
`;

type SlotModeType = { mode: "children" | "self"; display: string };

/**
 * The display of the first box `element` renders, looking through
 * `display: contents` elements and open shadow roots. `null` when none yet
 * (e.g. a custom element that has not upgraded).
 */
function renderedDisplay(element: Element, view: Window): string | null {
  const display = view.getComputedStyle(element).display;
  if (display !== "contents") return display;
  const children = [...(element.shadowRoot?.children ?? []), ...element.children];
  for (const child of children) {
    if (child.tagName === "STYLE" || child.tagName === "SLOT") continue;
    const inner = renderedDisplay(child, view);
    if (inner && inner !== "none") return inner;
  }
  return null;
}

/** Decides whether the slot's children can be animated directly. */
function measureSlot(slot: HTMLElement): SlotModeType {
  const view = slot.ownerDocument.defaultView;
  const hasText = [...slot.childNodes].some(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
  );
  const elements = [...slot.children];
  if (
    !view ||
    (!hasText && elements.every((el) => view.getComputedStyle(el).display !== "contents"))
  ) {
    return { mode: "children", display: "contents" };
  }
  const inner =
    elements.length === 1 && !hasText ? renderedDisplay(elements[0]!, view) : null;
  const inline = hasText || !inner || inner.startsWith("inline");
  return { mode: "self", display: inline ? "inline-block" : "block" };
}

/**
 * Adds the shared stylesheet to the document the element actually lives in
 * (which differs from the global `document` inside iframes and portals), once.
 */
function ensureStyles(node: HTMLElement | null) {
  const doc = node?.ownerDocument;
  if (!doc) return;
  // Replaces an outdated sheet (hot reload, or two package versions on a page).
  const existing = doc.getElementById(STYLE_ID);
  if (existing) {
    if (existing.textContent !== HOVERABLE_CSS) existing.textContent = HOVERABLE_CSS;
    return;
  }
  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = HOVERABLE_CSS;
  doc.head.appendChild(style);
}

const HoverableContext = createContext<HoverableStateType | null>(null);

/** Reads the nearest `Hoverable`'s state; `hovered` is `false` outside one. */
export function useHoverable(): HoverableStateType {
  return useContext(HoverableContext) ?? { hovered: false };
}

/** `relatedTarget` is still inside the group, so the pointer/focus never left. */
function staysInside(node: HTMLElement | null, related: EventTarget | null) {
  return !!node && related instanceof Node && node.contains(related);
}

function HoverableRoot({
  children,
  hovered: hoveredProp,
  onHoverChange,
  includeFocus = true,
  disabled = false,
  openDelay = 0,
  closeDelay = 0,
}: HoverablePropsType): ReactElement {
  const nodeRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const pointerInside = useRef(false);
  const focusInside = useRef(false);
  const [internalHovered, setInternalHovered] = useState(false);
  const lastHovered = useRef(false);

  useLayoutEffect(() => ensureStyles(nodeRef.current), []);
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const sync = useCallback(() => {
    const next = pointerInside.current || (includeFocus && focusInside.current);
    clearTimeout(timerRef.current);
    const apply = () => {
      if (lastHovered.current === next) return;
      lastHovered.current = next;
      setInternalHovered(next);
      onHoverChange?.(next);
    };
    const delay = next ? openDelay : closeDelay;
    if (delay > 0) timerRef.current = setTimeout(apply, delay);
    else apply();
  }, [includeFocus, openDelay, closeDelay, onHoverChange]);

  // Bubbling over/out events (not enter/leave) still reach a `display: contents`
  // element from its descendants; `relatedTarget` filters moves within the group.
  const handleMouseOver = () => {
    if (pointerInside.current) return;
    pointerInside.current = true;
    sync();
  };
  const handleMouseOut = (event: MouseEvent<HTMLDivElement>) => {
    if (staysInside(nodeRef.current, event.relatedTarget)) return;
    pointerInside.current = false;
    sync();
  };
  const handleFocus = () => {
    focusInside.current = true;
    sync();
  };
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (staysInside(nodeRef.current, event.relatedTarget)) return;
    focusInside.current = false;
    sync();
  };

  const hovered = !disabled && (hoveredProp ?? internalHovered);
  const state: HoverableStateType = { hovered };

  return (
    <HoverableContext.Provider value={state}>
      <div
        ref={nodeRef}
        className="cx-hoverable"
        data-hovered={hovered}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {typeof children === "function" ? children(state) : children}
      </div>
    </HoverableContext.Provider>
  );
}

function createSlot(showOnHover: boolean, displayName: string) {
  function Slot({
    children,
    animation = "fade",
    duration = 150,
    keepSpace = true,
  }: HoverableSlotPropsType): ReactElement {
    const { hovered } = useHoverable();
    const visible = hovered === showOnHover;
    const slotRef = useRef<HTMLDivElement>(null);
    const [ready, setReady] = useState(false);
    const [layout, setLayout] = useState<SlotModeType>({
      mode: "children",
      display: "contents",
    });

    // Re-measured after every render, and once more on the next frame for
    // custom elements that upgrade (and attach their shadow root) late.
    useLayoutEffect(() => {
      const slot = slotRef.current;
      if (!slot) return;
      const update = () => {
        const next = measureSlot(slot);
        if (next.mode === layout.mode && next.display === layout.display) return;
        setLayout(next);
      };
      update();
      // Transitions stay off until the mode is settled, so mounting never animates.
      const frame = requestAnimationFrame(() => {
        update();
        setReady(true);
      });
      return () => cancelAnimationFrame(frame);
    });

    const style = {
      "--cx-hv-duration": `${animation === "none" ? 0 : duration}ms`,
      "--cx-hv-from": ANIMATION_FROM[animation],
      "--cx-hv-display": layout.display,
    } as CSSProperties;

    return (
      <div
        ref={slotRef}
        className="cx-hoverable-slot"
        data-mode={layout.mode}
        data-ready={ready}
        data-visible={visible}
        data-keep-space={keepSpace}
        aria-hidden={visible ? undefined : true}
        style={style}
      >
        {children}
      </div>
    );
  }
  Slot.displayName = displayName;
  return Slot;
}

/** Visible only while its `Hoverable` group is hovered. */
const HoverableShow = createSlot(true, "Hoverable.Show");
/** Visible only while its `Hoverable` group is not hovered. */
const HoverableHide = createSlot(false, "Hoverable.Hide");

/**
 * Hover group that shows or hides content anywhere inside it, without adding
 * a box or changing the layout of what it wraps.
 *
 * ```tsx
 * <Hoverable>
 *   <Card>
 *     <TextField label="Name" />
 *     <Hoverable.Show animation="slide-up">
 *       <Button>Edit</Button>
 *     </Hoverable.Show>
 *   </Card>
 * </Hoverable>
 * ```
 */
export const Hoverable = Object.assign(HoverableRoot, {
  Show: HoverableShow,
  Hide: HoverableHide,
});
