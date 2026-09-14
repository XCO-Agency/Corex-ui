import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("calls showOverlay()/hideOverlay() on the underlying element as `open` changes", () => {
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

  it("calls onClose when the element dispatches a hide event", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Delete item">
        Are you sure?
      </Modal>,
    );

    screen
      .getByText("Are you sure?")
      .closest("s-modal")!
      .dispatchEvent(new Event("hide"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the element dispatches an afterhide event", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Delete item">
        Are you sure?
      </Modal>,
    );

    screen
      .getByText("Are you sure?")
      .closest("s-modal")!
      .dispatchEvent(new Event("afterhide"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders primary and secondary actions as Buttons in matching slots with commands", () => {
    render(
      <Modal
        open
        id="custom-modal-id"
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

    const cancel = screen.getByText("Cancel");
    expect(cancel).toHaveAttribute("slot", "secondary-actions");
    expect(cancel).toHaveAttribute("command", "--hide");
    expect(cancel).toHaveAttribute("commandfor", "custom-modal-id");
  });

  it("cleans up and hides overlay when unmounted while open", () => {
    const { unmount } = render(
      <Modal open onClose={() => {}} title="Test">
        Content
      </Modal>,
    );

    const el = screen.getByText("Content").closest("s-modal") as HTMLElement & {
      hasAttribute: (name: string) => boolean;
    };
    expect(el.hasAttribute("data-stub-open")).toBe(true);

    unmount();
    expect(el.hasAttribute("data-stub-open")).toBe(false);
  });

  it("renders ui-modal when variant='max' or src is specified", () => {
    render(
      <Modal open variant="max" onClose={() => {}} title="Max Editor">
        Inline Workflow Editor
      </Modal>,
    );

    const el = screen.getByText("Inline Workflow Editor").closest("ui-modal");
    expect(el).not.toBeNull();
    expect(el).toHaveAttribute("variant", "max");
  });

  it("renders ui-modal with src attribute and title-bar", () => {
    render(
      <Modal
        open
        variant="max"
        src="/app/preferences/settings"
        onClose={() => {}}
        title="Preferences"
      />,
    );

    const el = document.querySelector("ui-modal");
    expect(el).not.toBeNull();
    expect(el).toHaveAttribute("src", "/app/preferences/settings");
    expect(el).toHaveAttribute("variant", "max");

    const titleBar = el!.querySelector("ui-title-bar");
    expect(titleBar).not.toBeNull();
    expect(titleBar).toHaveAttribute("title", "Preferences");
  });

  it("calls both onHide and onClose when modal is dismissed", () => {
    const onHide = vi.fn();
    const onClose = vi.fn();
    render(
      <Modal open variant="max" onHide={onHide} onClose={onClose}>
        Content
      </Modal>,
    );

    const el = screen.getByText("Content").closest("ui-modal")!;
    el.dispatchEvent(new Event("hide"));

    expect(onHide).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("mounts host SaveBar and hides it upon unmount when saveBar prop is active", () => {
    const hideSpy = vi.fn();
    (window as any).shopify = {
      saveBar: {
        hide: hideSpy,
        show: vi.fn(),
      },
    };

    const { unmount } = render(
      <Modal
        open
        id="savebar-test-modal"
        variant="max"
        saveBar
        onClose={() => {}}
      >
        Modal content
      </Modal>,
    );

    const saveBarEl = document.querySelector("ui-save-bar#savebar-test-modal-save-bar");
    expect(saveBarEl).not.toBeNull();

    unmount();
    expect(hideSpy).toHaveBeenCalledWith("savebar-test-modal-save-bar");
  });
});
