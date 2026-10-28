import * as React from "react";
import { ChevronRight, Plus, Trash2 } from "lucide-react";
import { Box, Divider, SearchField, Tabs } from "@xco-agency/corex-ui";
import { cn } from "@/lib/utils";
import { blockGroups } from "../blocks";
import {
  canInsert,
  definitions,
  getDefinition,
  GROUP_ORDER,
  presets,
  openSlots,
  ROOT_TYPE,
  slotIndex,
} from "../definitions";
import { endDrag, getDragPayload, startDrag } from "../dnd";
import { partLabel } from "../parts";
import { createNode, useEditor } from "../store";
import { findNode, findParent, isDescendant, pathTo, ROOT_ID } from "../tree";
import type {
  ComponentDefinitionType,
  DropTargetType,
  EditorNodeType,
  NodePropsType,
  SlotType,
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
  // Parts (Drawer content, Table row…) are not listed: they are added in place
  // from Layers or the inspector, where the editor knows where they fit.
  const groups = GROUP_ORDER.map((group) => {
    const items: PaletteItemType[] = [
      ...definitions
        .filter(
          (definition) =>
            definition.group === group &&
            definition.type !== ROOT_TYPE &&
            !definition.partOf &&
            matches(definition, query),
        )
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
    return { group, items };
  }).filter(({ items }) => items.length);

  return (
    <>
      <SearchInput value={query} onChange={setQuery} placeholder="Search components" />
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {groups.map(({ group, items }) => (
          <section key={group} className="pt-2">
            <h3 className="flex items-center justify-between px-0.5 pb-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              {group}
              <span className="font-mono text-[10px] font-normal normal-case">
                {items.length}
              </span>
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {items.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  draggable
                  title={`${item.description} Drag onto the canvas or click to add.`}
                  onDragStart={(event) =>
                    startDrag(event, {
                      kind: "new",
                      type: item.type,
                      ...(item.props ? { props: item.props } : {}),
                    })
                  }
                  onDragEnd={endDrag}
                  onClick={() => addNode(item.type, item.props)}
                  className="group flex min-w-0 cursor-grab flex-col items-start gap-2 rounded-lg border border-border/70 bg-background p-2.5 text-left transition-colors hover:border-foreground/25 hover:bg-muted/40 active:cursor-grabbing"
                >
                  <item.icon className="size-4 text-muted-foreground group-hover:text-foreground" />
                  <span className="w-full truncate text-xs leading-none font-medium">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
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

type LayerContextType = {
  drop: LayerDropType | null;
  setDrop: (drop: LayerDropType | null) => void;
  /** Compound component around the selection; only its slots show "+ Add" rows. */
  focusId: string | null;
};

const LayerContext = React.createContext<LayerContextType>({
  drop: null,
  setDrop: () => undefined,
  focusId: null,
});

/** The nearest compound root (Drawer, Table…) at or above `id`: it has slots and is no part. */
function compoundRootOf(root: EditorNodeType, id: string | null) {
  if (!id) return null;
  const path = pathTo(root, id);
  for (let index = path.length - 1; index >= 0; index -= 1) {
    const definition = getDefinition(findNode(root, path[index]!)!.type);
    if (definition?.slots && !definition.partOf) return path[index]!;
  }
  return null;
}

/** A missing slot, e.g. "+ Header" under Drawer content, inserted at its slot position. */
function SlotRow({
  parent,
  slot,
  depth,
}: {
  parent: EditorNodeType;
  slot: SlotType;
  depth: number;
}) {
  const { dispatch } = useEditor();
  const definition = getDefinition(slot.type);
  if (!definition) return null;
  const Icon = definition.icon;
  return (
    <button
      type="button"
      title={`Add ${definition.label}`}
      onClick={() => {
        const created = createNode(slot.type);
        if (!created) return;
        dispatch({
          type: "insert",
          target: {
            parentId: parent.id,
            index: slotIndex(parent, slot.type, parent.children?.length ?? 0),
          },
          node: created,
        });
      }}
      className={cn(
        "flex h-7 w-full cursor-pointer items-center gap-1.5 rounded-md border border-dashed pr-2 text-left text-xs transition-colors",
        slot.required
          ? "border-amber-500/50 text-amber-700 hover:bg-amber-500/10 dark:text-amber-300"
          : "border-transparent text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground",
      )}
      style={{ paddingLeft: 6 + depth * 14 }}
    >
      <Plus className="size-3 shrink-0" />
      <Icon className="size-3.5 shrink-0 opacity-60" />
      <span className="truncate">{partLabel(definition)}</span>
      {slot.required && <span className="ml-auto text-[10px] font-medium">Required</span>}
    </button>
  );
}

function LayerRow({ node, depth }: { node: EditorNodeType; depth: number }) {
  const { state, dispatch } = useEditor();
  const { drop, setDrop, focusId } = React.useContext(LayerContext);
  const [open, setOpen] = React.useState(true);
  const definition = getDefinition(node.type);
  const isRoot = node.id === ROOT_ID;
  const isContainer = Boolean(definition?.isContainer);
  const parent = isRoot ? null : findParent(state.root, node.id);
  const parentSlot = parent
    ? getDefinition(parent.type)?.slots?.find((slot) => slot.type === node.type)
    : undefined;
  const Icon = definition?.icon;
  const name = ["children", "heading", "label", "title", "content"]
    .map((key) => node.props[key])
    .find((value): value is string => typeof value === "string" && value !== "");

  const inFocus =
    focusId !== null &&
    (focusId === node.id || isDescendant(state.root, focusId, node.id));
  const slots = inFocus && open ? openSlots(state.root, node) : [];
  const hasChildren = Boolean(node.children?.length) || slots.length > 0;

  const targetFor = (
    position: LayerDropType["position"],
    type: string,
    movingId?: string,
  ): DropTargetType | null => {
    const parentNode = position === "inside" ? node : findParent(state.root, node.id);
    if (!parentNode) return null;
    const own = parentNode.children!.findIndex((child) => child.id === node.id);
    const requested =
      position === "inside"
        ? (node.children?.length ?? 0)
        : position === "after"
          ? own + 1
          : own;
    return {
      parentId: parentNode.id,
      index: slotIndex(parentNode, type, requested, movingId),
    };
  };

  const draggedType = () => {
    const payload = getDragPayload();
    if (!payload) return null;
    return payload.kind === "new" ? payload.type : findNode(state.root, payload.id)?.type;
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    const payload = getDragPayload();
    const type = draggedType();
    if (!payload || !type) return;
    const movingId = payload.kind === "move" ? payload.id : undefined;
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
    const target = targetFor(position, type, movingId);
    if (
      !target ||
      !canInsert(state.root, target.parentId, type, movingId) ||
      (movingId &&
        (movingId === target.parentId ||
          isDescendant(state.root, movingId, target.parentId)))
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
    const type = draggedType();
    const movingId = payload?.kind === "move" ? payload.id : undefined;
    const target =
      drop?.id === node.id && type ? targetFor(drop.position, type, movingId) : null;
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

  // Missing slots sit where they would be inserted, between the existing parts.
  const children = node.children ?? [];
  const rows: React.ReactNode[] = [];
  const slotsAt = (index: number) =>
    slots
      .filter(
        (slot) =>
          slot.max !== undefined && slotIndex(node, slot.type, children.length) === index,
      )
      .map((slot) => (
        <SlotRow key={`slot-${slot.type}`} parent={node} slot={slot} depth={depth + 1} />
      ));
  if (open) {
    children.forEach((child, index) => {
      rows.push(...slotsAt(index));
      rows.push(<LayerRow key={child.id} node={child} depth={depth + 1} />);
    });
    rows.push(...slotsAt(children.length));
    // Repeatable parts (rows, items) are offered once, after the existing ones, and
    // only on the selected node so a long table does not fill with "+ Row" lines.
    const repeatable =
      state.selectedId === node.id
        ? slots.filter((entry) => entry.max === undefined)
        : [];
    for (const slot of repeatable) {
      rows.push(
        <SlotRow key={`slot-${slot.type}`} parent={node} slot={slot} depth={depth + 1} />,
      );
    }
  }

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
          "group relative flex h-7 cursor-pointer items-center gap-1.5 rounded-md pr-1 text-xs select-none",
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
        <span className="shrink-0 font-medium">
          {definition
            ? definition.partOf
              ? partLabel(definition)
              : definition.label
            : node.type}
        </span>
        {name && <span className="min-w-0 truncate text-muted-foreground">{name}</span>}
        {!isRoot && !parentSlot?.required && (
          <button
            type="button"
            title="Remove"
            aria-label={`Remove ${definition?.label ?? node.type}`}
            onClick={(event) => {
              event.stopPropagation();
              dispatch({ type: "remove", id: node.id });
            }}
            className="ml-auto flex size-5 shrink-0 cursor-pointer items-center justify-center rounded text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-3" />
          </button>
        )}
      </div>
      {rows}
    </>
  );
}

function LayersTab() {
  const { state } = useEditor();
  const [drop, setDrop] = React.useState<LayerDropType | null>(null);
  const focusId = compoundRootOf(state.root, state.selectedId);
  const context = React.useMemo(() => ({ drop, setDrop, focusId }), [drop, focusId]);
  return (
    <LayerContext.Provider value={context}>
      <div
        className="flex-1 overflow-y-auto p-2"
        onDragLeave={(event) =>
          !event.currentTarget.contains(event.relatedTarget as Node) && setDrop(null)
        }
      >
        <LayerRow node={state.root} depth={0} />
        {!state.root.children?.length && (
          <p className="px-3 pt-4 text-xs text-muted-foreground">
            Layers appear here as you add components.
          </p>
        )}
      </div>
    </LayerContext.Provider>
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
    <aside className="flex flex-1 min-h-0 flex-col bg-background rounded-xl border shadow-xs">
      <Box padding="small-300">
        {/* Remount on change: a Clickable's background attribute goes stale on update. */}
        <Tabs
          key={tab}
          tabs={TABS}
          value={tab}
          onChange={(id) => onTabChange(id as LeftTabType)}
        />
      </Box>
      <Divider />
      {tab === "add" && <ComponentsTab />}
      {tab === "blocks" && <BlocksTab />}
      {tab === "layers" && <LayersTab />}
    </aside>
  );
}
