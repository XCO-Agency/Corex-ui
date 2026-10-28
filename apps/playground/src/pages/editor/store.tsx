import * as React from "react";
import { canPlace, getDefinition } from "./definitions";
import { migrateNode } from "./migrate";
import { createRoot } from "./templates";
import {
  ancestryOf,
  cloneWithIds,
  duplicateNode,
  findNode,
  findParent,
  insertNode,
  moveNode,
  removeNode,
  ROOT_ID,
  updateProps,
} from "./tree";
import type { DropTargetType, EditorNodeType, NodePropsType } from "./types";

const STORAGE_KEY = "corex-editor:document";
const HISTORY_LIMIT = 100;
/** Keystrokes in the same field within this window collapse into one undo step. */
const COALESCE_MS = 800;

export type EditorStateType = {
  root: EditorNodeType;
  selectedId: string | null;
  past: EditorNodeType[];
  future: EditorNodeType[];
  lastEdit: { id: string; at: number } | null;
};

export type EditorActionType =
  | { type: "insert"; target: DropTargetType; node: EditorNodeType }
  | { type: "move"; id: string; target: DropTargetType }
  | { type: "update"; id: string; props: NodePropsType }
  | { type: "remove"; id: string }
  | { type: "duplicate"; id: string }
  | { type: "replace"; root: EditorNodeType; selectedId?: string | null }
  | { type: "select"; id: string | null }
  | { type: "undo" }
  | { type: "redo" };

function commit(
  state: EditorStateType,
  root: EditorNodeType,
  selectedId = state.selectedId,
  lastEdit: EditorStateType["lastEdit"] = null,
): EditorStateType {
  if (root === state.root) return { ...state, selectedId };
  return {
    root,
    selectedId,
    past: [...state.past, state.root].slice(-HISTORY_LIMIT),
    future: [],
    lastEdit,
  };
}

function reducer(state: EditorStateType, action: EditorActionType): EditorStateType {
  switch (action.type) {
    case "insert":
      return commit(
        state,
        insertNode(state.root, action.target, action.node),
        action.node.id,
      );
    case "move":
      return commit(state, moveNode(state.root, action.id, action.target), action.id);
    case "update": {
      const root = updateProps(state.root, action.id, action.props);
      const now = Date.now();
      const coalesce =
        state.lastEdit?.id === action.id && now - state.lastEdit.at < COALESCE_MS;
      if (coalesce) return { ...state, root, lastEdit: { id: action.id, at: now } };
      return commit(state, root, state.selectedId, { id: action.id, at: now });
    }
    case "remove": {
      const removed = findNode(state.root, action.id);
      const parentId = findParent(state.root, action.id)?.id ?? null;
      const selectionGone = Boolean(
        removed && state.selectedId && findNode(removed, state.selectedId),
      );
      const selectedId = selectionGone
        ? parentId === ROOT_ID
          ? null
          : parentId
        : state.selectedId;
      return commit(state, removeNode(state.root, action.id), selectedId);
    }
    case "duplicate": {
      const { root, id } = duplicateNode(state.root, action.id);
      return commit(state, root, id ?? state.selectedId);
    }
    case "replace": {
      const selectedId =
        action.selectedId !== undefined
          ? action.selectedId
          : state.selectedId && findNode(action.root, state.selectedId)
            ? state.selectedId
            : null;
      return commit(state, action.root, selectedId);
    }
    case "select":
      return state.selectedId === action.id
        ? state
        : { ...state, selectedId: action.id, lastEdit: null };
    case "undo": {
      const previous = state.past.at(-1);
      if (!previous) return state;
      return {
        root: previous,
        selectedId:
          state.selectedId && findNode(previous, state.selectedId)
            ? state.selectedId
            : null,
        past: state.past.slice(0, -1),
        future: [state.root, ...state.future],
        lastEdit: null,
      };
    }
    case "redo": {
      const [next, ...future] = state.future;
      if (!next) return state;
      return {
        root: next,
        selectedId:
          state.selectedId && findNode(next, state.selectedId) ? state.selectedId : null,
        past: [...state.past, state.root],
        future,
        lastEdit: null,
      };
    }
  }
}

function loadRoot(): EditorNodeType {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as EditorNodeType;
      if (parsed?.id === ROOT_ID && Array.isArray(parsed.children))
        return migrateNode(parsed);
    }
  } catch {
    // Storage can be blocked or hold an old shape; fall back to a fresh canvas.
  }
  return createRoot();
}

/** Builds a node from the palette with its defaults and starter children. */
export function createNode(type: string, props?: NodePropsType): EditorNodeType | null {
  const definition = getDefinition(type);
  if (!definition) return null;
  return cloneWithIds({
    type,
    props: { ...definition.defaultProps, ...props },
    ...(definition.isContainer ? { children: definition.defaultChildren?.() ?? [] } : {}),
  });
}

type EditorContextType = {
  state: EditorStateType;
  dispatch: React.Dispatch<EditorActionType>;
  selected: EditorNodeType | null;
  /**
   * Where a click-to-add of `type` lands: inside the selected container when it
   * accepts the type, otherwise right after the selection, otherwise at the end.
   */
  insertionTarget: (type: string) => DropTargetType;
};

const EditorContext = React.createContext<EditorContextType | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, undefined, () => ({
    root: loadRoot(),
    selectedId: null,
    past: [],
    future: [],
    lastEdit: null,
  }));

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.root));
      } catch {
        // Autosave is a convenience; a full or blocked storage must not break editing.
      }
    }, 300);
    return () => window.clearTimeout(timer);
  }, [state.root]);

  const selected = state.selectedId ? findNode(state.root, state.selectedId) : null;

  const insertionTarget = React.useCallback(
    (type: string): DropTargetType => {
      const end = { parentId: ROOT_ID, index: state.root.children?.length ?? 0 };
      let node = state.selectedId ? findNode(state.root, state.selectedId) : null;
      // Walk up from the selection to the first container that can hold `type`.
      while (node) {
        if (canPlace(ancestryOf(state.root, node.id), type)) {
          return { parentId: node.id, index: node.children?.length ?? 0 };
        }
        const parent = findParent(state.root, node.id);
        if (parent && canPlace(ancestryOf(state.root, parent.id), type)) {
          return {
            parentId: parent.id,
            index: parent.children!.findIndex((child) => child.id === node!.id) + 1,
          };
        }
        node = parent;
      }
      return end;
    },
    [state.root, state.selectedId],
  );

  const value = React.useMemo(
    () => ({ state, dispatch, selected, insertionTarget }),
    [state, selected, insertionTarget],
  );

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditor() {
  const context = React.useContext(EditorContext);
  if (!context) throw new Error("useEditor must be used inside <EditorProvider>");
  return context;
}
