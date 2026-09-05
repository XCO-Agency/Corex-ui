import { cloneElement, forwardRef, isValidElement, useId } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { TooltipPropsType } from "./Tooltip.types";

const STooltip = createWebComponent<HTMLElement>("s-tooltip");
const SText = createWebComponent<HTMLElement>("s-text");

/**
 * Composed pattern: the trigger is the default-slotted child, and `content`
 * is rendered into a `slot="content"` child. Tooltips are natively hover/focus-driven
 * by the element itself.
 */
export const Tooltip = forwardRef<HTMLElement, TooltipPropsType>(function Tooltip(
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
