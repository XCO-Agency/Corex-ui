import * as React from "react";
import { definitions, getDefinition } from "../definitions";
import {
  closestNodeId,
  computeDrop,
  endDrag,
  getDragPayload,
  onDragEnded,
  startDrag,
  type DropPreviewType,
} from "../dnd";
import { createNode, useEditor } from "../store";
import { findNode, pathTo, ROOT_ID } from "../tree";
import type { ComponentDefinitionType, EditorNodeType } from "../types";
import { CanvasOverlay } from "./CanvasOverlay";
import { useFrame } from "./EditorFrame";

/** Keeps one broken node (e.g. a bad prop from the AI agent) from blanking the canvas. */
class NodeBoundary extends React.Component<
  { label: string; children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidUpdate(previous: { children: React.ReactNode }) {
    if (previous.children !== this.props.children && this.state.error) {
      this.setState({ error: null });
    }
  }
  render() {
    if (this.state.error) {
      return (
        <div data-cx-broken>
          {this.props.label} failed to render: {this.state.error.message}
        </div>
      );
    }
    return this.props.children;
  }
}

type CanvasNodePropsType = {
  node: EditorNodeType;
  parentId: string | null;
  editing: boolean;
};

/**
 * Anything else was injected by a parent that clones its child (Popover.Trigger
 * adds `commandFor`, Drawer.Trigger adds `onClick`), so it is passed through.
 */
type InjectedPropsType = Record<string, unknown>;

/** Types an overlay opens as its panel (Drawer.Content…), from the catalog. */
const PANEL_TYPES = new Set(
  definitions.flatMap((definition) =>
    definition.overlay?.panel ? [definition.overlay.panel] : [],
  ),
);

/** Overlays (Drawer, Modal…) forced open because their content is selected. */
const OpenOverlaysContext = React.createContext<ReadonlySet<string>>(new Set());

/**
 * Ids of overlays on the path to the selection: a Drawer opens when its
 * Drawer.Content (or anything inside) is selected, a Modal when it or its
 * content is, so the user sees what they are editing.
 */
function openOverlayIds(root: EditorNodeType, selectedId: string | null) {
  if (!selectedId) return "";
  const path = pathTo(root, selectedId).map((id) => findNode(root, id)!);
  return path
    .filter((node, index) => {
      const overlay = getDefinition(node.type)?.overlay;
      if (!overlay) return false;
      return overlay.panel ? path[index + 1]?.type === overlay.panel : true;
    })
    .map((node) => node.id)
    .join(" ");
}

const CanvasNode = React.memo(
  React.forwardRef<unknown, CanvasNodePropsType>(function CanvasNode(allProps, ref) {
    const { node, parentId, editing, ...injected } = allProps as CanvasNodePropsType &
      InjectedPropsType;
    const forcedOpen = React.useContext(OpenOverlaysContext).has(node.id);
    const definition = getDefinition(node.type);
    if (!definition) {
      return editing ? (
        <div data-cx-node={node.id} data-cx-parent={parentId ?? undefined}>
          <div data-cx-broken>Unknown component “{node.type}”</div>
        </div>
      ) : null;
    }

    const isRoot = node.id === ROOT_ID;
    const children = nodeChildren(node, definition, editing, isRoot);

    let props = Object.keys(injected).length
      ? { ...node.props, ...injected }
      : node.props;
    if (forcedOpen && definition.overlay) {
      props = { ...props, [definition.overlay.openProp]: true };
    }
    // Overlay panels portal out of their wrapper; the tag maps clicks and outlines back.
    if (editing && PANEL_TYPES.has(node.type))
      props = { ...props, "data-cx-panel": node.id };
    let element = definition.render(props, children, node);
    // Only a real ref is forwarded; React can hand the frozen legacy-context `{}` here.
    const forwarded =
      typeof ref === "function" ||
      (ref !== null && typeof ref === "object" && "current" in ref)
        ? ref
        : null;
    if (forwarded && React.isValidElement(element) && element.type !== React.Fragment) {
      element = React.cloneElement(element as React.ReactElement<{ ref?: unknown }>, {
        ref,
      });
    }
    const rendered = <NodeBoundary label={definition.label}>{element}</NodeBoundary>;
    if (!editing) return rendered;

    const chip = forcedOpen ? null : definition.canvasLabel?.(node.props, node);
    return (
      <div
        data-cx-node={node.id}
        data-cx-parent={parentId ?? undefined}
        draggable={!isRoot}
        style={definition.wrapperStyle?.(node.props)}
      >
        {chip && <div data-cx-chip>{chip}</div>}
        {rendered}
      </div>
    );
  }),
);

/**
 * What a container renders as its children. Under a `bareChildren` parent
 * (IndexTable, Layout, Table…) the children are the real component elements,
 * not canvas nodes: those parents read their children's type and props
 * (`colSpan`, a row's `id`), so a wrapper element in between would hide them.
 */
function nodeChildren(
  node: EditorNodeType,
  definition: ComponentDefinitionType,
  editing: boolean,
  isRoot = false,
): React.ReactNode {
  if (!definition.isContainer) return null;
  const kids = node.children ?? [];
  if (kids.length) {
    const nested = kids.map((child) =>
      definition.bareChildren ? (
        renderBare(child, editing)
      ) : (
        <CanvasNode key={child.id} node={child} parentId={node.id} editing={editing} />
      ),
    );
    // A lone child stays an element: triggers check `isValidElement(children)`.
    return nested.length === 1 ? nested[0] : nested;
  }
  if (!editing || definition.bareChildren) return null;
  return (
    <div data-cx-empty data-cx-root-empty={isRoot ? "" : undefined}>
      {isRoot ? (
        <>
          <strong>Drag components or blocks here</strong>
          <span>…or describe a page to the AI agent</span>
        </>
      ) : (
        "Drop components here"
      )}
    </div>
  );
}

/** A bare child rendered in place: no wrapper, keyed by its node, selected from Layers. */
function renderBare(node: EditorNodeType, editing: boolean): React.ReactNode {
  const definition = getDefinition(node.type);
  if (!definition) return null;
  const props =
    editing && PANEL_TYPES.has(node.type)
      ? { ...node.props, "data-cx-panel": node.id }
      : node.props;
  const element = definition.render(props, nodeChildren(node, definition, editing), node);
  return React.isValidElement(element) ? (
    React.cloneElement(element, { key: node.id })
  ) : (
    <React.Fragment key={node.id}>{element}</React.Fragment>
  );
}

const samePreview = (a: DropPreviewType | null, b: DropPreviewType | null) =>
  a === b ||
  (a !== null &&
    b !== null &&
    a.target.parentId === b.target.parentId &&
    a.target.index === b.target.index &&
    a.indicator.top === b.indicator.top &&
    a.indicator.left === b.indicator.left);

export type CanvasPropsType = { editing: boolean };

export function Canvas({ editing }: CanvasPropsType) {
  const frame = useFrame();
  const { state, dispatch } = useEditor();
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const [preview, setPreview] = React.useState<DropPreviewType | null>(null);
  const rootRef = React.useRef(state.root);
  rootRef.current = state.root;

  React.useEffect(() => onDragEnded(() => setPreview(null)), []);

  // On <html> so the edit-mode CSS also covers overlays portaled to <body>.
  React.useEffect(() => {
    frame?.doc.documentElement.toggleAttribute("data-cx-edit", editing);
  }, [frame, editing]);

  const openKey = editing ? openOverlayIds(state.root, state.selectedId) : "";
  const openOverlays = React.useMemo(
    () => new Set(openKey ? openKey.split(" ") : []),
    [openKey],
  );

  if (!frame) return null;
  const { doc } = frame;

  if (!editing) return <CanvasNode node={state.root} parentId={null} editing={false} />;

  const handleDragOver = (event: React.DragEvent) => {
    if (!getDragPayload()) return;
    const next = computeDrop(
      doc,
      rootRef.current,
      event.target,
      event.clientX,
      event.clientY,
    );
    if (!next) {
      event.dataTransfer.dropEffect = "none";
      setPreview(null);
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = getDragPayload()!.kind === "new" ? "copy" : "move";
    setPreview((current) => (samePreview(current, next) ? current : next));
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const payload = getDragPayload();
    const drop = computeDrop(
      doc,
      rootRef.current,
      event.target,
      event.clientX,
      event.clientY,
    );
    endDrag();
    if (!payload || !drop) return;
    if (payload.kind === "move") {
      dispatch({ type: "move", id: payload.id, target: drop.target });
      return;
    }
    const node = createNode(payload.type, payload.props);
    if (node) dispatch({ type: "insert", target: drop.target, node });
  };

  return (
    <div
      data-cx-editing=""
      onClick={(event) => {
        const id = closestNodeId(event.target);
        dispatch({ type: "select", id: id && id !== ROOT_ID ? id : null });
      }}
      onMouseOver={(event) => {
        const id = closestNodeId(event.target);
        setHoveredId(id && id !== ROOT_ID ? id : null);
      }}
      onMouseLeave={() => setHoveredId(null)}
      onDragStart={(event) => {
        const id = closestNodeId(event.target);
        if (!id || id === ROOT_ID) return;
        event.stopPropagation();
        startDrag(event, { kind: "move", id });
        setHoveredId(null);
      }}
      onDragEnd={() => endDrag()}
      // dragenter must be cancelled too, or fast drags never become valid drops.
      onDragEnter={handleDragOver}
      onDragOver={handleDragOver}
      onDragLeave={(event) => {
        if (!event.relatedTarget) setPreview(null);
      }}
      onDrop={handleDrop}
    >
      <OpenOverlaysContext.Provider value={openOverlays}>
        <CanvasNode node={state.root} parentId={null} editing />
      </OpenOverlaysContext.Provider>
      <CanvasOverlay doc={doc} hoveredId={hoveredId} preview={preview} />
    </div>
  );
}
