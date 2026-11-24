import { type ReactNode, type JSX, useId } from "react";
import { MetricCardPropsType } from "./MetricCard.types";
import { ChartSparkline } from "../Chart/ChartSparkline";
import { Text } from "../Text";
import { Box } from "../Box";
import { BlockStack } from "../BlockStack";
import { Icon } from "../Icon";
import { Clickable } from "../Clickable";
import { Skeleton } from "../Skeleton";
import { InlineStack } from "../InlineStack";
import { Badge } from "../Badge";
import { Card } from "../Card";

// ─── MetricCard Component ───────────────────────────────────────────────────────
export function MetricCard({
  id: propID,
  title,
  value,
  icon,
  iconTone = "auto",
  tooltip,
  badge,
  sparklineData,
  sparklineColor,
  sparklineWidth,
  sparklineHeight,
  expanded,
  pressed,
  fetching,
  onClick,
}: MetricCardPropsType): JSX.Element {
  const id = propID ?? useId();

  let innerContent = (
    <Box padding="small-300" inlineSize="100%">
      <BlockStack gap="small-100" style={{ width: "100%" }}>
        {/* Header: icon + title + tooltip + badge */}
        <InlineStack justifyContent="space-between" alignItems="center">
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flex: 1,
              marginInlineStart: -4,
            }}
          >
            {icon && <Icon type={icon} tone={iconTone} />}
            <Text heading interestFor={id} lineClamp={1} tooltip={tooltip}>
              {title}
            </Text>
          </div>
          {badge && badge.value && (
            <Badge
              tone={badge?.tone ?? "neutral"}

              icon={
                badge?.dir ? (badge?.dir === "up" ? "arrow-up" : "arrow-down") : undefined
              }
            >
              {badge.value}
            </Badge>
          )}
        </InlineStack>

        {/* Value + sparkline */}
        <InlineStack justifyContent="space-between" alignItems="end">
          <InlineStack gap="small-200" alignItems="end">
            <Text heading as="strong" variant="base" fontVariantNumeric="tabular-nums">
              {value ?? "0"}
            </Text>
          </InlineStack>
          {sparklineData && (
            <ChartSparkline
              values={sparklineData}
              color={sparklineColor}
              width={sparklineWidth}
              height={sparklineHeight}
            />
          )}
        </InlineStack>
      </BlockStack>
    </Box>
  );
  if (fetching) {
    innerContent = <MetricsSkeleton {...{ icon, iconTone, title, id }} />;
  }

  return (
    <Box
      borderRadius="large-200"
      padding="none"
      inlineSize="100%"
      border={expanded ? "none" : "base"}
      background={expanded ? "none" : "base"}
    >
      <Box padding="small-500">
        {onClick && !fetching ? (
          <Clickable
            onClick={onClick}
            background={pressed ? "strong" : "transparent"}
            borderRadius="large-100"
            inlineSize="fill"
          >
            {innerContent}
          </Clickable>
        ) : (
          innerContent
        )}
      </Box>
    </Box>
  );
}

function MetricsSkeleton({
  icon,
  iconTone,
  title,
  id,
}: Pick<MetricCardPropsType, "icon" | "iconTone" | "title" | "id">) {
  return (
    <Box padding="small-200" inlineSize="100%">
      <BlockStack gap="small-100">
        {/* Header: icon + title + tooltip + badge */}
        <InlineStack justifyContent="space-between" alignItems="center">
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flex: 1,
              marginInlineStart: -4,
            }}
          >
            {icon && <Icon type={icon} tone={iconTone} />}
            <Text heading interestFor={id}>
              {title}
            </Text>
          </div>
          <Skeleton width="30px" height="20px" />
        </InlineStack>

        {/* Value + sparkline */}
        <InlineStack justifyContent="space-between" alignItems="end">
          <InlineStack gap="small-200" alignItems="end">
            <Skeleton width="50px" height="20px" />
          </InlineStack>

          <Skeleton width="50px" height="20px" />
        </InlineStack>
      </BlockStack>
    </Box>
  );
}
