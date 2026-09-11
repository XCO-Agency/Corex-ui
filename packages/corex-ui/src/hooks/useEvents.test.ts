import { describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useEvents, eventBus } from "./useEvents";

describe("useEvents", () => {
  it("subscribes to events with on and triggers with emit", () => {
    const { result } = renderHook(() => useEvents());
    const handler = vi.fn();

    act(() => {
      result.current.on("cart:variant-changed", handler);
    });

    act(() => {
      result.current.emit("cart:variant-changed", { variantId: 12345 });
    });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({ variantId: 12345 });
  });

  it("removes listener using returned unsubscribe function", () => {
    const { result } = renderHook(() => useEvents());
    const handler = vi.fn();

    let unsubscribe: () => void;
    act(() => {
      unsubscribe = result.current.on("cart:item-removed", handler);
    });

    act(() => {
      result.current.emit("cart:item-removed", { key: "k1" });
    });
    expect(handler).toHaveBeenCalledTimes(1);

    act(() => {
      unsubscribe();
    });

    act(() => {
      result.current.emit("cart:item-removed", { key: "k2" });
    });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("removes listener using off with handler", () => {
    const { result } = renderHook(() => useEvents());
    const handler = vi.fn();

    act(() => {
      result.current.on("cart:refresh", handler);
    });

    act(() => {
      result.current.emit("cart:refresh", { success: true });
    });
    expect(handler).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.off("cart:refresh", handler);
    });

    act(() => {
      result.current.emit("cart:refresh", { success: true });
    });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("removes all listeners for an event when off is called without handler", () => {
    const { result } = renderHook(() => useEvents());
    const h1 = vi.fn();
    const h2 = vi.fn();

    act(() => {
      result.current.on("cart:clear", h1);
      result.current.on("cart:clear", h2);
    });

    act(() => {
      result.current.emit("cart:clear");
    });
    expect(h1).toHaveBeenCalledTimes(1);
    expect(h2).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.off("cart:clear");
    });

    act(() => {
      result.current.emit("cart:clear");
    });
    expect(h1).toHaveBeenCalledTimes(1);
    expect(h2).toHaveBeenCalledTimes(1);
  });

  it("standalone eventBus emits and listens outside React components", () => {
    const handler = vi.fn();
    const unsub = eventBus.on("external:event", handler);

    eventBus.emit("external:event", { value: 99 });
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({ value: 99 });

    unsub();
    eventBus.emit("external:event", { value: 100 });
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
