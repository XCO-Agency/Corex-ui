import * as React from "react";
import {
  Box,
  InlineStack,
  Text,
  Badge,
  Button,
} from "@xco-agency/corex-ui";
import { RecommendationIllustration } from "./RecommendationIllustrations";

export type RecommendationItemType = {
  id: string;
  title: string;
  description: string;
  liftBadge: {
    text: string;
    tone?: "success" | "info" | "warning" | "neutral";
  };
  actionType: "create_fbt" | "create_addon" | "enable_post_purchase" | "default";
  primaryAction?: {
    label: string;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "tertiary";
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
  };
  media?: React.ReactNode;
  dismissable?: boolean;
};

export type RecommendationItemPropsType = {
  item: RecommendationItemType;
  onAction?: (item: RecommendationItemType) => void;
  onSecondaryAction?: (item: RecommendationItemType) => void;
  onDismiss?: (id: string) => void;
};

export function RecommendationItem({
  item,
  onAction,
  onSecondaryAction,
  onDismiss,
}: RecommendationItemPropsType) {
  const [loading, setLoading] = React.useState(false);
  const [activated, setActivated] = React.useState(false);

  const handlePrimaryClick = () => {
    if (item.primaryAction?.onClick) {
      item.primaryAction.onClick();
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setActivated(true);
      onAction?.(item);
    }, 500);
  };

  const handleSecondaryClick = () => {
    if (item.secondaryAction?.onClick) {
      item.secondaryAction.onClick();
      return;
    }
    onSecondaryAction?.(item);
  };

  return (
    <Box
      borderRadius="large"
      background="bg-surface-secondary"
      overflow="hidden"
      borderWidth="small-100"
      borderColor="border-subdued"
    >
      <div style={{ display: "flex", alignItems: "stretch", width: "100%" }}>
        {/* Full-height Media Column (Zero padding around image) */}
        <div
          style={{
            width: "96px",
            minWidth: "96px",
            display: "flex",
            alignItems: "stretch",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {item.media || <RecommendationIllustration actionType={item.actionType} />}
        </div>

        {/* Content Column */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            padding: "10px 12px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            justifyContent: "center",
          }}
        >
          {/* Header Row: Base Heading + Trend Badge + Dismiss Button */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                flexWrap: "wrap",
                flex: 1,
                minWidth: 0,
              }}
            >
              <Text as="h3" variant="base" heading>
                {item.title}
              </Text>

              {item.liftBadge && (
                <div style={{ flexShrink: 0 }}>
                  <Badge
                    tone={item.liftBadge.tone || "success"}
                    icon="arrow-up-right"
                  >
                    {item.liftBadge.text}
                  </Badge>
                </div>
              )}
            </div>

            {item.dismissable !== false && onDismiss && (
              <div style={{ flexShrink: 0, marginBlockStart: -4, marginInlineEnd: -4 }}>
                <Button
                  variant="tertiary"
                  icon="x"
                  accessibilityLabel={`Dismiss ${item.title}`}
                  onClick={() => onDismiss(item.id)}
                />
              </div>
            )}
          </div>

          {/* 2-line Clamped Description */}
          <Text as="p" color="subdued" variant="bodySm" lineClamp={2}>
            {item.description}
          </Text>

          {/* Action CTAs */}
          <InlineStack gap="small-200" alignItems="center">
            {item.primaryAction && (
              <Button
                variant={activated ? "secondary" : item.primaryAction.variant || "primary"}
                onClick={handlePrimaryClick}
                loading={loading}
                disabled={activated}
                icon={activated ? "check" : undefined}
              >
                {activated ? "Active" : item.primaryAction.label}
              </Button>
            )}

            {item.secondaryAction && (
              <Button
                variant="tertiary"
                onClick={handleSecondaryClick}
              >
                {item.secondaryAction.label}
              </Button>
            )}
          </InlineStack>
        </div>
      </div>
    </Box>
  );
}
