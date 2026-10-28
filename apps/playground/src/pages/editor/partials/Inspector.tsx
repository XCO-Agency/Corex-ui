import * as React from "react";
import {
  ArrowUp,
  ChevronRight,
  CircleHelp,
  Copy,
  Info,
  MousePointer2,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import iconsData from "@/data/icons.json";
import { cn } from "@/lib/utils";
import { getDefinition } from "../definitions";
import { useEditor } from "../store";
import { findParent, ROOT_ID } from "../tree";
import { FIELD_SECTIONS, type FieldSectionType, type FieldType } from "../types";

const ICON_NAMES = (iconsData as { name: string }[]).map((icon) => icon.name);
const ICON_LIST_ID = "cx-editor-icons";

const controlClass =
  "h-8 w-full min-w-0 rounded-md border border-input bg-transparent px-2 text-xs outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30";

const placeholderOf = (field: FieldType) =>
  field.defaultValue !== undefined && typeof field.defaultValue !== "object"
    ? String(field.defaultValue)
    : undefined;

/** JSON props keep a local draft so half-typed JSON never reaches the canvas. */
function JsonControl({
  value,
  shape,
  onChange,
}: {
  value: unknown;
  shape?: string;
  onChange: (value: unknown) => void;
}) {
  const serialized =
    value === undefined || value === "" ? "" : JSON.stringify(value, null, 2);
  const [draft, setDraft] = React.useState(serialized);
  const [error, setError] = React.useState<string | null>(null);
  const focused = React.useRef(false);

  React.useEffect(() => {
    if (!focused.current) setDraft(serialized);
  }, [serialized]);

  return (
    <div className="flex flex-col gap-1">
      <textarea
        spellCheck={false}
        rows={Math.min(10, Math.max(3, draft.split("\n").length))}
        className={cn(
          controlClass,
          "h-auto resize-y py-1.5 font-mono text-[11px] leading-relaxed",
          error && "border-destructive focus-visible:ring-destructive/30",
        )}
        placeholder={shape ? `e.g. ${shape}` : "JSON value"}
        value={draft}
        onFocus={() => (focused.current = true)}
        onBlur={() => {
          focused.current = false;
          if (!error) setDraft(serialized);
        }}
        onChange={(event) => {
          const next = event.target.value;
          setDraft(next);
          if (!next.trim()) {
            setError(null);
            onChange("");
            return;
          }
          try {
            onChange(JSON.parse(next));
            setError(null);
          } catch (parseError) {
            setError(parseError instanceof Error ? parseError.message : "Invalid JSON");
          }
        }}
      />
      {error ? (
        <span className="text-[10px] text-destructive">{error}</span>
      ) : (
        shape && (
          <span className="line-clamp-2 font-mono text-[10px] text-muted-foreground/80">
            {shape}
          </span>
        )
      )}
    </div>
  );
}

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: FieldType;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const placeholder = placeholderOf(field);
  const textValue =
    typeof value === "string" || typeof value === "number" ? String(value) : "";

  switch (field.kind) {
    case "text":
      return (
        <Input
          className="h-8 text-xs"
          value={textValue}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      );
    case "icon":
      return (
        <Input
          className="h-8 text-xs"
          list={ICON_LIST_ID}
          value={textValue}
          placeholder={placeholder ?? "e.g. star, cart, settings"}
          onChange={(event) => onChange(event.target.value)}
        />
      );
    case "textarea":
      return (
        <textarea
          className={cn(controlClass, "h-auto min-h-16 resize-y py-1.5 leading-relaxed")}
          value={textValue}
          placeholder={placeholder}
          rows={3}
          onChange={(event) => onChange(event.target.value)}
        />
      );
    case "number":
      return (
        <Input
          type="number"
          className="h-8 text-xs"
          value={textValue}
          placeholder={placeholder}
          onChange={(event) =>
            onChange(event.target.value === "" ? "" : Number(event.target.value))
          }
        />
      );
    case "json":
      return <JsonControl value={value} shape={field.shape} onChange={onChange} />;
    case "boolean": {
      const checked = value === undefined ? field.defaultValue === true : Boolean(value);
      return (
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={field.label}
          onClick={() => onChange(!checked)}
          className={cn(
            "relative h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors",
            checked ? "bg-blue-600" : "bg-muted-foreground/25",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow transition-transform",
              checked && "translate-x-4",
            )}
          />
        </button>
      );
    }
    case "select": {
      const current = textValue;
      if (field.allowCustom) {
        // Tokens plus free values (e.g. "240px"), so a datalist instead of a closed select.
        const listId = `cx-options-${field.name}`;
        return (
          <>
            <Input
              className="h-8 text-xs"
              list={listId}
              value={current}
              placeholder={placeholder ?? "default"}
              onChange={(event) => onChange(event.target.value)}
            />
            <datalist id={listId}>
              {field.options.map((option) => (
                <option key={option.value} value={option.value} />
              ))}
            </datalist>
          </>
        );
      }
      const short =
        field.options.length <= 4 &&
        field.options.every((option) => option.label.length <= 8);
      if (short) {
        const active = current || (placeholder ?? "");
        return (
          <div className="flex rounded-md bg-muted p-0.5">
            {field.options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(current === option.value ? "" : option.value)}
                className={cn(
                  "h-7 min-w-0 flex-1 cursor-pointer truncate rounded px-1.5 text-[11px] font-medium transition-colors",
                  active === option.value
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        );
      }
      return (
        <select
          className={controlClass}
          value={current}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">{placeholder ? `default (${placeholder})` : "default"}</option>
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }
  }
}

const isSet = (value: unknown) => value !== undefined && value !== "" && value !== null;

function FieldRow({
  field,
  value,
  onChange,
}: {
  field: FieldType;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const inline = field.kind === "boolean";
  return (
    <div
      className={cn(
        "group/field flex gap-1.5",
        inline ? "items-center justify-between" : "flex-col",
      )}
    >
      <div className="flex min-w-0 items-center gap-1">
        <span className="truncate text-[11px] font-medium text-muted-foreground">
          {field.label}
        </span>
        {field.description && (
          <Tooltip>
            <TooltipTrigger
              render={
                <span className="flex shrink-0 cursor-help text-muted-foreground/50 hover:text-muted-foreground" />
              }
            >
              <CircleHelp className="size-3" />
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-64 text-[11px] leading-snug">
              <span className="font-mono">{field.name}</span> — {field.description}
            </TooltipContent>
          </Tooltip>
        )}
        {isSet(value) && (
          <button
            type="button"
            title="Reset to default"
            onClick={() => onChange(undefined)}
            className="ml-auto flex shrink-0 cursor-pointer text-muted-foreground/0 group-hover/field:text-muted-foreground/70 hover:!text-foreground"
          >
            <RotateCcw className="size-3" />
          </button>
        )}
      </div>
      <FieldControl field={field} value={value} onChange={onChange} />
    </div>
  );
}

function Section({
  title,
  count,
  defaultOpen,
  forceOpen,
  children,
}: {
  title: FieldSectionType;
  count: number;
  defaultOpen: boolean;
  forceOpen: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const expanded = open || forceOpen;
  return (
    <section className="border-b border-border/60 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 w-full cursor-pointer items-center gap-1.5 px-3 text-[11px] font-semibold tracking-wide text-foreground/80 uppercase hover:text-foreground"
      >
        <ChevronRight
          className={cn("size-3 transition-transform", expanded && "rotate-90")}
        />
        {title}
        <span className="ml-auto font-mono text-[10px] font-normal text-muted-foreground">
          {count}
        </span>
      </button>
      {expanded && <div className="flex flex-col gap-3.5 px-3 pb-4">{children}</div>}
    </section>
  );
}

export function Inspector() {
  const { state, dispatch, selected } = useEditor();
  const [query, setQuery] = React.useState("");
  const node = selected ?? state.root;
  const definition = getDefinition(node.type);
  const isRoot = node.id === ROOT_ID;
  const parent = isRoot ? null : findParent(state.root, node.id);

  if (!definition) {
    return (
      <p className="p-4 text-xs text-muted-foreground">
        Unknown component “{node.type}”.
      </p>
    );
  }

  const needle = query.trim().toLowerCase();
  const visible = definition.fields.filter(
    (field) =>
      !needle ||
      field.name.toLowerCase().includes(needle) ||
      field.label.toLowerCase().includes(needle),
  );
  const sections = FIELD_SECTIONS.map((section) => ({
    section,
    fields: visible.filter((field) => field.section === section),
  })).filter(({ fields }) => fields.length);
  const setCount = definition.fields.filter((field) =>
    isSet(node.props[field.name]),
  ).length;

  const update = (name: string, value: unknown) =>
    dispatch({ type: "update", id: node.id, props: { [name]: value } });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <datalist id={ICON_LIST_ID}>
        {ICON_NAMES.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>

      <div className="flex items-start gap-2.5 border-b border-border/70 p-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-700 dark:text-blue-300">
          <definition.icon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{definition.label}</p>
          <p className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">
            {definition.description}
          </p>
        </div>
        {!isRoot && (
          <div className="flex shrink-0 gap-0.5">
            {parent && parent.id !== ROOT_ID && (
              <Button
                variant="ghost"
                size="icon-xs"
                title="Select parent"
                onClick={() => dispatch({ type: "select", id: parent.id })}
              >
                <ArrowUp />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon-xs"
              title="Duplicate"
              onClick={() => dispatch({ type: "duplicate", id: node.id })}
            >
              <Copy />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              title="Delete"
              className="hover:text-destructive"
              onClick={() => dispatch({ type: "remove", id: node.id })}
            >
              <Trash2 />
            </Button>
          </div>
        )}
      </div>

      {definition.note && (
        <div className="mx-3 mt-3 flex gap-2 rounded-lg bg-amber-500/10 p-2.5 text-[11px] leading-snug text-amber-800 dark:text-amber-300">
          <Info className="mt-px size-3.5 shrink-0" />
          {definition.note}
        </div>
      )}

      {definition.fields.length > 6 && (
        <div className="relative px-3 pt-3">
          <Search className="pointer-events-none absolute top-1/2 left-5.5 mt-1.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${definition.fields.length} props${setCount ? ` · ${setCount} set` : ""}`}
            className="h-8 pl-7 text-xs"
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto pt-1">
        {sections.length ? (
          sections.map(({ section, fields }, index) => (
            <Section
              key={`${node.id}-${section}`}
              title={section}
              count={fields.length}
              defaultOpen={
                index === 0 ||
                section === "Content" ||
                fields.some((field) => isSet(node.props[field.name]))
              }
              forceOpen={Boolean(needle)}
            >
              {fields.map((field) => (
                <FieldRow
                  key={field.name}
                  field={field}
                  value={node.props[field.name]}
                  onChange={(value) => update(field.name, value)}
                />
              ))}
            </Section>
          ))
        ) : (
          <p className="p-3 text-xs leading-relaxed text-muted-foreground">
            {needle
              ? `No props match “${query}”.`
              : isRoot
                ? "The canvas has no settings: it adds no wrapper, so the export returns your elements in a fragment. Use a Block stack or Page for spacing."
                : definition.group === "Blocks"
                  ? "Blocks render as ready-made sections. Compose around them with stacks, cards and grids, or ask the AI agent to build alongside."
                  : "This component has no settings."}
          </p>
        )}

        {isRoot && (
          <div className="m-3 flex flex-col items-center gap-2 rounded-lg border border-dashed border-border p-4 text-center">
            <MousePointer2 className="size-4 text-muted-foreground" />
            <p className="text-[11px] leading-snug text-muted-foreground">
              Select an element on the canvas or in Layers to edit its props.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
