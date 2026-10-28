import { getDefinition, ROOT_TYPE } from "./definitions";
import { cloneWithIds, ROOT_ID } from "./tree";
import type { DraftNodeType, EditorNodeType } from "./types";

export type TemplateType = {
  id: string;
  name: string;
  description: string;
  nodes: DraftNodeType[];
};

const text = (children: string, props: Record<string, unknown> = {}): DraftNodeType => ({
  type: "Text",
  props: { children, ...props },
});
const heading = (children: string): DraftNodeType => ({
  type: "Text",
  props: { children, variant: "headingLg", heading: true },
});

const templateContents: TemplateType[] = [
  {
    id: "blank",
    name: "Blank canvas",
    description: "Start from an empty page.",
    nodes: [],
  },
  {
    id: "dashboard",
    name: "Analytics dashboard",
    description: "Header, KPI grid and a recent activity card.",
    nodes: [
      {
        type: "InlineStack",
        props: {
          gap: "base",
          alignItems: "center",
          justifyContent: "space-between",
          wrap: true,
        },
        children: [
          {
            type: "BlockStack",
            props: { gap: "small-300" },
            children: [
              heading("Overview"),
              text("Performance for the last 30 days", { color: "subdued" }),
            ],
          },
          {
            type: "Button",
            props: { children: "Export report", variant: "secondary", icon: "export" },
          },
        ],
      },
      {
        type: "Grid",
        props: { columns: "3", gap: "base" },
        children: [
          {
            type: "MetricCard",
            props: {
              title: "Total sales",
              value: "$48,210",
              badge: { value: "+12%", tone: "success" },
            },
          },
          {
            type: "MetricCard",
            props: {
              title: "Orders",
              value: "1,284",
              badge: { value: "+4%", tone: "success" },
            },
          },
          {
            type: "MetricCard",
            props: {
              title: "Returns",
              value: "32",
              badge: { value: "-2%", tone: "critical" },
            },
          },
        ],
      },
      {
        type: "Card",
        props: { heading: "Recent activity", gap: "small", padding: "base" },
        children: [
          {
            type: "InlineStack",
            props: {
              gap: "small",
              alignItems: "center",
              justifyContent: "space-between",
            },
            children: [
              text("Order #1042 was fulfilled"),
              { type: "Badge", props: { children: "Fulfilled", tone: "success" } },
            ],
          },
          { type: "Divider", props: {} },
          {
            type: "InlineStack",
            props: {
              gap: "small",
              alignItems: "center",
              justifyContent: "space-between",
            },
            children: [
              text("Order #1041 is awaiting payment"),
              { type: "Badge", props: { children: "Pending", tone: "warning" } },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "settings",
    name: "Settings form",
    description: "Two cards with fields and a save action.",
    nodes: [
      heading("General settings"),
      {
        type: "Banner",
        props: { heading: "Changes apply to every storefront", tone: "info" },
        children: [text("Review your settings before saving.")],
      },
      {
        type: "Card",
        props: { heading: "Store details", gap: "base", padding: "base" },
        children: [
          { type: "TextField", props: { label: "Store name", placeholder: "My store" } },
          {
            type: "TextField",
            props: { label: "Contact email", helpText: "We use this to reach you." },
          },
          {
            type: "Select",
            props: {
              label: "Currency",
              options: [
                { label: "USD", value: "usd" },
                { label: "EUR", value: "eur" },
                { label: "GBP", value: "gbp" },
              ],
            },
          },
        ],
      },
      {
        type: "Card",
        props: { heading: "Notifications", gap: "base", padding: "base" },
        children: [
          { type: "Switch", props: { label: "Order confirmations", checked: true } },
          {
            type: "Checkbox",
            props: { label: "Send me a weekly summary", checked: false },
          },
        ],
      },
      {
        type: "InlineStack",
        props: { gap: "small", justifyContent: "end" },
        children: [
          { type: "Button", props: { children: "Cancel", variant: "secondary" } },
          { type: "Button", props: { children: "Save", variant: "primary" } },
        ],
      },
    ],
  },
];

/** The canvas adds no wrapper, so each template brings its own padded stack. */
export const templates: TemplateType[] = templateContents.map((template) => ({
  ...template,
  nodes: template.nodes.length
    ? [
        {
          type: "BlockStack",
          props: { gap: "base", padding: "large-100" },
          children: template.nodes,
        },
      ]
    : [],
}));

export function createRoot(nodes: DraftNodeType[] = []): EditorNodeType {
  return {
    id: ROOT_ID,
    type: ROOT_TYPE,
    props: { ...getDefinition(ROOT_TYPE)!.defaultProps },
    children: nodes.map(cloneWithIds),
  };
}
