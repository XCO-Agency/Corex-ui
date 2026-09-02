import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Page } from "./Page";

describe("Page", () => {
  it("maps title/subtitle to heading/subheading and composes primaryAction as a Button", () => {
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
});
