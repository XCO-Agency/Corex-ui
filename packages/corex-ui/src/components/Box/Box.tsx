import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { BoxProps } from "./Box.types";

const SBox = createWebComponent<HTMLElement>("s-box");

/** Thin wrapper: legacy `Box` prop names match `s-box` attributes directly. */
export const Box = forwardRef<HTMLElement, BoxProps>(function Box({ children, ...rest }, ref) {
  return (
    <SBox ref={ref} {...rest}>
      {children}
    </SBox>
  );
});
