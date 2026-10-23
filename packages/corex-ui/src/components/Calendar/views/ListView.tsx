import { useMemo } from "react";
import { useCalendarContext } from "../Calendar.context";
import { addDays, endOfMonth, isSameDay, startOfMonth, toDateKey } from "../utils/date";
import { occurrenceTouchesDay } from "../utils/events";
import { formatFullDate } from "../utils/format";
import { EventChip } from "../parts/EventChip";

/** Events of the visible month grouped by day. */
export function ListView() {
  const ctx = useCalendarContext();

  const groups = useMemo(() => {
    const result: Array<{ day: Date; items: typeof ctx.occurrences }> = [];
    const last = endOfMonth(ctx.date);
    for (let day = startOfMonth(ctx.date); day <= last; day = addDays(day, 1)) {
      const items = ctx.occurrences.filter((occurrence) => occurrenceTouchesDay(occurrence, day));
      if (items.length > 0) result.push({ day, items });
    }
    return result;
    // `ctx` identity changes each render; only these inputs matter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.date, ctx.occurrences]);

  if (groups.length === 0) {
    return (
      <div data-slot="calendar-list" data-view="list" role="status">
        <div data-slot="calendar-list-empty">No events to display</div>
      </div>
    );
  }

  return (
    <div data-slot="calendar-list" data-view="list" role="list" aria-labelledby={ctx.titleId}>
      {groups.map(({ day, items }) => (
        <section key={toDateKey(day)} role="listitem" data-slot="calendar-list-day">
          <h3
            data-slot="calendar-list-heading"
            data-today={isSameDay(day, ctx.today) ? "" : undefined}
          >
            {formatFullDate(day, ctx.locale)}
          </h3>
          <div data-slot="calendar-list-items">
            {items.map((occurrence, index) => (
              <div key={occurrence.key} data-slot="calendar-list-row">
                <EventChip occurrence={occurrence} variant="list" index={index} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
