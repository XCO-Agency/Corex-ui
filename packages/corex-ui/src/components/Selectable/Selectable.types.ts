import type { CSSProperties, ReactNode } from "react";
import type { ToneType } from "../../types/common";

export type SelectableToneType = Exclude<ToneType, undefined>;

export type SelectableRadiusType = "none" | "small" | "base" | "large" | "large-100";

/**
 * Selection indicator shown while selected.
 * - `true` — default corner check badge (top-end, outside)
 * - `"checkbox"` — inset rounded-square check (top-start)
 * - `"radio"` — inset circular check (top-start)
 */
export type SelectableIndicatorType = boolean | "checkbox" | "radio";

export type SelectablePropsType = {
  /** The element or card to highlight. */
  children?: ReactNode;
  /** Controlled selected state. */
  selected?: boolean;
  /** Initial selected state when uncontrolled. */
  defaultSelected?: boolean;
  /** Fires when the user toggles the selection (click, Space or Enter). */
  onSelectedChange?: (selected: boolean) => void;
  /**
   * Identifies this item inside a `Selectable.Group`, which then owns the
   * selected state.
   */
  value?: string;
  /** Outline colour. @default "info" */
  tone?: SelectableToneType;
  /**
   * Whether the wrapper reacts to clicks and the keyboard. Set `false` for a
   * highlight only, driven entirely by `selected`. @default true
   */
  interactive?: boolean;
  disabled?: boolean;
  /**
   * Shows a selection mark while selected. `true` keeps the default corner
   * badge; pass `"checkbox"` or `"radio"` for the inset control styles.
   * @default false
   */
  indicator?: SelectableIndicatorType;
  /** Shows a shadow around the element. @default false */
  shadow?: boolean;
  /** Outline thickness in px. @default 2 */
  outlineWidth?: 1 | 2 | 3;
  /** Gap between the content and the outline in px. @default 0 */
  outlineOffset?: number;
  /** Corner radius of the outline; match the wrapped element. @default "base" */
  borderRadius?: SelectableRadiusType;
  /** Width of the wrapper. @default "fill" */
  inlineSize?: "fill" | "auto";
  /** Accessible name for the control. */
  accessibilityLabel?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
};

export type SelectableGroupPropsType = {
  children?: ReactNode;
  /** Selects several items at once; otherwise it behaves like radio buttons. @default false */
  multiple?: boolean;
  /** Controlled selected values. */
  value?: string[];
  /** Initial selected values when uncontrolled. */
  defaultValue?: string[];
  /** Fires with the full list of selected values. */
  onChange?: (value: string[]) => void;
  /** Default tone for the items that don't set their own. */
  tone?: SelectableToneType;
  disabled?: boolean;
  /** Accessible name for the group. */
  accessibilityLabel?: string;
  id?: string;
};
