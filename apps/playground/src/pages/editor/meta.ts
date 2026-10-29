import metadata from "./generated/component-props.json";
import type { FieldSectionType, FieldType } from "./types";

/** One prop as extracted by `scripts/build-editor-props.mjs`. */
export type PropMetaType = {
  name: string;
  kind: "text" | "number" | "boolean" | "select" | "icon" | "json" | "node";
  options?: string[];
  allowCustom?: boolean;
  numeric?: boolean;
  description?: string;
  default?: unknown;
  shape?: string;
  required?: boolean;
};

export type ComponentMetaType = {
  name: string;
  /** `node` when the component renders `children`. */
  children: "node" | "other" | null;
  /** Required callback props, stubbed in generated code. */
  requiredHandlers?: string[];
  props: PropMetaType[];
};

const META = metadata as Record<string, ComponentMetaType>;

export const getMeta = (type: string): ComponentMetaType | undefined => META[type];

const CONTENT_ORDER = [
  "children",
  "heading",
  "title",
  "label",
  "content",
  "message",
  "description",
  "value",
  "placeholder",
  "helpText",
  "details",
  "src",
  "href",
];

const CONTENT = new RegExp(
  `^(${CONTENT_ORDER.join("|")}|defaultValue|prefix|suffix|badge|tooltip|alt|initials|image|largeImage|imageAlt|url|icon|source|type|error|currencyCode|saveText|discardText|closeLabel|queryValue|queryPlaceholder|rightSide|aside|accessory|breadcrumbActions|footerContent|emptyState|collapsedContent|collapseTrigger|keywords|output|primaryAction|secondaryActions|action|secondaryAction|containerName|channel|media|subRows|shortcut)$`,
);
const ACCESSIBILITY = /^(accessibility|labelAccessibility|labelHidden)/;
const SPACING = /^(padding|gap$|rowGap|columnGap|spacing)/;
const SIZE =
  /(inlineSize|blockSize|InlineSize|BlockSize)$|^(width|height|maxHeight|minWidth|overflow|sidebarWidth)/;
const LAYOUT =
  /^(justify|align|place|wrap$|fill$|grow$|shrink$|flex|order$|inline$|direction|position|display|columns$|rows$|areas$|gridTemplate|gridColumn|gridRow|column$|row$|area$|columnSpan|colSpan|rowSpan|sticky|strategy|offset|zIndex|mobileAlign|verticalAlign|snapPoint|visibleMonths|firstDay)/;
const APPEARANCE =
  /^(tone|color|variant|size$|background|border|shadow|fontWeight|fontVariantNumeric|shape|format|density|underline|numeric|breakWord|lineClamp|compact|framed|separator|transparent|condensed|outline|indicator|iconTone|sparkline|hasZebraStriping|increasedTableDensity|truncate|weekends|weekNumbers|nowIndicator|showBadge|showSwipeHandle|animation|animate|easing|duration|delay|reverse|imageContained|sectionned|noHeader|hideIcon|hideScrollbar)/;

function sectionOf(meta: PropMetaType): FieldSectionType {
  if (meta.kind === "json" && !CONTENT.test(meta.name)) return "Data";
  if (CONTENT.test(meta.name)) return "Content";
  if (ACCESSIBILITY.test(meta.name)) return "Accessibility";
  if (SPACING.test(meta.name)) return "Spacing";
  if (SIZE.test(meta.name)) return "Size";
  if (LAYOUT.test(meta.name)) return "Layout";
  if (APPEARANCE.test(meta.name)) return "Appearance";
  return "Behavior";
}

const ACRONYMS: Record<string, string> = {
  url: "URL",
  id: "ID",
  src: "Image URL",
  href: "Link URL",
  rrule: "RRule",
};

/** `accessibilityLabel` → "Accessibility label". */
export function humanize(name: string) {
  if (ACRONYMS[name]) return ACRONYMS[name]!;
  const words = name
    .replace(/\./g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .split(" ")
    .map((word) => ACRONYMS[word] ?? word);
  const text = words.join(" ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Numeric props with natural bounds get a slider instead of a free number input. */
const RANGES: Record<string, { min: number; max: number; step?: number }> = {
  columns: { min: 1, max: 12 },
  columnSpan: { min: 1, max: 12 },
  colSpan: { min: 1, max: 12 },
  rowSpan: { min: 1, max: 12 },
  lineClamp: { min: 1, max: 10 },
  dayMaxEvents: { min: 1, max: 10 },
  visibleMonths: { min: 1, max: 3 },
  sparklineWidth: { min: 40, max: 400, step: 10 },
  sparklineHeight: { min: 16, max: 120, step: 4 },
  duration: { min: 0, max: 2000, step: 50 },
  debounceDelay: { min: 0, max: 2000, step: 50 },
  openDelay: { min: 0, max: 2000, step: 50 },
  closeDelay: { min: 0, max: 2000, step: 50 },
};

const LONG_TEXT =
  /^(children|description|content|message|helpText|details|footerContent)$/;

export function toField(meta: PropMetaType): FieldType {
  const base = {
    name: meta.name,
    label: humanize(meta.name),
    section: sectionOf(meta),
    ...(meta.description ? { description: meta.description } : {}),
    ...(meta.default !== undefined ? { defaultValue: meta.default } : {}),
    ...(meta.required ? { required: true } : {}),
  };
  switch (meta.kind) {
    case "select":
      return {
        ...base,
        kind: "select",
        options: (meta.options ?? []).map((value) => ({ value, label: value })),
        ...(meta.allowCustom ? { allowCustom: true } : {}),
        ...(meta.numeric ? { numeric: true } : {}),
      };
    case "json":
      return { ...base, kind: "json", ...(meta.shape ? { shape: meta.shape } : {}) };
    case "node":
      return { ...base, kind: LONG_TEXT.test(meta.name) ? "textarea" : "text" };
    case "number":
      return RANGES[meta.name]
        ? { ...base, kind: "range", ...RANGES[meta.name]! }
        : { ...base, kind: "number" };
    default:
      return { ...base, kind: meta.kind };
  }
}

export type FieldOverridesType = {
  /** Props to leave out of the inspector (e.g. ones the editor controls). */
  omit?: string[];
  /** Per-prop changes, e.g. turning a `ReactNode | descriptor` prop into JSON. */
  patch?: Record<string, Partial<FieldType>>;
  /** Fields that are not real props (composed components). */
  extra?: FieldType[];
  /** Show `children` as a text field. */
  textChildren?: boolean | "textarea";
};

/** Every non-deprecated prop of `type`, as inspector fields, content first. */
export function fieldsFor(type: string, overrides: FieldOverridesType = {}): FieldType[] {
  const meta = getMeta(type);
  const omit = new Set(overrides.omit ?? []);
  const fields = (meta?.props ?? [])
    .filter((prop) => !omit.has(prop.name))
    .map((prop) => {
      const field = toField(prop);
      const patch = overrides.patch?.[prop.name];
      return patch ? ({ ...field, ...patch } as FieldType) : field;
    });

  if (overrides.textChildren) {
    fields.unshift({
      name: "children",
      label: "Text",
      section: "Content",
      kind: overrides.textChildren === "textarea" ? "textarea" : "text",
    });
  }
  fields.push(...(overrides.extra ?? []));

  const rank = (name: string) => {
    const index = CONTENT_ORDER.indexOf(name);
    return index === -1 ? CONTENT_ORDER.length : index;
  };
  // Stable sort: only the well-known content props move; the rest keep source order.
  return fields.sort((a, b) => rank(a.name) - rank(b.name));
}
