import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { FlexPopover } from "./FlexPopover";
import { Text } from "../Text";

describe("FlexPopover", () => {
  it("renders default heading 'Filters' and default close button accessibility label", () => {
    const onClose = vi.fn();
    render(
      <FlexPopover isOpen onClose={onClose}>
        <Text>Content</Text>
      </FlexPopover>,
    );

    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();

    const closeBtn = document.querySelector(
      '[accessibility-label="Close filters popup"]',
    );
    expect(closeBtn).toBeInTheDocument();

    fireEvent.click(closeBtn!);
    expect(onClose).toHaveBeenCalled();
  });

  it("renders custom string heading and derives close button accessibility label", () => {
    const onClose = vi.fn();
    render(
      <FlexPopover isOpen onClose={onClose} heading="Categories">
        <Text>Content</Text>
      </FlexPopover>,
    );

    expect(screen.getByText("Categories")).toBeInTheDocument();
    const closeBtn = document.querySelector('[accessibility-label="Close popup"]');
    expect(closeBtn).toBeInTheDocument();
  });

  it("renders custom ReactNode heading and supports custom closeAccessibilityLabel", () => {
    const onClose = vi.fn();
    render(
      <FlexPopover
        isOpen
        onClose={onClose}
        heading={<span>Custom Node Header</span>}
        closeAccessibilityLabel="Dismiss modal"
      >
        <Text>Content</Text>
      </FlexPopover>,
    );

    expect(screen.getByText("Custom Node Header")).toBeInTheDocument();
    const closeBtn = document.querySelector('[accessibility-label="Dismiss modal"]');
    expect(closeBtn).toBeInTheDocument();
  });

  it("omits the header when noHeader is true", () => {
    render(
      <FlexPopover isOpen onClose={vi.fn()} noHeader heading="Ignored Header">
        <Text>Content Only</Text>
      </FlexPopover>,
    );

    expect(screen.queryByText("Ignored Header")).toBeNull();
    expect(screen.getByText("Content Only")).toBeInTheDocument();
  });
});
