import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppNav } from "./AppNav";
import { Link } from "../Link";

describe("AppNav", () => {
  it("renders an s-app-nav wrapping Link children", () => {
    render(
      <AppNav>
        <Link url="/app" removeUnderline>
          Home
        </Link>
        <Link url="/app/settings">Settings</Link>
      </AppNav>,
    );

    expect(screen.getByText("Home").closest("s-app-nav")).not.toBeNull();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });
});
