import { cloneElement, forwardRef, isValidElement, useId } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { TooltipProps } from "./Tooltip.types";

const STooltip = createWebComponent<HTMLElement>("s-tooltip");
const SText = createWebComponent<HTMLElement>("s-text");

/**
 * Composed pattern: the trigger is the default-slotted child, and `content`
 * is rendered into a `slot="content"` child — the slot name is best-effort
 * (not confirmed against a full API reference); verify against your
 * installed polaris-1.js. Unlike `Modal`, there's no imperative bridge here
 * since tooltips are natively hover/focus-driven by the element itself.
 */
export const Tooltip = forwardRef<HTMLElement, TooltipProps>(function Tooltip(
  { children, content, id, ...rest },
  ref,
) {
  const generatedId = useId();
  const tooltipId = id ?? `corex-tooltip-${generatedId.replace(/:/g, "")}`;
  const trigger =
    isValidElement(children) && typeof children.type !== "string" ? (
      cloneElement(children, { interestFor: tooltipId })
    ) : (
      <SText interestFor={tooltipId}>{children}</SText>
    );

  return (
    <>
      <STooltip ref={ref} id={tooltipId} {...rest}>
        {content}
      </STooltip>
      {trigger}
    </>
  );
});
