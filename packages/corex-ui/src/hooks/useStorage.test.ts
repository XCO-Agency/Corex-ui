import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useStorage } from "./useStorage";

describe("useStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("supports object options syntax and object destructuring", () => {
    const { result } = renderHook(() =>
      useStorage({
        key: "user-theme",
        initialValue: "light",
        storage: "session",
      }),
    );

    expect(result.current.value).toBe("light");

    act(() => {
      result.current.setValue("dark");
    });

    expect(result.current.value).toBe("dark");
    expect(window.sessionStorage.getItem("user-theme")).toContain('"value":"dark"');

    act(() => {
      result.current.reset();
    });

    expect(result.current.value).toBe("light");

    act(() => {
      result.current.update("dim");
    });

    expect(result.current.value).toBe("dim");

    act(() => {
      result.current.remove();
    });

    expect(result.current.value).toBe("light");
    expect(window.sessionStorage.getItem("user-theme")).toBeNull();
  });

  it("supports traditional positional arguments and tuple destructuring", () => {
    const { result } = renderHook(() =>
      useStorage("counter-key", 0, { storage: "local" }),
    );

    const [val] = result.current;
    expect(val).toBe(0);

    act(() => {
      result.current.setValue((prev) => prev + 1);
    });

    expect(result.current.value).toBe(1);
    expect(window.localStorage.getItem("counter-key")).toContain('"value":1');
  });

  it("handles expiration time correctly", () => {
    const now = 1000000;
    vi.spyOn(Date, "now").mockReturnValue(now);

    const { result, unmount } = renderHook(() =>
      useStorage({
        key: "session-token",
        initialValue: "anon",
        storage: "local",
        expiresIn: 5000, // 5 seconds
      }),
    );

    act(() => {
      result.current.setValue("token-xyz");
    });

    expect(result.current.value).toBe("token-xyz");
    unmount();

    // 1. Check before expiration (at 3s)
    vi.spyOn(Date, "now").mockReturnValue(now + 3000);
    const { result: unexpiredHook, unmount: unmountUnexpired } = renderHook(() =>
      useStorage({
        key: "session-token",
        initialValue: "anon",
        storage: "local",
        expiresIn: 5000,
      }),
    );
    expect(unexpiredHook.current.value).toBe("token-xyz");
    unmountUnexpired();

    // 2. Check after expiration (at 6s)
    vi.spyOn(Date, "now").mockReturnValue(now + 6000);
    const { result: expiredHook } = renderHook(() =>
      useStorage({
        key: "session-token",
        initialValue: "anon",
        storage: "local",
        expiresIn: 5000,
      }),
    );
    expect(expiredHook.current.value).toBe("anon");
    expect(window.localStorage.getItem("session-token")).toBeNull();
  });
});
