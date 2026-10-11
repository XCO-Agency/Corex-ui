import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DatePicker } from "./DatePicker";
import { renderToString } from "react-dom/server";
import { renderAndHydrate } from "../../test-utils/ssr";

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

  it("integrates native s-date-picker with type='range', visibleMonths='2', view='2025-05', value='2025-05-20--2025-06-10'", () => {
    render(
      <DatePicker
        type="range"
        name="reporting-period"
        visibleMonths="2"
        view="2025-05"
        value="2025-05-20--2025-06-10"
      />,
    );

    const picker = document.querySelector("s-date-picker");
    expect(picker).toBeInTheDocument();
    expect(picker).toHaveAttribute("type", "range");
    expect(picker).toHaveAttribute("name", "reporting-period");
    expect(picker).toHaveAttribute("visiblemonths", "2");
    expect(picker).toHaveAttribute("view", "2025-05");
    expect(picker).toHaveAttribute("value", "2025-05-20--2025-06-10");
    expect(screen.getByText("May 2025")).toBeInTheDocument();
    expect(screen.getByText("June 2025")).toBeInTheDocument();
  });

  it("handles range string with normalizeDateRange in popover mode", () => {
    render(<DatePicker selected="2025-05-20--2025-06-10" />);

    expect(screen.getByText("20 May–10 Jun 2025")).toBeInTheDocument();
  });

  describe("server rendering across timezones", () => {
    const originalTZ = process.env.TZ;

    // 23:30 UTC on 11 Oct is already 12 Oct in Tokyo.
    const NOW = new Date("2026-10-11T23:30:00Z");

    function setup() {
      vi.useFakeTimers({ toFake: ["Date"] });
      vi.setSystemTime(NOW);
      process.env.TZ = "UTC";
    }

    afterEach(() => {
      vi.useRealTimers();
      process.env.TZ = originalTZ;
    });

    it("hydrates without a mismatch when the browser is in another timezone", () => {
      setup();
      const { container, messages, unmount } = renderAndHydrate(<DatePicker />, {
        beforeHydrate: () => {
          process.env.TZ = "Asia/Tokyo";
        },
      });

      expect(messages).toEqual([]);
      // After hydration the label resolves against the browser's own today.
      expect(container.querySelector("s-button")).toHaveTextContent("12 Oct 2026");

      unmount();
    });

    it("renders the same today on server and client from `referenceDate`", () => {
      setup();
      const { container, messages, unmount } = renderAndHydrate(
        <DatePicker referenceDate="2026-10-11" />,
        {
          beforeHydrate: () => {
            process.env.TZ = "Asia/Tokyo";
          },
        },
      );

      expect(messages).toEqual([]);
      expect(container.querySelector("s-button")).toHaveTextContent("11 Oct 2026");
      expect(container.querySelector("s-date-picker")).toHaveAttribute(
        "allow",
        "--2026-10-11",
      );

      unmount();
    });

    it("leaves the popover panel out of the server HTML and mounts it after hydration", () => {
      setup();
      const html = renderToString(<DatePicker selected="2026-03-01" />);
      expect(html).toContain("<s-popover");
      expect(html).not.toContain("<s-date-picker");
      expect(html).toContain("1 Mar 2026");

      const { container, messages, unmount } = renderAndHydrate(
        <DatePicker selected="2026-03-01" />,
        { beforeHydrate: () => (process.env.TZ = "Asia/Tokyo") },
      );

      expect(messages).toEqual([]);
      expect(container.querySelector("s-popover s-date-picker")).not.toBeNull();
      expect(container.querySelector("s-button")).toHaveTextContent("1 Mar 2026");

      unmount();
    });

    it("hydrates an inline picker without a mismatch in another timezone", () => {
      setup();
      const { container, messages, unmount } = renderAndHydrate(<DatePicker inline />, {
        beforeHydrate: () => {
          process.env.TZ = "Asia/Tokyo";
        },
      });

      expect(messages).toEqual([]);
      expect(container.querySelector("s-date-picker")).toHaveAttribute(
        "allow",
        "--2026-10-12",
      );

      unmount();
    });
  });

  describe("manual inputs accessibility", () => {
    it("labels the date and time fields and the time toggle", () => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
      render(<DatePicker inline selected="2026-03-01" />);

      const clock = Array.from(document.querySelectorAll("s-button")).find(
        (el) => el.getAttribute("icon") === "clock",
      );
      expect(clock).toHaveAttribute("accessibilitylabel", "Toggle time");
      fireEvent.click(clock!);

      const labels = Array.from(document.querySelectorAll("s-text-field")).map((el) =>
        el.getAttribute("label"),
      );
      expect(labels).toEqual(["Start date", "End date", "Start time", "End time"]);
      expect(
        warn.mock.calls.filter((call) => String(call[0]).includes("accessibilityLabel")),
      ).toEqual([]);
      warn.mockRestore();
    });
  });
});
