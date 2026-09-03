import { useState } from "react";
import { Checkbox } from "@xco/corex-ui";

export function CheckboxExample() {
  const [accepted, setAccepted] = useState(false);
  return (
    <Checkbox label="I accept the terms" checked={accepted} onChange={(value) => setAccepted(value)} />
  );
}
