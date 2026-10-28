/**
 * Extracts every public component's props from the TypeScript types of
 * `@xco-agency/corex-ui` into `src/pages/editor/generated/component-props.json`,
 * so the editor's settings panel always matches the real prop definitions.
 *
 * Deprecated props, event handlers and DOM plumbing (ref, style, aria-*, …)
 * are left out. Run with `pnpm --filter playground run build:editor-props`.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(here, "../../../packages/corex-ui");
const entry = resolve(packageRoot, "src/index.ts");
const outFile = resolve(here, "../src/pages/editor/generated/component-props.json");

const SKIPPED_PROPS = new Set([
  "key",
  "ref",
  "style",
  "className",
  "id",
  "slot",
  "role",
  "tabIndex",
  "lang",
  "dir",
  "hidden",
  "interestFor",
  "commandFor",
  "command",
  "name",
  "form",
  "autocomplete",
  "autoComplete",
  "as",
  "dangerouslySetInnerHTML",
]);

/** Literal unions holding these are Polaris icon names, edited with the icon picker. */
const ICON_MARKERS = ["adjust", "star", "cart"];
const SPACING_ORDER = [
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
/** CSS-wide keywords and vendor values that csstype adds to every property. */
const CSS_NOISE = /^(-moz-|-webkit-|-ms-)|^(inherit|initial|revert|revert-layer|unset)$/;

/**
 * Legacy numeric spacing tokens ("100", "400") and v12 `bg-*` aliases are kept in
 * the types for migration only; the editor offers modern tokens.
 */
function cleanOptions(options) {
  const tokenScale = options.includes("base") || options.includes("none");
  const kept = options.filter(
    (value) =>
      !CSS_NOISE.test(value) &&
      !(tokenScale && /^\d+$/.test(value) && value !== "0") &&
      !/^bg(-|$)/.test(value),
  );
  const rank = (value) => {
    const index = SPACING_ORDER.indexOf(value);
    return index === -1 ? SPACING_ORDER.length : index;
  };
  return tokenScale ? kept.sort((a, b) => rank(a) - rank(b)) : kept;
}

/** Generated unions (e.g. "base small-200" spacing pairs) only list their single tokens. */
const MAX_OPTIONS = 60;
const LEGACY_ALIAS =
  /^legacy\b|\(legacy polaris prop|\blegacy (polaris )?(alias|prop) (of|for)\b|\balias (mapping to|for) `/i;
const skippedLegacy = [];

function parseConfig() {
  const configPath = resolve(packageRoot, "tsconfig.json");
  const { config } = ts.readConfigFile(configPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(config, ts.sys, packageRoot);
  return { ...parsed.options, types: [], noEmit: true };
}

const program = ts.createProgram([entry], parseConfig());
const checker = program.getTypeChecker();
const source = program.getSourceFile(entry);
const moduleSymbol = checker.getSymbolAtLocation(source);

const jsDocTags = (symbol) => symbol.getJsDocTags(checker);
const isDeprecated = (symbol) =>
  jsDocTags(symbol).some((tag) => tag.name === "deprecated");
const tagText = (tag) => ts.displayPartsToString(tag.text ?? []).trim();

function describe(symbol) {
  return ts
    .displayPartsToString(symbol.getDocumentationComment(checker))
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);
}

function defaultOf(symbol) {
  const tag = jsDocTags(symbol).find((item) => item.name === "default");
  if (!tag) return undefined;
  const raw = tagText(tag)
    .split(/\s+-\s+|\s+\(/)[0]
    .trim();
  if (raw === "true" || raw === "false") return raw === "true";
  if (/^-?\d+(\.\d+)?$/.test(raw)) return Number(raw);
  const quoted = raw.match(/^['"`](.*)['"`]$/);
  return quoted ? quoted[1] : undefined;
}

const flags = (type) => type.getFlags();
const isUndefinedLike = (type) =>
  flags(type) & (ts.TypeFlags.Undefined | ts.TypeFlags.Null | ts.TypeFlags.Void);

function isCallable(type) {
  if (type.getCallSignatures().length) return true;
  return (
    type.isUnion() &&
    type.types.every((member) => isCallable(member) || isUndefinedLike(member))
  );
}

function isReactNode(type) {
  if (flags(type) & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) return true;
  const text = checker.typeToString(type);
  return /ReactNode|ReactElement|JSX\.Element|ComponentChildren/.test(text);
}

/** Props React adds to every element (title, color, draggable, …) are not component API. */
const fromReactTypes = (symbol) =>
  (symbol.getDeclarations() ?? []).every((declaration) =>
    /node_modules[\\/]@types[\\/]react[\\/]/.test(declaration.getSourceFile().fileName),
  );

/** Maps a prop type onto one of the editor's field kinds. */
function classify(type) {
  const members = (type.isUnion() ? type.types : [type]).filter(
    (member) => !isUndefinedLike(member),
  );
  if (!members.length) return null;
  if (members.every((member) => member.getCallSignatures().length)) return null;

  const usable = members.filter((member) => !member.getCallSignatures().length);
  const strings = usable
    .filter((member) => member.isStringLiteral())
    .map((member) => member.value);
  const numbers = usable
    .filter((member) => member.isNumberLiteral())
    .map((member) => member.value);
  const booleans = usable.filter((member) => flags(member) & ts.TypeFlags.BooleanLiteral);
  const openString = usable.some(
    (member) =>
      flags(member) & ts.TypeFlags.String ||
      (member.isIntersection() &&
        member.types.some((part) => flags(part) & ts.TypeFlags.String)) ||
      flags(member) & ts.TypeFlags.TemplateLiteral,
  );
  const openNumber = usable.some((member) => flags(member) & ts.TypeFlags.Number);
  const objects = usable.filter(
    (member) =>
      flags(member) & ts.TypeFlags.Object &&
      !member.isStringLiteral() &&
      !(member.isIntersection && member.isIntersection()),
  );

  // Data arrays such as IndexTable `rows` (ReactNode[][]) are edited as JSON, not as text.
  if (
    usable.some((member) => checker.isArrayType(member) || checker.isTupleType(member))
  ) {
    return { kind: "json" };
  }
  if (usable.some((member) => checker.typeToString(member) === "Date")) return null;
  if (isReactNode(type) && !strings.length) return { kind: "node" };
  if (ICON_MARKERS.every((marker) => strings.includes(marker))) return { kind: "icon" };
  if (booleans.length && booleans.length === usable.length) return { kind: "boolean" };
  if (strings.length) {
    let options = [...new Set(strings)].filter((value) => value !== "");
    const generated = options.length > MAX_OPTIONS;
    if (generated) options = options.filter((value) => !value.includes(" "));
    options = cleanOptions(options);
    return {
      kind: "select",
      options,
      ...(openString || generated || options.length > MAX_OPTIONS
        ? { allowCustom: true }
        : {}),
    };
  }
  if (numbers.length && !openNumber && !openString && numbers.length === usable.length) {
    return { kind: "select", options: numbers.map(String), numeric: true };
  }
  // `number | { xs, md }` responsive values are edited as their plain number.
  if (openNumber && !openString) return { kind: "number" };
  if (openString || openNumber) return { kind: "text" };
  if (booleans.length) return { kind: "boolean" };
  if (objects.length) return { kind: "json" };
  return null;
}

/** First parameter of a component's call signature, for function and forwardRef components. */
function propsTypeOf(symbol) {
  const type = checker.getTypeOfSymbol(symbol);
  const signature = type.getCallSignatures()[0];
  if (!signature || !signature.parameters.length) return null;
  const returns = checker.typeToString(signature.getReturnType());
  if (!/Element|ReactNode|null/.test(returns)) return null;
  return checker.getTypeOfSymbol(signature.parameters[0]);
}

function extract(name, propsType) {
  const props = [];
  /** Required callbacks (RangeSlider `onChange`), stubbed in generated code so it compiles. */
  const requiredHandlers = [];
  let children = null;

  for (const prop of checker.getPropertiesOfType(propsType)) {
    const propName = prop.getName();
    const required = !(prop.flags & ts.SymbolFlags.Optional);
    if (required && /^on[A-Z]/.test(propName)) requiredHandlers.push(propName);
    if (
      SKIPPED_PROPS.has(propName) ||
      /^(aria|data)-/.test(propName) ||
      /^on[A-Z]/.test(propName) ||
      propName.startsWith("_")
    ) {
      continue;
    }
    if (fromReactTypes(prop)) continue;
    if (isDeprecated(prop)) continue;
    // v12 props kept only so old code compiles ("accepted and ignored") are deprecated in all but name.
    // Legacy aliases ("legacy Polaris alias for `src`") duplicate a modern prop.
    const doc = describe(prop);
    if (/accepted and ignored/i.test(doc) || LEGACY_ALIAS.test(doc)) {
      skippedLegacy.push(`${name}.${propName}`);
      continue;
    }
    const type = checker.getTypeOfSymbol(prop);
    if (isCallable(type)) continue;

    if (propName === "children") {
      children = isReactNode(type) ? "node" : "other";
      continue;
    }
    const field = classify(type);
    if (!field) continue;
    const description = describe(prop);
    const defaultValue = defaultOf(prop);
    props.push({
      name: propName,
      ...field,
      ...(required ? { required: true } : {}),
      ...(field.kind === "json" || field.kind === "node"
        ? {
            shape: checker
              .typeToString(type, undefined, ts.TypeFormatFlags.NoTruncation)
              .slice(0, 400),
          }
        : {}),
      ...(description ? { description } : {}),
      ...(defaultValue !== undefined ? { default: defaultValue } : {}),
    });
  }

  // `source`/`url` are v12 spellings of `src`/`href`; offer only the modern one.
  const names = new Set(props.map((prop) => prop.name));
  const modern = { source: "src", url: "href" };
  return {
    name,
    children,
    ...(requiredHandlers.length ? { requiredHandlers } : {}),
    props: props.filter((prop) => !(modern[prop.name] && names.has(modern[prop.name]))),
  };
}

const result = {};
for (const exported of checker.getExportsOfModule(moduleSymbol)) {
  const name = exported.getName();
  if (!/^[A-Z]/.test(name)) continue;
  const symbol =
    exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
  if (!(symbol.flags & (ts.SymbolFlags.Variable | ts.SymbolFlags.Function))) continue;

  const propsType = propsTypeOf(symbol);
  if (propsType) result[name] = extract(name, propsType);

  // Compound members such as `Grid.Item` or `Layout.Section`.
  const ownType = checker.getTypeOfSymbol(symbol);
  for (const member of ownType.getProperties()) {
    const memberName = member.getName();
    if (!/^[A-Z]/.test(memberName)) continue;
    const memberProps = propsTypeOf(member);
    if (memberProps)
      result[`${name}.${memberName}`] = extract(`${name}.${memberName}`, memberProps);
  }
}

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, `${JSON.stringify(result, null, 2)}\n`);
console.log(`[editor-props] ${Object.keys(result).length} components → ${outFile}`);
if (process.argv.includes("--verbose"))
  console.log("Skipped legacy aliases:", skippedLegacy.join(", "));
