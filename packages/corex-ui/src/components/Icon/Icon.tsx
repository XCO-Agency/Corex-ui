import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { IconProps } from "./Icon.types";

const SIcon = createWebComponent<HTMLElement>("s-icon");

/** Thin wrapper: legacy `source` maps to `s-icon`'s `type` attribute (best-effort). */
export const Icon = forwardRef<HTMLElement, IconProps>(function Icon({ source, ...rest }, ref) {
  return <SIcon ref={ref} type={source} {...rest} />;
});
