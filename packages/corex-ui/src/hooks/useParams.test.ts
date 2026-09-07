import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useParams } from "./useParams";

describe("useParams", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/?shop=test-shop.myshopify.com&host=dGVzdC1zaG9w&locale=en");
  });

  it("reads standard shopify embed parameters", () => {
    const { result } = renderHook(() => useParams());

    expect(result.current.shop).toBe("test-shop.myshopify.com");
    expect(result.current.host).toBe("dGVzdC1zaG9w");
    expect(result.current.locale).toBe("en");
    expect(result.current.get("shop")).toBe("test-shop.myshopify.com");
    expect(result.current.get("unknown", "default")).toBe("default");
  });

  it("updates and deletes search params reactively", () => {
    const { result } = renderHook(() => useParams());

    act(() => {
      result.current.setParam("tab", "analytics");
    });

    expect(result.current.get("tab")).toBe("analytics");
    expect(window.location.search).toContain("tab=analytics");

    act(() => {
      result.current.setParams({ tab: null, view: "grid" });
    });

    expect(result.current.get("tab")).toBeUndefined();
    expect(result.current.get("view")).toBe("grid");
  });
});
