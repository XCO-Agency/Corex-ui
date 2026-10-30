import type { ReactNode } from "react";
import type { IconType, PolarisPropsType } from "../../types/common";

type NativeDropZoneProps = PolarisPropsType<"s-drop-zone">;

export type DropZoneSizeType = "small" | "base";

/**
 * Width of the drop zone surface when `size="small"`.
 * - CSS length (e.g. `"5rem"`, `"96px"`) — default `"5rem"`
 * - `"fill"` — stretch to the parent width (useful inside a grid cell)
 */
export type DropZoneInlineSizeType = "fill" | (string & {});

export type DropZonePropsType = Omit<
  NativeDropZoneProps,
  "label" | "value" | "onChange" | "onBlur" | "onFocus" | "details"
> & {
  label?: ReactNode;
  accept?: string;
  multiple?: boolean;
  /** Alias for `multiple` for backwards-compatibility. */
  allowMultiple?: boolean;
  accessibilityLabel?: string;
  labelAccessibilityVisibility?: "visible" | "exclusive";
  disabled?: boolean;
  error?: ReactNode;
  helpText?: ReactNode;
  details?: ReactNode;
  requiredIndicator?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
  value?: string;
  files?: File[];
  /**
   * Visual size of the drop zone surface.
   * - `base` (default): full-width Polaris drop zone with its built-in prompts
   * - `small`: square surface with a centered upload icon (visible label hidden by default)
   */
  size?: DropZoneSizeType;
  /**
   * Width of the drop zone when `size="small"`.
   * Ignored for `size="base"`.
   * @default "5rem"
   */
  inlineSize?: DropZoneInlineSizeType;
  /**
   * Icon shown in the center when `size="small"` and no `children` are provided.
   * @default "upload"
   */
  icon?: IconType;
  onChange?: (event: Event) => void;
  /**
   * v12's callback, called with the files the element accepted. v12 also passed
   * the rejected ones as a third argument; `s-drop-zone` reports only what it
   * accepted, so that argument is not offered rather than filled with a guess —
   * `onDropRejected` is the element's own signal for a rejection.
   */
  onDrop?: (files: File[]) => void;
  onInput?: (event: Event) => void;
  onDropRejected?: (event: Event) => void;
  onBlur?: (event: Event) => void;
  onFocus?: (event: Event) => void;
  children?: ReactNode;
  className?: string;
};
