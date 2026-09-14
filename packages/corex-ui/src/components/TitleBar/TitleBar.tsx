import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { TitleBarPropsType } from "./TitleBar.types";

const UiTitleBar = createWebComponent<HTMLElement>("ui-title-bar");

/**
 * App Bridge TitleBar component.
 * Wraps `<ui-title-bar>` to define modal titles and title-bar actions inside `<Modal>`.
 */
export const TitleBar = forwardRef<HTMLElement, TitleBarPropsType>(
  function TitleBar({ title, children, ...rest }, ref) {
    return (
      <UiTitleBar ref={ref} title={title} {...rest}>
        {children}
      </UiTitleBar>
    );
  },
);
