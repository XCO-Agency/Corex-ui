import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { EmptyState } from "./index";

describe("EmptyState", () => {
  it("renders heading and description children", () => {
    render(
      <EmptyState heading="Manage your inventory">
        <p>Track and receive your incoming inventory from suppliers.</p>
      </EmptyState>,
    );

    expect(screen.getByText("Manage your inventory")).toBeInTheDocument();
    expect(
      screen.getByText("Track and receive your incoming inventory from suppliers."),
    ).toBeInTheDocument();
  });

  it("supports legacy title prop as alias for heading", () => {
    render(
      <EmptyState title="No discounts yet">
        <p>Create a discount code to encourage customers to purchase.</p>
      </EmptyState>,
    );

    expect(screen.getByText("No discounts yet")).toBeInTheDocument();
  });

  it("renders an image with alt text", () => {
    render(
      <EmptyState
        heading="Empty cart"
        image="https://cdn.shopify.com/empty-cart.png"
        imageAlt="Empty shopping cart illustration"
      />,
    );

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://cdn.shopify.com/empty-cart.png");
    expect(img).toHaveAttribute("alt", "Empty shopping cart illustration");
  });

  it("triggers action and secondaryAction callbacks", () => {
    const onAction = vi.fn();
    const onSecondary = vi.fn();

    render(
      <EmptyState
        heading="Add your first product"
        action={{ content: "Add product", onAction }}
        secondaryAction={{ content: "Import products", onAction: onSecondary }}
      >
        <p>You can add products manually or import from a CSV file.</p>
      </EmptyState>,
    );

    const primaryBtn = screen.getByText("Add product");
    const secondaryBtn = screen.getByText("Import products");

    fireEvent.click(primaryBtn);
    expect(onAction).toHaveBeenCalledTimes(1);

    fireEvent.click(secondaryBtn);
    expect(onSecondary).toHaveBeenCalledTimes(1);
  });

  it("renders icon when icon prop is provided without an image", () => {
    const { container } = render(
      <EmptyState heading="No search results" icon="search">
        <p>Try searching for something else.</p>
      </EmptyState>,
    );

    const iconEl = container.querySelector("s-icon");
    expect(iconEl).toBeInTheDocument();
  });

  it("renders footer content", () => {
    render(
      <EmptyState
        heading="Manage webhooks"
        footerContent={<a href="/help">Learn more about webhooks</a>}
      />,
    );

    expect(screen.getByText("Learn more about webhooks")).toBeInTheDocument();
  });

  it("supports custom React nodes for actions", () => {
    render(
      <EmptyState
        heading="Custom actions"
        action={<button type="button">Custom Button</button>}
      />,
    );

    expect(screen.getByText("Custom Button")).toBeInTheDocument();
  });
});
