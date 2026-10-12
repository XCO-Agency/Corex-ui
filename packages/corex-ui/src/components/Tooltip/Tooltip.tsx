import { cloneElement, forwardRef, isValidElement, useId } from "react";
import type { CSSProperties } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { TooltipPropsType } from "./Tooltip.types";

const STooltip = createWebComponent<HTMLElement>("s-tooltip");
const SText = createWebComponent<HTMLElement>("s-text");

/**
 * `<s-tooltip>` is `display: contents`, and in the admin theme its shadow root
 * wraps the popover in a `display: block` `<s-internal-theme-provider>`. That
 * block becomes a flex/grid item of whatever stack holds the trigger, adding a
 * phantom item and an extra gap. This wrapper takes it out of flow; the popover
 * sits in the top layer and positions against the trigger. It is a plain span
 * because the Polaris runtime assigns `style` on `s-*` elements as a DOM
 * property, which drops a React style object.
 */
export const TOOLTIP_WRAPPER_STYLE: CSSProperties = {
  position: "absolute",
  inlineSize: 0,
  blockSize: 0,
};

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
      <span style={TOOLTIP_WRAPPER_STYLE}>
        <STooltip ref={ref} id={tooltipId} {...rest}>
          {content}
        </STooltip>
      </span>
      {trigger}
    </>
  );
});
