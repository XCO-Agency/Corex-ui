import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { Toast } from "./Toast";

const show = vi.fn();

beforeEach(() => {
  show.mockClear();
  (window as unknown as { shopify?: unknown }).shopify = { toast: { show } };
});

afterEach(() => {
  delete (window as unknown as { shopify?: unknown }).shopify;
});

describe("Toast", () => {
  it("renders nothing and raises the platform toast", () => {
    const { container } = render(<Toast content="Saved" />);

    expect(container).toBeEmptyDOMElement();
    expect(show).toHaveBeenCalledWith("Saved", {
      isError: undefined,
      duration: undefined,
    });
  });

  it("raises nothing without content", () => {
    render(<Toast />);

    expect(show).not.toHaveBeenCalled();
  });

  it("passes the error flag and duration through", () => {
    render(<Toast content="Failed" error duration={5000} />);

    expect(show).toHaveBeenCalledWith("Failed", { isError: true, duration: 5000 });
  });

  it("calls onDismiss once the toast has been raised", () => {
    const onDismiss = vi.fn();
    render(<Toast content="Saved" onDismiss={onDismiss} />);

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("does not raise the same toast twice on re-render", () => {
    const { rerender } = render(<Toast content="Saved" />);
    rerender(<Toast content="Saved" />);

    expect(show).toHaveBeenCalledTimes(1);
  });
});
