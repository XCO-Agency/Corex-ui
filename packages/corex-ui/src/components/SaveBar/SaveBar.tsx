import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { SaveBarPropsType } from "./SaveBar.types";

const UiSaveBar = createWebComponent<HTMLElement>("ui-save-bar");

/**
 * App Bridge component (see `docs/app-bridge.md`). Wraps `<ui-save-bar>` —
 * note this is a *different* custom element namespace from every other
 * component in this library (`ui-*`, not `s-*`). Shown/hidden imperatively
 * by its `id` via `useSaveBar()`, not a prop on this component.
 */
export const SaveBar = forwardRef<HTMLElement, SaveBarPropsType>(function SaveBar(
  { children, ...rest },
  ref,
) {
  return (
    <UiSaveBar ref={ref} {...rest}>
      {children}
    </UiSaveBar>
  );
});
