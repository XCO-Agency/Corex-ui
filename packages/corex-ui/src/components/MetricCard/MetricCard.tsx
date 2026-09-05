import { type ReactNode, type JSX, useId } from "react";
import { MetricCardPropsType, SparklinePropsType } from "./MetricCard.types";
import { Text } from "../Text";
import { Box } from "../Box";
import { BlockStack } from "../BlockStack";
import { Icon } from "../Icon";

const SPARK_W = 64;
const SPARK_H = 24;

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
  id,
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
  onClick,
}: MetricCardPropsType): JSX.Element {
  const innerContent = (
    <Box padding="small-200">
      <BlockStack gap="small-100">
        {/* Header: icon + title + tooltip + badge */}
        <s-stack direction="inline" justifyContent="space-between" alignItems="center">
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flex: 1,
            }}
          >
            {icon && <Icon type={icon} tone={iconTone} />}
            <span
              style={{
                flex: 1,
                textDecoration: tooltip
                  ? "underline 2px dotted var(--p-color-border-tertiary, rgba(204, 204, 204, 1))"
                  : "none",
                textUnderlineOffset: tooltip ? 5 : "none",
              }}
            >
              <Text type="strong" truncate interestFor={id} tooltip={tooltip}>
                {title}
              </Text>
            </span>
            {badge && badge.value && (
              <s-badge
                tone={badge?.tone ?? "neutral"}

                icon={
                  badge?.dir
                    ? badge?.dir === "up"
                      ? "arrow-up"
                      : "arrow-down"
                    : undefined
                }
              >
                {badge.value}
              </s-badge>
            )}
          </div>
        </s-stack>

        {/* Value + sparkline */}
        <s-stack direction="inline" justifyContent="space-between" alignItems="end">
          <s-stack direction="inline" gap="small-200" alignItems="end">
            <s-text fontVariantNumeric="tabular-nums">
              <strong>{value}</strong>
            </s-text>
          </s-stack>
          {sparklineData && (
            <Sparkline
              data={sparklineData}
              color={sparklineColor}
              width={sparklineWidth}
              height={sparklineHeight}
            />
          )}
        </s-stack>
      </BlockStack>
    </Box>
  );

  return (
    <s-section padding="none">
      <s-box padding="small-300">
        {onClick ? (
          <s-clickable onClick={onClick} borderRadius="base">
            {innerContent}
          </s-clickable>
        ) : (
          innerContent
        )}
      </s-box>
    </s-section>
  );
}
