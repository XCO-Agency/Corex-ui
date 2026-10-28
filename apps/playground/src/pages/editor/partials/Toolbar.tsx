import * as React from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Code2,
  Eye,
  LayoutTemplate,
  Monitor,
  PanelLeft,
  PanelRight,
  PencilRuler,
  Redo2,
  Smartphone,
  Tablet,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ComponentCodeViewer } from "@/pages/component-detail/partials/ComponentCodeViewer";
import { cn } from "@/lib/utils";
import { generateCode } from "../codegen";
import { useEditor } from "../store";
import { createRoot, templates } from "../templates";
import { countNodes } from "../tree";
import type { ViewportType } from "../types";

export const VIEWPORTS: {
  id: ViewportType;
  label: string;
  width: number | null;
  icon: typeof Monitor;
}[] = [
  { id: "desktop", label: "Desktop", width: null, icon: Monitor },
  { id: "tablet", label: "Tablet · 820px", width: 820, icon: Tablet },
  { id: "mobile", label: "Mobile · 390px", width: 390, icon: Smartphone },
];

function IconAction({
  label,
  shortcut,
  onClick,
  disabled,
  active,
  children,
}: {
  label: string;
  shortcut?: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className={cn(
              "size-8 text-muted-foreground",
              active && "bg-muted text-foreground",
            )}
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {label}
        {shortcut && <span className="ml-1 font-mono opacity-70">{shortcut}</span>}
      </TooltipContent>
    </Tooltip>
  );
}

export type ToolbarPropsType = {
  viewport: ViewportType;
  onViewportChange: (viewport: ViewportType) => void;
  editing: boolean;
  onEditingChange: (editing: boolean) => void;
  leftOpen: boolean;
  onToggleLeft: () => void;
  rightOpen: boolean;
  onToggleRight: () => void;
};

export function Toolbar({
  viewport,
  onViewportChange,
  editing,
  onEditingChange,
  leftOpen,
  onToggleLeft,
  rightOpen,
  onToggleRight,
}: ToolbarPropsType) {
  const { state, dispatch } = useEditor();
  const [codeOpen, setCodeOpen] = React.useState(false);
  const [templatesOpen, setTemplatesOpen] = React.useState(false);
  const [codeTab, setCodeTab] = React.useState<"react" | "json">("react");
  const nodeCount = countNodes(state.root) - 1;

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border/70 bg-background px-2">
      <div className="flex min-w-0 flex-1 items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          nativeButton={false}
          className="size-8 text-muted-foreground"
          render={<Link to="/" aria-label="Back to docs" title="Back to docs" />}
        >
          <ArrowLeft />
        </Button>
        <span className="flex size-5 items-center justify-center rounded-[5px] bg-foreground font-mono text-[10px] font-bold text-background">
          cx
        </span>
        <span className="ml-1 text-sm font-semibold tracking-tight">Editor</span>
        <span className="ml-1 hidden rounded border border-border px-1.5 py-px font-mono text-[10px] text-muted-foreground sm:inline">
          {nodeCount} element{nodeCount === 1 ? "" : "s"}
        </span>
        <Separator orientation="vertical" className="mx-1.5 my-auto h-4" />
        <IconAction label="Toggle left panel" onClick={onToggleLeft} active={leftOpen}>
          <PanelLeft />
        </IconAction>
        <IconAction
          label="Undo"
          shortcut="⌘Z"
          onClick={() => dispatch({ type: "undo" })}
          disabled={!state.past.length}
        >
          <Undo2 />
        </IconAction>
        <IconAction
          label="Redo"
          shortcut="⇧⌘Z"
          onClick={() => dispatch({ type: "redo" })}
          disabled={!state.future.length}
        >
          <Redo2 />
        </IconAction>
      </div>

      <div className="flex items-center gap-0.5 rounded-lg bg-muted p-0.5">
        {VIEWPORTS.map(({ id, label, icon: Icon }) => (
          <Tooltip key={id}>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  aria-label={label}
                  onClick={() => onViewportChange(id)}
                  className={cn(
                    "flex h-7 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors [&_svg]:size-3.5",
                    viewport === id && "bg-background text-foreground shadow-xs",
                  )}
                />
              }
            >
              <Icon />
            </TooltipTrigger>
            <TooltipContent side="bottom">{label}</TooltipContent>
          </Tooltip>
        ))}
      </div>

      <div className="flex flex-1 items-center justify-end gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs text-muted-foreground"
          onClick={() => setTemplatesOpen(true)}
        >
          <LayoutTemplate />
          Templates
        </Button>
        <div className="flex items-center rounded-lg bg-muted p-0.5">
          {[
            { value: true, label: "Edit", icon: PencilRuler },
            { value: false, label: "Preview", icon: Eye },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => onEditingChange(value)}
              className={cn(
                "flex h-7 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-muted-foreground transition-colors [&_svg]:size-3.5",
                editing === value && "bg-background text-foreground shadow-xs",
              )}
            >
              <Icon />
              {label}
            </button>
          ))}
        </div>
        <Button size="sm" className="h-8 text-xs" onClick={() => setCodeOpen(true)}>
          <Code2 />
          Export
        </Button>
        <Separator orientation="vertical" className="mx-1 my-auto h-4" />
        <IconAction label="Toggle right panel" onClick={onToggleRight} active={rightOpen}>
          <PanelRight />
        </IconAction>
      </div>

      <Dialog open={codeOpen} onOpenChange={setCodeOpen}>
        <DialogContent className="max-h-[85vh] max-w-4xl grid-rows-[auto_auto_minmax(0,1fr)] sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Export</DialogTitle>
            <DialogDescription>
              Paste the component into your app, or keep the JSON to rebuild this canvas
              later.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-1">
            {(["react", "json"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setCodeTab(tab)}
                className={cn(
                  "h-7 cursor-pointer rounded-md px-2.5 text-xs font-medium",
                  codeTab === tab
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab === "react" ? "React" : "JSON"}
              </button>
            ))}
          </div>
          <div className="min-h-0 overflow-y-auto">
            {codeOpen && (
              <ComponentCodeViewer
                key={codeTab}
                code={
                  codeTab === "react"
                    ? generateCode(state.root)
                    : JSON.stringify(state.root, null, 2)
                }
                filename={codeTab === "react" ? "ComposedPage.tsx" : "canvas.json"}
                language={codeTab === "react" ? "tsx" : "json"}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={templatesOpen} onOpenChange={setTemplatesOpen}>
        <DialogContent className="max-w-xl sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Start from a template</DialogTitle>
            <DialogDescription>
              Replaces the canvas. You can undo with ⌘Z.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 sm:grid-cols-3">
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => {
                  dispatch({
                    type: "replace",
                    root: createRoot(template.nodes),
                    selectedId: null,
                  });
                  setTemplatesOpen(false);
                }}
                className="flex cursor-pointer flex-col gap-1 rounded-lg border border-border p-3 text-left transition-colors hover:border-foreground/30 hover:bg-muted/40"
              >
                <span className="text-sm font-medium">{template.name}</span>
                <span className="text-xs leading-snug text-muted-foreground">
                  {template.description}
                </span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
