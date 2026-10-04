/**
 * Parses the Corex UI agent skill (`.agents/skills/corex-ui-components/SKILL.md`)
 * into structured API reference data for the docs pages.
 *
 * The skill is the single, hand-curated source of modern props: deprecated and
 * legacy props are listed only as "forbidden", never as part of the API. Reading
 * it here keeps the docs and the AI skill from drifting apart.
 */

export type ReferenceTableType = {
  title: string;
  headers: string[];
  rows: string[][];
};

export type ReferencePropType = {
  name: string;
  type: string;
  description: string;
  required: boolean;
};

export type ReferenceDeprecationType = {
  prop: string;
  note: string;
};

export type ComponentReferenceType = {
  name: string;
  summary: string;
  importCode: string | null;
  props: ReferencePropType[];
  subcomponents: ReferenceTableType | null;
  /** Any other tables in the section, e.g. "Item Fields (`ActionListItemType`)". */
  extraTables: ReferenceTableType[];
  deprecations: ReferenceDeprecationType[];
};

const decodeEntities = (value: string) =>
  value
    .replace(/&#124;/g, "|")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");

const splitRow = (line: string) =>
  line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => decodeEntities(cell.trim()));

const isDividerRow = (line: string) => /^\|\s*:?-{2,}/.test(line.trim());

/** Reads a markdown table starting at `start`; returns rows and the index after it. */
function readTable(lines: string[], start: number) {
  const headers = splitRow(lines[start]!);
  const rows: string[][] = [];
  let i = start + 1;
  while (i < lines.length && lines[i]!.trim().startsWith("|")) {
    if (!isDividerRow(lines[i]!)) rows.push(splitRow(lines[i]!));
    i += 1;
  }
  return { headers, rows, end: i };
}

const stripTicks = (value: string) => value.replace(/^`|`$/g, "");

function parseProps(table: { rows: string[][] }): ReferencePropType[] {
  return table.rows.map(([nameCell = "", typeCell = "", descCell = ""]) => {
    const required = /\(required\)/i.test(nameCell);
    const name = stripTicks(nameCell.replace(/\*\*\(required\)\*\*/i, "").trim());
    return {
      name,
      type: stripTicks(typeCell),
      description: descCell === "—" ? "" : descCell,
      required,
    };
  });
}

function parseSection(name: string, lines: string[]): ComponentReferenceType {
  const ref: ComponentReferenceType = {
    name,
    summary: "",
    importCode: null,
    props: [],
    subcomponents: null,
    extraTables: [],
    deprecations: [],
  };

  let heading = "";
  let i = 0;
  while (i < lines.length) {
    const line = lines[i]!;

    if (line.startsWith("#### ")) {
      heading = line.replace(/^#### /, "").trim();
      i += 1;
      continue;
    }

    // Stop at examples: the playground renders live ones instead.
    if (/^Examples?$/.test(heading)) break;

    if (!heading && !ref.summary && line.trim() && !line.startsWith("```")) {
      ref.summary = line.trim();
    }

    if (!heading && line.startsWith("```") && ref.importCode === null) {
      const body: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i]!.startsWith("```")) {
        body.push(lines[i]!);
        i += 1;
      }
      ref.importCode = body.join("\n").trim();
      i += 1;
      continue;
    }

    if (line.trim().startsWith("|")) {
      const table = readTable(lines, i);
      if (heading === "Modern Props") {
        ref.props = parseProps(table);
      } else if (heading === "Subcomponents") {
        ref.subcomponents = { title: heading, headers: table.headers, rows: table.rows };
      } else if (heading) {
        ref.extraTables.push({ title: heading, headers: table.headers, rows: table.rows });
      }
      i = table.end;
      continue;
    }

    const forbidden = line.match(/^>\s*-\s*`([^`]+)`\s*:?\s*(.*)$/);
    if (forbidden) {
      ref.deprecations.push({ prop: forbidden[1]!, note: forbidden[2]!.trim() });
    }

    i += 1;
  }

  return ref;
}

/** Rows of the skill's global "Critical Deprecation Replacements" table. */
function parseGlobalDeprecations(lines: string[]) {
  const start = lines.findIndex((l) => l.startsWith("## Critical Deprecation Replacements"));
  const map = new Map<string, ReferenceDeprecationType[]>();
  if (start < 0) return map;
  const tableStart = lines.findIndex((l, idx) => idx > start && l.trim().startsWith("|"));
  if (tableStart < 0) return map;
  const { rows } = readTable(lines, tableStart);
  for (const [componentCell = "", propCell = "", replacement = ""] of rows) {
    const component = stripTicks(componentCell).split(/[`\s]/)[0]!;
    const list = map.get(component) ?? [];
    list.push({ prop: propCell, note: replacement });
    map.set(component, list);
  }
  return map;
}

export function parseSkillReference(markdown: string) {
  const lines = markdown.split("\n");
  const apiStart = lines.findIndex((l) => l.startsWith("## Component API"));
  const sections = new Map<string, ComponentReferenceType>();
  const global = parseGlobalDeprecations(lines);

  let currentName: string | null = null;
  let buffer: string[] = [];
  const flush = () => {
    if (currentName) sections.set(currentName, parseSection(currentName, buffer));
  };

  for (let i = Math.max(apiStart, 0); i < lines.length; i += 1) {
    const line = lines[i]!;
    const match = line.match(/^### (\w+)\s*$/);
    if (match) {
      flush();
      currentName = match[1]!;
      buffer = [];
    } else if (line.trim() === "---") {
      flush();
      currentName = null;
      buffer = [];
    } else if (currentName) {
      buffer.push(line);
    }
  }
  flush();

  // Fold in the global replacement table. Section-level notes win on overlap.
  for (const [component, items] of global) {
    const ref = sections.get(component.split(".")[0]!);
    if (!ref) continue;
    const namesIn = (cell: string) =>
      (cell.match(/`([^`]+)`/g) ?? [cell]).map((n) => n.replace(/`/g, "").trim());
    const seen = new Set(ref.deprecations.flatMap((d) => namesIn(d.prop)));
    for (const item of items) {
      if (namesIn(item.prop).some((n) => !seen.has(n))) ref.deprecations.push(item);
    }
  }

  return sections;
}

let cache: Promise<Map<string, ComponentReferenceType>> | null = null;

/** Lazily loads and parses the skill so it stays out of the main bundle. */
export function loadSkillReference() {
  cache ??= import("../../../../.agents/skills/corex-ui-components/SKILL.md?raw").then(
    (mod) => parseSkillReference(mod.default),
  );
  return cache;
}

/** Registry names can carry a qualifier, e.g. "Menu (title bar)". */
export const toReferenceName = (entryName: string) =>
  entryName.replace(/\s*\(.*\)\s*$/, "").trim();
