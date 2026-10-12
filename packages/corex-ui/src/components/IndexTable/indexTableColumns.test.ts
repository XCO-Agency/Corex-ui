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
      `${SELECTION_COLUMN_WIDTH}px minmax(200px, 1fr) ` +
        "fit-content(max(80px, var(--cx-it-cell-max-width, 260px)))",
    );
    expect(layout.minInlineSize).toBe(`${SELECTION_COLUMN_WIDTH + 200 + 80}px`);
    expect(layout.columns[1]?.alignment).toBe("end");
  });

  it("sizes columns to their content between minWidth and maxWidth", () => {
    const layout = resolveLayout({
      headings: [
        { title: "Product" },
        { title: "Status", minWidth: 90, maxWidth: 140 },
        { title: "Notes", minWidth: 300, maxWidth: 200 },
        { title: "Vendor" },
      ],
      columnCount: 0,
      selectable: false,
      stickyOverrides: {},
    });

    expect(layout.columns.map((c) => c.track)).toEqual([
      "minmax(200px, 1fr)",
      "fit-content(140px)",
      // A max below the min is raised to the min.
      "fit-content(300px)",
      "fit-content(max(120px, var(--cx-it-cell-max-width, 260px)))",
    ]);
    expect(layout.columns.map((c) => c.flexible)).toEqual([true, false, false, false]);
    expect(layout.columns.map((c) => c.contentSized)).toEqual([false, true, true, true]);
  });

  it("caps the flexible column when it has a maxWidth", () => {
    const layout = resolveLayout({
      headings: [{ title: "Product", maxWidth: 400 }, { title: "Status" }],
      columnCount: 0,
      selectable: false,
      stickyOverrides: {},
    });

    expect(layout.columns[0]?.track).toBe("minmax(200px, 400px)");
  });

  it("lets the last free column take the spare width when the primary is pinned", () => {
    const layout = resolveLayout({
      headings: [
        { title: "Product", sticky: "left" },
        { title: "Status" },
        { title: "Vendor" },
        { title: "", hidden: true, width: "48px" },
      ],
      columnCount: 0,
      selectable: false,
      stickyOverrides: {},
    });

    expect(layout.columns.map((c) => c.flexible)).toEqual([false, false, true, false]);
    expect(layout.columns[2]?.track).toBe("minmax(120px, 1fr)");
  });

  it("pins left columns after the checkbox and fixes their width", () => {
    const layout = resolveLayout({
      headings: [
        { title: "Product", sticky: "left", width: "240px" },
        { title: "Status" },
      ],
      columnCount: 0,
      selectable: true,
      stickyOverrides: {},
    });

    expect(layout.selectionSticky).toBe("left");
    expect(layout.columns[0]).toMatchObject({
      track: "240px",
      offset: `${SELECTION_COLUMN_WIDTH}px`,
    });
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

    expect(layout.columns[0]).toMatchObject({
      sticky: "left",
      offset: "0px",
      track: "200px",
    });
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
    expect(layout.columns[0]?.offset).toBe(
      `${HANDLE_COLUMN_WIDTH + SELECTION_COLUMN_WIDTH}px`,
    );
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
