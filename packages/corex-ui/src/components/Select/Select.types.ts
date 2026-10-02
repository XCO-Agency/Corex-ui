import type { ReactNode } from "react";
import type { PolarisPropsType } from "../../types/common";

type NativeSelectProps = PolarisPropsType<"s-select">;

export type SelectOptionType = {
  label: string;
  value: string;
  disabled?: boolean;
};

/**
 * Generic in the option value so a select bound to union-typed state keeps that
 * union end to end: `onChange` then accepts a `Dispatch<SetStateAction<Union>>`
 * without a widening wrapper or a cast. `NoInfer` keeps the union coming from
 * `value` alone — inferring it from the handler as well would widen `V` back to
 * `string` and reintroduce the mismatch.
 */
export type SelectPropsType<V extends string = string> = Omit<
  NativeSelectProps,
  "label" | "value" | "onChange" | "details"
> & {
  label: ReactNode;
  options: Array<SelectOptionType | string>;
  value?: V;
  onChange?: (value: NoInfer<V>, id: string) => void;
  helpText?: ReactNode;
  details?: ReactNode;
  placeholder?: string;
  id?: string;
  className?: string;
};
