import { useState } from "react";
import { DateField } from "@xco/corex-ui";

export function DateFieldExample() {
  const [date, setDate] = useState("2026-01-01");
  return (
    <DateField label="Start date" value={date} onChange={(value) => setDate(value)} />
  );
}
