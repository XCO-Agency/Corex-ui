import { getDefinition } from "./definitions";
import type { EditorNodeType, NodePropsType } from "./types";

const splitOptions = (value: string) =>
  value
    .split(",")
    .map((label) => label.trim())
    .filter(Boolean)
    .map((label) => ({ label, value: label.toLowerCase().replace(/\s+/g, "-") }));

/**
 * Upgrades canvases saved by the first editor version, which stored text in
 * `content` and had its own Heading/GridItem types, to real component props.
 */
export function migrateNode(node: EditorNodeType): EditorNodeType {
  let { type } = node;
  // The canvas used to render as a padded Box + BlockStack; it now has no props.
  let props: NodePropsType = node.type === "Root" ? {} : { ...node.props };

  if (type === "Heading") {
    type = "Text";
    props = { ...props, heading: true, variant: props.variant || "headingLg" };
  }
  if (type === "GridItem") type = "Grid.Item";
  if (
    (type === "Grid" || type === "InlineGrid") &&
    typeof props.columns === "string" &&
    /^\d+$/.test(props.columns)
  ) {
    props.columns = Number(props.columns);
  }
  if (type === "BlockStack" || type === "InlineStack") delete props.content;

  const definition = getDefinition(type);
  const takesTextChildren = definition?.fields.some((field) => field.name === "children");
  if (typeof props.content === "string" && takesTextChildren) {
    props.children = props.content;
    delete props.content;
  }
  if (type === "Select" && typeof props.options === "string")
    props.options = splitOptions(props.options);
  if (type === "MetricCard" && typeof props.badge === "string") {
    props.badge = props.badge
      ? { value: props.badge, tone: props.tone || undefined }
      : undefined;
    delete props.tone;
  }
  if (
    (type === "Page" || type === "EmptyState") &&
    typeof props.primaryAction === "string"
  ) {
    props.primaryAction = { content: props.primaryAction };
  }
  if (type === "EmptyState" && typeof props.action === "string")
    props.action = { content: props.action };
  let children = node.children?.map(migrateNode);
  if (type === "EmptyState" && typeof props.content === "string") {
    children = [
      ...(children ?? []),
      {
        id: `${node.id}-text`,
        type: "Text",
        props: { children: props.content, color: "subdued" },
      },
    ];
    delete props.content;
  }
  if (type === "Button" && props.fill) {
    props.inlineSize = "fill";
    delete props.fill;
  }

  return {
    ...node,
    type,
    props,
    ...(children ? { children } : {}),
  };
}
