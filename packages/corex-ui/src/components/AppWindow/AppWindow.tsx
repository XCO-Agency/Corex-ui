import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import type { AppWindowPropsType } from "./AppWindow.types";

type AppWindowElement = HTMLElementTagNameMap["s-app-window"];

const SAppWindow = createWebComponent<AppWindowElement>("s-app-window");

/**
 * App Bridge component (see `docs/app-bridge.md`), not a Polaris design
 * component. There's no confirmed close event for `s-app-window` (unlike
 * `Modal`), so unlike `Modal` this doesn't offer a controlled `open`/
 * `onClose` prop — `ref` is forwarded straight to the element for imperative
 * `ref.current.show()` / `ref.current.hide()` calls, and it works equally
 * well with the declarative `<Button command="--show" commandFor="...">`
 * trigger pattern, exactly as Shopify's own examples show.
 */
export const AppWindow = forwardRef<AppWindowElement, AppWindowPropsType>(function AppWindow(
  { src, ...rest },
  ref,
) {
  return <SAppWindow ref={ref} src={src} {...rest} />;
});
