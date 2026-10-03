import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DatePickerPresets } from "./DatePickerPresets";

describe("DatePickerPresets", () => {
  it("opens a nested submenu in place of the top-level list", () => {
    const onSelectPreset = vi.fn();
    render(<DatePickerPresets presets onSelectPreset={onSelectPreset} />);

    expect(screen.queryByText("Last 7 days")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Last"));

    expect(screen.getByText("Last 7 days")).toBeInTheDocument();
    expect(screen.queryByText("Today")).not.toBeInTheDocument();
    expect(onSelectPreset).not.toHaveBeenCalled();
  });

  it("selects a nested preset", () => {
    const onSelectPreset = vi.fn();
    render(<DatePickerPresets presets onSelectPreset={onSelectPreset} />);

    fireEvent.click(screen.getByText("Period to date"));
    fireEvent.click(screen.getByText("Month to date"));

    expect(onSelectPreset).toHaveBeenCalledWith(
      expect.objectContaining({ id: "month_to_date" }),
    );
  });

  it("returns to the top-level list from the submenu", () => {
    render(<DatePickerPresets presets onSelectPreset={vi.fn()} />);

    fireEvent.click(screen.getByText("Last"));
    // The back row shows the submenu title
    fireEvent.click(screen.getByText("Last"));

    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.queryByText("Last 7 days")).not.toBeInTheDocument();
  });
});
