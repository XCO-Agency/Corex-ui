import type { FlexPopoverPositionType } from "./FlexPopover.types";

export type FlexPopoverSideType = "top" | "bottom" | "left" | "right";
type Align = "start" | "center" | "end";

/** Anchor or popover box in viewport coordinates. */
export type FlexPopoverRectType = {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

export type FlexPopoverPlacementType = {
  /** Physical side after flipping. */
  side: FlexPopoverSideType;
  /** Cross-axis alignment after writing-direction resolution. */
  align: Align;
  top: number;
  left: number;
  /** CSS `transform-origin`, so the popover grows out of the anchor edge. */
  transformOrigin: string;
  /** Closed-state translate, applied through `--corex-popover-enter-x`. */
  enterX: string;
  /** Closed-state translate, applied through `--corex-popover-enter-y`. */
  enterY: string;
};

export type FlexPopoverBridgeType = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const OPPOSITE_SIDE: Record<FlexPopoverSideType, FlexPopoverSideType> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

export function parseFlexPopoverPosition(position: FlexPopoverPositionType): {
  side: FlexPopoverSideType;
  align: Align;
} {
  const [side, align] = position.split("-") as [FlexPopoverSideType, Align | undefined];
  return { side, align: align ?? "center" };
}

export function toPopoverRect(
  rect: Pick<DOMRect, "top" | "left" | "right" | "bottom" | "width" | "height">,
): FlexPopoverRectType {
  return {
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  };
}

function clamp(value: number, min: number, max: number): number {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

/**
 * Horizontal `start` / `end` follow writing direction. Vertical alignment
 * (`left` / `right` placements) stays physical: start is the top edge.
 */
function logicalAlign(align: Align, side: FlexPopoverSideType, rtl: boolean): Align {
  const horizontal = side === "top" || side === "bottom";
  if (!rtl || !horizontal || align === "center") return align;
  return align === "start" ? "end" : "start";
}

function chooseSide(
  side: FlexPopoverSideType,
  anchor: FlexPopoverRectType,
  popoverWidth: number,
  popoverHeight: number,
  offset: number,
  viewportWidth: number,
  viewportHeight: number,
): FlexPopoverSideType {
  const space: Record<FlexPopoverSideType, number> = {
    top: anchor.top - offset,
    bottom: viewportHeight - anchor.bottom - offset,
    left: anchor.left - offset,
    right: viewportWidth - anchor.right - offset,
  };
  const needed = side === "top" || side === "bottom" ? popoverHeight : popoverWidth;
  if (space[side] >= needed) return side;
  const opposite = OPPOSITE_SIDE[side];
  return space[opposite] > space[side] ? opposite : side;
}

const ENTER_PX = 4;

/** Closed-state motion for the resolved side and alignment. */
function enterMotion(
  side: FlexPopoverSideType,
  align: Align,
): Pick<FlexPopoverPlacementType, "transformOrigin" | "enterX" | "enterY"> {
  const x =
    side === "left"
      ? "right"
      : side === "right"
        ? "left"
        : align === "end"
          ? "right"
          : align === "center"
            ? "center"
            : "left";
  const y =
    side === "top"
      ? "bottom"
      : side === "bottom"
        ? "top"
        : align === "end"
          ? "bottom"
          : align === "center"
            ? "center"
            : "top";
  return {
    transformOrigin: `${x} ${y}`,
    enterX: side === "left" ? `${ENTER_PX}px` : side === "right" ? `-${ENTER_PX}px` : "0px",
    enterY: side === "top" ? `${ENTER_PX}px` : side === "bottom" ? `-${ENTER_PX}px` : "0px",
  };
}

/**
 * Place the popover against `anchor` for `position`, flipping to the opposite
 * side when the preferred side cannot fit and the opposite side has more room.
 * The result is clamped inside the viewport margin.
 */
export function placeFlexPopover({
  position,
  anchor,
  popoverWidth,
  popoverHeight,
  offset,
  viewportWidth,
  viewportHeight,
  margin,
  rtl = false,
}: {
  position: FlexPopoverPositionType;
  anchor: FlexPopoverRectType;
  popoverWidth: number;
  popoverHeight: number;
  offset: number;
  viewportWidth: number;
  viewportHeight: number;
  margin: number;
  rtl?: boolean;
}): FlexPopoverPlacementType {
  const requested = parseFlexPopoverPosition(position);
  const side = chooseSide(
    requested.side,
    anchor,
    popoverWidth,
    popoverHeight,
    offset,
    viewportWidth,
    viewportHeight,
  );
  const align = logicalAlign(requested.align, side, rtl);

  let top: number;
  if (side === "bottom") top = anchor.bottom + offset;
  else if (side === "top") top = anchor.top - offset - popoverHeight;
  else if (align === "end") top = anchor.bottom - popoverHeight;
  else if (align === "center") top = anchor.top + (anchor.height - popoverHeight) / 2;
  else top = anchor.top;

  let left: number;
  if (side === "right") left = anchor.right + offset;
  else if (side === "left") left = anchor.left - offset - popoverWidth;
  else if (align === "end") left = anchor.right - popoverWidth;
  else if (align === "center") left = anchor.left + (anchor.width - popoverWidth) / 2;
  else left = anchor.left;

  const maxTop = Math.max(margin, viewportHeight - margin - popoverHeight);
  const maxLeft = Math.max(margin, viewportWidth - margin - popoverWidth);

  return {
    side,
    align,
    top: Math.round(clamp(top, margin, maxTop)),
    left: Math.round(clamp(left, margin, maxLeft)),
    ...enterMotion(side, align),
  };
}

/** Overlap both edges by a pixel so the seam itself cannot dismiss the popover. */
const BRIDGE_SEAM = 1;

/**
 * Strip covering the offset gap between the anchor and the popover.
 * Hover treats this strip as inside, so the pointer can cross `offset` slowly.
 */
export function flexPopoverHoverBridge(
  side: FlexPopoverSideType,
  anchor: FlexPopoverRectType,
  popover: FlexPopoverRectType,
): FlexPopoverBridgeType {
  if (popover.width <= 0 || popover.height <= 0) {
    return { top: 0, left: 0, width: 0, height: 0 };
  }

  if (side === "top" || side === "bottom") {
    const near = side === "bottom" ? anchor.bottom : popover.bottom;
    const far = side === "bottom" ? popover.top : anchor.top;
    const left = Math.min(anchor.left, popover.left) - BRIDGE_SEAM;
    const right = Math.max(anchor.right, popover.right) + BRIDGE_SEAM;
    return {
      top: Math.min(near, far) - BRIDGE_SEAM,
      left,
      width: Math.max(0, right - left),
      height: Math.abs(far - near) + BRIDGE_SEAM * 2,
    };
  }

  const near = side === "right" ? anchor.right : popover.right;
  const far = side === "right" ? popover.left : anchor.left;
  const top = Math.min(anchor.top, popover.top) - BRIDGE_SEAM;
  const bottom = Math.max(anchor.bottom, popover.bottom) + BRIDGE_SEAM;
  return {
    top,
    left: Math.min(near, far) - BRIDGE_SEAM,
    width: Math.abs(far - near) + BRIDGE_SEAM * 2,
    height: Math.max(0, bottom - top),
  };
}

function hasBox(node: Element | null | undefined): boolean {
  // Not `instanceof HTMLElement`: nodes from an iframe come from another realm.
  if (!node || node.nodeType !== 1 || typeof node.getBoundingClientRect !== "function") {
    return false;
  }
  const rect = (node as HTMLElement).getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

/**
 * Element whose border box should be used to place the popover.
 * Polaris hosts such as `s-button` are `display: contents`, so the host rect is
 * empty and the visible control lives in the shadow tree.
 * Returns null while that control has no box yet. Callers retry. The parent is
 * not a fallback: it is the row or card, and anchoring there is the wrong place.
 */
export function flexPopoverAnchorBox(host: HTMLElement): HTMLElement | null {
  if (hasBox(host)) return host;

  const roots: ParentNode[] = [];
  if (host.shadowRoot) roots.push(host.shadowRoot);
  for (const node of host.querySelectorAll("*")) {
    if (node.shadowRoot) roots.push(node.shadowRoot);
  }

  for (const root of roots) {
    const control = root.querySelector("button, a, input, [role='button']");
    if (hasBox(control)) return control as HTMLElement;
    for (const node of root.querySelectorAll("*")) {
      if (node.tagName === "SLOT") continue;
      if (hasBox(node)) return node as HTMLElement;
    }
  }

  for (const node of host.querySelectorAll("*")) {
    if (hasBox(node)) return node as HTMLElement;
  }

  return null;
}

/** True when the pointer is inside the offset bridge. */
export function pointerInFlexPopoverBridge(
  x: number,
  y: number,
  bridge: FlexPopoverBridgeType,
): boolean {
  if (bridge.width <= 0 || bridge.height <= 0) return false;
  return (
    x >= bridge.left &&
    x <= bridge.left + bridge.width &&
    y >= bridge.top &&
    y <= bridge.top + bridge.height
  );
}
