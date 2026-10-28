import * as React from "react";
import { ChevronRight } from "lucide-react";
import { Box, Divider, SearchField, Tabs } from "@xco-agency/corex-ui";
import { cn } from "@/lib/utils";
import { blockGroups } from "../blocks";
import {
  canPlace,
  definitions,
  getDefinition,
  GROUP_ORDER,
  presets,
  ROOT_TYPE,
} from "../definitions";
import { endDrag, getDragPayload, startDrag } from "../dnd";
import { createNode, useEditor } from "../store";
import { ancestryOf, findNode, findParent, isDescendant, ROOT_ID } from "../tree";
import type {
  ComponentDefinitionType,
  DropTargetType,
  EditorNodeType,
  NodePropsType,
} from "../types";

export type LeftTabType = "add" | "blocks" | "layers";

const matches = (definition: ComponentDefinitionType, query: string) =>
  !query ||
  `${definition.label} ${definition.type} ${definition.description}`
    .toLowerCase()
    .includes(query.toLowerCase());

function useAddNode() {
  const { dispatch, insertionTarget } = useEditor();
  return (type: string, props?: NodePropsType) => {
    const node = createNode(type, props);
    if (node) dispatch({ type: "insert", target: insertionTarget(type), node });
  };
}

function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <Box paddingInline="small" paddingBlockStart="small" paddingBlockEnd="small-200">
      <SearchField
        label={placeholder}
        labelAccessibilityVisibility="exclusive"
        value={value}
        placeholder={placeholder}
        onChange={(next) => onChange(next)}
      />
    </Box>
  );
}

type PaletteItemType = {
  key: string;
  type: string;
  label: string;
  icon: ComponentDefinitionType["icon"];
  description: string;
  props?: NodePropsType;
};

const tile = (definition: ComponentDefinitionType): PaletteItemType => ({
  key: definition.type,
  type: definition.type,
  label: definition.label,
  icon: definition.icon,
  description: definition.description,
});

function ComponentsTab() {
  const [query, setQuery] = React.useState("");
  const addNode = useAddNode();
  const groups = GROUP_ORDER.map((group) => {
    const inGroup = definitions.filter(
      (definition) => definition.group === group && definition.type !== ROOT_TYPE,
    );
    const items: PaletteItemType[] = [
      ...inGroup
        .filter((definition) => !definition.partOf && matches(definition, query))
        .map(tile),
      ...presets
        .filter(
          (preset) =>
            preset.group === group &&
            (!query || preset.label.toLowerCase().includes(query.toLowerCase())),
        )
        .map((preset) => ({
          ...preset,
          description: `${preset.label} preset of ${preset.type}.`,
        })),
    ];
    // Parts (Grid item, Table row…) sit under their parent as compact chips.
    const parts = inGroup
      .filter((definition) => definition.partOf && matches(definition, query))
      .map(tile);
    return { group, items, parts };
  }).filter(({ items, parts }) => items.length || parts.length);

  const dragProps = (item: PaletteItemType) => ({
    draggable: true,
    title: `${item.description} Drag onto the canvas or click to add.`,
    onDragStart: (event: React.DragEvent) =>
      startDrag(event, {
        kind: "new",
        type: item.type,
        ...(item.props ? { props: item.props } : {}),
      }),
    onDragEnd: endDrag,
    onClick: () => addNode(item.type, item.props),
  });

  return (
    <>
      <SearchInput value={query} onChange={setQuery} placeholder="Search components" />
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {groups.map(({ group, items, parts }) => (
          <section key={group} className="pt-2">
            <h3 className="flex items-center justify-between px-0.5 pb-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              {group}
              <span className="font-mono text-[10px] font-normal normal-case">
                {items.length + parts.length}
              </span>
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {items.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  {...dragProps(item)}
                  className="group flex min-w-0 cursor-grab flex-col items-start gap-2 rounded-lg border border-border/70 bg-background p-2.5 text-left transition-colors hover:border-foreground/25 hover:bg-muted/40 active:cursor-grabbing"
                >
                  <item.icon className="size-4 text-muted-foreground group-hover:text-foreground" />
                  <span className="w-full truncate text-xs leading-none font-medium">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
            {parts.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {parts.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    {...dragProps(item)}
                    className="flex h-6 cursor-grab items-center gap-1 rounded-md border border-dashed border-border px-1.5 text-[11px] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground active:cursor-grabbing"
                  >
                    <item.icon className="size-3" />
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </section>
        ))}
        {!groups.length && (
          <p className="px-1 pt-6 text-center text-xs text-muted-foreground">
            No components match “{query}”.
          </p>
        )}
      </div>
    </>
  );
}

function BlocksTab() {
  const [query, setQuery] = React.useState("");
  const addNode = useAddNode();
  const groups = blockGroups
    .map(({ category, items }) => ({
      category,
      items: items.filter((item) => matches(item, query)),
    }))
    .filter(({ items }) => items.length);

  return (
    <>
      <SearchInput value={query} onChange={setQuery} placeholder="Search blocks" />
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {groups.map(({ category, items }) => (
          <section key={category} className="pt-2">
            <h3 className="px-0.5 pb-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              {category}
            </h3>
            <div className="flex flex-col gap-1.5">
              {items.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  draggable
                  onDragStart={(event) =>
                    startDrag(event, { kind: "new", type: item.type })
                  }
                  onDragEnd={endDrag}
                  onClick={() => addNode(item.type)}
                  className="flex cursor-grab items-start gap-2.5 rounded-lg border border-border/70 bg-background p-2.5 text-left transition-colors hover:border-foreground/25 hover:bg-muted/40 active:cursor-grabbing"
                >
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <item.icon className="size-3.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-medium">{item.label}</span>
                    <span className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

type LayerDropType = { id: string; position: "before" | "after" | "inside" };

function LayerRow({
  node,
  depth,
  drop,
  setDrop,
}: {
  node: EditorNodeType;
  depth: number;
  drop: LayerDropType | null;
  setDrop: (drop: LayerDropType | null) => void;
}) {
  const { state, dispatch } = useEditor();
  const [open, setOpen] = React.useState(true);
  const definition = getDefinition(node.type);
  const isRoot = node.id === ROOT_ID;
  const isContainer = Boolean(definition?.isContainer);
  const hasChildren = Boolean(node.children?.length);
  const Icon = definition?.icon;
  const name = ["children", "heading", "label", "title", "content"]
    .map((key) => node.props[key])
    .find((value): value is string => typeof value === "string" && value !== "");

  const targetFor = (position: LayerDropType["position"]): DropTargetType | null => {
    if (position === "inside")
      return { parentId: node.id, index: node.children?.length ?? 0 };
    const parent = findParent(state.root, node.id);
    if (!parent) return null;
    const index = parent.children!.findIndex((child) => child.id === node.id);
    return { parentId: parent.id, index: position === "after" ? index + 1 : index };
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    const payload = getDragPayload();
    if (!payload) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientY - rect.top) / rect.height;
    const position: LayerDropType["position"] = isRoot
      ? "inside"
      : isContainer
        ? ratio < 0.25
          ? "before"
          : ratio > 0.75
            ? "after"
            : "inside"
        : ratio < 0.5
          ? "before"
          : "after";
    const target = targetFor(position);
    const draggedType =
      payload.kind === "new" ? payload.type : findNode(state.root, payload.id)?.type;
    const targetParent = target ? findNode(state.root, target.parentId) : null;
    if (
      !target ||
      !draggedType ||
      !targetParent ||
      !canPlace(ancestryOf(state.root, targetParent.id), draggedType) ||
      (payload.kind === "move" &&
        (payload.id === target.parentId ||
          isDescendant(state.root, payload.id, target.parentId)))
    ) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (drop?.id !== node.id || drop.position !== position)
      setDrop({ id: node.id, position });
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const payload = getDragPayload();
    const target = drop?.id === node.id ? targetFor(drop.position) : null;
    endDrag();
    setDrop(null);
    if (!payload || !target) return;
    if (payload.kind === "move") dispatch({ type: "move", id: payload.id, target });
    else {
      const created = createNode(payload.type, payload.props);
      if (created) dispatch({ type: "insert", target, node: created });
    }
  };

  const dropHere = drop?.id === node.id ? drop.position : null;
  const selected = state.selectedId === node.id || (isRoot && !state.selectedId);

  return (
    <>
      <div
        draggable={!isRoot}
        onDragStart={(event) => {
          event.stopPropagation();
          startDrag(event, { kind: "move", id: node.id });
        }}
        onDragEnd={() => {
          endDrag();
          setDrop(null);
        }}
        onDragEnter={handleDragOver}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => dispatch({ type: "select", id: isRoot ? null : node.id })}
        className={cn(
          "group relative flex h-7 cursor-pointer items-center gap-1.5 rounded-md pr-2 text-xs select-none",
          selected
            ? "bg-blue-600/10 text-blue-700 dark:text-blue-300"
            : "hover:bg-muted/70",
          dropHere === "inside" && "ring-1 ring-blue-600 ring-inset",
        )}
        style={{ paddingLeft: 6 + depth * 14 }}
      >
        {dropHere === "before" && (
          <span className="absolute -top-px right-1 left-2 h-0.5 rounded bg-blue-600" />
        )}
        {dropHere === "after" && (
          <span className="absolute right-1 -bottom-px left-2 h-0.5 rounded bg-blue-600" />
        )}
        <span
          className={cn(
            "flex size-4 items-center justify-center",
            !hasChildren && "invisible",
          )}
          onClick={(event) => {
            event.stopPropagation();
            setOpen((value) => !value);
          }}
        >
          <ChevronRight
            className={cn("size-3 transition-transform", open && "rotate-90")}
          />
        </span>
        {Icon && <Icon className="size-3.5 shrink-0 opacity-70" />}
        <span className="shrink-0 font-medium">{definition?.label ?? node.type}</span>
        {name && <span className="truncate text-muted-foreground">{name}</span>}
      </div>
      {open &&
        node.children?.map((child) => (
          <LayerRow
            key={child.id}
            node={child}
            depth={depth + 1}
            drop={drop}
            setDrop={setDrop}
          />
        ))}
    </>
  );
}

function LayersTab() {
  const { state } = useEditor();
  const [drop, setDrop] = React.useState<LayerDropType | null>(null);
  return (
    <div
      className="flex-1 overflow-y-auto p-2"
      onDragLeave={(event) =>
        !event.currentTarget.contains(event.relatedTarget as Node) && setDrop(null)
      }
    >
      <LayerRow node={state.root} depth={0} drop={drop} setDrop={setDrop} />
      {!state.root.children?.length && (
        <p className="px-3 pt-4 text-xs text-muted-foreground">
          Layers appear here as you add components.
        </p>
      )}
    </div>
  );
}

const TABS: { id: LeftTabType; label: string }[] = [
  { id: "add", label: "Components" },
  { id: "blocks", label: "Blocks" },
  { id: "layers", label: "Layers" },
];

export function LeftPanel({
  tab,
  onTabChange,
}: {
  tab: LeftTabType;
  onTabChange: (tab: LeftTabType) => void;
}) {
  return (
    <aside className="flex h-full min-h-0 flex-col bg-background">
      <Box paddingInline="small" paddingBlockStart="small-200">
        <Tabs tabs={TABS} value={tab} onChange={(id) => onTabChange(id as LeftTabType)} />
      </Box>
      <Divider />
      {tab === "add" && <ComponentsTab />}
      {tab === "blocks" && <BlocksTab />}
      {tab === "layers" && <LayersTab />}
    </aside>
  );
}
