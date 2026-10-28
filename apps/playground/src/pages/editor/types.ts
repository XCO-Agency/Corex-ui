import type * as React from "react";
import type { LucideIcon } from "lucide-react";

export type NodePropsType = Record<string, unknown>;

/** One element on the canvas. Containers own `children`; leaves never do. */
export type EditorNodeType = {
  id: string;
  type: string;
  props: NodePropsType;
  children?: EditorNodeType[];
};

/** A node before it has ids, as written in templates, defaults and AI output. */
export type DraftNodeType = Omit<EditorNodeType, "id" | "children"> & {
  id?: string;
  children?: DraftNodeType[];
};

export type FieldOptionType = { label: string; value: string };

/** Inspector groups, in display order. */
export const FIELD_SECTIONS = [
  "Content",
  "Appearance",
  "Layout",
  "Spacing",
  "Size",
  "Data",
  "Behavior",
  "Accessibility",
] as const;

export type FieldSectionType = (typeof FIELD_SECTIONS)[number];

type FieldBaseType = {
  name: string;
  label: string;
  section: FieldSectionType;
  description?: string;
  /** The component's own default, shown as the placeholder when the prop is unset. */
  defaultValue?: unknown;
  /** Required by the component's types, so generated code always writes it. */
  required?: boolean;
};

export type FieldType = FieldBaseType &
  (
    | { kind: "text" }
    | { kind: "textarea" }
    | { kind: "number" }
    | { kind: "boolean" }
    | {
        kind: "select";
        options: FieldOptionType[];
        allowCustom?: boolean;
        numeric?: boolean;
      }
    | { kind: "icon" }
    /** Arrays and objects (items, rows, actions…), edited as JSON. */
    | { kind: "json"; shape?: string }
  );

export type FieldKindType = FieldType["kind"];

export type ComponentGroupType =
  | "Layout"
  | "Typography"
  | "Actions"
  | "Forms"
  | "Feedback"
  | "Media"
  | "Navigation"
  | "Overlays"
  | "App Bridge"
  | "Blocks";

export type CodeShapeType = {
  /** Component name used in the generated JSX, e.g. `Text` or `Grid.Item`. */
  name: string;
  props: NodePropsType;
  /** Text rendered as JSX children for leaves (`<Text>Hello</Text>`). */
  text?: string;
  /** Raw JSX lines rendered as children, for components composed from data. */
  childLines?: string[];
  /** Child nodes are emitted into this prop (`content={<>…</>}`) instead of as children. */
  childrenProp?: string;
  /** Props written as raw JS expressions, e.g. a `renderItem` function. */
  rawProps?: Record<string, string>;
  /** Raw JSX lines rendered just before the element (e.g. a menu's trigger). */
  siblingsBefore?: string[];
  /** Import line override for non-package components (blocks). */
  importFrom?: string;
  /** Extra names to import from the package. */
  imports?: string[];
};

export type ComponentDefinitionType = {
  type: string;
  label: string;
  group: ComponentGroupType;
  icon: LucideIcon;
  description: string;
  isContainer?: boolean;
  /** Flex direction of the children, used to place the drop indicator. */
  axis?: "vertical" | "horizontal";
  /**
   * Children render without editor wrappers, for parents that inspect or clone
   * their direct children (Layout, Table, List…). They are selected from Layers.
   */
  bareChildren?: boolean;
  /** Only these types may be dropped inside. */
  accepts?: string[];
  /** This type may only be dropped inside these parents. */
  parents?: string[];
  /** Must sit somewhere inside one of these types (parts that read the parent's context). */
  ancestors?: string[];
  /** Parent type this is a part of, so the palette lists it under that parent. */
  partOf?: string;
  /** Shown in the inspector, e.g. for App Bridge components that need the admin. */
  note?: string;
  defaultProps: NodePropsType;
  /** Children inserted with the node when it is dropped from the palette. */
  defaultChildren?: () => DraftNodeType[];
  fields: FieldType[];
  render: (
    props: NodePropsType,
    children: React.ReactNode,
    node: EditorNodeType,
  ) => React.ReactNode;
  /**
   * Label shown on the canvas in edit mode for components that render nothing
   * visible there (a closed Modal, App Bridge APIs), so they can still be selected.
   */
  canvasLabel?: (props: NodePropsType) => string | null;
  /** Layout the canvas wrapper must carry so the node still sizes like its preview. */
  wrapperStyle?: (props: NodePropsType) => React.CSSProperties;
  toCode?: (props: NodePropsType, node: EditorNodeType) => CodeShapeType;
};

export type ViewportType = "desktop" | "tablet" | "mobile";

export type DropTargetType = { parentId: string; index: number };

export type DragPayloadType =
  { kind: "new"; type: string; props?: NodePropsType } | { kind: "move"; id: string };

export type ChatMessageType = {
  id: string;
  role: "user" | "assistant";
  text: string;
  /** Number of operations the agent applied to the canvas. */
  applied?: number;
  error?: boolean;
  /** For a retired-model error: the model to switch to and the prompt to retry. */
  retry?: { model: string; prompt: string };
};
