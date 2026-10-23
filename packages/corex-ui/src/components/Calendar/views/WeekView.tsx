import { useMemo } from "react";
import { useCalendarContext } from "../Calendar.context";
import { getWeekDays, isWeekend } from "../utils/date";
import { TimeGrid } from "../parts/TimeGrid";

export function WeekView() {
  const ctx = useCalendarContext();
  const days = useMemo(() => {
    const all = getWeekDays(ctx.date, ctx.firstDay);
    return ctx.weekends ? all : all.filter((day) => !isWeekend(day));
  }, [ctx.date, ctx.firstDay, ctx.weekends]);
  return <TimeGrid days={days} />;
}
