import { useCallback } from "react";
import type { PointerEvent } from "react";
import type { CalendarSelectInfoType } from "../Calendar.types";
import type { CalendarSelectionType } from "../Calendar.context";
import { addDays, fromDateKey, startOfDay } from "../utils/date";
import { beginPointerSession, dateKeyFromPoint } from "../utils/pointer";

/**
 * Drag across day cells to select a range. A press that never travels is
 * left to the cell's own click handler. Esc cancels and clears the highlight.
 */
export function useDaySelection(options: {
  selectable: boolean;
  setSelection: (selection: CalendarSelectionType | null) => void;
  fireSelect: (info: CalendarSelectInfoType) => void;
}) {
  const { selectable, setSelection, fireSelect } = options;

  return useCallback(
    (event: PointerEvent<HTMLElement>, anchor: Date) => {
      if (!selectable || event.button !== 0) return;
      const anchorDay = startOfDay(anchor);
      let current: CalendarSelectionType | null = null;
      const doc = event.currentTarget.ownerDocument;

      beginPointerSession(
        { clientX: event.clientX, clientY: event.clientY, pointerId: event.pointerId, target: event.currentTarget },
        {
          threshold: 4,
          onMove: (move) => {
            const key = dateKeyFromPoint(doc, move.clientX, move.clientY);
            if (!key) return;
            const day = fromDateKey(key);
            const first = day < anchorDay ? day : anchorDay;
            const last = day < anchorDay ? anchorDay : day;
            const next = { start: first, end: addDays(last, 1), allDay: true };
            if (!current || current.start.getTime() !== next.start.getTime() || current.end.getTime() !== next.end.getTime()) {
              current = next;
              setSelection(next);
            }
          },
          onEnd: (_up, dragging) => {
            if (dragging && current) fireSelect(current);
          },
          onCancel: () => setSelection(null),
        },
      );
    },
    [selectable, setSelection, fireSelect],
  );
}
