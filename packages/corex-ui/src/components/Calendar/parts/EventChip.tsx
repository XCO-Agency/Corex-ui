import { memo } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent, ReactNode } from "react";
import type { CalendarOccurrenceType } from "../Calendar.types";
import { useCalendarContext } from "../Calendar.context";
import { formatFullDate, formatTime, formatTimeRange } from "../utils/format";
import { wasJustDragged } from "../utils/pointer";

export type EventChipVariantType = "bar" | "dot" | "pip" | "block" | "list";

export type EventChipPropsType = {
  occurrence: CalendarOccurrenceType;
  variant: EventChipVariantType;
  /** Position in the render order, drives the capped mount stagger. */
  index?: number;
  continuesBefore?: boolean;
  continuesAfter?: boolean;
  style?: CSSProperties;
  dragging?: boolean;
  ghost?: boolean;
  /** Block too short to stack time over title; lays them out on one line. */
  short?: boolean;
  onPointerDown?: (event: PointerEvent<HTMLElement>, occurrence: CalendarOccurrenceType) => void;
  children?: ReactNode;
};

function EventChipComponent({
  occurrence,
  variant,
  index = 0,
  continuesBefore,
  continuesAfter,
  style,
  dragging,
  ghost,
  short,
  onPointerDown,
  children,
}: EventChipPropsType) {
  const ctx = useCalendarContext();
  const { event, start, end, allDay } = occurrence;

  const timeText = allDay ? "" : formatTime(start, ctx.locale);
  const spokenTime = allDay ? "all day" : formatTimeRange(start, end, ctx.locale);
  const label = `${event.title}, ${spokenTime}, ${formatFullDate(start, ctx.locale)}`;

  const activate = (target: EventTarget | null) => {
    if (wasJustDragged()) return;
    ctx.fireEventClick({ event, start, end, nativeEvent: { target } });
  };

  const handleKeyDown = (keyEvent: KeyboardEvent<HTMLElement>) => {
    if (keyEvent.key === "Enter" || keyEvent.key === " ") {
      keyEvent.preventDefault();
      keyEvent.stopPropagation();
      activate(keyEvent.target);
    }
  };

  const content =
    variant === "pip" ? null : ctx.renderEvent ? (
      ctx.renderEvent({
        event,
        start,
        end,
        allDay,
        view: ctx.view,
        timeText,
      })
    ) : (
      <>
        {variant === "dot" || variant === "list" ? (
          <span data-slot="calendar-event-dot" aria-hidden="true" />
        ) : null}
        {variant === "list" ? (
          <span data-slot="calendar-event-time">
            {allDay ? "All day" : formatTimeRange(start, end, ctx.locale)}
          </span>
        ) : timeText && variant !== "bar" ? (
          <span data-slot="calendar-event-time">{timeText}</span>
        ) : null}
        <span data-slot="calendar-event-title">{event.title}</span>
      </>
    );

  const colorVars: Record<string, string | number> = {
    "--cx-cal-i": Math.min(index, 15),
  };
  if (event.color) colorVars["--cx-cal-ev-color"] = event.color;
  if (event.textColor) colorVars["--cx-cal-ev-fg"] = event.textColor;

  return (
    <div
      role="button"
      tabIndex={ghost ? -1 : 0}
      aria-label={label}
      aria-hidden={ghost ? true : undefined}
      title={variant === "pip" ? event.title : undefined}
      data-slot="calendar-event"
      data-variant={variant}
      data-continues-before={continuesBefore ? "" : undefined}
      data-continues-after={continuesAfter ? "" : undefined}
      data-dragging={dragging ? "" : undefined}
      data-ghost={ghost ? "" : undefined}
      data-short={short ? "" : undefined}
      data-settling={ctx.settling.has(event.id) ? "" : undefined}
      data-editable={onPointerDown ? "" : undefined}
      className={ctx.classNames.event}
      style={{ ...colorVars, ...style } as CSSProperties}
      onClick={ghost ? undefined : (clickEvent) => activate(clickEvent.target)}
      onKeyDown={ghost ? undefined : handleKeyDown}
      onPointerDown={onPointerDown ? (down) => onPointerDown(down, occurrence) : undefined}
    >
      {content}
      {children}
    </div>
  );
}

export const EventChip = memo(EventChipComponent);
