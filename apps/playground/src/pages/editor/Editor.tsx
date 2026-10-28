import * as React from "react";
import { Box, Divider, Tabs } from "@xco-agency/corex-ui";
import { cn } from "@/lib/utils";
import { EditorProvider, useEditor } from "./store";
import { usePolarisRuntime } from "./usePolarisRuntime";
import { getDefinition } from "./definitions";
import { cloneWithIds, findNode } from "./tree";
import type { EditorNodeType, ViewportType } from "./types";
import { AiPanel } from "./partials/AiPanel";
import { Canvas } from "./partials/Canvas";
import { EditorFrame } from "./partials/EditorFrame";
import { Inspector } from "./partials/Inspector";
import { LeftPanel, type LeftTabType } from "./partials/LeftPanel";
import { Toolbar, VIEWPORTS } from "./partials/Toolbar";

const isTyping = (target: EventTarget | null) => {
  const element = target as HTMLElement | null;
  if (!element || typeof element.closest !== "function") return false;
  return Boolean(element.closest("input, textarea, select, [contenteditable='true']"));
};

/** Canvas shortcuts, bound to both the app window and the canvas iframe. */
function useShortcuts(windows: (Window | null)[], editing: boolean) {
  const { state, dispatch, insertionTarget } = useEditor();
  const clipboard = React.useRef<EditorNodeType | null>(null);
  const latest = React.useRef({ state, insertionTarget, editing });
  latest.current = { state, insertionTarget, editing };

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isTyping(event.target)) return;
      const { state, insertionTarget, editing } = latest.current;
      const mod = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();
      const selectedId = state.selectedId;

      if (mod && key === "z") {
        event.preventDefault();
        dispatch({ type: event.shiftKey ? "redo" : "undo" });
      } else if (mod && key === "y") {
        event.preventDefault();
        dispatch({ type: "redo" });
      } else if (!editing) {
        return;
      } else if ((key === "delete" || key === "backspace") && selectedId) {
        event.preventDefault();
        dispatch({ type: "remove", id: selectedId });
      } else if (mod && key === "d" && selectedId) {
        event.preventDefault();
        dispatch({ type: "duplicate", id: selectedId });
      } else if (mod && key === "c" && selectedId) {
        clipboard.current = findNode(state.root, selectedId);
      } else if (mod && key === "v" && clipboard.current) {
        event.preventDefault();
        dispatch({
          type: "insert",
          target: insertionTarget(clipboard.current.type),
          node: cloneWithIds(clipboard.current),
        });
      } else if (key === "escape") {
        dispatch({ type: "select", id: null });
      }
    };

    const targets = windows.filter((win): win is Window => Boolean(win));
    targets.forEach((win) => win.addEventListener("keydown", onKeyDown));
    return () => targets.forEach((win) => win.removeEventListener("keydown", onKeyDown));
  }, [dispatch, ...windows]); // eslint-disable-line react-hooks/exhaustive-deps
}

type RightTabType = "design" | "ai";

function EditorWorkspace() {
  const { state } = useEditor();
  const [viewport, setViewport] = React.useState<ViewportType>("desktop");
  const [editing, setEditing] = React.useState(true);
  const [leftOpen, setLeftOpen] = React.useState(true);
  const [rightOpen, setRightOpen] = React.useState(true);
  const [leftTab, setLeftTab] = React.useState<LeftTabType>("add");
  const [rightTab, setRightTab] = React.useState<RightTabType>("design");
  const [frameWindow, setFrameWindow] = React.useState<Window | null>(null);

  useShortcuts([window, frameWindow], editing);

  // Adding a compound component (Drawer, Table…) opens Layers, where its slots
  // can be filled or removed, instead of leaving its structure hidden.
  React.useEffect(() => {
    const id = state.lastInsertedId;
    const inserted = id ? findNode(state.root, id) : null;
    if (inserted && getDefinition(inserted.type)?.slots) {
      setLeftOpen(true);
      setLeftTab("layers");
    }
  }, [state.lastInsertedId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Selecting on the canvas brings the inspector forward, as in Framer or Webflow.
  const previousSelection = React.useRef(state.selectedId);
  React.useEffect(() => {
    if (
      state.selectedId &&
      state.selectedId !== previousSelection.current &&
      rightTab === "design"
    ) {
      setRightOpen(true);
    }
    previousSelection.current = state.selectedId;
  }, [state.selectedId, rightTab]);

  const width = VIEWPORTS.find((item) => item.id === viewport)?.width;
  const showLeft = leftOpen && editing;

  return (
    <div className="fixed inset-0 flex flex-col bg-muted/50 text-foreground">
      <Toolbar
        viewport={viewport}
        onViewportChange={setViewport}
        editing={editing}
        onEditingChange={setEditing}
        leftOpen={showLeft}
        onToggleLeft={() => setLeftOpen((open) => !open)}
        rightOpen={rightOpen}
        onToggleRight={() => setRightOpen((open) => !open)}
      />
      <Divider />

      <div className="flex min-h-0 flex-1">
        {showLeft && (
          <div className="w-68 shrink-0 p-0.75 pr-0 flex ">
            <LeftPanel tab={leftTab} onTabChange={setLeftTab} />
          </div>
        )}

        <main
          className="relative min-w-0 flex-1 overflow-auto  p-0.75"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgb(0 0 0 / 0.07) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        >
          <div
            className={cn(
              "mx-auto h-full overflow-hidden rounded-xl border border-border bg-white shadow-xs transition-[max-width] duration-300 ease-out",
            )}
            style={{ maxWidth: width ?? "100%" }}
          >
            <EditorFrame onReady={({ win }) => setFrameWindow(win)}>
              <Canvas editing={editing} />
            </EditorFrame>
          </div>
        </main>

        {rightOpen && (
          <aside className="flex w-80 shrink-0 flex-col p-0.75 pl-0">
            <div className="bg-background border shadow-xs border-border rounded-xl flex-1">
              <Box padding="small-300">
                {/* Remount on change: a Clickable's background attribute goes stale on update. */}
                <Tabs
                  key={rightTab}
                  tabs={[
                    { id: "design", label: "Design", icon: "adjust" },
                    { id: "ai", label: "AI agent", icon: "wand" },
                  ]}
                  value={rightTab}
                  onChange={(id) => setRightTab(id as RightTabType)}
                />
              </Box>
              <Divider />
              {/* Both stay mounted so the chat survives switching tabs. */}
              <div
                className={cn(
                  "min-h-0 flex-1 flex-col",
                  rightTab === "design" ? "flex" : "hidden",
                )}
              >
                <Inspector />
              </div>
              <div
                className={cn(
                  "min-h-0 flex-1 flex-col",
                  rightTab === "ai" ? "flex" : "hidden",
                )}
              >
                <AiPanel />
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

export function Editor() {
  usePolarisRuntime();
  return (
    <EditorProvider>
      <EditorWorkspace />
    </EditorProvider>
  );
}
