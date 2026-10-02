import type { ReactNode } from "react";
import type { PolarisPropsType } from "../../types/common";

type NativeDropZoneProps = PolarisPropsType<"s-drop-zone">;

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
