import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DatePicker } from "./DatePicker";

describe("DatePicker", () => {
  it("sets `selected` as a live DOM property", () => {
    render(<DatePicker selected="2026-03-01" />);
    const el = document.querySelector("s-date-picker") as HTMLElement & {
      selected?: string;
    };
    expect(el.selected).toBe("2026-03-01");
  });

  it("calls onChange(date) on the native change event", () => {
    const onChange = vi.fn();
    render(<DatePicker onChange={onChange} />);

    const el = document.querySelector("s-date-picker") as HTMLElement & {
      selected?: string;
    };
    el.selected = "2026-04-10";
    el.dispatchEvent(new Event("change", { bubbles: true }));

    expect(onChange).toHaveBeenCalledWith("2026-04-10");
  });

  it("renders inline with presets and displays 'Custom range'", () => {
    render(<DatePicker inline presets={true} selected="2026-09-05" />);

    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Yesterday")).toBeInTheDocument();
    expect(screen.getByText("Custom range")).toBeInTheDocument();
  });

  it("hides presets when presets={false}", () => {
    render(<DatePicker inline presets={false} selected="2026-09-05" />);

    expect(screen.queryByText("Today")).not.toBeInTheDocument();
    expect(screen.queryByText("Custom range")).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText("Start date")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("End date")).toBeInTheDocument();
  });

  it("navigates nested presets like 'Period to date'", () => {
    render(<DatePicker inline presets={true} selected="2026-09-05" />);

    const periodToDateBtn = screen.getByText("Period to date");
    fireEvent.click(periodToDateBtn);

    expect(screen.getByText("Week to date")).toBeInTheDocument();
    expect(screen.getByText("Month to date")).toBeInTheDocument();
    expect(screen.getByText("Quarter to date")).toBeInTheDocument();
    expect(screen.getByText("Year to date")).toBeInTheDocument();
  });
});
