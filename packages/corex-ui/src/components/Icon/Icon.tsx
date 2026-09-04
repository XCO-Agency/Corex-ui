import { forwardRef, Ref } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { IconPropsType } from "./Icon.types";

const SIcon = createWebComponent<HTMLElement>("s-icon");

/**
 * Icon component supporting Polaris icon source types:
 * - String identifier for Polaris web component (e.g. `"search"`, `"save"`, `"star"`).
 * - React component (Polaris SVG icon component).
 */
export const Icon = forwardRef<HTMLElement, IconPropsType>(function Icon(
  { source, tone, type, accessibilityLabel, style, ...rest },
  ref,
) {
  if (typeof source === "function") {
    const SourceComponent = source;
    return (
      <span
        ref={ref as unknown as Ref<HTMLSpanElement>}
        aria-label={accessibilityLabel}
        role={accessibilityLabel ? "img" : undefined}
        style={style}
        {...rest}
      >
        <SourceComponent />
      </span>
    );
  }

  return (
    <SIcon
      ref={ref}
      type={type ?? source ?? undefined}
      tone={tone}
      aria-label={accessibilityLabel ?? source}
      style={style}
      {...rest}
    />
  );
});
