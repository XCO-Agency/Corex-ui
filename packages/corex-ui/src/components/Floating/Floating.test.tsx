import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createRef } from "react";
import { Floating } from "./Floating";

describe("Floating", () => {
  it("renders children at default bottom-right position with default offset", () => {
    render(
      <Floating>
        <button type="button">Floating Action</button>
      </Floating>,
    );

    const button = screen.getByRole("button", { name: "Floating Action" });
    expect(button).toBeInTheDocument();

    const root = screen.getByLabelText("Floating action container");
    expect(root).toBeInTheDocument();
    expect(root.style.position).toBe("fixed");
    expect(root.style.bottom).toBe("20px");
    expect(root.style.right).toBe("20px");
    expect(root.style.pointerEvents).toBe("none");
    expect(root.style.background).toBe("transparent");
  });

  it("supports custom position and custom edge offsets", () => {
    render(
      <Floating
        position="top-left"
        strategy="absolute"
        offset={{ top: 32, left: "2rem" }}
      >
        <span>Pinned Content</span>
      </Floating>,
    );

    const root = screen.getByLabelText("Floating action container");
    expect(root.style.position).toBe("absolute");
    expect(root.style.top).toBe("32px");
    expect(root.style.left).toBe("2rem");
  });

  it("supports centering positions with transforms", () => {
    const { rerender } = render(
      <Floating position="bottom-center" offset={16}>
        <span>Bottom Center</span>
      </Floating>,
    );

    const root = screen.getByLabelText("Floating action container");
    expect(root.style.bottom).toBe("16px");
    expect(root.style.left).toBe("50%");
    expect(root.style.transform).toBe("translateX(-50%)");

    rerender(
      <Floating position="center">
        <span>Center Modal</span>
      </Floating>,
    );
    expect(root.style.transform).toBe("translate(-50%, -50%)");
  });

  it("handles collapsible mode with uncontrolled defaultCollapsed and expand trigger", () => {
    render(
      <Floating
        collapsible
        defaultCollapsed
        collapsedContent={<span data-testid="collapsed-fab">Open Menu</span>}
      >
        <div data-testid="expanded-panel">Full Widget Content</div>
      </Floating>,
    );

    expect(screen.queryByTestId("expanded-panel")).not.toBeInTheDocument();
    const fab = screen.getByTestId("collapsed-fab");
    expect(fab).toBeInTheDocument();

    // Click collapsed fab to expand
    fireEvent.click(fab);

    expect(screen.getByTestId("expanded-panel")).toBeInTheDocument();
    expect(screen.queryByTestId("collapsed-fab")).not.toBeInTheDocument();
  });

  it("supports controlled collapsed state and onToggleCollapse callbacks", () => {
    const handleToggle = vi.fn();
    const { rerender } = render(
      <Floating
        collapsible
        collapsed={true}
        onToggleCollapse={handleToggle}
        collapsedContent={<span>Trigger</span>}
      >
        <div>Expanded Content</div>
      </Floating>,
    );

    expect(screen.queryByText("Expanded Content")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Trigger"));
    expect(handleToggle).toHaveBeenCalledWith(false);

    // Update controlled prop
    rerender(
      <Floating
        collapsible
        collapsed={false}
        onToggleCollapse={handleToggle}
        collapsedContent={<span>Trigger</span>}
      >
        <div>Expanded Content</div>
      </Floating>,
    );

    expect(screen.getByText("Expanded Content")).toBeInTheDocument();
  });

  it("supports render function for children with collapse controls", () => {
    render(
      <Floating collapsible defaultCollapsed={false}>
        {({ collapse, collapsed }) => (
          <div>
            <span>State: {collapsed ? "collapsed" : "expanded"}</span>
            <button type="button" onClick={collapse}>
              Minimize
            </button>
          </div>
        )}
      </Floating>,
    );

    expect(screen.getByText("State: expanded")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Minimize" }));
    expect(screen.queryByText("State: expanded")).not.toBeInTheDocument();
  });

  it("forwards ref correctly to the root div element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Floating ref={ref} id="custom-floating">
        <span>Content</span>
      </Floating>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.id).toBe("custom-floating");
  });
});
