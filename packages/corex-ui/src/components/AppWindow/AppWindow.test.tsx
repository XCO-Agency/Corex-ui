import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { createRef } from "react";
import { AppWindow } from "./AppWindow";

describe("AppWindow", () => {
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
});
