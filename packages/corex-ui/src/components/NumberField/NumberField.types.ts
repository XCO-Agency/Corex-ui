import type { PolarisPropsType } from "../../types/common";

type NativeNumberFieldProps = PolarisPropsType<"s-number-field">;

export type NumberFieldPropsType = Omit<NativeNumberFieldProps, "onChange"> & {
  onChange?: (value: string, id: string) => void;
  helpText?: string;
};
