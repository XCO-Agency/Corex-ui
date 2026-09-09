import { useId } from "react";
import { RangeSliderSingleThumb } from "./RangeSliderSingleThumb";
import type { RangeSliderPropsType } from "./RangeSlider.types";

export function RangeSlider(props: RangeSliderPropsType) {
  const generatedId = useId();
  const { min = 0, max = 100, step = 1, value, id = generatedId, ...rest } = props;

  return (
    <RangeSliderSingleThumb
      id={id}
      min={min}
      max={max}
      step={step}
      value={value}
      {...rest}
    />
  );
}
