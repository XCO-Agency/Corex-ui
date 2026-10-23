import { useMemo, useState } from "react";
import {
  BlockStack,
  Button,
  Calendar,
  InlineStack,
  Text,
  type CalendarEventChangeInfoType,
  type CalendarEventType,
} from "@xco-agency/corex-ui";

function at(dayOffset: number, hours: number, minutes = 0): Date {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function day(dayOffset: number): Date {
  return at(dayOffset, 0);
}

function sampleEvents(): CalendarEventType[] {
  return [
    { id: "offsite", title: "Team offsite", start: day(-2), end: day(2), allDay: true, color: "#7c3aed" },
    { id: "launch", title: "Product launch", start: day(5), allDay: true, color: "#e11d48" },
    { id: "standup", title: "Standup", start: at(-21, 9, 30), end: at(-21, 9, 45), rrule: "FREQ=WEEKLY;BYDAY=MO,WE,FR" },
    { id: "review", title: "Design review", start: at(0, 11), end: at(0, 12) },
    { id: "lunch", title: "Lunch with Sam", start: at(0, 11, 30), end: at(0, 13), color: "#059669" },
    { id: "one-on-one", title: "1:1", start: at(0, 15), end: at(0, 15, 30) },
    { id: "planning", title: "Sprint planning", start: at(1, 10), end: at(1, 12) },
    { id: "demo", title: "Customer demo", start: at(3, 14), end: at(3, 15), color: "#d97706" },
    { id: "travel", title: "Flight to Lisbon", start: at(8, 18), end: at(9, 1, 30) },
    { id: "a", title: "Inventory sync", start: at(6, 9) },
    { id: "b", title: "Payroll", start: at(6, 10) },
    { id: "c", title: "Shipping cut-off", start: at(6, 15) },
    { id: "d", title: "Newsletter", start: at(6, 16) },
  ];
}

export function CalendarExample() {
  const [events, setEvents] = useState<CalendarEventType[]>(sampleEvents);
  const [weekends, setWeekends] = useState(true);
  const [rtl, setRtl] = useState(false);
  const [lastAction, setLastAction] = useState("Drag events to move them, drag edges to resize, or drag across days to add one.");

  const applyChange = ({ event, newStart, newEnd }: CalendarEventChangeInfoType) => {
    setEvents((current) =>
      current.map((item) => (item.id === event.id ? { ...item, start: newStart, end: newEnd } : item)),
    );
    setLastAction(`Updated “${event.title}”: ${newStart.toLocaleString()} – ${newEnd.toLocaleString()}`);
  };

  const businessHours = useMemo(() => ({ startTime: "09:00", endTime: "18:00" }), []);

  return (
    <BlockStack gap="large-100">
      <InlineStack gap="small-200" align="space-between" alignItems="center">
        <Text as="p" variant="small" color="subdued">
          {lastAction}
        </Text>
        <InlineStack gap="small-200">
          <Button onClick={() => setWeekends((value) => !value)}>
            {weekends ? "Hide weekends" : "Show weekends"}
          </Button>
          <Button onClick={() => setRtl((value) => !value)}>{rtl ? "LTR" : "RTL"}</Button>
        </InlineStack>
      </InlineStack>
      <Calendar
        events={events}
        editable
        selectable
        weekNumbers
        weekends={weekends}
        dir={rtl ? "rtl" : "ltr"}
        firstDay={1}
        businessHours={businessHours}
        slotMinTime="07:00"
        slotMaxTime="21:00"
        onEventDrop={applyChange}
        onEventResize={applyChange}
        onEventClick={({ event, start }) => setLastAction(`Clicked “${event.title}” on ${start.toLocaleDateString()}`)}
        onSelect={({ start, end, allDay }) => {
          const id = `new-${Date.now()}`;
          setEvents((current) => [...current, { id, title: "New event", start, end, allDay }]);
          setLastAction(`Added an event from ${start.toLocaleString()}`);
        }}
      />
    </BlockStack>
  );
}
