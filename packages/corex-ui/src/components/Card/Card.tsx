import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { devWarning } from "../../utils/devWarning";
import { Text } from "../Text";
import { Button } from "../Button";
import type { CardPropsType } from "./Card.types";

const SSection = createWebComponent<HTMLElement>("s-section", {
  domProps: ["padding", "heading"],
});

/**
 * Composed pattern: legacy `Card` has no direct Polaris web component
 * equivalent (there is no `s-card`). It's built on `s-section`, the closest
 * primitive for a bordered content surface, with an optional heading
 * composed from `Text` for the legacy `title` prop, header actions, and footer actions.
 */
export const Card = forwardRef<HTMLElement, CardPropsType>(function Card(
  {
    children,
    title,
    sectioned,
    actions,
    primaryFooterAction,
    secondaryFooterActions,
    padding,
    ...rest
  },
  ref,
) {
  if (sectioned !== undefined) {
    devWarning(
      "Card",
      "`sectioned` has no effect — every Card already renders as a single s-section.",
    );
  }

  const resolvedPadding =
    padding === "none" || padding === "0"
      ? "none"
      : padding === "base"
        ? "base"
        : padding;

  const hasHeader = Boolean(title || (actions && actions.length > 0));
  const hasFooter = Boolean(
    primaryFooterAction || (secondaryFooterActions && secondaryFooterActions.length > 0),
  );

  return (
    <SSection ref={ref} padding={resolvedPadding} {...rest}>
      {hasHeader && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          {title ? (
            <Text as="h2" variant="headingSm">
              {title}
            </Text>
          ) : (
            <div />
          )}
          {actions && actions.length > 0 && (
            <div style={{ display: "flex", gap: "8px" }}>
              {actions.map((act, index) => (
                <Button
                  key={index}
                  variant="plain"
                  onClick={act.onAction}
                  url={act.url}
                  external={act.external}
                  disabled={act.disabled}
                >
                  {act.content}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {children}

      {hasFooter && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "8px",
            marginTop: "16px",
          }}
        >
          {secondaryFooterActions?.map((act, index) => (
            <Button
              key={index}
              onClick={act.onAction}
              url={act.url}
              external={act.external}
              disabled={act.disabled}
            >
              {act.content}
            </Button>
          ))}
          {primaryFooterAction && (
            <Button
              variant="primary"
              tone={primaryFooterAction.destructive ? "critical" : undefined}
              onClick={primaryFooterAction.onAction}
              url={primaryFooterAction.url}
              external={primaryFooterAction.external}
              disabled={primaryFooterAction.disabled}
              loading={primaryFooterAction.loading}
            >
              {primaryFooterAction.content}
            </Button>
          )}
        </div>
      )}
    </SSection>
  );
});
