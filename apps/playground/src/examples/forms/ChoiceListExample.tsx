import { useState } from "react";
import { ChoiceList } from "@xco/corex-ui";

export function ChoiceListExample() {
  const [selected, setSelected] = useState<string[]>(["email"]);
  return (
    <ChoiceList
      title="Notify me by"
      choices={[
        { label: "Email", value: "email" },
        { label: "SMS", value: "sms" },
      ]}
      selected={selected}
      onChange={(value) => setSelected(value)}
      allowMultiple
    />
  );
}
