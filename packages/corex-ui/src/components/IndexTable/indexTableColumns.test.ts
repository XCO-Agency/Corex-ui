import { describe, expect, it } from "vitest";
import {
  HANDLE_COLUMN_WIDTH,
  reorderItems,
  resolveLayout,
  SELECTION_COLUMN_WIDTH,
} from "./indexTableColumns";

describe("resolveLayout", () => {
  it("builds one track per column plus the selection column", () => {
    const layout = resolveLayout({
      headings: [{ title: "Product" }, { title: "Total", format: "currency" }],
      columnCount: 0,
      selectable: true,
      stickyOverrides: {},
    });

    expect(layout.gridTemplateColumns).toBe(
      `${SELECTION_COLUMN_WIDTH}px minmax(200px, 2fr) minmax(80px, 1fr)`,
    );
    expect(layout.minInlineSize).toBe(`${SELECTION_COLUMN_WIDTH + 200 + 80}px`);
    expect(layout.columns[1]?.alignment).toBe("end");
  });

  it("pins left columns after the checkbox and fixes their width", () => {
    const layout = resolveLayout({
      headings: [{ title: "Product", sticky: "left", width: "240px" }, { title: "Status" }],
      columnCount: 0,
      selectable: true,
      stickyOverrides: {},
    });

    expect(layout.selectionSticky).toBe("left");
    expect(layout.columns[0]).toMatchObject({ track: "240px", offset: `${SELECTION_COLUMN_WIDTH}px` });
    expect(layout.columns[1]?.sticky).toBeUndefined();
  });

  it("stacks right pins from the right edge", () => {
    const layout = resolveLayout({
      headings: [
        { title: "Product" },
        { title: "Vendor", sticky: "right", minWidth: 100 },
        { title: "Actions", sticky: "right", width: "48px" },
      ],
      columnCount: 0,
      selectable: false,
      stickyOverrides: {},
    });

    expect(layout.columns[2]?.offset).toBe("0px");
    expect(layout.columns[1]?.offset).toBe("48px");
    expect(layout.selectionSticky).toBeUndefined();
  });

  it("lets a cell-registered pin override the heading", () => {
    const layout = resolveLayout({
      headings: [{ title: "Product" }, { title: "Status" }],
      columnCount: 0,
      selectable: false,
      stickyOverrides: { 0: "left" },
    });

    expect(layout.columns[0]).toMatchObject({ sticky: "left", offset: "0px", track: "200px" });
  });

  it("sizes columns from the row data when there are no headings", () => {
    const layout = resolveLayout({
      headings: [],
      columnCount: 3,
      selectable: false,
      stickyOverrides: {},
    });

    expect(layout.columns).toHaveLength(3);
  });

  it("puts the drag handle first and pins it with the checkbox", () => {
    const layout = resolveLayout({
      headings: [{ title: "Product", sticky: "left", minWidth: 240 }],
      columnCount: 0,
      selectable: true,
      reorderable: true,
      stickyOverrides: {},
    });

    expect(layout.gridTemplateColumns).toBe(
      `${HANDLE_COLUMN_WIDTH}px ${SELECTION_COLUMN_WIDTH}px 240px`,
    );
    expect(layout.selectionOffset).toBe(`${HANDLE_COLUMN_WIDTH}px`);
    expect(layout.columns[0]?.offset).toBe(`${HANDLE_COLUMN_WIDTH + SELECTION_COLUMN_WIDTH}px`);
  });
});

describe("reorderItems", () => {
  it("moves an item without mutating the input", () => {
    const items = ["a", "b", "c", "d"];
    expect(reorderItems(items, 0, 2)).toEqual(["b", "c", "a", "d"]);
    expect(reorderItems(items, 3, 0)).toEqual(["d", "a", "b", "c"]);
    expect(items).toEqual(["a", "b", "c", "d"]);
  });
});
