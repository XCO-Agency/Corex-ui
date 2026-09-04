import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { SpinnerProps } from "./Spinner.types";

const SSpinner = createWebComponent<HTMLElement>("s-spinner");

export const Spinner = forwardRef<HTMLElement, SpinnerProps>(
  function Spinner(props, ref) {
    return <SSpinner ref={ref} {...props} />;
  },
);
