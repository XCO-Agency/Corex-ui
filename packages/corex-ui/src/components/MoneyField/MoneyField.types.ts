import type { ReactNode } from "react";
import type { PolarisPropsType } from "../../types/common";

type NativeMoneyFieldProps = PolarisPropsType<"s-money-field">;

export type MoneyFieldPropsType = Omit<NativeMoneyFieldProps, "onChange"> & {
  /** Legacy signature: fires on every keystroke, mirroring `s-money-field`'s `onInput`. */
  onChange?: (value: string, id: string) => void;
  helpText?: ReactNode;
};
