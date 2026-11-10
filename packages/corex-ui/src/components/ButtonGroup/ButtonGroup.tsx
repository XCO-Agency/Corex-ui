import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { ButtonGroupPropsType } from "./ButtonGroup.types";

const SButtonGroup = createWebComponent<HTMLElement>("s-button-group", {
  domProps: ["gap"],
});

/** Thin wrapper: `s-button-group` accepts `<s-button>` children directly. */
export const ButtonGroup = forwardRef<HTMLElement, ButtonGroupPropsType>(
  function ButtonGroup(
    { children, fullWidth: _fullWidth, variant, gap, accessibilityLabel, ...rest },
    ref,
  ) {
    return (
      <SButtonGroup
        ref={ref}
        gap={gap ?? (variant === "segmented" ? "none" : undefined)}
        accessibilityLabel={accessibilityLabel || "Actions"}
        {...rest}
      >
        {children}
      </SButtonGroup>
    );
  },
);
