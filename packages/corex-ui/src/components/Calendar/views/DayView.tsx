import { useMemo } from "react";
import { useCalendarContext } from "../Calendar.context";
import { startOfDay } from "../utils/date";
import { TimeGrid } from "../parts/TimeGrid";

export function DayView() {
  const ctx = useCalendarContext();
  const days = useMemo(() => [startOfDay(ctx.date)], [ctx.date]);
  return <TimeGrid days={days} />;
}
