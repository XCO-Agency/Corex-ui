import * as React from "react";
import * as Corex from "@xco-agency/corex-ui";
import {
  ActionList,
  Button,
  Combobox,
  Menu,
  ResourceItem,
  ResourceList,
  Text,
} from "@xco-agency/corex-ui";
import {
  AppWindow,
  ArrowDownUp,
  BarChart3,
  Bell,
  Box as BoxIcon,
  CalendarDays,
  CalendarRange,
  Check,
  ChevronDown,
  ChevronsUpDown,
  Circle,
  CircleDot,
  Code,
  Columns2,
  Columns3,
  Command as CommandIcon,
  DollarSign,
  Eye,
  FileText,
  Filter,
  Globe,
  Grid2x2,
  Hand,
  Hash,
  Heading,
  Image as ImageIcon,
  Inbox,
  Info,
  KeyRound,
  Layers,
  LayoutGrid,
  LayoutList,
  LayoutTemplate,
  Link2,
  List,
  ListChecks,
  ListTree,
  Loader,
  Mail,
  Menu as MenuIcon,
  MessageSquare,
  Minus,
  MousePointerClick,
  Navigation,
  PanelBottom,
  PanelRight,
  PanelTop,
  Palette,
  Pilcrow,
  Pointer,
  RectangleHorizontal,
  Rows3,
  Save,
  ScanLine,
  Search,
  SlidersHorizontal,
  Smile,
  Sparkles,
  Square,
  SquareCheck,
  SquareUser,
  Table,
  Tag,
  TextCursorInput,
  TextQuote,
  ToggleRight,
  TriangleAlert,
  Type,
  Upload,
  WandSparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { registry } from "@/data/registry";
import { fieldsFor, type FieldOverridesType } from "./meta";
import type {
  CodeShapeType,
  ComponentDefinitionType,
  ComponentGroupType,
  DraftNodeType,
  EditorNodeType,
  FieldType,
  NodePropsType,
} from "./types";

/* ------------------------------------------------------------------ helpers */

const descriptions = new Map(registry.map((entry) => [entry.name, entry.description]));

/** Resolves `Grid.Item` to `Corex.Grid.Item`. */
function resolveComponent(type: string): React.ElementType {
  const [root, part] = type.split(".");
  const base = (
    Corex as unknown as Record<string, React.ElementType & Record<string, unknown>>
  )[root!];
  const component = part ? (base?.[part] as React.ElementType | undefined) : base;
  if (!component) throw new Error(`@xco-agency/corex-ui has no export "${type}"`);
  return component;
}

/** Turns stored props into what the component receives: no empty values, numbers as numbers. */
export function runtimeProps(fields: FieldType[], props: NodePropsType): NodePropsType {
  const byName = new Map(fields.map((field) => [field.name, field]));
  const result: NodePropsType = {};
  for (const [name, value] of Object.entries(props)) {
    if (value === "" || value === undefined || value === null) continue;
    const field = byName.get(name);
    if (
      field &&
      (field.kind === "number" ||
        field.kind === "range" ||
        (field.kind === "select" && field.numeric))
    ) {
      const parsed = typeof value === "number" ? value : Number(value);
      if (Number.isFinite(parsed)) result[name] = parsed;
      continue;
    }
    result[name] = value;
  }
  return result;
}

export const text = (children: string, props: NodePropsType = {}): DraftNodeType => ({
  type: "Text",
  props: { children, ...props },
});
const node = (
  type: string,
  props: NodePropsType = {},
  children?: DraftNodeType[],
): DraftNodeType => ({
  type,
  props,
  ...(children ? { children } : {}),
});

type EntryType = {
  type: string;
  group: ComponentGroupType;
  icon: LucideIcon;
  label?: string;
  description?: string;
  /** Holds child nodes; `"horizontal"` when they flow in a row. */
  container?: boolean | "horizontal";
  bare?: boolean;
  slots?: ComponentDefinitionType["slots"];
  maxChildren?: number;
  overlay?: ComponentDefinitionType["overlay"];
  /** Child nodes render into this prop instead of `children` (e.g. Collapsible `content`). */
  childrenProp?: string;
  accepts?: string[];
  parents?: string[];
  ancestors?: string[];
  partOf?: string;
  note?: string;
  defaults?: NodePropsType;
  children?: () => DraftNodeType[];
  fields?: FieldOverridesType;
  render?: ComponentDefinitionType["render"];
  canvasLabel?: ComponentDefinitionType["canvasLabel"];
  toCode?: ComponentDefinitionType["toCode"];
  wrapperStyle?: ComponentDefinitionType["wrapperStyle"];
};

function define(entry: EntryType): ComponentDefinitionType {
  const fields = fieldsFor(entry.type, entry.fields);
  const textChildren = Boolean(entry.fields?.textChildren);
  const isContainer = Boolean(entry.container);
  let render = entry.render;

  if (!render) {
    const Component = resolveComponent(entry.type);
    render = (props, children) => {
      const { children: label, ...rest } = runtimeProps(fields, props);
      if (entry.childrenProp) {
        return React.createElement(
          Component,
          { ...rest, [entry.childrenProp]: children },
          label as React.ReactNode,
        );
      }
      const content = isContainer
        ? children
        : textChildren
          ? (label as React.ReactNode)
          : undefined;
      return React.createElement(Component, rest, content);
    };
  }

  const canvasLabel =
    entry.canvasLabel ??
    (entry.note === EMBEDDED_NOTE ? embeddedLabel(entry.type) : undefined);

  return {
    type: entry.type,
    label: entry.label ?? entry.type.replace(".", " › "),
    group: entry.group,
    icon: entry.icon,
    description:
      entry.description ??
      descriptions.get(entry.type) ??
      `Part of ${entry.type.split(".")[0]}.`,
    ...(isContainer
      ? {
          isContainer: true,
          axis: entry.container === "horizontal" ? "horizontal" : "vertical",
        }
      : {}),
    ...(entry.bare ? { bareChildren: true } : {}),
    ...(entry.accepts ? { accepts: entry.accepts } : {}),
    ...(entry.parents ? { parents: entry.parents } : {}),
    ...(entry.ancestors ? { ancestors: entry.ancestors } : {}),
    ...(entry.slots ? { slots: entry.slots } : {}),
    ...(entry.maxChildren !== undefined ? { maxChildren: entry.maxChildren } : {}),
    ...(entry.overlay ? { overlay: entry.overlay } : {}),
    ...(entry.partOf ? { partOf: entry.partOf } : {}),
    ...(entry.note ? { note: entry.note } : {}),
    defaultProps: entry.defaults ?? {},
    ...(entry.children ? { defaultChildren: entry.children } : {}),
    fields,
    render,
    ...(entry.toCode
      ? { toCode: entry.toCode }
      : entry.childrenProp
        ? {
            toCode: (props: NodePropsType) => {
              const { children: label, ...rest } = props;
              return {
                name: entry.type,
                props: rest,
                text: typeof label === "string" ? label : undefined,
                childrenProp: entry.childrenProp,
              } satisfies CodeShapeType;
            },
          }
        : {}),
    ...(entry.wrapperStyle ? { wrapperStyle: entry.wrapperStyle } : {}),
    ...(canvasLabel ? { canvasLabel } : {}),
  };
}

const EMBEDDED_NOTE =
  "App Bridge component: it only does something inside the embedded Shopify admin, so the canvas shows little or nothing.";
const embeddedLabel = (type: string) => () => `${type} · renders in the Shopify admin`;
const closedLabel = (type: string) => (props: NodePropsType) =>
  props.open ? null : `${type} (closed) · turn on Open to edit`;
const json = (shape?: string): Partial<FieldType> => ({
  kind: "json",
  section: "Content",
  ...(shape ? { shape } : {}),
});

/* ------------------------------------------------------------------- entries */

const entries: EntryType[] = [
  /* Layout ---------------------------------------------------------------- */
  {
    type: "Page",
    group: "Layout",
    icon: PanelTop,
    container: true,
    defaults: { heading: "Page title", primaryAction: { content: "Save" } },
    fields: {
      patch: {
        primaryAction: json(
          "{ content: string; disabled?: boolean; loading?: boolean; destructive?: boolean; url?: string }",
        ),
        secondaryActions: json(
          "Array<{ content: string; icon?: string; disabled?: boolean }>",
        ),
      },
    },
  },
  {
    type: "Card",
    group: "Layout",
    icon: RectangleHorizontal,
    container: true,
    defaults: { heading: "Card heading" },
    children: () => [text("Use cards to group related information.")],
  },
  {
    type: "Box",
    group: "Layout",
    icon: BoxIcon,
    container: true,
    defaults: { padding: "base", background: "subdued", borderRadius: "base" },
  },
  {
    type: "BlockStack",
    label: "Block stack",
    group: "Layout",
    icon: Rows3,
    container: true,
    defaults: { gap: "base" },
  },
  {
    type: "InlineStack",
    label: "Inline stack",
    group: "Layout",
    icon: Columns3,
    container: "horizontal",
    defaults: { gap: "small", alignItems: "center", wrap: true },
  },
  {
    type: "Grid",
    slots: [{ type: "Grid.Item" }],
    group: "Layout",
    icon: LayoutGrid,
    container: "horizontal",
    defaults: { columns: 2, gap: "base" },
    // `columns` also takes a track string, which `gridTemplateColumns` covers; the slider sets a count.
    fields: { patch: { columns: { kind: "range", min: 1, max: 12 } } },
    render: (props, children) => {
      const { columns, ...rest } = props;
      const count =
        typeof columns === "string" && /^\d+$/.test(columns) ? Number(columns) : columns;
      return (
        <Corex.Grid
          {...(runtimeProps(gridFields, rest) as object)}
          columns={(count || undefined) as number}
        >
          {children}
        </Corex.Grid>
      );
    },
    toCode: ({ columns, ...rest }) => ({
      name: "Grid",
      props: {
        ...rest,
        columns:
          typeof columns === "string" && /^\d+$/.test(columns)
            ? Number(columns)
            : columns,
      },
    }),
  },
  {
    type: "Grid.Item",
    label: "Grid item",
    group: "Layout",
    icon: Square,
    container: true,
    partOf: "Grid",
    parents: ["Grid"],
    defaults: { columnSpan: 1 },
    render: (props, children) => {
      const { columnSpan, rowSpan, ...rest } = runtimeProps(gridItemFields, props);
      return (
        <Corex.Grid.Item
          {...(rest as object)}
          columnSpan={toNumber(columnSpan)}
          rowSpan={toNumber(rowSpan)}
        >
          {children}
        </Corex.Grid.Item>
      );
    },
    wrapperStyle: (props) => ({
      gridColumn: toNumber(props.columnSpan)
        ? `span ${toNumber(props.columnSpan)}`
        : undefined,
      gridRow: toNumber(props.rowSpan) ? `span ${toNumber(props.rowSpan)}` : undefined,
    }),
  },
  {
    type: "InlineGrid",
    label: "Inline grid",
    group: "Layout",
    icon: Columns2,
    container: "horizontal",
    defaults: { columns: 2, gap: "base" },
    fields: { patch: { columns: { kind: "range", min: 1, max: 12 } } },
  },
  {
    type: "Layout",
    slots: [{ type: "Layout.Section" }],
    group: "Layout",
    icon: LayoutTemplate,
    container: "horizontal",
    bare: true,
    accepts: ["Layout.Section"],
    children: () => [
      node("Layout.Section", { variant: "oneThird" }, [text("Sidebar content")]),
      node("Layout.Section", {}, [
        node("Card", { heading: "Main content" }, [text("Primary column")]),
      ]),
    ],
  },
  {
    type: "Layout.Section",
    label: "Layout section",
    group: "Layout",
    icon: Square,
    container: true,
    partOf: "Layout",
    parents: ["Layout"],
  },
  {
    type: "FormLayout",
    slots: [{ type: "FormLayout.Group" }],
    label: "Form layout",
    group: "Layout",
    icon: LayoutList,
    container: true,
    children: () => [
      node("TextField", { label: "First name" }),
      node("TextField", { label: "Last name" }),
    ],
  },
  {
    type: "FormLayout.Group",
    parents: ["FormLayout"],
    label: "Form layout group",
    group: "Layout",
    icon: Columns2,
    container: "horizontal",
    partOf: "FormLayout",
    children: () => [
      node("TextField", { label: "City" }),
      node("TextField", { label: "ZIP code" }),
    ],
  },
  {
    type: "TextContainer",
    label: "Text container",
    group: "Layout",
    icon: TextQuote,
    container: true,
    children: () => [text("Grouped text keeps consistent spacing.")],
  },
  {
    type: "QueryContainer",
    label: "Query container",
    group: "Layout",
    icon: ScanLine,
    container: true,
    children: () => [text("Children can respond to this container's width.")],
  },
  { type: "Divider", group: "Layout", icon: Minus },
  {
    type: "Collapsible",
    group: "Layout",
    icon: ChevronsUpDown,
    container: true,
    childrenProp: "content",
    defaults: { children: "Shipping details", defaultExpanded: true, framed: true },
    fields: { textChildren: true, omit: ["content"] },
    children: () => [text("Orders ship within 1–2 business days.")],
  },
  {
    type: "Transition",
    group: "Layout",
    icon: Sparkles,
    container: true,
    defaults: { show: true },
    children: () => [text("Animated content")],
  },
  {
    type: "Hoverable",
    slots: [{ type: "Hoverable.Show" }, { type: "Hoverable.Hide" }],
    group: "Layout",
    icon: Pointer,
    container: true,
    children: () => [
      node("Card", { heading: "Hover me" }, [
        node("Hoverable.Show", { animation: "scale" }, [
          node("Button", { children: "Edit", variant: "tertiary" }),
        ]),
      ]),
    ],
  },
  {
    type: "Hoverable.Show",
    ancestors: ["Hoverable"],
    label: "Hoverable show",
    group: "Layout",
    icon: Eye,
    container: true,
    partOf: "Hoverable",
  },
  {
    type: "Hoverable.Hide",
    ancestors: ["Hoverable"],
    label: "Hoverable hide",
    group: "Layout",
    icon: Eye,
    container: true,
    partOf: "Hoverable",
  },
  {
    type: "Selectable",
    group: "Layout",
    icon: SquareCheck,
    container: true,
    defaults: { value: "basic" },
    children: () => [node("Card", {}, [text("Selectable card")])],
  },
  {
    type: "Selectable.Group",
    slots: [{ type: "Selectable" }],
    label: "Selectable group",
    group: "Layout",
    icon: ListChecks,
    container: "horizontal",
    children: () => [
      node("Selectable", { value: "basic" }, [node("Card", {}, [text("Basic")])]),
      node("Selectable", { value: "pro" }, [node("Card", {}, [text("Pro")])]),
    ],
  },
  {
    type: "MetricCard",
    label: "Metric card",
    group: "Layout",
    icon: BarChart3,
    defaults: {
      title: "Total sales",
      value: "$12,480",
      badge: { value: "+12%", tone: "success" },
    },
    fields: { patch: { value: { kind: "text" } } },
  },
  {
    type: "Table",
    slots: [
      { type: "Table.HeaderRow", max: 1, required: true },
      { type: "Table.Body", max: 1, required: true },
    ],
    group: "Layout",
    icon: Table,
    container: true,
    bare: true,
    accepts: ["Table.HeaderRow", "Table.Body"],
    children: () => [
      node("Table.HeaderRow", {}, [
        node("Table.Header", { children: "Product", listSlot: "primary" }),
        node("Table.Header", { children: "Status" }),
        node("Table.Header", { children: "Price", format: "currency" }),
      ]),
      node("Table.Body", {}, [
        node("Table.Row", {}, [
          node("Table.Cell", {}, [text("Snowboard")]),
          node("Table.Cell", {}, [
            node("Badge", { children: "Active", tone: "success" }),
          ]),
          node("Table.Cell", {}, [text("$120.00")]),
        ]),
        node("Table.Row", {}, [
          node("Table.Cell", {}, [text("Ski wax")]),
          node("Table.Cell", {}, [node("Badge", { children: "Draft" })]),
          node("Table.Cell", {}, [text("$12.00")]),
        ]),
      ]),
    ],
  },
  {
    type: "Table.HeaderRow",
    slots: [{ type: "Table.Header" }],
    label: "Table header row",
    group: "Layout",
    icon: Rows3,
    container: "horizontal",
    bare: true,
    partOf: "Table",
    parents: ["Table"],
    accepts: ["Table.Header"],
  },
  {
    type: "Table.Header",
    label: "Table header",
    group: "Layout",
    icon: Heading,
    partOf: "Table",
    parents: ["Table.HeaderRow"],
    defaults: { children: "Column" },
    fields: { textChildren: true },
  },
  {
    type: "Table.Body",
    slots: [{ type: "Table.Row" }],
    label: "Table body",
    group: "Layout",
    icon: Rows3,
    container: true,
    bare: true,
    partOf: "Table",
    parents: ["Table"],
    accepts: ["Table.Row"],
  },
  {
    type: "Table.Row",
    slots: [{ type: "Table.Cell" }],
    label: "Table row",
    group: "Layout",
    icon: Rows3,
    container: "horizontal",
    bare: true,
    partOf: "Table",
    parents: ["Table.Body"],
    accepts: ["Table.Cell"],
    children: () => [node("Table.Cell", {}, [text("Cell")])],
  },
  {
    type: "Table.Cell",
    slots: [
      { type: "Table.ExpandButton", max: 1 },
      { type: "Table.SubRowConnector", max: 1 },
    ],
    label: "Table cell",
    group: "Layout",
    icon: Square,
    container: true,
    partOf: "Table",
    parents: ["Table.Row"],
    children: () => [text("Cell")],
  },
  {
    type: "Table.ExpandButton",
    parents: ["Table.Cell"],
    label: "Table expand button",
    group: "Layout",
    icon: ChevronDown,
    partOf: "Table",
    defaults: { accessibilityLabel: "Expand row", expanded: false },
  },
  {
    type: "Table.SubRowConnector",
    parents: ["Table.Cell"],
    label: "Table sub-row connector",
    group: "Layout",
    icon: ListTree,
    partOf: "Table",
  },
  {
    type: "IndexTable",
    label: "Index table",
    group: "Layout",
    icon: Table,
    container: true,
    // IndexTable reads its rows' `id`s and cells' `colSpan`, so they render as the real elements.
    bare: true,
    accepts: ["IndexTable.Row"],
    slots: [{ type: "IndexTable.Row" }],
    defaults: {
      resourceName: { singular: "product", plural: "products" },
      headings: [
        { title: "Product" },
        { title: "Status" },
        { title: "Inventory" },
        { title: "Price", alignment: "end" },
      ],
      itemCount: 3,
      selectable: true,
    },
    // Rows are built from IndexTable.Row nodes, which carry `colSpan` and sub-rows.
    fields: { omit: ["rows"] },
    children: () => [
      indexRow(
        ["The Collection Snowboard", "Active", "50 in stock", "$749.95"],
        [
          node("IndexTable.Row", {}, [
            node("IndexTable.Cell", { colSpan: 3 }, [
              text("Ships from two warehouses: Paris and Lyon.", { color: "subdued" }),
            ]),
            node("IndexTable.Cell", {}, [text("—")]),
          ]),
        ],
      ),
      indexRow(["Ski Wax", "Draft", "120 in stock", "$12.00"]),
      indexRow(["Gift Card", "Active", "—", "$25.00"]),
    ],
  },
  {
    type: "IndexTable.Row",
    label: "Index table row",
    group: "Layout",
    icon: Rows3,
    container: "horizontal",
    bare: true,
    partOf: "IndexTable",
    parents: ["IndexTable", "IndexTable.Row"],
    accepts: ["IndexTable.Cell", "IndexTable.Row"],
    // Cells first; nested rows become this row's `subRows`.
    slots: [{ type: "IndexTable.Cell" }, { type: "IndexTable.Row" }],
    fields: { omit: ["subRows"] },
    children: () => [node("IndexTable.Cell", {}, [text("Cell")])],
    render: (props, children, current) => {
      const items = React.Children.toArray(children).filter(React.isValidElement);
      const subRows = items.filter((item) => item.type === Corex.IndexTable.Row);
      return (
        <Corex.IndexTable.Row
          {...(runtimeProps(indexRowFields, props) as object)}
          id={indexRowId(current)}
          subRows={subRows.length ? subRows : undefined}
        >
          {items.filter((item) => item.type !== Corex.IndexTable.Row)}
        </Corex.IndexTable.Row>
      );
    },
    toCode: (props, current) => ({
      name: "IndexTable.Row",
      props: { id: indexRowId(current), ...props },
      slotProps: { subRows: ["IndexTable.Row"] },
    }),
  },
  {
    type: "IndexTable.Cell",
    label: "Index table cell",
    group: "Layout",
    icon: Square,
    container: true,
    partOf: "IndexTable",
    parents: ["IndexTable.Row"],
    children: () => [text("Cell")],
  },
  {
    type: "ResourceList",
    label: "Resource list",
    group: "Layout",
    icon: List,
    defaults: {
      resourceName: { singular: "customer", plural: "customers" },
      items: [
        { id: "1", name: "Mae Jemison", location: "Decatur, USA" },
        { id: "2", name: "Ellen Ochoa", location: "Los Angeles, USA" },
      ],
    },
    render: (props) => (
      <ResourceList
        {...(runtimeProps(resourceListFields, props) as object)}
        renderItem={(
          item: { id?: string; name?: string; title?: string; location?: string },
          id,
        ) => (
          <ResourceItem id={item.id ?? id}>
            <Text fontWeight="semibold">{item.name ?? item.title ?? String(id)}</Text>
            {item.location && <Text color="subdued">{item.location}</Text>}
          </ResourceItem>
        )}
      />
    ),
    toCode: (props) => ({
      name: "ResourceList",
      props,
      rawProps: {
        renderItem:
          '(item) => (\n  <ResourceItem id={item.id}>\n    <Text fontWeight="semibold">{item.name}</Text>\n  </ResourceItem>\n)',
      },
      imports: ["ResourceItem", "Text"],
    }),
  },
  {
    type: "ResourceItem",
    label: "Resource item",
    group: "Layout",
    icon: Square,
    container: true,
    children: () => [text("Resource name", { fontWeight: "semibold" })],
  },
  {
    type: "DescriptionList",
    label: "Description list",
    group: "Layout",
    icon: LayoutList,
    defaults: {
      items: [
        { term: "Plan", description: "Growth" },
        { term: "Billing", description: "Monthly" },
      ],
    },
  },
  {
    type: "List",
    slots: [{ type: "List.Item" }],
    group: "Typography",
    icon: List,
    container: true,
    bare: true,
    accepts: ["List.Item"],
    children: () => [
      node("List.Item", { children: "Products sync every 15 minutes" }),
      node("List.Item", { children: "Inventory syncs on change" }),
    ],
  },
  {
    type: "List.Item",
    label: "List item",
    group: "Typography",
    icon: Minus,
    partOf: "List",
    parents: ["List"],
    defaults: { children: "List item" },
    fields: { textChildren: true },
  },
  {
    type: "Calendar",
    group: "Layout",
    icon: CalendarRange,
    defaults: {
      defaultView: "month",
      events: [
        {
          id: "launch",
          title: "Product launch",
          start: "2026-11-05",
          allDay: true,
          color: "#e11d48",
        },
        {
          id: "review",
          title: "Design review",
          start: "2026-11-10T11:00:00",
          end: "2026-11-10T12:00:00",
        },
      ],
    },
    fields: { omit: ["classNames"] },
  },
  {
    type: "Skeleton",
    group: "Feedback",
    icon: Minus,
    defaults: { inlineSize: "100%", blockSize: "16px" },
  },
  {
    type: "SkeletonPage",
    label: "Skeleton page",
    group: "Feedback",
    icon: FileText,
    defaults: { title: "Loading page", primaryAction: true },
  },

  /* Typography ------------------------------------------------------------ */
  {
    type: "Text",
    group: "Typography",
    icon: Type,
    defaults: { children: "Text" },
    fields: { textChildren: "textarea" },
  },
  {
    type: "Paragraph",
    group: "Typography",
    icon: Pilcrow,
    defaults: {
      children: "Paragraphs hold longer descriptions that explain a feature or setting.",
    },
    fields: { textChildren: "textarea" },
  },
  {
    type: "InlineCode",
    label: "Inline code",
    group: "Typography",
    icon: Code,
    defaults: { children: "npm install" },
    fields: { textChildren: true },
  },
  {
    type: "InlineError",
    label: "Inline error",
    group: "Typography",
    icon: TriangleAlert,
    defaults: { message: "Store name is required", fieldID: "store-name" },
  },
  {
    type: "Link",
    group: "Typography",
    icon: Link2,
    defaults: { children: "Learn more", href: "#" },
    fields: { textChildren: true },
  },
  {
    type: "Badge",
    group: "Feedback",
    icon: Tag,
    defaults: { children: "Active", tone: "success" },
    fields: { textChildren: true },
  },
  {
    type: "Tag",
    group: "Feedback",
    icon: Tag,
    defaults: { children: "Wholesale" },
    fields: { textChildren: true },
  },

  /* Actions --------------------------------------------------------------- */
  {
    type: "Button",
    group: "Actions",
    icon: MousePointerClick,
    defaults: { children: "Button", variant: "primary" },
    fields: { textChildren: true },
  },
  {
    type: "ButtonGroup",
    label: "Button group",
    group: "Actions",
    icon: Columns3,
    container: "horizontal",
    children: () => [
      node("Button", { children: "Cancel" }),
      node("Button", { children: "Save", variant: "primary" }),
    ],
  },
  {
    type: "Clickable",
    group: "Actions",
    icon: Hand,
    container: true,
    defaults: { padding: "base", border: "base", borderRadius: "base" },
    children: () => [text("Clickable area")],
  },
  {
    type: "Menu",
    group: "Actions",
    icon: MenuIcon,
    container: true,
    accepts: ["Button"],
    defaults: { triggerLabel: "More actions", accessibilityLabel: "More actions" },
    fields: {
      extra: [
        {
          name: "triggerLabel",
          label: "Trigger label",
          section: "Content",
          kind: "text",
          description:
            "Label of the button that opens the menu (rendered with commandFor).",
        },
      ],
    },
    children: () => [
      node("Button", { children: "Duplicate", icon: "duplicate" }),
      node("Button", { children: "Delete", icon: "delete", tone: "critical" }),
    ],
    render: (props, children, current) => {
      const { triggerLabel, ...rest } = props;
      const id = `menu-${current.id}`;
      return (
        <>
          <Button commandFor={id} icon="menu">
            {String(triggerLabel || "More actions")}
          </Button>
          <Menu id={id} {...(runtimeProps(menuFields, rest) as object)}>
            {children}
          </Menu>
        </>
      );
    },
    toCode: ({ triggerLabel, ...rest }, current) => ({
      name: "Menu",
      props: { id: `menu-${current.id}`, ...rest },
      siblingsBefore: [
        `<Button commandFor="menu-${current.id}" icon="menu">${String(triggerLabel || "More actions")}</Button>`,
      ],
      imports: ["Button"],
    }),
  },
  {
    type: "ActionList",
    label: "Action list",
    group: "Actions",
    icon: ListChecks,
    defaults: {
      items: [
        { content: "Import", icon: "import" },
        { content: "Export", icon: "export" },
        { content: "Delete", icon: "delete", destructive: true },
      ],
    },
    render: (props) => (
      <ActionList {...(runtimeProps(actionListFields, props) as object)} />
    ),
  },

  /* Forms ----------------------------------------------------------------- */
  {
    type: "TextField",
    label: "Text field",
    group: "Forms",
    icon: TextCursorInput,
    defaults: { label: "Store name", placeholder: "My store" },
  },
  {
    type: "SearchField",
    label: "Search field",
    group: "Forms",
    icon: Search,
    defaults: { label: "Search", placeholder: "Search products" },
  },
  {
    type: "NumberField",
    label: "Number field",
    group: "Forms",
    icon: Hash,
    defaults: { label: "Quantity", min: 0 },
  },
  {
    type: "EmailField",
    label: "Email field",
    group: "Forms",
    icon: Mail,
    defaults: { label: "Email", placeholder: "you@example.com" },
  },
  {
    type: "PasswordField",
    label: "Password field",
    group: "Forms",
    icon: KeyRound,
    defaults: { label: "Password" },
  },
  {
    type: "UrlField",
    label: "URL field",
    group: "Forms",
    icon: Globe,
    defaults: { label: "Website", placeholder: "https://" },
  },
  {
    type: "MoneyField",
    label: "Money field",
    group: "Forms",
    icon: DollarSign,
    defaults: { label: "Price", currencyCode: "USD" },
  },
  {
    type: "ColorField",
    label: "Color field",
    group: "Forms",
    icon: Palette,
    defaults: { label: "Brand color", value: "#2563eb" },
  },
  {
    type: "DateField",
    label: "Date field",
    group: "Forms",
    icon: CalendarDays,
    defaults: { label: "Start date" },
  },
  {
    type: "DatePicker",
    label: "Date picker",
    group: "Forms",
    icon: CalendarDays,
    defaults: { inline: true },
  },
  {
    type: "Select",
    group: "Forms",
    icon: ChevronDown,
    defaults: {
      label: "Sort by",
      options: [
        { label: "Newest", value: "newest" },
        { label: "Oldest", value: "oldest" },
        { label: "Price", value: "price" },
      ],
    },
  },
  {
    type: "Checkbox",
    group: "Forms",
    icon: Check,
    defaults: { label: "Email me updates" },
  },
  {
    type: "Switch",
    group: "Forms",
    icon: ToggleRight,
    defaults: { label: "Enable feature", checked: true },
  },
  {
    type: "ChoiceList",
    label: "Choice list",
    group: "Forms",
    icon: CircleDot,
    defaults: {
      label: "Shipping",
      choices: [
        { label: "Standard", value: "standard" },
        { label: "Express", value: "express" },
      ],
      selected: ["standard"],
    },
  },
  {
    type: "RangeSlider",
    label: "Range slider",
    group: "Forms",
    icon: SlidersHorizontal,
    defaults: { label: "Discount", value: 20, min: 0, max: 100, output: true },
  },
  {
    type: "DropZone",
    label: "Drop zone",
    group: "Forms",
    icon: Upload,
    defaults: { label: "Product images", accept: "image/*" },
  },
  {
    type: "Combobox",
    group: "Forms",
    icon: ChevronsUpDown,
    defaults: {
      items: ["Snowboards", "Skis", "Accessories"],
      placeholder: "Select a category",
      emptyText: "No categories found.",
    },
    fields: {
      omit: ["value", "defaultValue"],
      extra: [
        {
          name: "placeholder",
          label: "Placeholder",
          section: "Content",
          kind: "text",
          description: "Combobox.Input placeholder.",
        },
        {
          name: "emptyText",
          label: "Empty text",
          section: "Content",
          kind: "text",
          description: "Combobox.Empty content.",
        },
      ],
    },
    render: (props) => {
      const { placeholder, emptyText, ...rest } = runtimeProps(comboboxFields, props);
      const items = Array.isArray(rest.items) ? (rest.items as unknown[]) : [];
      return (
        <Combobox {...(rest as object)} items={items}>
          <Combobox.Input placeholder={placeholder as string | undefined} showClear />
          <Combobox.Content>
            <Combobox.Empty>{String(emptyText ?? "No results.")}</Combobox.Empty>
            <Combobox.List>
              {(item: unknown) => (
                <Combobox.Item key={String(item)} value={item}>
                  {String(item)}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Content>
        </Combobox>
      );
    },
    toCode: ({ placeholder, emptyText, ...rest }) => ({
      name: "Combobox",
      props: rest,
      childLines: [
        `<Combobox.Input placeholder=${JSON.stringify(String(placeholder ?? ""))} showClear />`,
        "<Combobox.Content>",
        `  <Combobox.Empty>${String(emptyText ?? "No results.")}</Combobox.Empty>`,
        "  <Combobox.List>",
        "    {(item) => (",
        "      <Combobox.Item key={item} value={item}>",
        "        {item}",
        "      </Combobox.Item>",
        "    )}",
        "  </Combobox.List>",
        "</Combobox.Content>",
      ],
    }),
  },
  {
    type: "Autocomplete",
    group: "Forms",
    icon: Search,
    defaults: {
      label: "Vendors",
      placeholder: "Search vendors",
      options: [
        { label: "Burton", value: "burton" },
        { label: "Salomon", value: "salomon" },
      ],
    },
  },
  {
    type: "IndexFilters",
    slots: [
      { type: "IndexFilters.SearchField", max: 1 },
      { type: "IndexFilters.Actions", max: 1 },
      { type: "IndexFilters.ViewVisibleActiveFilter" },
    ],
    label: "Index filters",
    group: "Forms",
    icon: Filter,
    container: true,
    defaults: {
      queryPlaceholder: "Search products",
      filters: [
        {
          key: "status",
          label: "Status",
          options: [
            { label: "Active", value: "active" },
            { label: "Draft", value: "draft" },
          ],
        },
      ],
    },
    children: () => [
      node("IndexFilters.SearchField", {}),
      node("IndexFilters.Actions", {}, [
        node("IndexFilters.ViewOptions", { icon: "sort" }, [
          node("IndexFilters.ViewOptionsSort", {
            label: "Sort by",
            options: [
              { label: "Title", value: "title" },
              { label: "Created", value: "created" },
            ],
            value: "title",
          }),
        ]),
      ]),
    ],
  },
  {
    type: "IndexFilters.SearchField",
    label: "Index filters search",
    group: "Forms",
    icon: Search,
    partOf: "IndexFilters",
    parents: ["IndexFilters"],
  },
  {
    type: "IndexFilters.Actions",
    slots: [{ type: "IndexFilters.ViewOptions", max: 1 }],
    label: "Index filters actions",
    group: "Forms",
    icon: Columns3,
    container: "horizontal",
    partOf: "IndexFilters",
    parents: ["IndexFilters"],
  },
  {
    type: "IndexFilters.ViewOptions",
    parents: ["IndexFilters.Actions"],
    slots: [
      { type: "IndexFilters.ViewOptionsSort", max: 1 },
      { type: "IndexFilters.ViewOptionsToggles", max: 1 },
      { type: "IndexFilters.ViewOptionsColumns", max: 1 },
    ],
    label: "Index filters view options",
    group: "Forms",
    icon: ArrowDownUp,
    container: true,
    bare: true,
    partOf: "IndexFilters",
    defaults: { icon: "sort" },
  },
  {
    type: "IndexFilters.ViewOptionsSort",
    label: "View options sort",
    group: "Forms",
    icon: ArrowDownUp,
    partOf: "IndexFilters",
    parents: ["IndexFilters.ViewOptions"],
    defaults: {
      label: "Sort by",
      options: [{ label: "Title", value: "title" }],
      value: "title",
    },
  },
  {
    type: "IndexFilters.ViewOptionsToggles",
    label: "View options toggles",
    group: "Forms",
    icon: ToggleRight,
    partOf: "IndexFilters",
    parents: ["IndexFilters.ViewOptions"],
    defaults: { items: [{ key: "archived", label: "Show archived", checked: false }] },
  },
  {
    type: "IndexFilters.ViewOptionsColumns",
    label: "View options columns",
    group: "Forms",
    icon: Columns3,
    partOf: "IndexFilters",
    parents: ["IndexFilters.ViewOptions"],
    defaults: {
      columns: [
        { key: "title", label: "Title", visible: true },
        { key: "status", label: "Status", visible: true },
      ],
    },
  },
  {
    type: "IndexFilters.ViewVisibleActiveFilter",
    parents: ["IndexFilters", "IndexFilters.Actions"],
    label: "Visible when filtered",
    group: "Forms",
    icon: Eye,
    container: true,
    partOf: "IndexFilters",
    children: () => [
      node("Button", { children: "Export", variant: "tertiary", icon: "export" }),
    ],
  },

  /* Feedback -------------------------------------------------------------- */
  {
    type: "Banner",
    group: "Feedback",
    icon: Info,
    container: true,
    defaults: { heading: "Heads up", tone: "info" },
    children: () => [text("Your changes will publish in a few minutes.")],
  },
  {
    type: "EmptyState",
    label: "Empty state",
    group: "Feedback",
    icon: Inbox,
    container: true,
    defaults: { heading: "No orders yet", action: { content: "Create order" } },
    fields: {
      patch: {
        action: json("{ content: string; url?: string; icon?: string }"),
        secondaryAction: json("{ content: string; url?: string; icon?: string }"),
        icon: { kind: "icon" },
      },
    },
    children: () => [
      text("When customers place orders, they will show up here.", { color: "subdued" }),
    ],
  },
  {
    type: "IconTile",
    label: "Icon tile",
    group: "Feedback",
    icon: Square,
    container: true,
    defaults: { tone: "success" },
    children: () => [node("Icon", { type: "check", tone: "auto" })],
  },
  {
    type: "ProgressBar",
    label: "Progress bar",
    group: "Feedback",
    icon: SlidersHorizontal,
    defaults: { value: 60, max: 100 },
    fields: { patch: { value: { kind: "range", min: 0, max: 100 } } },
  },
  {
    type: "Spinner",
    group: "Feedback",
    icon: Loader,
    defaults: { accessibilityLabel: "Loading" },
  },
  {
    type: "Tooltip",
    group: "Feedback",
    icon: MessageSquare,
    container: true,
    defaults: { content: "Deletes the item permanently" },
    children: () => [node("Button", { children: "Delete", tone: "critical" })],
  },

  /* Media ----------------------------------------------------------------- */
  { type: "Icon", group: "Media", icon: Smile, defaults: { type: "star" } },
  { type: "Avatar", group: "Media", icon: SquareUser, defaults: { initials: "JD" } },
  {
    type: "Thumbnail",
    group: "Media",
    icon: Circle,
    defaults: { src: "https://picsum.photos/seed/corex/200", alt: "Product" },
  },
  {
    type: "Image",
    group: "Media",
    icon: ImageIcon,
    defaults: {
      src: "https://picsum.photos/seed/corex-hero/960/400",
      alt: "Illustration",
      aspectRatio: "16/9",
      objectFit: "cover",
      borderRadius: "base",
    },
  },

  /* Navigation ------------------------------------------------------------ */
  {
    type: "Tabs",
    group: "Navigation",
    icon: Columns3,
    defaults: {
      tabs: [
        { id: "all", label: "All" },
        { id: "active", label: "Active" },
        { id: "draft", label: "Draft" },
      ],
      selected: 0,
    },
  },
  {
    type: "Pagination",
    group: "Navigation",
    icon: ArrowDownUp,
    defaults: { hasPrevious: true, hasNext: true, label: "Page 2 of 5" },
  },
  {
    type: "Navigation",
    slots: [
      { type: "Navigation.Search", max: 1 },
      { type: "Navigation.Section" },
      { type: "Navigation.Item" },
      { type: "Navigation.Label" },
      { type: "Navigation.Footer", max: 1 },
    ],
    group: "Navigation",
    icon: Navigation,
    container: true,
    defaults: { inlineSize: "240px" },
    children: () => [
      node("Navigation.Search", {}),
      node("Navigation.Section", { title: "Settings" }, [
        node("Navigation.Item", {
          id: "general",
          label: "General",
          icon: "settings",
          selected: true,
        }),
        node("Navigation.Item", {
          id: "notifications",
          label: "Notifications",
          icon: "notification",
        }),
        node("Navigation.Label", { children: "Marketing" }),
        node("Navigation.Item", { id: "widgets", label: "Widgets", icon: "view" }),
      ]),
      node("Navigation.Footer", { divider: true }, [
        node("Navigation.Item", { id: "help", label: "Help", icon: "question-circle" }),
      ]),
    ],
  },
  {
    type: "Navigation.Search",
    label: "Navigation search",
    group: "Navigation",
    icon: Search,
    partOf: "Navigation",
    parents: ["Navigation"],
  },
  {
    type: "Navigation.Section",
    slots: [{ type: "Navigation.Item" }, { type: "Navigation.Label" }],
    parents: ["Navigation"],
    label: "Navigation section",
    group: "Navigation",
    icon: Layers,
    container: true,
    partOf: "Navigation",
    defaults: { title: "Section" },
  },
  {
    type: "Navigation.Item",
    parents: ["Navigation", "Navigation.Section", "Navigation.Footer"],
    label: "Navigation item",
    group: "Navigation",
    icon: Link2,
    partOf: "Navigation",
    defaults: { label: "Item", icon: "home" },
  },
  {
    type: "Navigation.Label",
    parents: ["Navigation", "Navigation.Section", "Navigation.Footer"],
    label: "Navigation label",
    group: "Navigation",
    icon: Type,
    partOf: "Navigation",
    defaults: { children: "Label" },
    fields: { textChildren: true },
  },
  {
    type: "Navigation.Footer",
    slots: [{ type: "Navigation.Item" }, { type: "Navigation.Label" }],
    label: "Navigation footer",
    group: "Navigation",
    icon: PanelBottom,
    container: true,
    partOf: "Navigation",
    parents: ["Navigation"],
  },

  /* Overlays -------------------------------------------------------------- */
  {
    type: "Modal",
    canvasLabel: (props) =>
      props.open ? null : "Modal · select it or its content to edit",
    overlay: { openProp: "open" },
    group: "Overlays",
    icon: AppWindow,
    container: true,
    defaults: {
      heading: "Edit product",
      open: false,
      primaryAction: { content: "Save" },
      secondaryActions: [{ content: "Cancel" }],
    },
    children: () => [text("Modal content goes here.")],
  },
  {
    type: "Drawer",
    canvasLabel: (props, current) =>
      hasChild(current, "Drawer.Trigger")
        ? null
        : `Drawer · opens with useDrawer("${drawerId(props, current)}")`,
    toCode: (props, current) => ({
      name: "Drawer",
      props: { ...props, id: drawerId(props, current) },
      ...(hasChild(current, "Drawer.Trigger")
        ? {}
        : {
            siblingsBefore: [
              `{/* Open it from anywhere: useDrawer("${drawerId(props, current)}").open() */}`,
            ],
          }),
    }),
    render: (props, children, current) => (
      <Corex.Drawer
        {...(runtimeProps(drawerFields, props) as object)}
        id={drawerId(props, current)}
      >
        {children}
      </Corex.Drawer>
    ),
    fields: {
      omit: ["open"],
      extra: [
        {
          name: "id",
          label: "Drawer ID",
          section: "Content",
          kind: "text",
          description:
            "Open it from anywhere with useDrawer(id).open() or openDrawer(id).",
        },
      ],
    },
    children: () => [
      node("Drawer.Content", {}, [
        node("Drawer.Header", {}, [
          node("Drawer.Title", { children: "Order details" }),
          node("Drawer.Description", {
            children: "Review the order before fulfilling it.",
          }),
        ]),
        node("Drawer.Body", {}, [text("Drawer body content.")]),
        node("Drawer.Footer", {}, [
          node("Drawer.Close", {}, [node("Button", { children: "Close" })]),
        ]),
      ]),
    ],
    overlay: { openProp: "open", panel: "Drawer.Content" },
    accepts: ["Drawer.Trigger", "Drawer.Content"],
    slots: [
      { type: "Drawer.Trigger", max: 1 },
      { type: "Drawer.Content", max: 1, required: true },
    ],
    group: "Overlays",
    icon: PanelRight,
    container: true,
  },
  {
    type: "Drawer.Trigger",
    maxChildren: 1,
    label: "Drawer trigger",
    group: "Overlays",
    icon: MousePointerClick,
    container: true,
    partOf: "Drawer",
    parents: ["Drawer"],
    children: () => [node("Button", { children: "Open drawer" })],
  },
  {
    type: "Drawer.Content",
    children: () => [node("Drawer.Body", {}, [text("Drawer body content.")])],
    accepts: ["Drawer.Header", "Drawer.Body", "Drawer.PreFooter", "Drawer.Footer"],
    slots: [
      { type: "Drawer.Header", max: 1 },
      { type: "Drawer.Body", max: 1 },
      { type: "Drawer.PreFooter", max: 1 },
      { type: "Drawer.Footer", max: 1 },
    ],
    label: "Drawer content",
    group: "Overlays",
    icon: PanelRight,
    container: true,
    partOf: "Drawer",
    parents: ["Drawer"],
  },
  {
    type: "Drawer.Header",
    children: () => [node("Drawer.Title", { children: "Title" })],
    accepts: ["Drawer.Title", "Drawer.Description"],
    slots: [
      { type: "Drawer.Title", max: 1 },
      { type: "Drawer.Description", max: 1 },
    ],
    parents: ["Drawer.Content"],
    ancestors: ["Drawer"],
    label: "Drawer header",
    group: "Overlays",
    icon: PanelTop,
    container: true,
    partOf: "Drawer",
  },
  {
    type: "Drawer.Title",
    parents: ["Drawer.Header"],
    ancestors: ["Drawer"],
    label: "Drawer title",
    group: "Overlays",
    icon: Heading,
    partOf: "Drawer",
    defaults: { children: "Title" },
    fields: { textChildren: true },
  },
  {
    type: "Drawer.Description",
    parents: ["Drawer.Header"],
    ancestors: ["Drawer"],
    label: "Drawer description",
    group: "Overlays",
    icon: Pilcrow,
    partOf: "Drawer",
    defaults: { children: "Description" },
    fields: { textChildren: true },
  },
  {
    type: "Drawer.Body",
    slots: [{ type: "Drawer.Close", max: 1 }],
    parents: ["Drawer.Content"],
    ancestors: ["Drawer"],
    label: "Drawer body",
    group: "Overlays",
    icon: Square,
    container: true,
    partOf: "Drawer",
  },
  {
    type: "Drawer.PreFooter",
    slots: [{ type: "Drawer.Close", max: 1 }],
    parents: ["Drawer.Content"],
    ancestors: ["Drawer"],
    label: "Drawer pre-footer",
    group: "Overlays",
    icon: PanelBottom,
    container: true,
    partOf: "Drawer",
  },
  {
    type: "Drawer.Footer",
    children: () => [node("Drawer.Close", {}, [node("Button", { children: "Close" })])],
    slots: [{ type: "Drawer.Close", max: 1 }],
    parents: ["Drawer.Content"],
    ancestors: ["Drawer"],
    label: "Drawer footer",
    group: "Overlays",
    icon: PanelBottom,
    container: "horizontal",
    partOf: "Drawer",
  },
  {
    type: "Drawer.Close",
    children: () => [node("Button", { children: "Close" })],
    parents: ["Drawer.Body", "Drawer.PreFooter", "Drawer.Footer"],
    maxChildren: 1,
    container: true,
    ancestors: ["Drawer"],
    label: "Drawer close",
    group: "Overlays",
    icon: MousePointerClick,
    partOf: "Drawer",
  },
  {
    type: "Popover",
    overlay: { openProp: "active", panel: "Popover.Content" },
    slots: [
      { type: "Popover.Trigger", max: 1, required: true },
      { type: "Popover.Content", max: 1, required: true },
    ],
    group: "Overlays",
    icon: MessageSquare,
    container: true,
    accepts: ["Popover.Trigger", "Popover.Content"],
    children: () => [
      node("Popover.Trigger", {}, [
        node("Button", { children: "Filter", icon: "filter" }),
      ]),
      node("Popover.Content", {}, [
        node("Box", { padding: "base" }, [text("Popover content")]),
      ]),
    ],
  },
  {
    type: "Popover.Trigger",
    maxChildren: 1,
    label: "Popover trigger",
    group: "Overlays",
    icon: MousePointerClick,
    container: true,
    partOf: "Popover",
    parents: ["Popover"],
    children: () => [node("Button", { children: "Open" })],
  },
  {
    type: "Popover.Content",
    label: "Popover content",
    group: "Overlays",
    icon: Square,
    container: true,
    partOf: "Popover",
    parents: ["Popover"],
    children: () => [node("Box", { padding: "base" }, [text("Popover content")])],
  },
  {
    type: "FlexPopover",
    overlay: { openProp: "isOpen", panel: "FlexPopover.Content" },
    slots: [
      { type: "FlexPopover.Trigger", max: 1, required: true },
      { type: "FlexPopover.Content", max: 1, required: true },
    ],
    label: "Flex popover",
    group: "Overlays",
    icon: MessageSquare,
    container: true,
    bare: true,
    accepts: ["FlexPopover.Trigger", "FlexPopover.Content"],
    defaults: { position: "bottom-start" },
    children: () => [
      node("FlexPopover.Trigger", {}, [
        node("Button", { children: "Quick filters", variant: "primary" }),
      ]),
      node("FlexPopover.Content", { heading: "Filters" }, [text("Popover content")]),
    ],
  },
  {
    type: "FlexPopover.Trigger",
    maxChildren: 1,
    label: "Flex popover trigger",
    group: "Overlays",
    icon: MousePointerClick,
    container: true,
    partOf: "FlexPopover",
    parents: ["FlexPopover"],
    children: () => [node("Button", { children: "Open" })],
  },
  {
    type: "FlexPopover.Content",
    label: "Flex popover content",
    group: "Overlays",
    icon: Square,
    container: true,
    partOf: "FlexPopover",
    parents: ["FlexPopover"],
    children: () => [text("Popover content")],
  },
  {
    type: "Floating",
    group: "Overlays",
    icon: Layers,
    container: true,
    defaults: { position: "bottom-right", strategy: "absolute" },
    children: () => [node("Badge", { children: "New", tone: "info" })],
  },
  {
    type: "Command",
    accepts: ["Command.Input", "Command.List"],
    slots: [
      { type: "Command.Input", max: 1 },
      { type: "Command.List", max: 1, required: true },
    ],
    group: "Overlays",
    icon: CommandIcon,
    container: true,
    defaults: { label: "Command menu" },
    fields: {
      omit: [
        "sidebarGroups",
        "sidebarGroup",
        "defaultSidebarGroup",
        "sidebarWidth",
        "sidebar",
      ],
    },
    children: () => [
      node("Command.Input", { placeholder: "Type a command or search…" }),
      node("Command.List", {}, [
        node("Command.Empty", { children: "No results found." }),
        node("Command.Group", { heading: "Suggestions" }, [
          node("Command.Item", { value: "calendar" }, [
            node("Icon", { type: "calendar", size: "small" }),
            text("Calendar"),
          ]),
          node("Command.Item", { value: "settings" }, [
            node("Icon", { type: "settings", size: "small" }),
            text("Settings"),
            node("Command.Shortcut", { children: "⌘S" }),
          ]),
        ]),
      ]),
    ],
  },
  {
    type: "Command.Input",
    parents: ["Command", "Command.Dialog"],
    label: "Command input",
    group: "Overlays",
    icon: Search,
    partOf: "Command",
    defaults: { placeholder: "Search…" },
  },
  {
    type: "Command.List",
    slots: [
      { type: "Command.Empty", max: 1 },
      { type: "Command.Group" },
      { type: "Command.Item" },
      { type: "Command.Separator" },
    ],
    parents: ["Command", "Command.Dialog"],
    label: "Command list",
    group: "Overlays",
    icon: List,
    container: true,
    partOf: "Command",
  },
  {
    type: "Command.Empty",
    parents: ["Command.List"],
    label: "Command empty",
    group: "Overlays",
    icon: Inbox,
    partOf: "Command",
    defaults: { children: "No results found." },
    fields: { textChildren: true },
  },
  {
    type: "Command.Group",
    slots: [{ type: "Command.Item" }, { type: "Command.Separator" }],
    parents: ["Command.List"],
    label: "Command group",
    group: "Overlays",
    icon: Layers,
    container: true,
    partOf: "Command",
    defaults: { heading: "Group" },
    fields: { patch: { icon: { kind: "icon" } } },
  },
  {
    type: "Command.Item",
    slots: [{ type: "Command.Shortcut", max: 1 }],
    parents: ["Command.Group", "Command.List"],
    label: "Command item",
    group: "Overlays",
    icon: MousePointerClick,
    container: "horizontal",
    partOf: "Command",
    defaults: { value: "item" },
    children: () => [text("Item")],
  },
  {
    type: "Command.Separator",
    parents: ["Command.List", "Command.Group"],
    label: "Command separator",
    group: "Overlays",
    icon: Minus,
    partOf: "Command",
  },
  {
    type: "Command.Shortcut",
    parents: ["Command.Item"],
    label: "Command shortcut",
    group: "Overlays",
    icon: KeyRound,
    partOf: "Command",
    defaults: { children: "⌘K" },
    fields: { textChildren: true },
  },
  {
    type: "Command.Dialog",
    children: () => [
      node("Command.Input", { placeholder: "Type a command or search…" }),
      node("Command.List", {}, [
        node("Command.Empty", { children: "No results found." }),
      ]),
    ],
    accepts: ["Command.Input", "Command.List"],
    slots: [
      { type: "Command.Input", max: 1 },
      { type: "Command.List", max: 1, required: true },
    ],
    canvasLabel: (props) => (props.open ? null : "Command dialog · select it to edit"),
    overlay: { openProp: "open" },
    label: "Command dialog",
    group: "Overlays",
    icon: CommandIcon,
    container: true,
    defaults: { title: "Command palette", open: false },
    fields: { omit: ["container"] },
  },

  /* App Bridge ------------------------------------------------------------ */
  {
    type: "TitleBar",
    label: "Title bar",
    group: "App Bridge",
    icon: PanelTop,
    container: "horizontal",
    note: EMBEDDED_NOTE,
    defaults: { title: "Products" },
    children: () => [node("Button", { children: "Export", variant: "primary" })],
  },
  {
    type: "SaveBar",
    label: "Save bar",
    group: "App Bridge",
    icon: Save,
    container: "horizontal",
    note: EMBEDDED_NOTE,
    children: () => [
      node("Button", { children: "Save", variant: "primary" }),
      node("Button", { children: "Discard" }),
    ],
  },
  {
    type: "AppNav",
    label: "App nav",
    group: "App Bridge",
    icon: Navigation,
    container: true,
    note: EMBEDDED_NOTE,
    children: () => [
      node("Link", { children: "Home", href: "/app" }),
      node("Link", { children: "Settings", href: "/app/settings" }),
    ],
  },
  {
    type: "AppWindow",
    label: "App window",
    group: "App Bridge",
    icon: AppWindow,
    note: EMBEDDED_NOTE,
    defaults: { src: "/app-window-content.html" },
  },
  {
    type: "Toast",
    group: "App Bridge",
    icon: Bell,
    note: EMBEDDED_NOTE,
    defaults: { content: "Changes saved" },
  },
];

const gridFields = fieldsFor("Grid");
const gridItemFields = fieldsFor("Grid.Item");
const resourceListFields = fieldsFor("ResourceList");
const menuFields = fieldsFor("Menu");
const actionListFields = fieldsFor("ActionList");
const comboboxFields = fieldsFor("Combobox");

const drawerFields = fieldsFor("Drawer");
const indexRowFields = fieldsFor("IndexTable.Row");

/** IndexTable selects rows by `id`; it defaults to one derived from the node. */
const indexRowId = (current: EditorNodeType) =>
  typeof current.props.id === "string" && current.props.id
    ? current.props.id
    : `row-${current.id.slice(-6)}`;

/** An IndexTable.Row of plain text cells, with optional nested rows. */
function indexRow(cells: string[], subRows: DraftNodeType[] = []): DraftNodeType {
  return node("IndexTable.Row", subRows.length ? { defaultExpanded: true } : {}, [
    ...cells.map((value) => node("IndexTable.Cell", {}, [text(value)])),
    ...subRows,
  ]);
}

/** A Drawer needs an id to be opened from code; it defaults to one derived from the node. */
const drawerId = (props: NodePropsType, current: EditorNodeType) =>
  typeof props.id === "string" && props.id ? props.id : `drawer-${current.id.slice(-6)}`;

const hasChild = (current: EditorNodeType, type: string) =>
  Boolean(current.children?.some((child) => child.type === type));

function toNumber(value: unknown) {
  const parsed =
    typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));
  return Number.isFinite(parsed) ? parsed : undefined;
}

export const ROOT_TYPE = "Root";

const rootDefinition: ComponentDefinitionType = {
  type: ROOT_TYPE,
  label: "Canvas",
  group: "Layout",
  icon: WandSparkles,
  description:
    "The page every element is dropped into. It adds no wrapper: top-level elements render as a fragment.",
  isContainer: true,
  axis: "vertical",
  defaultProps: {},
  fields: [],
  render: (_props, children) => <>{children}</>,
};

export const componentDefinitions: ComponentDefinitionType[] = [
  rootDefinition,
  ...entries.map(define),
];

/** Palette shortcuts that drop a pre-configured component. */
export type PresetType = {
  key: string;
  type: string;
  label: string;
  icon: LucideIcon;
  props: NodePropsType;
  group: ComponentGroupType;
};

export const presets: PresetType[] = [
  {
    key: "heading",
    type: "Text",
    label: "Heading",
    icon: Heading,
    group: "Typography",
    props: { children: "Heading", variant: "headingLg", heading: true },
  },
  {
    key: "subdued-text",
    type: "Text",
    label: "Subdued text",
    icon: Type,
    group: "Typography",
    props: { children: "Supporting text", color: "subdued" },
  },
];
