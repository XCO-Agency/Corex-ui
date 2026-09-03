import type { ComponentEntry } from "../types";
import { TextFieldExample } from "@/examples/forms/TextFieldExample";
import TextFieldExampleRaw from "@/examples/forms/TextFieldExample.tsx?raw";
import { SelectExample } from "@/examples/forms/SelectExample";
import SelectExampleRaw from "@/examples/forms/SelectExample.tsx?raw";
import { CheckboxExample } from "@/examples/forms/CheckboxExample";
import CheckboxExampleRaw from "@/examples/forms/CheckboxExample.tsx?raw";
import { ChoiceListExample } from "@/examples/forms/ChoiceListExample";
import ChoiceListExampleRaw from "@/examples/forms/ChoiceListExample.tsx?raw";
import { DateFieldExample } from "@/examples/forms/DateFieldExample";
import DateFieldExampleRaw from "@/examples/forms/DateFieldExample.tsx?raw";
import { DatePickerExample } from "@/examples/forms/DatePickerExample";
import DatePickerExampleRaw from "@/examples/forms/DatePickerExample.tsx?raw";

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
        code: TextFieldExampleRaw,
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
        code: SelectExampleRaw,
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
        code: CheckboxExampleRaw,
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
        code: ChoiceListExampleRaw,
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
        code: DateFieldExampleRaw,
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
        code: DatePickerExampleRaw,
      },
    ],
  },
];
