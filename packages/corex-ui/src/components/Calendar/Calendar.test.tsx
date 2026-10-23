import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { Calendar } from "./Calendar";
import type { CalendarEventType } from "./Calendar.types";

const OCT = new Date(2026, 9, 21);

const events: CalendarEventType[] = [
  { id: "conf", title: "Conference", start: "2026-10-19", end: "2026-10-22", allDay: true },
  { id: "lunch", title: "Lunch", start: "2026-10-21T12:00:00", end: "2026-10-21T13:00:00" },
  { id: "sync", title: "Sync", start: "2026-10-21T12:30:00", end: "2026-10-21T13:30:00" },
];

function grid() {
  return screen.getByRole("grid");
}

function title() {
  return document.querySelector('[data-slot="calendar-sr"]')?.textContent;
}

function action(name: string) {
  return document.querySelector<HTMLElement>(`[data-calendar-action="${name}"]`)!;
}

function calendarView() {
  return document.querySelector('[data-slot="calendar"]')?.getAttribute("data-view");
}

function cell(key: string) {
  return document.querySelector<HTMLElement>(`[role="gridcell"][data-cx-date="${key}"]`)!;
}

describe("Calendar", () => {
  it("renders a month grid with weekday headers and injects styles", () => {
    render(<Calendar events={events} defaultDate={OCT} />);
    expect(document.getElementById("cx-calendar-styles")).toBeTruthy();
    expect(title()).toBe("October 2026");
    expect(within(grid()).getAllByRole("columnheader")).toHaveLength(7);
    expect(within(grid()).getAllByRole("gridcell")).toHaveLength(42);
    expect(cell("2026-09-27")).toHaveAttribute("data-outside");
    expect(screen.getByText("Conference")).toBeInTheDocument();
  });

  it("navigates with prev, next and today", () => {
    const onDatesChange = vi.fn();
    render(<Calendar events={[]} defaultDate={OCT} onDatesChange={onDatesChange} />);
    fireEvent.click(action("next"));
    expect(title()).toBe("November 2026");
    fireEvent.click(action("prev"));
    fireEvent.click(action("prev"));
    expect(title()).toBe("September 2026");
    expect(onDatesChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ view: "month", start: new Date(2026, 7, 30) }),
    );
  });

  it("switches views and reports the change", () => {
    const onViewChange = vi.fn();
    render(<Calendar events={events} defaultDate={OCT} onViewChange={onViewChange} />);
    fireEvent.click(action("view-week"));
    expect(onViewChange).toHaveBeenCalledWith("week");
    expect(calendarView()).toBe("week");
    expect(action("view-week")).toHaveAttribute("variant", "primary");
    expect(document.querySelector('[data-slot="calendar-timegrid"]')).toBeTruthy();
    // Overlapping timed events share the column width.
    const lunch = screen.getByRole("button", { name: /^Lunch/ });
    const sync = screen.getByRole("button", { name: /^Sync/ });
    expect(lunch.style.width).toBe(sync.style.width);
    expect(lunch.style.width).toContain("50%");

    fireEvent.click(action("view-list"));
    expect(screen.getAllByText("Conference").length).toBeGreaterThan(0);
  });

  it("fires date and event clicks", () => {
    const onDateClick = vi.fn();
    const onEventClick = vi.fn();
    render(
      <Calendar events={events} defaultDate={OCT} onDateClick={onDateClick} onEventClick={onEventClick} />,
    );
    fireEvent.click(cell("2026-10-08"));
    expect(onDateClick).toHaveBeenCalledWith({ date: new Date(2026, 9, 8), allDay: true });

    fireEvent.click(screen.getByRole("button", { name: /^Lunch/ }));
    expect(onEventClick).toHaveBeenCalledWith(
      expect.objectContaining({ event: events[1], start: new Date(2026, 9, 21, 12) }),
    );
  });

  it("uses Corex buttons for every toolbar action", () => {
    render(<Calendar events={[]} defaultDate={OCT} />);
    for (const name of ["prev", "next", "today", "view-month", "view-week", "view-day", "view-list"]) {
      expect(action(name).tagName.toLowerCase()).toBe("s-button");
    }
  });

  it("collapses busy days into a +N more modal", () => {
    const busy: CalendarEventType[] = Array.from({ length: 5 }, (_, index) => ({
      id: `e${index}`,
      title: `Event ${index}`,
      start: "2026-10-14",
      allDay: true,
    }));
    render(<Calendar events={busy} defaultDate={OCT} dayMaxEvents={3} />);
    const modal = document.querySelector("s-modal")!;
    expect(modal.hasAttribute("data-stub-open")).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "+3 more" }));
    expect(modal.hasAttribute("data-stub-open")).toBe(true);
    const list = modal.querySelector<HTMLElement>('[data-slot="calendar-modal-list"]')!;
    expect(within(list).getAllByRole("button", { name: /^Event/ })).toHaveLength(5);
    act(() => {
      modal.dispatchEvent(new Event("hide"));
    });
    expect(modal.hasAttribute("data-stub-open")).toBe(false);
  });

  it("moves focus with the keyboard and changes month at the edge", () => {
    render(<Calendar events={[]} defaultDate={OCT} />);
    const start = cell("2026-10-21");
    expect(start).toHaveAttribute("tabindex", "0");
    start.focus();
    fireEvent.keyDown(start, { key: "ArrowRight" });
    expect(document.activeElement).toBe(cell("2026-10-22"));
    fireEvent.keyDown(cell("2026-10-22"), { key: "ArrowDown" });
    expect(document.activeElement).toBe(cell("2026-10-29"));
    fireEvent.keyDown(cell("2026-10-29"), { key: "PageDown" });
    expect(title()).toBe("November 2026");
    expect(document.activeElement).toBe(cell("2026-11-29"));
    fireEvent.keyDown(cell("2026-11-29"), { key: "Home" });
    expect(document.activeElement).toBe(cell("2026-11-29"));
    fireEvent.keyDown(cell("2026-11-29"), { key: "End" });
    expect(document.activeElement).toBe(cell("2026-12-05"));
  });

  it("hides weekends and shows week numbers", () => {
    render(<Calendar events={[]} defaultDate={OCT} weekends={false} weekNumbers firstDay={1} />);
    expect(within(grid()).getAllByRole("gridcell")).toHaveLength(30);
    expect(screen.getByRole("rowheader", { name: "Week 43" })).toBeTruthy();
  });

  it("loads events from an async source for the visible range", async () => {
    const loader = vi.fn(async () => [
      { id: "x", title: "Loaded", start: "2026-10-10", allDay: true },
    ]);
    render(<Calendar events={loader} defaultDate={OCT} />);
    expect(loader).toHaveBeenCalledWith({ start: new Date(2026, 8, 27), end: new Date(2026, 10, 8) });
    expect(await screen.findByText("Loaded")).toBeInTheDocument();
  });

  it("makes events draggable only when editable and not recurring", () => {
    const { container } = render(
      <Calendar
        events={[...events, { id: "r", title: "Weekly", start: "2026-10-06", allDay: true, rrule: "FREQ=WEEKLY" }]}
        defaultDate={OCT}
        editable
      />,
    );
    expect(screen.getByRole("button", { name: /^Lunch/ })).toHaveAttribute("data-editable");
    expect(screen.getAllByRole("button", { name: /^Weekly/ })[0]).not.toHaveAttribute("data-editable");
    expect(container.querySelector('[data-slot="calendar-resize"]')).toBeTruthy();
  });

  it("renders a custom event body", () => {
    render(
      <Calendar
        events={events}
        defaultDate={OCT}
        renderEvent={({ event }) => <strong>{event.title.toUpperCase()}</strong>}
      />,
    );
    expect(screen.getByText("LUNCH")).toBeInTheDocument();
  });

  it("mirrors the layout in RTL", () => {
    render(<Calendar events={[]} defaultDate={OCT} dir="rtl" />);
    expect(screen.getByRole("region", { name: "Calendar" })).toHaveAttribute("dir", "rtl");
    const start = cell("2026-10-21");
    start.focus();
    fireEvent.keyDown(start, { key: "ArrowLeft" });
    expect(document.activeElement).toBe(cell("2026-10-22"));
  });

  it("shows the now indicator in today's column", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 9, 21, 10, 0));
    render(<Calendar events={[]} defaultView="day" nowIndicator />);
    expect(document.querySelector('[data-slot="calendar-now"]')).toBeTruthy();
    vi.useRealTimers();
  });

  it("shows an empty state in list view", () => {
    render(<Calendar events={[]} defaultDate={OCT} defaultView="list" />);
    expect(screen.getByText("No events to display")).toBeInTheDocument();
  });
});

describe("Calendar drop handling", () => {
  it("reverts a rejected drop", async () => {
    const { useDragDrop } = await import("./hooks/useDragDrop");
    const { renderHook } = await import("@testing-library/react");
    const onEventDrop = vi.fn(async () => {
      throw new Error("no");
    });
    const source = [events[0]!];
    const { result } = renderHook(() => useDragDrop(source, { onEventDrop }));
    const info = {
      event: events[0]!,
      oldStart: new Date(2026, 9, 19),
      oldEnd: new Date(2026, 9, 22),
      newStart: new Date(2026, 9, 20),
      newEnd: new Date(2026, 9, 23),
      allDay: true,
    };
    await act(async () => {
      await result.current.commitMove(info);
    });
    expect(onEventDrop).toHaveBeenCalledWith(info);
    expect(result.current.overrides.conf).toBeUndefined();
  });

  it("keeps an accepted drop", async () => {
    const { useDragDrop } = await import("./hooks/useDragDrop");
    const { renderHook } = await import("@testing-library/react");
    const source = [events[0]!];
    const { result } = renderHook(() => useDragDrop(source, { onEventDrop: () => undefined }));
    await act(async () => {
      await result.current.commitMove({
        event: events[0]!,
        oldStart: new Date(2026, 9, 19),
        oldEnd: new Date(2026, 9, 22),
        newStart: new Date(2026, 9, 20),
        newEnd: new Date(2026, 9, 23),
        allDay: true,
      });
    });
    expect(result.current.overrides.conf?.start).toEqual(new Date(2026, 9, 20));
  });
});
