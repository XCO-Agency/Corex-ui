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
  onInput?: (event: Event) => void;
  onDropRejected?: (event: Event) => void;
  onBlur?: (event: Event) => void;
  onFocus?: (event: Event) => void;
  children?: ReactNode;
  className?: string;
};
