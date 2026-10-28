import * as React from "react";
import { Sparkles, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditorProvider, useEditor } from "./store";
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
    <div className="fixed inset-0 flex flex-col bg-background text-foreground">
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

      <div className="flex min-h-0 flex-1">
        {showLeft && (
          <div className="w-68 shrink-0 border-r border-border/70">
            <LeftPanel tab={leftTab} onTabChange={setLeftTab} />
          </div>
        )}

        <main
          className="relative min-w-0 flex-1 overflow-auto bg-muted/50 p-4"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgb(0 0 0 / 0.07) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        >
          <div
            className={cn(
              "mx-auto h-full overflow-hidden rounded-xl border border-border/80 bg-white shadow-sm transition-[max-width] duration-300 ease-out",
            )}
            style={{ maxWidth: width ?? "100%" }}
          >
            <EditorFrame onReady={({ win }) => setFrameWindow(win)}>
              <Canvas editing={editing} />
            </EditorFrame>
          </div>
        </main>

        {rightOpen && (
          <aside className="flex w-80 shrink-0 flex-col border-l border-border/70 bg-background">
            <div className="flex h-10 shrink-0 items-center gap-1 border-b border-border/70 px-2">
              {(
                [
                  { id: "design", label: "Design", icon: SlidersHorizontal },
                  { id: "ai", label: "AI agent", icon: Sparkles },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setRightTab(id)}
                  className={cn(
                    "flex h-7 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors [&_svg]:size-3.5",
                    rightTab === id
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className={cn(id === "ai" && "text-violet-600")} />
                  {label}
                </button>
              ))}
            </div>
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
          </aside>
        )}
      </div>
    </div>
  );
}

export function Editor() {
  return (
    <EditorProvider>
      <EditorWorkspace />
    </EditorProvider>
  );
}
