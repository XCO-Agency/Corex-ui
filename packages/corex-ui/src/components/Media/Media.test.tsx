import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Media, useMedia } from "./Media";

function ViewLabel() {
  const { view } = useMedia();
  return <span data-testid="view">{view}</span>;
}

function DetailLabel() {
  const { detailValue } = useMedia();
  return <span data-testid="detail">{detailValue ?? "none"}</span>;
}

function SelectionCount() {
  const { selectedCount } = useMedia();
  return <span data-testid="count">{selectedCount}</span>;
}

describe("Media", () => {
  it("selects items through Selectable.Group (single)", () => {
    const onChange = vi.fn();
    render(
      <Media value={[]} onChange={onChange} accessibilityLabel="Files">
        <Media.Content>
          <Media.Item value="a" accessibilityLabel="Alpha">
            <Media.Preview src="/a.jpg" alt="Alpha" />
            <Media.Meta name="alpha" type="JPG" />
          </Media.Item>
          <Media.Item value="b" accessibilityLabel="Beta">
            <Media.Preview src="/b.jpg" alt="Beta" />
            <Media.Meta name="beta" type="PNG" />
          </Media.Item>
        </Media.Content>
      </Media>,
    );

    fireEvent.click(screen.getByRole("radio", { name: "Alpha" }));
    expect(onChange).toHaveBeenLastCalledWith(["a"]);
  });

  it("supports multiple selection with checkboxes", () => {
    const onChange = vi.fn();
    render(
      <Media multiple value={["a"]} onChange={onChange} accessibilityLabel="Files">
        <SelectionCount />
        <Media.Content>
          <Media.Item value="a" accessibilityLabel="Alpha">
            <Media.Meta name="alpha" />
          </Media.Item>
          <Media.Item value="b" accessibilityLabel="Beta">
            <Media.Meta name="beta" />
          </Media.Item>
        </Media.Content>
      </Media>,
    );

    expect(screen.getByTestId("count")).toHaveTextContent("1");
    expect(screen.getByRole("checkbox", { name: "Alpha" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "Beta" }));
    expect(onChange).toHaveBeenLastCalledWith(["a", "b"]);
  });

  it("toggles view with Media.ViewToggle", () => {
    const onViewChange = vi.fn();
    render(
      <Media defaultView="grid" onViewChange={onViewChange}>
        <Media.Toolbar>
          <Media.ViewToggle />
        </Media.Toolbar>
        <ViewLabel />
        <Media.Content>
          <Media.Item value="a" accessibilityLabel="Alpha">
            <Media.Meta name="alpha" />
          </Media.Item>
        </Media.Content>
      </Media>,
    );

    expect(screen.getByTestId("view")).toHaveTextContent("grid");
    fireEvent.click(screen.getByRole("button", { name: "List view" }));
    expect(onViewChange).toHaveBeenLastCalledWith("list");
    expect(screen.getByTestId("view")).toHaveTextContent("list");
  });

  it("opens detail from preview trigger without changing selection", () => {
    const onChange = vi.fn();
    const onDetailChange = vi.fn();
    render(
      <Media value={[]} onChange={onChange} onDetailChange={onDetailChange}>
        <DetailLabel />
        <Media.Body>
          <Media.Content>
            <Media.Item value="a" accessibilityLabel="Alpha">
              <Media.Preview src="/a.jpg" alt="Alpha">
                <Media.Actions animation={false}>
                  <Media.Trigger variant="preview" accessibilityLabel="Preview Alpha" />
                </Media.Actions>
              </Media.Preview>
            </Media.Item>
          </Media.Content>
          <Media.Detail heading="Preview">
            <span>detail panel</span>
          </Media.Detail>
        </Media.Body>
      </Media>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Preview Alpha" }));
    expect(onDetailChange).toHaveBeenLastCalledWith("a");
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByTestId("detail")).toHaveTextContent("a");
  });

  it("opens detail on double-click activate", () => {
    const onDetailChange = vi.fn();
    const onActivate = vi.fn();
    render(
      <Media onDetailChange={onDetailChange}>
        <Media.Content>
          <Media.Item
            value="a"
            accessibilityLabel="Alpha"
            onActivate={onActivate}
          >
            <Media.Meta name="alpha" />
          </Media.Item>
        </Media.Content>
      </Media>,
    );

    fireEvent.doubleClick(
      document.querySelector('[data-slot="media-item"]') as HTMLElement,
    );
    expect(onActivate).toHaveBeenCalledWith("a");
    expect(onDetailChange).toHaveBeenCalledWith("a");
  });

  it("closes detail from the built-in close control", () => {
    const onDetailChange = vi.fn();
    render(
      <Media detailValue="a" onDetailChange={onDetailChange}>
        <Media.Detail heading="Preview">
          <span>body</span>
        </Media.Detail>
      </Media>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Close preview" }));
    expect(onDetailChange).toHaveBeenLastCalledWith(null);
  });

  it("clears selection via context", () => {
    const onChange = vi.fn();
    function Clear() {
      const { clearSelection } = useMedia();
      return (
        <button type="button" onClick={clearSelection}>
          clear
        </button>
      );
    }

    render(
      <Media multiple value={["a", "b"]} onChange={onChange}>
        <Clear />
        <Media.Content>
          <Media.Item value="a" accessibilityLabel="Alpha">
            <Media.Meta name="alpha" />
          </Media.Item>
        </Media.Content>
      </Media>,
    );

    fireEvent.click(screen.getByRole("button", { name: "clear" }));
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it("renders toolbar, filters, upload, and empty slots", () => {
    render(
      <Media>
        <Media.Toolbar>
          <span>toolbar</span>
          <Media.Filters>
            <span>filters</span>
          </Media.Filters>
        </Media.Toolbar>
        <Media.Upload>
          <span>upload</span>
        </Media.Upload>
        <Media.Empty>
          <span>empty</span>
        </Media.Empty>
      </Media>,
    );

    expect(document.querySelector('[data-slot="media-toolbar"]')).toHaveTextContent(
      "toolbar",
    );
    expect(document.querySelector('[data-slot="media-filters"]')).toHaveTextContent(
      "filters",
    );
    expect(document.querySelector('[data-slot="media-upload"]')).toHaveAttribute(
      "data-variant",
      "dashed",
    );
    expect(document.querySelector('[data-slot="media-empty"]')).toHaveTextContent("empty");
  });

  it("injects the stylesheet once", () => {
    render(
      <>
        <Media>
          <Media.Content />
        </Media>
        <Media>
          <Media.Content />
        </Media>
      </>,
    );
    expect(document.querySelectorAll("#cx-media-styles")).toHaveLength(1);
  });
});
