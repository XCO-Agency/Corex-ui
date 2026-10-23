import type { CalendarOccurrenceType } from "../Calendar.types";
import { useCalendarContext } from "../Calendar.context";
import { Modal } from "../../Modal";
import { isMultiDay } from "../utils/events";
import { formatFullDate } from "../utils/format";
import { EventChip } from "./EventChip";

export type DayEventsModalPropsType = {
  open: boolean;
  date: Date | null;
  occurrences: CalendarOccurrenceType[];
  direction: "ltr" | "rtl";
  onClose: () => void;
};

/** Every event on one day, opened from "+N more" or a tapped day on narrow screens. */
export function DayEventsModal({ open, date, occurrences, direction, onClose }: DayEventsModalPropsType) {
  const ctx = useCalendarContext();
  return (
    <Modal open={open} onClose={onClose} title={date ? formatFullDate(date, ctx.locale) : ""}>
      <div data-slot="calendar-modal-list" dir={direction} className={ctx.classNames.popover}>
        {occurrences.map((occurrence, index) => (
          <EventChip
            key={occurrence.key}
            occurrence={occurrence}
            variant={occurrence.allDay || isMultiDay(occurrence) ? "bar" : "dot"}
            index={index}
          />
        ))}
      </div>
    </Modal>
  );
}
