import { useState } from "react";
import { DatePicker } from "@xco/corex-ui";

export function DatePickerExample() {
  const [date, setDate] = useState("2026-01-01");
  return <DatePicker selected={date} onChange={(value) => setDate(value)} />;
}
