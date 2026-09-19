import { PolarisPropsType } from "../../types/common";
type SchoiceListPropsType = PolarisPropsType<"s-choice-list">;
export type ChoiceListOptionType = {
  label: string;
  value: string;
  helpText?: string;
  disabled?: boolean;
};

export type ChoiceListPropsType = Omit<SchoiceListPropsType, "onChange"> & {
  choices?: ChoiceListOptionType[];
  selected?: string[];
  onChange?: (values: string[], name: string) => void;
};
