import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("calls show()/hideOverlay() on the underlying element as `open` changes", () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Modal open={false} onClose={onClose} title="Delete item">
        Are you sure?
      </Modal>,
    );

    const el = screen.getByText("Are you sure?").closest("s-modal") as HTMLElement & {
      hasAttribute: (name: string) => boolean;
    };
    expect(el.hasAttribute("data-stub-open")).toBe(false);

    rerender(
      <Modal open onClose={onClose} title="Delete item">
        Are you sure?
      </Modal>,
    );
    expect(el.hasAttribute("data-stub-open")).toBe(true);
  });

  it("calls onClose when the element dispatches a close event", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Delete item">
        Are you sure?
      </Modal>,
    );

    screen.getByText("Are you sure?").closest("s-modal")!.dispatchEvent(new Event("close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders primary and secondary actions as Buttons in the matching slots", () => {
    render(
      <Modal
        open
        onClose={() => {}}
        primaryAction={{ content: "Delete", destructive: true, onAction: () => {} }}
        secondaryActions={[{ content: "Cancel", onAction: () => {} }]}
      >
        Body
      </Modal>,
    );

    const primary = screen.getByText("Delete");
    expect(primary).toHaveAttribute("slot", "primary-action");
    expect(primary).toHaveAttribute("variant", "primary");
    expect(primary).toHaveAttribute("tone", "critical");
    expect(screen.getByText("Cancel")).toHaveAttribute("slot", "secondary-actions");
  });
});
