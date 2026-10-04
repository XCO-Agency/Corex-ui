import type { KeyboardEvent } from "react";
import type { PolarisPropsType } from "../../types/common";

type NativeTextFieldProps = PolarisPropsType<"s-text-field">;

export type TextFieldPropsType = Omit<NativeTextFieldProps, "onChange"> & {
  /** Legacy signature: fires on every keystroke, mirroring `s-text-field`'s `onInput`. */
  onChange?: (value: string, id: string) => void;
  helpText?: string;
  autoComplete?: NativeTextFieldProps["autocomplete"];
  /** `true`/a row count renders `s-text-area` instead of `s-text-field`. */
  multiline?: boolean | number;
  /** @deprecated Use `required` prop on `TextField` instead. */
  requiredIndicator?: boolean;
};
