import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { SpinnerPropsType } from "./Spinner.types";

const SSpinner = createWebComponent<HTMLElement>("s-spinner");

export const Spinner = forwardRef<HTMLElement, SpinnerPropsType>(
  function Spinner(props, ref) {
    return <SSpinner ref={ref} {...props} />;
  },
);
