import type { PolarisPropsType, SizeType } from "../../types/common";

type NativeSpinnerProps = PolarisPropsType<"s-spinner">;

export type SpinnerPropsType = Omit<NativeSpinnerProps, "size"> & {
  size?: NativeSpinnerProps["size"] | SizeType;
  accessibilityLabel?: string;
  className?: string;
  id?: string;
};
