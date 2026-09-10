import { forwardRef } from "react";
import { createWebComponent } from "../../core/createWebComponent";
import { devWarning } from "../../utils/devWarning";
import { Text } from "../Text";
import { Button } from "../Button";
import type { CardPropsType } from "./Card.types";
import { InlineStack } from "../InlineStack";
import { BlockStack } from "../BlockStack";
import { Icon } from "../Icon";
import { IconTile } from "../IconTile";
import { Box } from "../Box";

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
    tooltip,
    icon,
    description,
    heading,
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

  const headerTitle = title || heading;
  const hasHeader = Boolean(headerTitle || actions);
  const hasFooter = Boolean(
    primaryFooterAction || (secondaryFooterActions && secondaryFooterActions.length > 0),
  );

  return (
    <SSection ref={ref} {...rest}>
      {hasHeader && (
        <InlineStack justifyContent="space-between" alignItems="center" gap="base">
          <BlockStack gap="small-300">
            {(headerTitle || icon) && (
              <InlineStack gap="small" alignItems="center">
                {icon && (
                  <IconTile size="sm" tone="neutral">
                    <Icon type={icon} size="small" />
                  </IconTile>
                )}
                {headerTitle && (
                  <Text tooltip={tooltip} heading>
                    {headerTitle}
                  </Text>
                )}
              </InlineStack>
            )}
          </BlockStack>

          {actions && <InlineStack gap="small">{actions}</InlineStack>}
        </InlineStack>
      )}
      <BlockStack gap="small">
        {description && (
          <Box paddingBlock="small-300">
            <Text color="subdued" as="p">
              {description}
            </Text>
          </Box>
        )}

        <span></span>
        {children}
      </BlockStack>
      {hasFooter && (
        <InlineStack
          justifyContent="safe end"
          alignItems="center"
          gap="small"
          paddingBlockStart="small"
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
        </InlineStack>
      )}
    </SSection>
  );
});
