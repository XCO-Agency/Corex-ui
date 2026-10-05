import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useIndexResourceState } from "./useIndexResourceState";

const orders = [{ id: "1" }, { id: "2" }, { id: "3" }];

describe("useIndexResourceState", () => {
  it("starts empty and tracks single selections", () => {
    const { result } = renderHook(() => useIndexResourceState(orders));

    expect(result.current.selectedResources).toEqual([]);

    act(() => result.current.handleSelectionChange("single", true, "2"));
    expect(result.current.selectedResources).toEqual(["2"]);

    act(() => result.current.handleSelectionChange("single", false, "2"));
    expect(result.current.selectedResources).toEqual([]);
  });

  it("never selects the same resource twice", () => {
    const { result } = renderHook(() => useIndexResourceState(orders));

    act(() => result.current.handleSelectionChange("single", true, "2"));
    act(() => result.current.handleSelectionChange("single", true, "2"));

    expect(result.current.selectedResources).toEqual(["2"]);
  });

  it("selects and clears the page", () => {
    const { result } = renderHook(() => useIndexResourceState(orders));

    act(() => result.current.handleSelectionChange("page", true));
    expect(result.current.selectedResources).toEqual(["1", "2", "3"]);
    expect(result.current.allResourcesSelected).toBe(true);

    act(() => result.current.handleSelectionChange("page", false));
    expect(result.current.selectedResources).toEqual([]);
    expect(result.current.allResourcesSelected).toBe(false);
  });

  it("honours a custom id resolver and an initial selection", () => {
    const resources = [
      { id: 1, gid: "gid://1" },
      { id: 2, gid: "gid://2" },
    ];
    const { result } = renderHook(() =>
      useIndexResourceState(resources, {
        resourceIDResolver: (resource) => resource.gid,
        selectedResources: ["gid://2"],
      }),
    );

    expect(result.current.selectedResources).toEqual(["gid://2"]);

    act(() => result.current.handleSelectionChange("all", true));
    expect(result.current.selectedResources).toEqual(["gid://1", "gid://2"]);
  });

  it("clears and removes selections after a bulk action", () => {
    const { result } = renderHook(() => useIndexResourceState(orders));

    act(() => result.current.handleSelectionChange("page", true));
    act(() => result.current.removeSelectedResources(["1", "3"]));
    expect(result.current.selectedResources).toEqual(["2"]);

    act(() => result.current.clearSelection());
    expect(result.current.selectedResources).toEqual([]);
  });

  it("ignores a single selection with no id", () => {
    const { result } = renderHook(() => useIndexResourceState(orders));

    act(() => result.current.handleSelectionChange("single", true));
    expect(result.current.selectedResources).toEqual([]);
  });

  it("toggles only the given page ids and keeps other pages' selections", () => {
    const { result } = renderHook(() => useIndexResourceState(orders));

    act(() => result.current.handleSelectionChange("single", true, "3"));
    act(() => result.current.handleSelectionChange("page", true, undefined, ["1", "2"]));
    expect(result.current.selectedResources).toEqual(["3", "1", "2"]);

    act(() => result.current.handleSelectionChange("page", false, undefined, ["1", "2"]));
    expect(result.current.selectedResources).toEqual(["3"]);
  });

  it("keeps 'all' selected after Select all, until something is deselected", () => {
    // Server-side pagination: the hook only ever sees the current page.
    const page = [{ id: "1" }, { id: "2" }];
    const { result } = renderHook(() => useIndexResourceState(page));

    act(() => result.current.handleSelectionChange("all", true));
    expect(result.current.allResourcesSelected).toBe(true);

    act(() => result.current.handleSelectionChange("single", false, "2"));
    expect(result.current.allResourcesSelected).toBe(false);
    expect(result.current.selectedResources).toEqual(["1"]);
  });

  it("clears every page on a deselect-all", () => {
    const { result } = renderHook(() => useIndexResourceState(orders));

    act(() => result.current.handleSelectionChange("all", true));
    act(() => result.current.handleSelectionChange("all", false));

    expect(result.current.selectedResources).toEqual([]);
    expect(result.current.allResourcesSelected).toBe(false);
  });
});
