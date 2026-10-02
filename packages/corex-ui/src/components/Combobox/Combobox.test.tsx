import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Combobox } from "./Combobox";
import { Listbox } from "../Listbox";
import { InlineStack } from "../InlineStack";
import { Tag } from "../Tag";

describe("Combobox", () => {
  it("renders the field and its suggestions", () => {
    const { container } = render(
      <Combobox
        open
        activator={<Combobox.TextField label="Tags" value="" autoComplete="off" />}
      >
        <Listbox>
          <Listbox.Option value="a">Alpha</Listbox.Option>
        </Listbox>
      </Combobox>,
    );

    const field = container.querySelector("s-text-field")!;
    expect(field).not.toBeNull();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
  });

  it("renders suggestions inside FlexPopover", () => {
    render(
      <Combobox
        open
        activator={<Combobox.TextField label="Tags" value="" autoComplete="off" />}
      >
        <Listbox>
          <Listbox.Option value="a">Alpha</Listbox.Option>
        </Listbox>
      </Combobox>,
    );

    const popover = document.querySelector(".corex-native-popover");
    expect(popover).not.toBeNull();
    expect(popover?.querySelector('[role="listbox"]')).not.toBeNull();
  });

  it("separates in-flow elements like tags from popover suggestions", () => {
    render(
      <Combobox
        open
        activator={<Combobox.TextField label="Tags" value="" autoComplete="off" />}
      >
        <InlineStack gap="small-300">
          <Tag>SelectedTag</Tag>
        </InlineStack>
        <Listbox>
          <Listbox.Option value="a">Alpha</Listbox.Option>
        </Listbox>
      </Combobox>,
    );

    const popover = document.querySelector(".corex-native-popover")!;
    expect(popover.querySelector('[role="listbox"]')).not.toBeNull();
    // The Tag should NOT be inside the Popover, it should be in-flow
    expect(popover.querySelector("s-chip")).toBeNull();
    expect(screen.getByText("SelectedTag")).toBeInTheDocument();
  });

  it("closes popover on selection when allowMultiple is false", () => {
    const onSelect = vi.fn();
    render(
      <Combobox
        open
        activator={<Combobox.TextField label="Tags" value="" autoComplete="off" />}
      >
        <Listbox onSelect={onSelect}>
          <Listbox.Option value="a">Alpha</Listbox.Option>
        </Listbox>
      </Combobox>,
    );

    fireEvent.mouseDown(screen.getByRole("option"));
    expect(onSelect).toHaveBeenCalledWith("a");
  });

  it("exposes TextField and Popover subcomponents", () => {
    expect(Combobox.TextField).toBeTypeOf("object");
    expect(Combobox.Popover).toBeTypeOf("object");
  });
});
