import { describe, expect, it } from "vitest";
import {
  getSelectionState,
  getToggleChanges,
  type SelectionNodeType,
} from "./indexTableSelection";

function node(
  id: string,
  selected = false,
  children: SelectionNodeType[] = [],
  selectable = true,
): SelectionNodeType {
  return { id, selected, selectable, children };
}

describe("getSelectionState", () => {
  it("uses the row's own flag when it has no selectable children", () => {
    expect(getSelectionState(node("a", true))).toBe("all");
    expect(getSelectionState(node("a", false, [node("x", true, [], false)]))).toBe(
      "none",
    );
  });

  it("derives all / some / none from selectable children", () => {
    expect(getSelectionState(node("p", false, [node("a", true), node("b", true)]))).toBe(
      "all",
    );
    expect(getSelectionState(node("p", false, [node("a", true), node("b")]))).toBe(
      "some",
    );
    expect(getSelectionState(node("p", true, [node("a"), node("b")]))).toBe("none");
  });

  it("ignores children that cannot be selected", () => {
    const parent = node("p", false, [node("a", true), node("b", false, [], false)]);
    expect(getSelectionState(parent)).toBe("all");
  });

  it("works through several levels", () => {
    const tree = node("p", false, [
      node("g", false, [node("a", true), node("b")]),
      node("c", true),
    ]);
    expect(getSelectionState(tree)).toBe("some");
  });
});

describe("getToggleChanges", () => {
  it("selects a parent's whole subtree", () => {
    const parent = node("p", false, [
      node("a"),
      node("b", true),
      node("x", false, [], false),
    ]);
    expect(getToggleChanges(parent, true, [])).toEqual([
      { id: "p", selected: true },
      { id: "a", selected: true },
    ]);
  });

  it("updates every ancestor as far up as it changes", () => {
    const leaf = node("a");
    const group = node("g", false, [leaf, node("b", true)]);
    const root = node("r", false, [group, node("c", true)]);

    expect(getToggleChanges(leaf, true, [group, root])).toEqual([
      { id: "a", selected: true },
      { id: "g", selected: true },
      { id: "r", selected: true },
    ]);
  });
});
