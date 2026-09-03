import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Page } from "./Page";
import { Button } from "../Button";

describe("Page", () => {
  it("maps legacy title/subtitle to heading/subheading and composes primaryAction as a Button", () => {
    render(
      <Page title="Products" subtitle="Manage your catalog" primaryAction={{ content: "Add product" }}>
        Body
      </Page>,
    );

    const el = screen.getByText("Body").closest("s-page");
    expect(el).toHaveAttribute("heading", "Products");
    expect(el).toHaveAttribute("subheading", "Manage your catalog");
    expect(screen.getByText("Add product")).toHaveAttribute("slot", "primary-action");
  });

  it("supports native s-page props: heading, subheading, inlineSize", () => {
    render(
      <Page heading="Orders" subheading="View orders" inlineSize="large">
        Content
      </Page>,
    );

    const el = screen.getByText("Content").closest("s-page");
    expect(el).toHaveAttribute("heading", "Orders");
    expect(el).toHaveAttribute("subheading", "View orders");
    expect(el).toHaveAttribute("inlinesize", "large");
  });

  it("prioritizes new props over deprecated props", () => {
    render(
      <Page
        heading="New Heading"
        title="Old Title"
        subheading="New Sub"
        subtitle="Old Sub"
        inlineSize="small"
        fullWidth
      >
        Content
      </Page>,
    );

    const el = screen.getByText("Content").closest("s-page");
    expect(el).toHaveAttribute("heading", "New Heading");
    expect(el).toHaveAttribute("subheading", "New Sub");
    expect(el).toHaveAttribute("inlinesize", "small");
  });

  it("maps legacy fullWidth and narrowWidth to inlineSize", () => {
    const { rerender } = render(
      <Page title="Full Width Page" fullWidth>
        Content
      </Page>,
    );
    let el = screen.getByText("Content").closest("s-page");
    expect(el).toHaveAttribute("inlinesize", "large");

    rerender(
      <Page title="Narrow Page" narrowWidth>
        Content
      </Page>,
    );
    el = screen.getByText("Content").closest("s-page");
    expect(el).toHaveAttribute("inlinesize", "small");
  });

  it("renders primaryAction with destructive/critical tone, disabled, and click handler", () => {
    const onAction = vi.fn();
    render(
      <Page
        heading="Settings"
        primaryAction={{
          content: "Delete Store",
          destructive: true,
          disabled: false,
          onAction,
        }}
      >
        Body
      </Page>,
    );

    const button = screen.getByText("Delete Store");
    expect(button).toHaveAttribute("slot", "primary-action");
    expect(button.closest("s-button")).toHaveAttribute("tone", "critical");

    fireEvent.click(button);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("accepts ReactNode for primaryAction and assigns slot", () => {
    render(
      <Page
        heading="Dashboard"
        primaryAction={<Button variant="primary">Custom Primary</Button>}
      >
        Body
      </Page>,
    );

    const button = screen.getByText("Custom Primary").closest("s-button");
    expect(button).toHaveAttribute("slot", "primary-action");
  });

  it("renders secondaryActions array of action descriptors or ReactNodes", () => {
    const onExport = vi.fn();
    render(
      <Page
        heading="Inventory"
        secondaryActions={[
          { content: "Export", onAction: onExport },
          <Button key="import" variant="secondary">Import</Button>,
        ]}
      >
        Body
      </Page>,
    );

    const exportBtn = screen.getByText("Export");
    expect(exportBtn).toHaveAttribute("slot", "secondary-actions");
    fireEvent.click(exportBtn);
    expect(onExport).toHaveBeenCalledTimes(1);

    const importBtn = screen.getByText("Import").closest("s-button");
    expect(importBtn).toHaveAttribute("slot", "secondary-actions");
  });

  it("renders legacy backAction as Link with slot='breadcrumb-actions'", () => {
    const onBack = vi.fn();
    render(
      <Page
        heading="Product Detail"
        backAction={{ content: "Products", url: "/products", onAction: onBack }}
      >
        Body
      </Page>,
    );

    const backLink = screen.getByText("Products").closest("s-link");
    expect(backLink).toHaveAttribute("slot", "breadcrumb-actions");
    expect(backLink).toHaveAttribute("href", "/products");

    fireEvent.click(backLink!);
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("supports native breadcrumbActions slot", () => {
    render(
      <Page
        heading="Analytics"
        breadcrumbActions={<span id="custom-crumb">Back to overview</span>}
      >
        Body
      </Page>,
    );

    const crumb = screen.getByText("Back to overview");
    expect(crumb).toHaveAttribute("slot", "breadcrumb-actions");
  });

  it("renders aside and accessory slots", () => {
    render(
      <Page
        heading="Orders"
        aside={<div id="sidebar">Sidebar content</div>}
        accessory={<span id="badge">Paid</span>}
      >
        Main body
      </Page>,
    );

    expect(screen.getByText("Sidebar content")).toHaveAttribute("slot", "aside");
    expect(screen.getByText("Paid")).toHaveAttribute("slot", "accessory");
  });

  it("falls back to titleMetadata and additionalMetadata for accessory", () => {
    const { rerender } = render(
      <Page heading="Orders" titleMetadata={<span>Fulfilled</span>}>
        Body
      </Page>,
    );
    expect(screen.getByText("Fulfilled")).toHaveAttribute("slot", "accessory");

    rerender(
      <Page heading="Orders" additionalMetadata="Archived">
        Body
      </Page>,
    );
    expect(screen.getByText("Archived")).toHaveAttribute("slot", "accessory");
  });
});
