import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { devWarning } from "../../utils/devWarning";
import { Button } from "../Button";
import type { PageProps } from "./Page.types";

const SPage = createWebComponent<HTMLElement>("s-page");

/**
 * Composed pattern: top-level layout wrapper over `s-page`. `primaryAction`/
 * `secondaryActions` are composed from `Button` into the page's action
 * slots, matching the same convention used by `Modal`.
 */
export const Page = forwardRef<HTMLElement, PageProps>(function Page(
  { children, title, subtitle, primaryAction, secondaryActions, backAction, ...rest },
  ref,
) {
  if (backAction) {
    devWarning(
      "Page",
      "`backAction` has no confirmed equivalent on `s-page`; verify against your installed polaris-1.js.",
    );
  }

  return (
    <SPage ref={ref} heading={title} subheading={subtitle} {...rest}>
      {primaryAction ? (
        <Button
          slot="primary-action"
          variant="primary"
          disabled={primaryAction.disabled}
          loading={primaryAction.loading}
          onClick={primaryAction.onAction}
        >
          {primaryAction.content}
        </Button>
      ) : null}
      {secondaryActions?.map((action, index) => (
        <Button
          key={index}
          slot="secondary-actions"
          disabled={action.disabled}
          loading={action.loading}
          onClick={action.onAction}
        >
          {action.content}
        </Button>
      ))}
      {children}
    </SPage>
  );
});
