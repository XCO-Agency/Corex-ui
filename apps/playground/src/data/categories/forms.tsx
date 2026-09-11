import type { ComponentEntry } from "../types";
import { TextFieldExample } from "@/examples/forms/TextFieldExample";
import TextFieldExampleRaw from "@/examples/forms/TextFieldExample.tsx?raw";
import { SearchFieldExample } from "@/examples/forms/SearchFieldExample";
import SearchFieldExampleRaw from "@/examples/forms/SearchFieldExample.tsx?raw";
import { MoneyFieldExample } from "@/examples/forms/MoneyFieldExample";
import MoneyFieldExampleRaw from "@/examples/forms/MoneyFieldExample.tsx?raw";
import { ColorFieldExample } from "@/examples/forms/ColorFieldExample";
import ColorFieldExampleRaw from "@/examples/forms/ColorFieldExample.tsx?raw";
import { DropZoneExample } from "@/examples/forms/DropZoneExample";
import DropZoneExampleRaw from "@/examples/forms/DropZoneExample.tsx?raw";
import { EmailFieldExample } from "@/examples/forms/EmailFieldExample";
import EmailFieldExampleRaw from "@/examples/forms/EmailFieldExample.tsx?raw";
import { NumberFieldExample } from "@/examples/forms/NumberFieldExample";
import NumberFieldExampleRaw from "@/examples/forms/NumberFieldExample.tsx?raw";
import { PasswordFieldExample } from "@/examples/forms/PasswordFieldExample";
import PasswordFieldExampleRaw from "@/examples/forms/PasswordFieldExample.tsx?raw";
import { UrlFieldExample } from "@/examples/forms/UrlFieldExample";
import UrlFieldExampleRaw from "@/examples/forms/UrlFieldExample.tsx?raw";
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
import { RangeSliderExample } from "@/examples/forms/RangeSliderExample";
import RangeSliderExampleRaw from "@/examples/forms/RangeSliderExample.tsx?raw";

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
    name: "SearchField",
    slug: "search-field",
    category: "Forms",
    description: "A search input backed by Polaris s-search-field with integrated debounce support.",
    examples: [
      {
        title: "Debounced search",
        Example: SearchFieldExample,
        code: SearchFieldExampleRaw,
      },
    ],
  },
  {
    name: "MoneyField",
    slug: "money-field",
    category: "Forms",
    description:
      "Collects monetary values with built-in currency formatting, min/max limits, and validation.",
    examples: [
      {
        title: "Price & budget inputs",
        Example: MoneyFieldExample,
        code: MoneyFieldExampleRaw,
      },
    ],
  },
  {
    name: "ColorField",
    slug: "color-field",
    category: "Forms",
    description:
      "Select colors through an integrated color picker and hex/rgb/hsl text inputs with alpha support.",
    examples: [
      {
        title: "Brand colors & alpha transparency",
        Example: ColorFieldExample,
        code: ColorFieldExampleRaw,
      },
    ],
  },
  {
    name: "DropZone",
    slug: "drop-zone",
    category: "Forms",
    description:
      "Upload files through drag-and-drop or browsing with file type validation and multi-file support.",
    examples: [
      {
        title: "File & media uploads",
        Example: DropZoneExample,
        code: DropZoneExampleRaw,
      },
    ],
  },
  {
    name: "EmailField",
    slug: "email-field",
    category: "Forms",
    description:
      "Captures email address inputs with email keyboards on mobile and browser autofill support.",
    examples: [
      {
        title: "Support & billing email inputs",
        Example: EmailFieldExample,
        code: EmailFieldExampleRaw,
      },
    ],
  },
  {
    name: "NumberField",
    slug: "number-field",
    category: "Forms",
    description:
      "Captures numeric input with step increments, min/max bounds, prefix/suffix units, and mobile keypad support.",
    examples: [
      {
        title: "Quantities & percentage rates",
        Example: NumberFieldExample,
        code: NumberFieldExampleRaw,
      },
    ],
  },
  {
    name: "PasswordField",
    slug: "password-field",
    category: "Forms",
    description:
      "Securely collects passwords, API tokens, and secrets with masked characters.",
    examples: [
      {
        title: "API tokens & secrets",
        Example: PasswordFieldExample,
        code: PasswordFieldExampleRaw,
      },
    ],
  },
  {
    name: "UrlField",
    slug: "url-field",
    category: "Forms",
    description:
      "Collects website addresses, webhook destinations, and endpoints with URL validation.",
    examples: [
      {
        title: "Domains & webhook URLs",
        Example: UrlFieldExample,
        code: UrlFieldExampleRaw,
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
    description:
      "Presents a list of checkbox or radio-style choices, controlled via selected/onChange.",
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
    description:
      "A calendar for selecting a single date, controlled via selected/onChange.",
    examples: [
      {
        title: "Controlled date picker",
        Example: DatePickerExample,
        code: DatePickerExampleRaw,
      },
    ],
  },
  {
    name: "RangeSlider",
    slug: "range-slider",
    category: "Forms",
    description:
      "A slider control for selecting a numeric value or a range between two bounds.",
    examples: [
      {
        title: "Single and dual-thumb range sliders",
        Example: RangeSliderExample,
        code: RangeSliderExampleRaw,
      },
    ],
  },
];
