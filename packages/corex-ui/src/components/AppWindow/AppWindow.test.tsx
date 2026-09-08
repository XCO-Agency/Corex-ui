import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { createRef } from "react";
import { AppWindow } from "./AppWindow";

describe("AppWindow", () => {
  afterEach(() => {
    delete (window as { shopify?: unknown }).shopify;
  });

  it("renders an s-app-window with a src attribute", () => {
    render(<AppWindow src="/app-window-content.html" id="app-window" />);
    const el = document.querySelector("s-app-window#app-window");
    expect(el).toHaveAttribute("src", "/app-window-content.html");
  });

  it("forwards a ref exposing show()/hide()", () => {
    const ref = createRef<HTMLElementTagNameMap["s-app-window"]>();
    render(<AppWindow ref={ref} src="/app-window-content.html" />);
    expect(typeof ref.current?.show).toBe("function");
    expect(typeof ref.current?.hide).toBe("function");
  });

  it("does not render SaveBar when saveBar prop is omitted", () => {
    render(<AppWindow src="/builder" id="test-window" />);
    expect(document.querySelector("ui-save-bar")).toBeNull();
  });

  it("renders SaveBar with matching ID when saveBar prop is true", () => {
    render(<AppWindow src="/builder" id="test-window" saveBar />);
    const saveBarEl = document.querySelector("ui-save-bar#test-window-save-bar");
    expect(saveBarEl).not.toBeNull();
  });

  it("syncs open, loading, disabled state from child iframe message", async () => {
    render(<AppWindow src="/builder" id="builder-window" saveBar />);

    // Child iframe sends sync message
    await act(async () => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: {
            type: "COREX_APP_WINDOW_SAVE_BAR_SYNC",
            windowId: "builder-window",
            open: true,
            loading: false,
            disabled: false,
            saveText: "Commit Changes",
            discardText: "Reset",
          },
        }),
      );
    });

    expect(screen.getByText("Commit Changes")).toBeInTheDocument();
    expect(screen.getByText("Reset")).toBeInTheDocument();
  });

  it("forwards Save and Discard actions to child iframe via postMessage", async () => {
    const onSave = vi.fn();
    const onDiscard = vi.fn();
    const messageListener = vi.fn();
    window.addEventListener("message", messageListener);

    render(
      <AppWindow
        src="/builder"
        id="builder-win"
        saveBar={{
          onSave,
          onDiscard,
          saveText: "Save",
          discardText: "Discard",
        }}
      />,
    );

    const saveBtn = screen.getByText("Save");
    const discardBtn = screen.getByText("Discard");

    fireEvent.click(saveBtn);
    expect(onSave).toHaveBeenCalledTimes(1);

    fireEvent.click(discardBtn);
    expect(onDiscard).toHaveBeenCalledTimes(1);

    // Verify messages dispatched asynchronously in jsdom
    await vi.waitFor(() => {
      const actionMessages = messageListener.mock.calls
        .map((c) => c[0].data)
        .filter((d) => d?.type === "COREX_APP_WINDOW_SAVE_BAR_ACTION");

      expect(actionMessages).toEqual([
        { type: "COREX_APP_WINDOW_SAVE_BAR_ACTION", action: "save", windowId: "builder-win" },
        { type: "COREX_APP_WINDOW_SAVE_BAR_ACTION", action: "discard", windowId: "builder-win" },
      ]);
    });

    window.removeEventListener("message", messageListener);
  });
});
