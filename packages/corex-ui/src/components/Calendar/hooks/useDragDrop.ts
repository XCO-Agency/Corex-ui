import { useCallback, useEffect, useRef, useState } from "react";
import type {
  CalendarEventChangeInfoType,
  CalendarEventChangeResultType,
  CalendarEventsSourceType,
} from "../Calendar.types";

type OverrideType = { start: Date; end: Date; allDay: boolean };

/**
 * Holds optimistic overrides for events that were moved or resized.
 * An override applies at once, stays if the handler resolves (or returns
 * nothing), and is dropped if the handler returns `false` or rejects, so the
 * event snaps back. A new `events` prop replaces all overrides.
 */
export function useDragDrop(
  eventsSource: CalendarEventsSourceType,
  handlers: {
    onEventDrop?: (info: CalendarEventChangeInfoType) => CalendarEventChangeResultType;
    onEventResize?: (info: CalendarEventChangeInfoType) => CalendarEventChangeResultType;
  },
) {
  const [overrides, setOverrides] = useState<Record<string, OverrideType>>({});
  const [settling, setSettling] = useState<ReadonlySet<string>>(new Set());
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;
  const timers = useRef<number[]>([]);

  useEffect(() => {
    setOverrides({});
  }, [eventsSource]);

  useEffect(
    () => () => {
      for (const timer of timers.current) window.clearTimeout(timer);
    },
    [],
  );

  const commit = useCallback(
    async (kind: "drop" | "resize", info: CalendarEventChangeInfoType) => {
      const id = info.event.id;
      const previous = overrides[id];
      setOverrides((current) => ({
        ...current,
        [id]: { start: info.newStart, end: info.newEnd, allDay: info.allDay },
      }));
      setSettling((current) => new Set(current).add(id));
      timers.current.push(
        window.setTimeout(() => {
          setSettling((current) => {
            const next = new Set(current);
            next.delete(id);
            return next;
          });
        }, 420),
      );

      const handler =
        kind === "drop" ? handlersRef.current.onEventDrop : handlersRef.current.onEventResize;
      let accepted = true;
      try {
        accepted = (await handler?.(info)) !== false;
      } catch {
        accepted = false;
      }
      if (!accepted) {
        setOverrides((current) => {
          const next = { ...current };
          if (previous) next[id] = previous;
          else delete next[id];
          return next;
        });
      }
    },
    [overrides],
  );

  return {
    overrides,
    settling,
    commitMove: (info: CalendarEventChangeInfoType) => commit("drop", info),
    commitResize: (info: CalendarEventChangeInfoType) => commit("resize", info),
  };
}
