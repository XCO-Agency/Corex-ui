import { memo } from "react";
import type { KeyboardEvent, PointerEvent, ReactNode } from "react";
import { useCalendarContext } from "../Calendar.context";
import { toDateKey } from "../utils/date";
import { formatFullDate } from "../utils/format";
import { wasJustDragged } from "../utils/pointer";

export type DayCellPropsType = {
  day: Date;
  isOutside: boolean;
  isToday: boolean;
  inSelection: boolean;
  isDropTarget: boolean;
  isFocusStop: boolean;
  onPointerDown: (event: PointerEvent<HTMLElement>, day: Date) => void;
  /** Collapsed event markers for the narrow-screen layout. */
  children?: ReactNode;
};

function DayCellComponent({
  day,
  isOutside,
  isToday,
  inSelection,
  isDropTarget,
  isFocusStop,
  onPointerDown,
  children,
}: DayCellPropsType) {
  const ctx = useCalendarContext();

  const activate = () => {
    if (wasJustDragged()) return;
    ctx.setFocusDate(day);
    ctx.fireDateClick({ date: day, allDay: true });
    if (ctx.compact) ctx.openDayList(day);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate();
    }
  };

  return (
    <div
      role="gridcell"
      tabIndex={isFocusStop ? 0 : -1}
      aria-label={formatFullDate(day, ctx.locale)}
      aria-selected={ctx.selectable ? inSelection : undefined}
      aria-current={isToday ? "date" : undefined}
      data-slot="calendar-day"
      data-cx-date={toDateKey(day)}
      data-today={isToday ? "" : undefined}
      data-outside={isOutside ? "" : undefined}
      data-weekend={day.getDay() === 0 || day.getDay() === 6 ? "" : undefined}
      data-selected={inSelection ? "" : undefined}
      data-drop-target={isDropTarget ? "" : undefined}
      data-pulse={isToday && ctx.pulseToday ? "" : undefined}
      className={ctx.classNames.dayCell}
      onClick={activate}
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => onPointerDown(event, day)}
    >
      <div data-slot="calendar-day-header">
        {ctx.renderDayCell ? (
          ctx.renderDayCell({ date: day, isToday, isOutside, view: ctx.view })
        ) : (
          <span data-slot="calendar-day-number" aria-hidden="true">
            {day.getDate()}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

export const DayCell = memo(DayCellComponent);
