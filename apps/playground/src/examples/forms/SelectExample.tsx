import { useState } from "react";
import { Select } from "@xco/corex-ui";

export function SelectExample() {
  const [country, setCountry] = useState("ca");
  return (
    <Select
      label="Country"
      value={country}
      onChange={(value) => setCountry(value)}
      options={[
        { label: "Canada", value: "ca" },
        { label: "United States", value: "us" },
      ]}
    />
  );
}
