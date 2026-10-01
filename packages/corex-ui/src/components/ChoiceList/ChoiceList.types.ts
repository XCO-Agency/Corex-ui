import { ReactNode } from "react";
import { PolarisPropsType } from "../../types/common";
type SchoiceListPropsType = PolarisPropsType<"s-choice-list">;
/**
 * `label` and `value` accept `null`/`undefined` because choice lists are
 * routinely built from optional backend fields; the component coerces them to
 * `""` rather than making every call site write `?? ""`.
 */
export type ChoiceListOptionType = {
  label?: string | null;
  value?: string | null;
  helpText?: ReactNode;
  disabled?: boolean;
};

export type ChoiceListPropsType = Omit<SchoiceListPropsType, "onChange"> & {
  choices?: ChoiceListOptionType[];
  selected?: string[];
  onChange?: (values: string[], name: string) => void;
};
