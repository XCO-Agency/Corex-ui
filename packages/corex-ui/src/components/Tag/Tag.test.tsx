import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { Tag } from "./Tag";

describe("Tag", () => {
  it("renders a chip that is not removable without a handler", () => {
    const { container } = render(<Tag>Draft</Tag>);
    const chip = container.querySelector("s-chip")!;

    expect(chip).toHaveTextContent("Draft");
    expect(chip).not.toHaveAttribute("removable");
  });

  it("becomes removable once a handler is passed", () => {
    const { container } = render(<Tag onRemove={() => {}}>Draft</Tag>);

    expect(container.querySelector("s-chip")).toHaveAttribute("removable", "true");
  });

  it("calls onRemove when the element fires remove", () => {
    const onRemove = vi.fn();
    const { container } = render(<Tag onRemove={onRemove}>Draft</Tag>);

    container
      .querySelector("s-chip")!
      .dispatchEvent(new Event("remove", { bubbles: true }));

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("stays fixed when disabled", () => {
    const { container } = render(
      <Tag onRemove={() => {}} disabled>
        Draft
      </Tag>,
    );

    expect(container.querySelector("s-chip")).toHaveAttribute("removable", "false");
  });
});
