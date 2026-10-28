import iconsData from "@/data/icons.json";
import { blockDefinitions } from "../blocks";
import {
  canInsert,
  canPlace,
  compact,
  definitions,
  getDefinition,
  hasRoom,
  ROOT_TYPE,
  slotIndex,
} from "../definitions";
import {
  ancestryOf,
  cloneWithIds,
  findNode,
  insertNode,
  moveNode,
  removeNode,
  ROOT_ID,
  updateProps,
} from "../tree";
import type {
  ComponentDefinitionType,
  EditorNodeType,
  FieldType,
  NodePropsType,
} from "../types";

const ICON_NAMES = (iconsData as { name: string }[]).map((icon) => icon.name).join(", ");

const SPACING_TOKENS = [
  "none",
  "small-500",
  "small-400",
  "small-300",
  "small-200",
  "small-100",
  "small",
  "base",
  "large",
  "large-100",
  "large-200",
  "large-300",
  "large-400",
  "large-500",
];
const isSpacingScale = (values: string[]) =>
  SPACING_TOKENS.every((token) => values.includes(token));

/** Compact prop signature, e.g. `tone:"info"|"success"`, `items:json<{ content: string }[]>`. */
function describeField(field: FieldType) {
  switch (field.kind) {
    case "select": {
      const values = field.options.map((option) => option.value);
      const listed = isSpacingScale(values)
        ? "SPACING"
        : values.map((value) => JSON.stringify(value)).join("|");
      return `${field.name}:${listed}${field.allowCustom ? "|string" : ""}`;
    }
    case "boolean":
      return `${field.name}:bool`;
    case "number":
      return `${field.name}:number`;
    case "range":
      return `${field.name}:number(${field.min}-${field.max})`;
    case "icon":
      return `${field.name}:ICON`;
    case "json":
      return `${field.name}:json${field.shape ? `<${field.shape.replace(/\s+/g, " ").slice(0, 160)}>` : ""}`;
    default:
      return `${field.name}:string`;
  }
}

function describeComponent(definition: ComponentDefinitionType) {
  const traits = [
    definition.isContainer ? "container" : "leaf",
    definition.accepts && `children only ${definition.accepts.join("/")}`,
    definition.parents && `only inside ${definition.parents.join("/")}`,
    definition.ancestors && `somewhere inside ${definition.ancestors.join("/")}`,
    definition.maxChildren !== undefined && `holds ${definition.maxChildren} element`,
    definition.slots &&
      `slots in order: ${definition.slots
        .map(
          (slot) =>
            `${slot.type}${slot.max ? ` (max ${slot.max}${slot.required ? ", required" : ""})` : " (many)"}`,
        )
        .join(", ")}`,
  ]
    .filter(Boolean)
    .join(", ");
  const props = definition.fields.map(describeField).join("; ");
  return `- ${definition.type} [${traits}] ${definition.description}${props ? `\n    ${props}` : ""}`;
}

export const SYSTEM_PROMPT = `You are the layout agent of the Corex UI visual editor. Corex UI wraps Shopify Polaris web components, so build clean, realistic Shopify-admin style app screens.

The canvas is a JSON tree. Every node is {"id": string, "type": string, "props": object, "children"?: node[]}. The root node has id "root" and type "${ROOT_TYPE}". It has no props and adds no wrapper (its children render as a fragment, with no gap or padding), so give a page its own top-level container, e.g. a BlockStack with gap and padding, or a Page.

## Components (type [traits] purpose, then props as name:type)
SPACING = ${SPACING_TOKENS.join("|")}. ICON = a Polaris icon name (list below). json<…> props take JSON values of that TypeScript shape.
${definitions
  .filter((definition) => definition.type !== ROOT_TYPE)
  .map(describeComponent)
  .join("\n")}

## Ready-made blocks (leaf nodes, no props; use them whole when the request matches)
${blockDefinitions.map((block) => `- ${block.type} — ${block.label}: ${block.description}`).join("\n")}

## Rules
- Use only the types and props listed above, with values of the listed type. Text content of leaf components (Text, Paragraph, Button, Badge, Link, Tag, List.Item, …) goes in props.children as a string.
- Headings are Text with {"variant":"headingLg","heading":true} (or headingMd/headingSm/headingXl).
- Only containers may have children, and "children only"/"only inside"/"somewhere inside" traits must be respected (e.g. Table > Table.Body > Table.Row > Table.Cell, Layout > Layout.Section, Grid > Grid.Item for spans).
- Compose with Card for grouped content, InlineStack for rows (e.g. a heading with an action), BlockStack for vertical flow and Grid for metric/tile rows. Prefer IndexTable (headings + rows) for data tables.
- Overlays (Modal, Command.Dialog) start with open:false unless the user wants them shown.
- Compound components follow their slots, in order, and parts never appear outside them. A Drawer is Drawer > [Drawer.Trigger] + Drawer.Content > [Header > Title, Description] [Body] [PreFooter] [Footer > Drawer.Close]. Drawer.Trigger and Drawer.Close wrap exactly one element of any kind (a Button, a Card…). Leave out Drawer.Trigger when the drawer is opened from code, and give the Drawer an "id".
- Write real, specific copy for the merchant's use case — never lorem ipsum.
- Icon names must come from: ${ICON_NAMES}.

## Response
Reply with JSON only, shaped as {"message": string, "operations": Operation[]}.
"message" is one or two short sentences telling the user what you changed (or answering a question, with no operations).
Operation is one of:
- {"op": "replace", "nodes": node[]} — replaces everything inside the root. Use for "build/create a page" requests on an empty or unrelated canvas.
- {"op": "insert", "parentId": string, "index"?: number, "node": node} — adds a subtree inside a container (omit index to append).
- {"op": "update", "id": string, "props": object} — merges props into an existing node (set a prop to null to reset it).
- {"op": "remove", "id": string}
- {"op": "move", "id": string, "parentId": string, "index"?: number}
New nodes may omit "id". Refer to existing nodes by the ids in the current canvas. When the user says "this" or "selected", they mean the selected node. Prefer small targeted operations for edits, and "replace" only for new pages.`;

/** Drops empty props so the canvas sent with each prompt stays small. */
function slim(node: EditorNodeType): unknown {
  return {
    id: node.id,
    type: node.type,
    ...(Object.keys(compact(node.props)).length ? { props: compact(node.props) } : {}),
    ...(node.children ? { children: node.children.map(slim) } : {}),
  };
}

export function buildUserTurn(
  root: EditorNodeType,
  selectedId: string | null,
  prompt: string,
) {
  return [
    `Current canvas:\n${JSON.stringify(slim(root))}`,
    `Selected node: ${selectedId ?? "none"}`,
    `Request: ${prompt}`,
  ].join("\n\n");
}

type RawNodeType = { type?: unknown; props?: unknown; children?: unknown };

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Whether `value` fits the field, so a wrong type from the model is dropped, not rendered. */
function fits(field: FieldType, value: unknown) {
  if (value === null) return true; // explicit reset
  switch (field.kind) {
    case "boolean":
      return typeof value === "boolean";
    case "number":
    case "range":
      return typeof value === "number" && Number.isFinite(value);
    case "select":
      return (
        (typeof value === "string" || typeof value === "number") &&
        (field.allowCustom ||
          field.options.some((option) => option.value === String(value)))
      );
    case "json":
      return (
        typeof value === "object" ||
        typeof value === "string" ||
        typeof value === "number"
      );
    default:
      return typeof value === "string" || typeof value === "number";
  }
}

/** Keeps only declared props with values of the right type, so model output cannot inject attributes. */
function cleanProps(
  definition: ComponentDefinitionType,
  props: unknown,
  withDefaults = true,
): NodePropsType {
  const fields = new Map(definition.fields.map((field) => [field.name, field]));
  const input = isObject(props) ? props : {};
  const accepted = Object.entries(input)
    .filter(([key, value]) => {
      const field = fields.get(key);
      return field ? fits(field, value) : false;
    })
    .map(([key, value]) => [key, value === null ? undefined : value]);
  return {
    ...(withDefaults ? definition.defaultProps : {}),
    ...Object.fromEntries(accepted),
  };
}

/** Children that fit their slots (one Drawer.Header…), sorted into slot order. */
function buildChildren(
  definition: ComponentDefinitionType,
  raw: unknown,
  ancestry: string[],
): EditorNodeType[] {
  const kept: EditorNodeType[] = [];
  for (const item of Array.isArray(raw) ? raw : []) {
    const child = toNode(item, ancestry);
    if (child && hasRoom(definition, kept, child.type)) kept.push(child);
  }
  const slots = definition.slots;
  if (!slots || !definition.accepts) return kept;
  const rank = (type: string) => slots.findIndex((slot) => slot.type === type);
  return kept
    .map((child, index) => ({ child, index }))
    .sort((a, b) => rank(a.child.type) - rank(b.child.type) || a.index - b.index)
    .map(({ child }) => child);
}

/** `ancestry` lists types from the canvas root down to the parent the node goes into. */
function toNode(raw: unknown, ancestry: string[]): EditorNodeType | null {
  if (!isObject(raw)) return null;
  const { type, props, children } = raw as RawNodeType;
  const definition = typeof type === "string" ? getDefinition(type) : undefined;
  if (
    !definition ||
    definition.type === ROOT_TYPE ||
    !canPlace(ancestry, definition.type)
  ) {
    return null;
  }
  return cloneWithIds({
    type: definition.type,
    props: cleanProps(definition, props),
    ...(definition.isContainer
      ? {
          children: buildChildren(definition, children, [...ancestry, definition.type]),
        }
      : {}),
  });
}

const indexOf = (value: unknown, parent: EditorNodeType) =>
  typeof value === "number" && Number.isFinite(value)
    ? value
    : (parent.children?.length ?? 0);

export type AgentResultType = {
  message: string;
  root: EditorNodeType;
  applied: number;
  skipped: number;
  /** Last node the agent created or touched, selected so the user sees it. */
  focusId: string | null;
};

function parseJson(text: string): unknown {
  const trimmed = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/, "");
  return JSON.parse(trimmed);
}

export function applyAgentResponse(text: string, start: EditorNodeType): AgentResultType {
  const data = parseJson(text);
  const message =
    isObject(data) && typeof data.message === "string" ? data.message : "Done.";
  const operations =
    isObject(data) && Array.isArray(data.operations) ? data.operations : [];

  let root = start;
  let applied = 0;
  let focusId: string | null = null;

  for (const operation of operations) {
    if (!isObject(operation)) continue;
    const before = root;

    switch (operation.op) {
      case "replace": {
        const nodes = (Array.isArray(operation.nodes) ? operation.nodes : [])
          .map((raw) => toNode(raw, [root.type]))
          .filter((node): node is EditorNodeType => node !== null);
        root = { ...root, children: nodes };
        focusId = null;
        break;
      }
      case "insert": {
        const parentId =
          typeof operation.parentId === "string" ? operation.parentId : ROOT_ID;
        const parent = findNode(root, parentId);
        const node = parent ? toNode(operation.node, ancestryOf(root, parent.id)) : null;
        if (!parent || !node || !canInsert(root, parent.id, node.type)) break;
        root = insertNode(
          root,
          {
            parentId,
            index: slotIndex(parent, node.type, indexOf(operation.index, parent)),
          },
          node,
        );
        focusId = node.id;
        break;
      }
      case "update": {
        const id = typeof operation.id === "string" ? operation.id : "";
        const node = findNode(root, id);
        const definition = node && getDefinition(node.type);
        if (!node || !definition || !isObject(operation.props)) break;
        const props = cleanProps(definition, operation.props, false);
        if (id === ROOT_ID) {
          root = { ...root, props: { ...root.props, ...props } };
        } else {
          root = updateProps(root, id, props);
          focusId = id;
        }
        break;
      }
      case "remove": {
        if (typeof operation.id === "string") root = removeNode(root, operation.id);
        break;
      }
      case "move": {
        const id = typeof operation.id === "string" ? operation.id : "";
        const parentId =
          typeof operation.parentId === "string" ? operation.parentId : ROOT_ID;
        const parent = findNode(root, parentId);
        const moving = findNode(root, id);
        if (!parent || !moving || !canInsert(root, parent.id, moving.type, id)) break;
        root = moveNode(root, id, {
          parentId,
          index: slotIndex(parent, moving.type, indexOf(operation.index, parent), id),
        });
        focusId = id;
        break;
      }
    }

    if (root !== before) applied += 1;
  }

  if (focusId && !findNode(root, focusId)) focusId = null;
  return { message, root, applied, skipped: operations.length - applied, focusId };
}
