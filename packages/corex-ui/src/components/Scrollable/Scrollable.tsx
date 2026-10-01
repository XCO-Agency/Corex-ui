import { forwardRef } from "react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { devWarning } from "../../utils/devWarning";
import type { ScrollablePropsType } from "./Scrollable.types";

const SScrollBox = createWebComponent<HTMLElement>("s-scroll-box", {
  domProps: ["overflow", "snapType", "scrollPadding", "scrollMargin"],
});

/**
 * A pane that scrolls inside a fixed size, on `s-scroll-box` — the native
 * equivalent, so the admin's own scrollbars and snapping come for free.
 *
 * v12's `horizontal`/`vertical` map onto the element's two-value `overflow`
 * shorthand; passing neither leaves the element's own `auto` in place.
 */
export const Scrollable: ForwardRefExoticComponent<
  ScrollablePropsType & RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, ScrollablePropsType>(
  function Scrollable(
    { children, shadow, focusable, horizontal, vertical, hint, overflow, ...rest },
    ref,
  ) {
    if (shadow || hint) {
      devWarning(
        "Scrollable",
        "`shadow` and `hint` have no `s-scroll-box` equivalent and are ignored.",
      );
    }

    const resolvedOverflow =
      overflow ??
      (horizontal === undefined && vertical === undefined
        ? undefined
        : // Two-value shorthand is block then inline, so vertical comes first.
          `${vertical === false ? "hidden" : "auto"} ${horizontal ? "auto" : "hidden"}`);

    return (
      <SScrollBox
        ref={ref}
        overflow={resolvedOverflow}
        tabIndex={focusable ? 0 : undefined}
        {...rest}
      >
        {children}
      </SScrollBox>
    );
  },
);
