import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DatePicker } from "./DatePicker";

describe("DatePicker", () => {
  it("renders trigger button with formatted date in popover mode", () => {
    render(<DatePicker selected="2026-03-01" />);
    expect(screen.getByText("1 Mar 2026")).toBeInTheDocument();
  });

  it("renders on defaultValue if selected is not provided", () => {
    render(<DatePicker inline defaultValue="2025-05-15" />);
    expect(screen.getByText("May 2025")).toBeInTheDocument();
    expect(screen.getByText("June 2025")).toBeInTheDocument();
  });

  it("renders inline with presets and displays 'Custom range'", () => {
    render(<DatePicker inline presets={true} selected="2026-09-05" />);

    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Yesterday")).toBeInTheDocument();
    expect(screen.getByText("Custom range")).toBeInTheDocument();
    expect(screen.getByText("September 2026")).toBeInTheDocument();
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

  it("switches calendar month and year when a preset is selected", () => {
    render(<DatePicker inline presets={true} selected="2026-03-01" />);

    expect(screen.getByText("March 2026")).toBeInTheDocument();

    const bfcmBtn = screen.getByText("Black Friday Cyber Monday");
    fireEvent.click(bfcmBtn);

    // Calendar should switch view to November 2026
    expect(screen.getByText("November 2026")).toBeInTheDocument();
    expect(screen.getByText("December 2026")).toBeInTheDocument();
  });

  it("calls onApply when Apply button is clicked", () => {
    const onApply = vi.fn();
    render(<DatePicker selected="2026-06-10" onApply={onApply} />);

    const applyBtn = screen.getByText("Apply");
    fireEvent.click(applyBtn);

    expect(onApply).toHaveBeenCalledWith({
      start: "2026-06-10",
      end: "2026-06-10",
    });
  });
});
