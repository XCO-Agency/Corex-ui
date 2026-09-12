import * as React from "react";
import type {
  EmptyStateActionType,
  EmptyStateComponentType,
  EmptyStatePropsType,
} from "./EmptyState.types";
import { Box } from "../Box";
import { BlockStack } from "../BlockStack";
import { InlineStack } from "../InlineStack";
import { Text } from "../Text";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { IconType } from "../../types/common";
import { IconTile } from "../IconTile";

function renderAction(
  action: EmptyStateActionType | React.ReactNode | undefined,
  defaultVariant: "primary" | "secondary",
  key?: string,
) {
  if (!action) return null;
  if (React.isValidElement(action))
    return <React.Fragment key={key}>{action}</React.Fragment>;

  const act = action as EmptyStateActionType;
  const variant =
    act.variant === "plain"
      ? "tertiary"
      : ((act.variant as "primary" | "secondary" | "tertiary" | "auto" | undefined) ??
        defaultVariant);
  const tone = act.tone === "critical" ? "critical" : undefined;

  return (
    <Button
      key={key || act.id || act.content}
      variant={variant}
      tone={tone}
      onClick={act.onAction}
      url={act.url}
      target={act.target}
      disabled={act.disabled}
      loading={act.loading}
      accessibilityLabel={act.accessibilityLabel}
      id={act.id}
    >
      {act.content}
    </Button>
  );
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStatePropsType>(
  function EmptyState(
    {
      heading,
      title,
      action,
      secondaryAction,
      image,
      largeImage,
      imageContained = false,
      imageAlt = "",
      icon,
      footerContent,
      fullWidth = false,
      children,
      padding = "large-300",
      className,
      id,
      style,
    },
    ref,
  ) {
    const effectiveHeading = heading ?? title;

    // Image illustration rendering
    const effectiveImage = largeImage ?? image;
    let imageNode: React.ReactNode = null;

    if (effectiveImage) {
      if (typeof effectiveImage === "string") {
        imageNode = (
          <img
            src={effectiveImage}
            alt={imageAlt}
            style={{
              maxWidth: imageContained ? "200px" : "100%",
              maxHeight: "240px",
              objectFit: "contain",
              display: "block",
            }}
          />
        );
      } else {
        imageNode = effectiveImage;
      }
    } else if (icon) {
      imageNode = (
        <IconTile tone="subdued">
          <Icon type={icon as IconType} />
        </IconTile>
      );
    }

    const hasActions = Boolean(action || secondaryAction);

    return (
      <InlineStack
        ref={ref}
        id={id}
        className={className}
        justifyContent="center"
        alignItems="center"
        style={style}
        padding={padding}
      >
        <BlockStack gap="large-100" alignItems="center">
          {imageNode && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              {imageNode}
            </div>
          )}

          {(effectiveHeading || children) && (
            <BlockStack gap="small-200" alignItems="center">
              {effectiveHeading && (
                <Text as="h2" variant="large" heading alignment="center">
                  {effectiveHeading}
                </Text>
              )}
              {children && (
                <Text as="div" color="subdued" alignment="center">
                  {children}
                </Text>
              )}
            </BlockStack>
          )}

          {hasActions && (
            <InlineStack gap="small-300" alignItems="center" justifyContent="center" wrap>
              {renderAction(action, "primary", "primary-action")}
              {renderAction(secondaryAction, "secondary", "secondary-action")}
            </InlineStack>
          )}

          {footerContent && (
            <div
              style={{
                paddingTop: "var(--p-space-200, 8px)",
              }}
            >
              <Text as="div" color="subdued" alignment="center">
                {footerContent}
              </Text>
            </div>
          )}
        </BlockStack>
      </InlineStack>
    );
  },
) as EmptyStateComponentType;

EmptyState.displayName = "EmptyState";
