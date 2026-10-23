import { describe, expect, it } from "vitest";
import {
  flexPopoverAnchorBox,
  flexPopoverHoverBridge,
  placeFlexPopover,
  pointerInFlexPopoverBridge,
  type FlexPopoverRectType,
} from "./FlexPopover.placement";

function rect(
  partial: Pick<FlexPopoverRectType, "top" | "left" | "width" | "height">,
): FlexPopoverRectType {
  return {
    top: partial.top,
    left: partial.left,
    width: partial.width,
    height: partial.height,
    right: partial.left + partial.width,
    bottom: partial.top + partial.height,
  };
}

const anchor = rect({ top: 200, left: 100, width: 80, height: 40 });
const viewport = {
  viewportWidth: 800,
  viewportHeight: 600,
  margin: 12,
  offset: 8,
  popoverWidth: 120,
  popoverHeight: 80,
};

describe("placeFlexPopover", () => {
  it("aligns the bottom-start edge under the anchor", () => {
    const placed = placeFlexPopover({
      anchor,
      position: "bottom-start",
      ...viewport,
    });

    expect(placed.side).toBe("bottom");
    expect(placed.top).toBe(248);
    expect(placed.left).toBe(100);
    expect(placed.enterY).toBe("-4px");
    expect(placed.transformOrigin).toBe("left top");
  });

  it("centers a bare side on the anchor", () => {
    const placed = placeFlexPopover({
      anchor,
      position: "bottom",
      ...viewport,
    });

    expect(placed.align).toBe("center");
    expect(placed.left).toBe(80);
    expect(placed.top).toBe(248);
  });

  it("treats *-center the same as a bare side", () => {
    const bare = placeFlexPopover({
      anchor,
      position: "bottom",
      ...viewport,
    });
    const named = placeFlexPopover({
      anchor,
      position: "bottom-center",
      ...viewport,
    });

    expect(named).toEqual(bare);
  });

  it("places top-center above the anchor", () => {
    const placed = placeFlexPopover({
      anchor,
      position: "top-center",
      ...viewport,
    });

    expect(placed.side).toBe("top");
    expect(placed.align).toBe("center");
    expect(placed.top).toBe(112);
    expect(placed.left).toBe(80);
    expect(placed.enterY).toBe("4px");
    expect(placed.transformOrigin).toBe("center bottom");
  });

  it("places top-start above the anchor", () => {
    const placed = placeFlexPopover({
      anchor,
      position: "top-start",
      ...viewport,
    });

    expect(placed.side).toBe("top");
    expect(placed.top).toBe(112);
    expect(placed.left).toBe(100);
    expect(placed.enterY).toBe("4px");
  });

  it("places right-center beside the anchor", () => {
    const placed = placeFlexPopover({
      anchor,
      position: "right-center",
      ...viewport,
    });

    expect(placed.side).toBe("right");
    expect(placed.align).toBe("center");
    expect(placed.left).toBe(188);
    expect(placed.top).toBe(180);
    expect(placed.enterX).toBe("-4px");
    expect(placed.transformOrigin).toBe("left center");
  });

  it("places left-center beside the anchor", () => {
    const placed = placeFlexPopover({
      // Far enough from the left edge that the panel fits without flipping.
      anchor: rect({ top: 200, left: 300, width: 80, height: 40 }),
      position: "left-center",
      ...viewport,
    });

    expect(placed.side).toBe("left");
    expect(placed.align).toBe("center");
    expect(placed.left).toBe(300 - 8 - 120);
    expect(placed.top).toBe(180);
    expect(placed.enterX).toBe("4px");
  });

  it("flips below the anchor when there is not enough room above", () => {
    const placed = placeFlexPopover({
      anchor: rect({ top: 20, left: 100, width: 80, height: 40 }),
      position: "top",
      ...viewport,
    });

    expect(placed.side).toBe("bottom");
    expect(placed.top).toBe(68);
  });

  it("flips start and end in RTL on the horizontal axis", () => {
    const placed = placeFlexPopover({
      anchor,
      position: "bottom-start",
      rtl: true,
      ...viewport,
      popoverWidth: 50,
      popoverHeight: 40,
    });

    expect(placed.left).toBe(130);
    expect(placed.align).toBe("end");
  });

  it("clamps the cross axis inside the viewport margin", () => {
    const placed = placeFlexPopover({
      anchor: rect({ top: 200, left: 0, width: 20, height: 40 }),
      position: "bottom-end",
      ...viewport,
      popoverWidth: 100,
      popoverHeight: 40,
    });

    expect(placed.left).toBe(12);
  });
});

describe("flexPopoverHoverBridge", () => {
  const anchorRect = rect({ top: 100, left: 100, width: 80, height: 32 });
  const popoverRect = rect({ top: 140, left: 100, width: 180, height: 160 });

  it("covers the offset between the anchor and the popover", () => {
    const bridge = flexPopoverHoverBridge("bottom", anchorRect, popoverRect);
    expect(pointerInFlexPopoverBridge(140, 136, bridge)).toBe(true);
  });

  it("ignores a point that has left the gap", () => {
    const bridge = flexPopoverHoverBridge("bottom", anchorRect, popoverRect);
    expect(pointerInFlexPopoverBridge(400, 400, bridge)).toBe(false);
  });

  it("ignores an unmeasured popover", () => {
    const bridge = flexPopoverHoverBridge(
      "bottom",
      anchorRect,
      rect({ top: 0, left: 0, width: 0, height: 0 }),
    );
    expect(pointerInFlexPopoverBridge(140, 136, bridge)).toBe(false);
  });
});

describe("flexPopoverAnchorBox across realms", () => {
  it("finds the box of a node that is not an instance of this realm's HTMLElement", () => {
    const rect = { width: 10, height: 10 };
    const fake = {
      nodeType: 1,
      getBoundingClientRect: () => rect,
    } as unknown as HTMLElement;
    expect(flexPopoverAnchorBox(fake)).toBe(fake);
  });
});
