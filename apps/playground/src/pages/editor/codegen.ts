import { compact, getDefinition } from "./definitions";
import { getMeta } from "./meta";
import type { CodeShapeType, EditorNodeType } from "./types";

const INDENT = "  ";

/** JS literal with bare keys, e.g. `{ value: "+12%", tone: "success" }`. */
function literal(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(literal).join(", ")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value).map(
      ([key, item]) =>
        `${/^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key)}: ${literal(item)}`,
    );
    return entries.length ? `{ ${entries.join(", ")} }` : "{}";
  }
  return JSON.stringify(value);
}

function formatValue(value: unknown): string | null {
  if (value === true) return "";
  if (value === false) return null;
  if (typeof value === "string") return JSON.stringify(value);
  return `{${literal(value)}}`;
}

function formatProps(props: CodeShapeType["props"], raw: CodeShapeType["rawProps"] = {}) {
  const attrs = Object.entries(props)
    .map(([key, value]) => {
      const formatted = formatValue(value);
      if (formatted === null) return null;
      return formatted === "" ? key : `${key}=${formatted}`;
    })
    .filter(Boolean);
  for (const [key, expression] of Object.entries(raw))
    attrs.push(`${key}={${expression}}`);
  return attrs.join(" ");
}

const escapeText = (text: string) =>
  /[{}<>]/.test(text) ? `{${JSON.stringify(text)}}` : text;

function shapeOf(node: EditorNodeType): CodeShapeType | null {
  const definition = getDefinition(node.type);
  if (!definition) return null;
  const shape: CodeShapeType = definition.toCode
    ? definition.toCode(node.props, node)
    : (() => {
        const { children, ...rest } = node.props;
        return {
          name: definition.type,
          props: rest,
          text: typeof children === "string" ? children : undefined,
        };
      })();
  // Keep the output compilable: required props are written even when false, and
  // required callbacks get a stub.
  const raw = { ...shape.rawProps };
  for (const field of definition.fields) {
    if (field.required && shape.props[field.name] === false) raw[field.name] = "false";
  }
  for (const handler of getMeta(shape.name)?.requiredHandlers ?? []) {
    raw[handler] ??= "() => {}";
  }
  return { ...shape, props: compact(shape.props), rawProps: raw };
}

const indent = (lines: string[], pad: string) => lines.map((line) => `${pad}${line}`);

type ImportsType = { names: Set<string>; lines: Set<string> };

function renderNode(node: EditorNodeType, depth: number, imports: ImportsType): string {
  const shape = shapeOf(node);
  if (!shape) return "";
  if (shape.importFrom) imports.lines.add(shape.importFrom);
  else imports.names.add(shape.name.split(".")[0]!);
  shape.imports?.forEach((name) => imports.names.add(name));

  const pad = INDENT.repeat(depth);
  const childPad = INDENT.repeat(depth + 1);
  const nested = (node.children ?? [])
    .map((child) => renderNode(child, depth + 1, imports))
    .filter(Boolean);

  // Slot props such as Collapsible `content` hold the child nodes as a fragment.
  const raw = { ...shape.rawProps };
  let children = nested;
  if (shape.childrenProp && nested.length) {
    const fragment = (node.children ?? [])
      .map((child) => renderNode(child, depth + 2, imports))
      .filter(Boolean);
    raw[shape.childrenProp] =
      `\n${childPad}<>\n${fragment.join("\n")}\n${childPad}</>\n${pad}`;
    children = [];
  }
  if (shape.childLines?.length)
    children = [...children, ...indent(shape.childLines, childPad)];

  const attrs = formatProps(shape.props, raw);
  const open = attrs ? `${shape.name} ${attrs}` : shape.name;
  const before = shape.siblingsBefore?.length
    ? `${indent(shape.siblingsBefore, pad).join("\n")}\n`
    : "";

  if (children.length)
    return `${before}${pad}<${open}>\n${children.join("\n")}\n${pad}</${shape.name}>`;
  if (shape.text)
    return `${before}${pad}<${open}>${escapeText(shape.text)}</${shape.name}>`;
  return `${before}${pad}<${open} />`;
}

/** Turns the canvas into a copy-pasteable React component. */
export function generateCode(root: EditorNodeType, componentName = "ComposedPage") {
  const imports: ImportsType = { names: new Set(), lines: new Set() };
  // The canvas itself adds no wrapper, so top-level nodes are returned as a fragment.
  const body = (root.children ?? [])
    .map((child) => renderNode(child, 3, imports))
    .join("\n");

  return [
    ...(imports.names.size
      ? [
          `import { ${[...imports.names].sort().join(", ")} } from "@xco-agency/corex-ui";`,
        ]
      : []),
    ...imports.lines,
    ...(imports.names.size || imports.lines.size ? [""] : []),
    `export function ${componentName}() {`,
    "  return (",
    "    <>",
    ...(body ? [body] : []),
    "    </>",
    "  );",
    "}",
    "",
  ].join("\n");
}
