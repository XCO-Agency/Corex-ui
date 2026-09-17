import type { PolarisPropsType } from "../../types/common";

type NativeTextFieldProps = PolarisPropsType<"s-text-field">;

export type TextFieldPropsType = Omit<NativeTextFieldProps, "onChange"> & {
  /** Legacy signature: fires on every keystroke, mirroring `s-text-field`'s `onInput`. */
  onChange?: (value: string, id: string) => void;
  helpText?: string;

  /** `true`/a row count renders `s-text-area` instead of `s-text-field`. */
  multiline?: boolean | number;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  requiredIndicator?: boolean;
};
