import { useState } from "react";
import { Checkbox, Select, TextField } from "@xco/corex-ui";
import type { ComponentEntry } from "../types";

function TextFieldExample() {
  const [name, setName] = useState("Ada Lovelace");
  return <TextField label="Name" value={name} onChange={(value) => setName(value)} />;
}

function SelectExample() {
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

function CheckboxExample() {
  const [accepted, setAccepted] = useState(false);
  return (
    <Checkbox label="I accept the terms" checked={accepted} onChange={(value) => setAccepted(value)} />
  );
}

export const formsComponents: ComponentEntry[] = [
  {
    name: "TextField",
    slug: "text-field",
    category: "Forms",
    description: "A single- or multi-line text input, controlled via value/onChange.",
    examples: [
      {
        title: "Controlled input",
        Example: TextFieldExample,
        code: `const [name, setName] = useState("Ada Lovelace");

<TextField label="Name" value={name} onChange={(value) => setName(value)} />`,
      },
    ],
  },
  {
    name: "Select",
    slug: "select",
    category: "Forms",
    description: "Lets the user pick one option from a menu of choices.",
    examples: [
      {
        title: "Controlled select",
        Example: SelectExample,
        code: `const [country, setCountry] = useState("ca");

<Select
  label="Country"
  value={country}
  onChange={(value) => setCountry(value)}
  options={[
    { label: "Canada", value: "ca" },
    { label: "United States", value: "us" },
  ]}
/>`,
      },
    ],
  },
  {
    name: "Checkbox",
    slug: "checkbox",
    category: "Forms",
    description: "A binary on/off form control, controlled via checked/onChange.",
    examples: [
      {
        title: "Controlled checkbox",
        Example: CheckboxExample,
        code: `const [accepted, setAccepted] = useState(false);

<Checkbox
  label="I accept the terms"
  checked={accepted}
  onChange={(value) => setAccepted(value)}
/>`,
      },
    ],
  },
];
