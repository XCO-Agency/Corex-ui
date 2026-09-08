import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SaveBar } from "./SaveBar";

describe("SaveBar", () => {
  afterEach(() => {
    delete (window as { shopify?: unknown }).shopify;
  });

  it("renders a ui-save-bar with the given id and raw button children", () => {
    render(
      <SaveBar id="modal-save-bar">
        <button type="button">Save</button>
        <button type="button">Discard</button>
      </SaveBar>,
    );

    const el = document.querySelector("ui-save-bar#modal-save-bar");
    expect(el).not.toBeNull();
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Discard")).toBeInTheDocument();
  });

  it("renders default buttons when onSave and onDiscard are provided without children", () => {
    const onSave = vi.fn();
    const onDiscard = vi.fn();

    render(
      <SaveBar
        id="auto-save-bar"
        onSave={onSave}
        onDiscard={onDiscard}
        saveText="Save Cart"
        discardText="Revert"
      />,
    );

    const saveBtn = screen.getByText("Save Cart");
    const discardBtn = screen.getByText("Revert");

    expect(saveBtn).toBeInTheDocument();
    expect(discardBtn).toBeInTheDocument();

    fireEvent.click(saveBtn);
    expect(onSave).toHaveBeenCalled();

    fireEvent.click(discardBtn);
    expect(onDiscard).toHaveBeenCalled();
  });

  it("calls window.shopify.saveBar.show and hide declaratively based on open prop", () => {
    const show = vi.fn();
    const hide = vi.fn();
    window.shopify = { toast: { show: vi.fn() }, saveBar: { show, hide } } as any;

    const { rerender, unmount } = render(
      <SaveBar id="reactive-save-bar" open={false}>
        <button type="button">Save</button>
      </SaveBar>,
    );

    expect(hide).toHaveBeenCalledWith("reactive-save-bar");

    rerender(
      <SaveBar id="reactive-save-bar" open={true}>
        <button type="button">Save</button>
      </SaveBar>,
    );

    expect(show).toHaveBeenCalledWith("reactive-save-bar");

    unmount();
    expect(hide).toHaveBeenCalledWith("reactive-save-bar");
  });

  it("uses default id 'corex-ui-save-bar' when id is omitted", () => {
    const show = vi.fn();
    const hide = vi.fn();
    window.shopify = { toast: { show: vi.fn() }, saveBar: { show, hide } } as any;

    render(
      <SaveBar open={true}>
        <button type="button">Save</button>
      </SaveBar>,
    );

    const el = document.querySelector("ui-save-bar#corex-ui-save-bar");
    expect(el).not.toBeNull();
    expect(show).toHaveBeenCalledWith("corex-ui-save-bar");
  });


  it("formats discardconfirmation attribute correctly as empty flag without hyphen", () => {
    render(
      <SaveBar id="confirm-save-bar" discardConfirmation={true}>
        <button type="button">Save</button>
      </SaveBar>,
    );

    const el = document.querySelector("ui-save-bar#confirm-save-bar")!;
    expect(el).not.toBeNull();
    expect(el.getAttribute("discardconfirmation")).toBe("");
    expect(el.getAttribute("discard-confirmation")).toBeNull();
  });

  it("omits discardconfirmation attribute when discardConfirmation is false", () => {
    render(
      <SaveBar id="no-confirm-save-bar" discardConfirmation={false}>
        <button type="button">Save</button>
      </SaveBar>,
    );

    const el = document.querySelector("ui-save-bar#no-confirm-save-bar")!;
    expect(el).not.toBeNull();
    expect(el.getAttribute("discardconfirmation")).toBeNull();
    expect(el.getAttribute("discard-confirmation")).toBeNull();
  });
});
