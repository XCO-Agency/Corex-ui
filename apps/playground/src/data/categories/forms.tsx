import { useState } from "react";
import { Checkbox, ChoiceList, DateField, DatePicker, Select, TextField } from "@xco/corex-ui";
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

function ChoiceListExample() {
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

function DateFieldExample() {
  const [date, setDate] = useState("2026-01-01");
  return <DateField label="Start date" value={date} onChange={(value) => setDate(value)} />;
}

function DatePickerExample() {
  const [date, setDate] = useState("2026-01-01");
  return <DatePicker selected={date} onChange={(value) => setDate(value)} />;
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
      },
    ],
  },
  {
    name: "ChoiceList",
    slug: "choice-list",
    category: "Forms",
    description: "Presents a list of checkbox or radio-style choices, controlled via selected/onChange.",
    examples: [
      {
        title: "Multiple choice",
        Example: ChoiceListExample,
      },
    ],
  },
  {
    name: "DateField",
    slug: "date-field",
    category: "Forms",
    description: "A single-line date input, controlled via value/onChange.",
    examples: [
      {
        title: "Controlled date field",
        Example: DateFieldExample,
      },
    ],
  },
  {
    name: "DatePicker",
    slug: "date-picker",
    category: "Forms",
    description: "A calendar for selecting a single date, controlled via selected/onChange.",
    examples: [
      {
        title: "Controlled date picker",
        Example: DatePickerExample,
      },
    ],
  },
];
