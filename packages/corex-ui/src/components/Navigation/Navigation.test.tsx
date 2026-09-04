import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Navigation, Navigations } from "./Navigation";

describe("Navigation", () => {
  const sections = [
    {
      title: "REVIEW COLLECTION",
      items: [
        { id: "import", label: "Import reviews" },
        { id: "request", label: "Request reviews" },
      ],
    },
    {
      title: "REVIEW DISPLAY",
      items: [
        { id: "widgets", label: "Widgets" },
        { id: "social", label: "Social sharing" },
      ],
    },
  ];

  it("renders section titles and items", () => {
    render(<Navigation sections={sections} selectedId="social" />);
    expect(screen.getByText("REVIEW COLLECTION")).toBeInTheDocument();
    expect(screen.getByText("Import reviews")).toBeInTheDocument();
    expect(screen.getByText("Social sharing")).toBeInTheDocument();
  });

  it("triggers onSelect callback on click", () => {
    const handleSelect = vi.fn();
    render(<Navigation sections={sections} onSelect={handleSelect} />);
    fireEvent.click(screen.getByText("Social sharing"));
    expect(handleSelect).toHaveBeenCalledWith("social");
  });

  it("supports search filtering", () => {
    render(<Navigation sections={sections} searchable />);
    const searchInput = screen.getByPlaceholderText("Search (Ctrl + Shift + F)");
    fireEvent.change(searchInput, { target: { value: "social" } });
    expect(screen.getByText("Social sharing")).toBeInTheDocument();
    expect(screen.queryByText("Import reviews")).not.toBeInTheDocument();
  });

  it("exports Navigations as alias", () => {
    expect(Navigations).toBe(Navigation);
  });
});
