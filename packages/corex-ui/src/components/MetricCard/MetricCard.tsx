import { type ReactNode, type JSX, useId } from "react";
import { MetricCardPropsType, SparklinePropsType } from "./MetricCard.types";
import { Text } from "../Text";
import { Box } from "../Box";
import { BlockStack } from "../BlockStack";
import { Icon } from "../Icon";
import { Clickable } from "../Clickable";
import { Skeleton } from "../Skeleton";
import { InlineStack } from "../InlineStack";
import { Badge } from "../Badge";
import { Card } from "../Card";

const SPARK_W = 64;
const SPARK_H = 20;

const SPARK_PADDING_X = 1;
const SPARK_PADDING_Y = 3;

const SPARK_STROKE = "#7a7e82";
const SPARK_STROKE_WIDTH = 1.8;

type Point = {
  x: number;
  y: number;
};

function buildPoints(data: number[], width: number, height: number): Point[] {
  if (data.length < 2) return [];

  const innerWidth = width - SPARK_PADDING_X * 2;
  const innerHeight = height - SPARK_PADDING_Y * 2;

  // Always use 0 as the baseline.
  // This ensures positive metric charts start from the bottom.
  const maxValue = Math.max(...data, 0);

  // Prevent division by zero while keeping zero values
  // positioned on the bottom baseline.
  const range = maxValue || 1;

  return data.map((value, index) => ({
    x: SPARK_PADDING_X + (index / (data.length - 1)) * innerWidth,

    y: SPARK_PADDING_Y + (1 - Math.max(value, 0) / range) * innerHeight,
  }));
}

function buildSmoothPath(points: Point[]): string {
  if (points.length < 2) return "";

  if (points.length === 2) {
    return `
      M ${points[0]?.x.toFixed(2)} ${points[0]?.y.toFixed(2)}
      L ${points[1]?.x.toFixed(2)} ${points[1]?.y.toFixed(2)}
    `;
  }

  let path = `
    M ${points[0]?.x.toFixed(2)} ${points[0]?.y.toFixed(2)}
  `;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    if (!p0 || !p1 || !p2 || !p3) continue;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;

    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += `
      C
        ${cp1x.toFixed(2)} ${cp1y.toFixed(2)},
        ${cp2x.toFixed(2)} ${cp2y.toFixed(2)},
        ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}
    `;
  }

  return path;
}

function buildAreaPath(linePath: string, points: Point[], height: number): string {
  const firstPoint = points[0];
  const lastPoint = points.at(-1);

  if (!firstPoint || !lastPoint) return "";

  const baselineY = height - SPARK_PADDING_Y;

  return `
    ${linePath}
    L ${lastPoint.x} ${baselineY}
    L ${firstPoint.x} ${baselineY}
    Z
  `;
}

const TONE_COLOR_MAP: Record<string, string> = {
  auto: SPARK_STROKE,
  neutral: "var(--p-color-text-neutral, #616161)",
  success: "var(--p-color-text-success, #108043)",
  warning: "var(--p-color-text-warning, #b98900)",
  critical: "var(--p-color-text-critical, #d72c0d)",
  info: "var(--p-color-text-info, #2c6ecb)",
  caution: "var(--p-color-text-warning, #b98900)",
};

function resolveSparklineColor(color?: string): string {
  if (!color) return SPARK_STROKE;

  return TONE_COLOR_MAP[color] ?? color;
}

export function Sparkline({
  data,
  width = SPARK_W,
  height = SPARK_H,
  color,
  strokeWidth = SPARK_STROKE_WIDTH,
  showArea = true,
  showEndpoint = true,
}: SparklinePropsType): JSX.Element | null {
  const gradientId = useId();

  if (data.length < 2) return null;

  const resolvedStroke = resolveSparklineColor(color);

  // Build the points only once.
  const points = buildPoints(data, width, height);

  const linePath = buildSmoothPath(points);

  if (!linePath) return null;

  // Use the exact final point from the path.
  const endpoint = points.at(-1);

  if (!endpoint) return null;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      style={{
        display: "block",
        overflow: "visible",
        flexShrink: 0,
      }}
    >
      {showArea && (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={resolvedStroke} stopOpacity="0.16" />

              <stop offset="100%" stopColor={resolvedStroke} stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d={buildAreaPath(linePath, points, height)}
            fill={`url(#${gradientId})`}
          />
        </>
      )}

      <path
        d={linePath}
        fill="none"
        stroke={resolvedStroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {showEndpoint && (
        <>
          <circle cx={endpoint.x} cy={endpoint.y} r="3" fill="white" />

          <circle cx={endpoint.x} cy={endpoint.y} r="1.75" fill={resolvedStroke} />
        </>
      )}
    </svg>
  );
}

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
    <Box padding="small-300">
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
            <Sparkline
              data={sparklineData}
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
      borderRadius="large"
      padding="none"
      border={expanded ? "none" : "base"}
      background={expanded ? "none" : "base"}
    >
      <Box padding="small-400">
        {onClick && !fetching ? (
          <Clickable
            onClick={onClick}
            background={pressed ? "strong" : "transparent"}
            borderRadius="base"
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
    <Box padding="small-200">
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
