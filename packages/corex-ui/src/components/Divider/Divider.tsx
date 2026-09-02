import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { DividerProps } from "./Divider.types";

const SDivider = createWebComponent<HTMLElement>("s-divider");

export const Divider = forwardRef<HTMLElement, DividerProps>(function Divider(props, ref) {
  return <SDivider ref={ref} {...props} />;
});
