import type { CSSProperties, ReactNode } from "react";

/** Block-level style options available in the toolbar. */
export type RichTextBlockType =
  | "paragraph"
  | "heading1"
  | "heading2"
  | "heading3"
  | "heading4"
  | "heading5"
  | "heading6"
  | "blockquote";

/** Text alignment options. */
export type RichTextAlignType = "left" | "center" | "right" | "justify";

export type RichTextEditorPropsType = {
  /** Accessible label for the editing surface. */
  label?: ReactNode;
  /** Visually hide the label (it stays available to assistive tech via aria). */
  labelHidden?: boolean;
  /** Controlled HTML value. */
  value?: string;
  /** Uncontrolled initial HTML. */
  defaultValue?: string;
  /** Called with the current HTML whenever the content changes. */
  onChange?: (value: string) => void;
  /** Placeholder shown when the editor is empty. */
  placeholder?: string;
  /** Disables editing and toolbar actions. */
  disabled?: boolean;
  /** Minimum height of the editing surface. @default "160px" */
  minHeight?: string;
  /** Element id for the editable surface. */
  id?: string;
  /** Optional name for form contexts. */
  name?: string;
  className?: string;
  style?: CSSProperties;
};
