import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { List } from "./List";

describe("List", () => {
  it("renders an unordered list by default", () => {
    const { container } = render(
      <List>
        <List.Item>One</List.Item>
        <List.Item>Two</List.Item>
      </List>,
    );

    expect(container.querySelector("s-unordered-list")).not.toBeNull();
    expect(container.querySelectorAll("s-list-item")).toHaveLength(2);
  });

  it("renders an ordered list for type='number'", () => {
    const { container } = render(
      <List type="number">
        <List.Item>One</List.Item>
      </List>,
    );

    expect(container.querySelector("s-ordered-list")).not.toBeNull();
    expect(container.querySelector("s-unordered-list")).toBeNull();
  });
});
