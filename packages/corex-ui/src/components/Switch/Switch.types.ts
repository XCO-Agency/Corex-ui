import type { ReactNode } from "react";
import type { PolarisPropsType } from "../../types/common";

type NativeSwitchProps = PolarisPropsType<"s-switch">;

export type SwitchPropsType = Omit<NativeSwitchProps, "onChange"> & {
  onChange?: (checked: boolean, id: string) => void;
};
